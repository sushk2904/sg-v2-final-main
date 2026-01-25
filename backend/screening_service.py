
import os
import json
import uuid
import datetime
from groq import Groq
import resend
from config import settings
from typing import List, Dict, Any, Optional

# Initialize APIs
if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY

def _get_groq_client():
    if not settings.GROQ_API_KEY:
        return None
    return Groq(api_key=settings.GROQ_API_KEY)

def generate_screening_questions(
    role_title: str,
    job_description: Optional[str],
    focus_areas: List[str],
    count: int = 5
) -> List[Dict[str, Any]]:
    """
    Generates screening questions using Groq (Llama 3) based on role context.
    """
    client = _get_groq_client()
    if not client:
        return [{"text": "Groq API Key missing. Please configure backend.", "category": "System Error"}]

    prompt = f"""
    You are an expert technical recruiter. Generate {count} screening questions for a {role_title} role.
    
    Context:
    - Job Description: {job_description or "Standard industry definition"}
    - Focus Areas: {', '.join(focus_areas)}

    Requirements:
    - Questions should be open-ended but specific enough to evaluate depth.
    - Mix of technical and behavioral if appropriate, but focus on the requested areas.
    - Return output as a strictly valid JSON array of objects.
    - Each object must have: "text" (the question), "category" (e.g. System Design, Coding, Leadership).
    
    Output JSON only. No markdown formatting.
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a specialized JSON generator. Output only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        content = completion.choices[0].message.content
        
        # Parse JSON
        data = json.loads(content)
        
        if isinstance(data, list):
            questions = data
        elif isinstance(data, dict) and "questions" in data:
            questions = data["questions"]
        else:
            # Try to find list in values
            questions = next((v for v in data.values() if isinstance(v, list)), [])
            
        if not questions:
            return [{"text": "Failed to parse questions from AI response.", "category": "AI Error"}]
            
        return questions[:count]
        
    except Exception as e:
        print(f"Error generating questions with Groq: {e}")
        return [{"text": f"Error: {str(e)}", "category": "System Error"}]

def send_screening_email(candidate_email: str, candidate_name: str, token: str) -> bool:
    """
    Sends the screening link via Resend.
    """
    if not settings.RESEND_API_KEY:
        print("Resend API Key missing. Skipping email.")
        return False
        
    link = f"http://localhost:3000/screening/{token}"
    
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello {candidate_name},</h2>
        <p>We'd like to invite you to a brief technical screening for your application.</p>
        <p>This session helps us understand your problem-solving approach and technical depth. It takes about 15-20 minutes.</p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="{link}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Screening</a>
        </p>
        <p>Or copy this link: {link}</p>
        <p>Best regards,<br>Hiring Team</p>
    </div>
    """
    
    try:
        r = resend.Emails.send({
            "from": "screening@resend.dev",
            "to": "unknownsushantone2904@gmail.com", # Hardcoded for testing
            "subject": f"Action Required: Technical Screening for {candidate_name}",
            "html": html_content
        })
        print(f"Email sent: {r}")
        return True
    except Exception as e:
        print(f"Error sending email with Resend: {e}")
        return False

def evaluate_screening_responses(
    role_title: str,
    questions: List[Dict[str, str]], 
    answers: List[Dict[str, str]]
) -> Dict[str, Any]:
    """
    Evaluates candidate responses using Groq to generate signals.
    """
    client = _get_groq_client()
    if not client:
        return _get_mock_evaluation()
        
    # Prepare context for AI
    qa_pairs = []
    for ans in answers:
        q_text = next((q['text'] for q in questions if q['id'] == ans['question_id']), "Unknown Question")
        qa_pairs.append(f"Q: {q_text}\nA: {ans['response_text']}")
        
    qa_text = "\n\n".join(qa_pairs)
    
    prompt = f"""
    You are a Senior Technical Hiring Manager. Evaluate the following candidate screening responses for a {role_title} position.
    
    Candidate Responses:
    {qa_text}
    
    Task:
    Analyze the answers for:
    1. Applied Reasoning: logic, problem-solving capabilities.
    2. Clarity: communication effectiveness.
    3. Conceptual Depth: understanding of underlying principles.
    
    Output strictly as JSON object with fields:
    applied_reasoning_score (0.0-1.0),
    clarity_score (0.0-1.0),
    conceptual_depth_score (0.0-1.0),
    confidence ("low"|"medium"|"high"),
    evidence_snippets (array of strings),
    analysis_text (string summary)
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a specialized JSON evaluator. Output only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        content = completion.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        print(f"Error evaluating with Groq: {e}")
        return _get_mock_evaluation()

def _get_mock_evaluation():
    return {
            "applied_reasoning_score": 0.0,
            "clarity_score": 0.0,
            "conceptual_depth_score": 0.0,
            "confidence": "low",
            "evidence_snippets": [],
            "analysis_text": "Error during AI evaluation."
    }
