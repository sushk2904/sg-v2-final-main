"""
Database connection and session management.
Connects to SQLite (local) or PostgreSQL (production) database.
"""

from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

# Create database engine with appropriate settings for SQLite vs PostgreSQL
if settings.DATABASE_URL.startswith("sqlite"):
    # SQLite specific settings (no pooling)
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False}  # Required for SQLite with FastAPI
    )
else:
    # PostgreSQL settings
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10
    )

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency function to get database session.
    Use with FastAPI Depends().
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_connection():
    """Test database connection."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False
