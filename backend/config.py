"""
Configuration loader for FastAPI backend.
Loads environment variables from .env file.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    DATABASE_URL: str
    
    # API Settings
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    
    # CORS Origins (comma-separated in .env)
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"
    
    # GitHub API Token (optional for MVP)
    GITHUB_TOKEN: str = ""
    
    # ML Model Settings
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    SKILL_SIMILARITY_THRESHOLD: float = 0.55
    DECAY_LAMBDA: float = 0.1
    
    # App Settings
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    
    # JWT Secret (optional for MVP)
    JWT_SECRET: str = "dev-secret-change-in-production"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields from .env
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    # Screening Services
    RESEND_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""


# Create global settings instance
settings = Settings()
