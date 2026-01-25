"""
Database models for Skill Genome
Using SQLAlchemy ORM
"""

from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(String, primary_key=True)
    recruiter_id = Column(String, nullable=True)
    role_id = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    status = Column(String, default="pending_intake")  # pending_intake, questionnaire_sent, analyzed
    
    # Data sources
    github_username = Column(String, nullable=True)
    github_data = Column(JSON, nullable=True)
    leetcode_username = Column(String, nullable=True)
    leetcode_data = Column(JSON, nullable=True)
    resume_url = Column(String, nullable=True)
    resume_parsed = Column(JSON, nullable=True)
    
    # Preferences
    work_preferences = Column(JSON, nullable=True)
    questionnaire_responses = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    cri_scores = relationship("CRIScore", back_populates="candidate", cascade="all, delete-orphan")
    alignment_scores = relationship("AlignmentScore", back_populates="candidate", cascade="all, delete-orphan")


class CRIScore(Base):
    __tablename__ = "cri_scores"
    
    id = Column(String, primary_key=True)
    candidate_id = Column(String, ForeignKey("candidates.id"), nullable=False)
    role_id = Column(String, nullable=True)
    
    # CRI Components
    technical_readiness = Column(Float, nullable=False)
    problem_solving_consistency = Column(Float, nullable=False)
    learning_growth = Column(Float, nullable=False)
    work_discipline = Column(Float, nullable=False)
    context_alignment = Column(Float, nullable=False)
    
    # Overall
    overall_cri = Column(Float, nullable=False)
    confidence_level = Column(Float, nullable=False)
    readiness_trend = Column(String, nullable=False)  # improving, stable, declining
    
    # Explanations
    explanations = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    candidate = relationship("Candidate", back_populates="cri_scores")


class AlignmentScore(Base):
    __tablename__ = "alignment_scores"
    
    id = Column(String, primary_key=True)
    candidate_id = Column(String, ForeignKey("candidates.id"), nullable=False)
    role_id = Column(String, nullable=True)
    organization_id = Column(String, nullable=True)
    
    # Alignment data
    role_alignment = Column(JSON, nullable=True)
    org_alignment = Column(JSON, nullable=True)
    overall_alignment = Column(Float, nullable=False)
    alignment_category = Column(String, nullable=False)  # high, medium, low
    
    # Insights
    key_strengths = Column(JSON, nullable=True)
    potential_gaps = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    candidate = relationship("Candidate", back_populates="alignment_scores")


class Role(Base):
    __tablename__ = "roles"
    
    id = Column(String, primary_key=True)
    organization_id = Column(String, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    requirements = Column(JSON, nullable=True)  # Technical requirements
    work_environment = Column(JSON, nullable=True)  # Pace, collaboration, etc.
    
    created_at = Column(DateTime, default=datetime.utcnow)


class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    culture_profile = Column(JSON, nullable=True)  # Work style preferences
    
    created_at = Column(DateTime, default=datetime.utcnow)


class ScreeningSession(Base):
    __tablename__ = "screening_sessions"
    
    id = Column(String, primary_key=True)
    candidate_id = Column(String, ForeignKey("candidates.id"), nullable=False)
    recruiter_id = Column(String, nullable=True)
    status = Column(String, default="created")  # created, sent, completed, evaluated
    token = Column(String, unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    questions = relationship("ScreeningQuestion", back_populates="session", cascade="all, delete-orphan")
    responses = relationship("ScreeningResponse", back_populates="session", cascade="all, delete-orphan")
    signal = relationship("ScreeningSignal", back_populates="session", uselist=False, cascade="all, delete-orphan")


class ScreeningQuestion(Base):
    __tablename__ = "screening_questions"
    
    id = Column(String, primary_key=True)
    session_id = Column(String, ForeignKey("screening_sessions.id"), nullable=False)
    text = Column(Text, nullable=False)
    order = Column(Integer, nullable=False)
    category = Column(String, nullable=True) # e.g. "System Design", "Behavioral"
    
    session = relationship("ScreeningSession", back_populates="questions")
    response = relationship("ScreeningResponse", back_populates="question", uselist=False)


class ScreeningResponse(Base):
    __tablename__ = "screening_responses"
    
    id = Column(String, primary_key=True)
    session_id = Column(String, ForeignKey("screening_sessions.id"), nullable=False)
    question_id = Column(String, ForeignKey("screening_questions.id"), nullable=False)
    response_text = Column(Text, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("ScreeningSession", back_populates="responses")
    question = relationship("ScreeningQuestion", back_populates="response")


class ScreeningSignal(Base):
    __tablename__ = "screening_signals"
    
    id = Column(String, primary_key=True)
    session_id = Column(String, ForeignKey("screening_sessions.id"), nullable=False)
    candidate_id = Column(String, ForeignKey("candidates.id"), nullable=False)
    
    # AI Scoring
    applied_reasoning_score = Column(Float, nullable=False)
    clarity_score = Column(Float, nullable=False)
    conceptual_depth_score = Column(Float, nullable=False)
    
    confidence = Column(String, nullable=False) # low, medium, high
    evidence_snippets = Column(JSON, nullable=True) # List of quotes
    analysis_text = Column(Text, nullable=True) # Full AI explanation
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("ScreeningSession", back_populates="signal")
