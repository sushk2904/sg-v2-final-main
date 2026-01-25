"""
API Routes for Candidate Management and Analysis
Uses real database, GitHub API, and CRI calculations
"""

from fastapi import APIRouter, HTTPException, Depends, Body, File, UploadFile
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import uuid

from database import get_db
from models import Candidate, CRIScore, AlignmentScore
from github_service import analyze_github_profile, calculate_github_signals
from cri_service import calculate_cri, calculate_alignment
from pdf_utils import extract_text_from_pdf, extract_candidate_info
from leetcode_service import analyze_leetcode_profile

router = APIRouter(prefix="/api/candidates", tags=["candidates"])


@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Parse a PDF resume to extract text, emails, and profile links.
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        content = await file.read()
        text, links = extract_text_from_pdf(content)
        
        if not text and not links:
            raise HTTPException(status_code=400, detail="Could not extract text or links. PDF might be scanned/empty.")
            
        profiles = extract_candidate_info(text, links)
        
        return {
            "resume_text": text.strip(),
            "github_username": profiles["github_username"],
            "leetcode_username": profiles["leetcode_username"],
            "email": profiles["email"],
            "full_name": profiles["name"],
            "message": "Resume parsed successfully"
        }
    except Exception as e:
        print(f"Error parsing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")


@router.post("/")
async def create_candidate(
    email: str = Body(...),
    full_name: str = Body(...),
    github_username: Optional[str] = Body(None),
    leetcode_username: Optional[str] = Body(None),
    role_id: Optional[str] = Body(None),
    db: Session = Depends(get_db)
):
    """Create a new candidate and optionally analyze their GitHub/LeetCode profile."""
    
    # Check if candidate exists (Upsert Logic)
    existing = db.query(Candidate).filter(Candidate.email == email).first()
    
    if existing:
        candidate = existing
        candidate.full_name = full_name
        if role_id: candidate.role_id = role_id
        if github_username: candidate.github_username = github_username
        if leetcode_username: candidate.leetcode_username = leetcode_username
    else:
        candidate = Candidate(
            id=str(uuid.uuid4()),
            email=email,
            full_name=full_name,
            github_username=github_username,
            leetcode_username=leetcode_username,
            role_id=role_id,
            status="pending_intake"
        )
        db.add(candidate)
    
    # Analyze GitHub if username provided
    github_data = None
    if github_username:
        github_data = analyze_github_profile(github_username)
        if github_data:
            candidate.github_data = github_data
            candidate.status = "analyzed"
            
    # Analyze LeetCode if username provided
    leetcode_data = None
    if leetcode_username:
        leetcode_data = analyze_leetcode_profile(leetcode_username)
        if leetcode_data:
            candidate.leetcode_data = leetcode_data
            candidate.status = "analyzed"

    # Calculate CRI if we have any data
    if github_data or leetcode_data:
        github_signals = calculate_github_signals(github_data) if github_data else {}
        
        # Pass leetcode_data to calculate_cri
        cri_input = {
            "github_data": github_data,
            "leetcode_data": leetcode_data,
            "work_preferences": candidate.work_preferences
        }
        
        cri_data = calculate_cri(cri_input, github_signals)
        
        # Remove old scores
        db.query(CRIScore).filter(CRIScore.candidate_id == candidate.id).delete()
        
        cri_score = CRIScore(
            id=str(uuid.uuid4()),
            candidate_id=candidate.id,
            **{k: v for k, v in cri_data.items() if k != "explanations"},
            explanations=cri_data["explanations"]
        )
        db.add(cri_score)
    
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    
    return {
        "id": candidate.id,
        "email": candidate.email,
        "full_name": candidate.full_name,
        "status": candidate.status,
        "message": "Candidate processed successfully"
    }


@router.get("/{candidate_id}/dashboard")
async def get_candidate_dashboard(candidate_id: str, db: Session = Depends(get_db)):
    """Get complete dashboard data for a candidate."""
    
    # Fetch candidate
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Fetch CRI score
    cri_score = db.query(CRIScore).filter(CRIScore.candidate_id == candidate_id).first()
    
    # Fetch alignment score
    alignment_score = db.query(AlignmentScore).filter(AlignmentScore.candidate_id == candidate_id).first()
    
    # Build response
    return {
        "candidate": {
            "id": candidate.id,
            "email": candidate.email,
            "full_name": candidate.full_name,
            "status": candidate.status,
            "github_username": candidate.github_username,
            "github_data": candidate.github_data,
            "leetcode_username": candidate.leetcode_username,
            "leetcode_data": candidate.leetcode_data,
            "resume_parsed": candidate.resume_parsed,
            "work_preferences": candidate.work_preferences,
            "created_at": candidate.created_at.isoformat() if candidate.created_at else None,
            "updated_at": candidate.updated_at.isoformat() if candidate.updated_at else None
        },
        "cri_score": {
            "id": cri_score.id,
            "technical_readiness": cri_score.technical_readiness,
            "problem_solving_consistency": cri_score.problem_solving_consistency,
            "learning_growth": cri_score.learning_growth,
            "work_discipline": cri_score.work_discipline,
            "context_alignment": cri_score.context_alignment,
            "overall_cri": cri_score.overall_cri,
            "confidence_level": cri_score.confidence_level,
            "readiness_trend": cri_score.readiness_trend,
            "explanations": cri_score.explanations
        } if cri_score else None,
        "alignment_score": {
            "id": alignment_score.id,
            "role_alignment": alignment_score.role_alignment,
            "org_alignment": alignment_score.org_alignment,
            "overall_alignment": alignment_score.overall_alignment,
            "alignment_category": alignment_score.alignment_category,
            "key_strengths": alignment_score.key_strengths,
            "potential_gaps": alignment_score.potential_gaps
        } if alignment_score else None,
        "role": None,  # TODO: Implement role fetching
        "organization": None  # TODO: Implement org fetching
    }


@router.get("/{candidate_id}/cri")
async def get_candidate_cri(candidate_id: str, db: Session = Depends(get_db)):
    """Get CRI score for a candidate."""
    
    cri_score = db.query(CRIScore).filter(CRIScore.candidate_id == candidate_id).first()
    if not cri_score:
        raise HTTPException(status_code=404, detail="CRI score not found for this candidate")
    
    return {
        "id": cri_score.id,
        "candidate_id": cri_score.candidate_id,
        "technical_readiness": cri_score.technical_readiness,
        "problem_solving_consistency": cri_score.problem_solving_consistency,
        "learning_growth": cri_score.learning_growth,
        "work_discipline": cri_score.work_discipline,
        "context_alignment": cri_score.context_alignment,
        "overall_cri": cri_score.overall_cri,
        "confidence_level": cri_score.confidence_level,
        "readiness_trend": cri_score.readiness_trend,
        "explanations": cri_score.explanations,
        "created_at": cri_score.created_at.isoformat() if cri_score.created_at else None
    }


@router.post("/{candidate_id}/analyze-github")
async def analyze_candidate_github(candidate_id: str, db: Session = Depends(get_db)):
    """Trigger GitHub analysis for a candidate."""
    
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    if not candidate.github_username:
        raise HTTPException(status_code=400, detail="No GitHub username set for this candidate")
    
    # Analyze GitHub
    github_data = analyze_github_profile(candidate.github_username)
    if not github_data:
        raise HTTPException(status_code=500, detail="Failed to analyze GitHub profile")
    
    # Update candidate
    candidate.github_data = github_data
    candidate.status = "analyzed"
    candidate.updated_at = datetime.utcnow()
    
    # Calculate CRI
    github_signals = calculate_github_signals(github_data)
    cri_data = calculate_cri({
        "github_data": github_data,
        "leetcode_data": candidate.leetcode_data,
        "work_preferences": candidate.work_preferences
    }, github_signals)
    
    # Delete old CRI scores
    db.query(CRIScore).filter(CRIScore.candidate_id == candidate_id).delete()
    
    # Create new CRI score
    cri_score = CRIScore(
        id=str(uuid.uuid4()),
        candidate_id=candidate.id,
        technical_readiness=cri_data["technical_readiness"],
        problem_solving_consistency=cri_data["problem_solving_consistency"],
        learning_growth=cri_data["learning_growth"],
        work_discipline=cri_data["work_discipline"],
        context_alignment=cri_data["context_alignment"],
        overall_cri=cri_data["overall_cri"],
        confidence_level=cri_data["confidence_level"],
        readiness_trend=cri_data["readiness_trend"],
        explanations=cri_data["explanations"]
    )
    
    db.add(cri_score)
    db.commit()
    db.refresh(candidate)
    db.refresh(cri_score)
    
    return {
        "message": "GitHub analysis completed",
        "candidate_id": candidate.id,
        "cri_score": cri_data["overall_cri"]
    }


@router.post("/{candidate_id}/analyze-leetcode")
async def analyze_candidate_leetcode(candidate_id: str, db: Session = Depends(get_db)):
    """Trigger LeetCode analysis for a candidate."""
    
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    if not candidate.leetcode_username:
        raise HTTPException(status_code=400, detail="No LeetCode username set for this candidate")
    
    # Analyze LeetCode
    leetcode_data = analyze_leetcode_profile(candidate.leetcode_username)
    if not leetcode_data:
        raise HTTPException(status_code=500, detail="Failed to analyze LeetCode profile")
    
    # Update candidate
    candidate.leetcode_data = leetcode_data
    candidate.status = "analyzed"
    candidate.updated_at = datetime.utcnow()
    
    # Calculate CRI
    github_signals = calculate_github_signals(candidate.github_data) if candidate.github_data else {}
    cri_data = calculate_cri({
        "github_data": candidate.github_data,
        "leetcode_data": leetcode_data,
        "work_preferences": candidate.work_preferences
    }, github_signals)
    
    # Delete old CRI scores
    db.query(CRIScore).filter(CRIScore.candidate_id == candidate_id).delete()
    
    # Create new CRI score
    cri_score = CRIScore(
        id=str(uuid.uuid4()),
        candidate_id=candidate.id,
        technical_readiness=cri_data["technical_readiness"],
        problem_solving_consistency=cri_data["problem_solving_consistency"],
        learning_growth=cri_data["learning_growth"],
        work_discipline=cri_data["work_discipline"],
        context_alignment=cri_data["context_alignment"],
        overall_cri=cri_data["overall_cri"],
        confidence_level=cri_data["confidence_level"],
        readiness_trend=cri_data["readiness_trend"],
        explanations=cri_data["explanations"]
    )
    
    db.add(cri_score)
    db.commit()
    db.refresh(candidate)
    
    return {
        "message": "LeetCode analysis completed",
        "candidate_id": candidate.id,
        "cri_score": cri_data["overall_cri"]
    }


@router.get("/")
async def list_candidates(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """List all candidates."""
    
    candidates = db.query(Candidate).offset(skip).limit(limit).all()
    
    return {
        "candidates": [
            {
                "id": c.id,
                "email": c.email,
                "full_name": c.full_name,
                "status": c.status,
                "github_username": c.github_username,
                "created_at": c.created_at.isoformat() if c.created_at else None
            }
            for c in candidates
        ],
        "total": db.query(Candidate).count()
    }
