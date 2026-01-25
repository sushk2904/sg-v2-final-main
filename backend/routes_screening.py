
from fastapi import APIRouter, HTTPException, Depends, Body
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid

from database import get_db
from models import ScreeningSession, ScreeningQuestion, ScreeningResponse, ScreeningSignal, Candidate
from screening_service import generate_screening_questions, send_screening_email, evaluate_screening_responses

router = APIRouter(prefix="/api/screening", tags=["screening"])

@router.post("/generate-questions")
async def generate_questions(
    role_title: str = Body(...),
    job_description: str = Body(None),
    focus_areas: list[str] = Body([]),
    count: int = Body(5)
):
    """Generate screening questions via AI."""
    questions = generate_screening_questions(role_title, job_description, focus_areas, count)
    return {"questions": questions}

@router.post("/sessions")
async def create_session(
    candidate_id: str = Body(...),
    recruiter_id: str = Body(None),
    questions: list[dict] = Body(...), # [{text: str, category: str}]
    db: Session = Depends(get_db)
):
    """Create a screening session and email the candidate."""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Create Session
    token = str(uuid.uuid4())
    session_id = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(days=7)
    
    session = ScreeningSession(
        id=session_id,
        candidate_id=candidate_id,
        recruiter_id=recruiter_id,
        status="sent",
        token=token,
        expires_at=expires_at
    )
    db.add(session)
    
    # Save Questions
    for idx, q_data in enumerate(questions):
        q = ScreeningQuestion(
            id=str(uuid.uuid4()),
            session_id=session_id,
            text=q_data["text"],
            category=q_data.get("category", "General"),
            order=idx
        )
        db.add(q)
        
    db.commit()
    
    # Send Email
    email_sent = send_screening_email(candidate.email, candidate.full_name, token)
    if not email_sent:
        # We don't rollback, just warn
        pass
        
    return {"session_id": session_id, "token": token, "email_sent": email_sent}

@router.get("/session/{token}")
async def get_session(token: str, db: Session = Depends(get_db)):
    """Public endpoint for candidate to fetch questions."""
    session = db.query(ScreeningSession).filter(ScreeningSession.token == token).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=403, detail="Session expired")
        
    if session.status == "completed" or session.status == "evaluated":
        raise HTTPException(status_code=400, detail="Session already completed")
        
    return {
        "candidate_name": session.candidate_id, # Simplified, typically we fetch name
        "questions": [
            {"id": q.id, "text": q.text, "category": q.category}
            for q in session.questions
        ]
    }

@router.post("/submit")
async def submit_responses(
    token: str = Body(...),
    responses: list[dict] = Body(...), # [{question_id: str, response_text: str}]
    db: Session = Depends(get_db)
):
    """Submit answers and trigger AI evaluation."""
    session = db.query(ScreeningSession).filter(ScreeningSession.token == token).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # Save Responses
    for r in responses:
        resp = ScreeningResponse(
            id=str(uuid.uuid4()),
            session_id=session.id,
            question_id=r["question_id"],
            response_text=r["response_text"]
        )
        db.add(resp)
        
    session.status = "completed"
    db.commit()
    
    # Trigger AI Evaluation
    # Fetch questions text
    eval_questions = [{"id": q.id, "text": q.text} for q in session.questions]
    eval_answers = [{"question_id": r["question_id"], "response_text": r["response_text"]} for r in responses]
    candidate = db.query(Candidate).filter(Candidate.id == session.candidate_id).first()
    
    # Evaluate
    result = evaluate_screening_responses(
        role_title="Candidate Role", # Ideally fetch role title
        questions=eval_questions,
        answers=eval_answers
    )
    
    # Save Signal
    signal = ScreeningSignal(
        id=str(uuid.uuid4()),
        session_id=session.id,
        candidate_id=session.candidate_id,
        **result
    )
    db.add(signal)
    
    session.status = "evaluated"
    db.commit()
    
    return {"message": "Responses submitted and evaluated", "signal_id": signal.id}

@router.get("/candidate/{candidate_id}")
async def get_candidate_screening(candidate_id: str, db: Session = Depends(get_db)):
    """Fetch the latest screening session and results for a candidate."""
    # Get latest session
    session = db.query(ScreeningSession)\
        .filter(ScreeningSession.candidate_id == candidate_id)\
        .order_by(ScreeningSession.created_at.desc())\
        .first()
        
    if not session:
        return {"status": "none"}
        
    result = {
        "id": session.id,
        "status": session.status,
        "token": session.token,
        "created_at": session.created_at.isoformat(),
        "signal": None
    }
    
    # If evaluated, fetch signal
    if session.status == "evaluated":
        signal = db.query(ScreeningSignal).filter(ScreeningSignal.session_id == session.id).first()
        if signal:
            result["signal"] = {
                "applied_reasoning_score": signal.applied_reasoning_score,
                "clarity_score": signal.clarity_score,
                "conceptual_depth_score": signal.conceptual_depth_score,
                "confidence": signal.confidence,
                "evidence_snippets": signal.evidence_snippets,
                "analysis_text": signal.analysis_text
            }
            
    return result
