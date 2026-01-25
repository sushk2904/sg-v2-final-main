"""
Skill Genome FastAPI Backend
Main application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import test_connection

# Create FastAPI app
app = FastAPI(
    title="Skill Genome API",
    description="AI-powered candidate analysis and Corporate Readiness Index (CRI) scoring",
    version="1.0.0",
    debug=settings.DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    print("🚀 Starting Skill Genome API...")
    print(f"📊 Environment: {'Development' if settings.DEBUG else 'Production'}")
    
    # Test database connection
    if test_connection():
        print("✅ Database connected successfully")
    else:
        print("❌ Database connection failed")


@app.get("/")
async def root():
    """Root endpoint - API information."""
    return {
        "name": "Skill Genome API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    db_status = test_connection()
    
    return {
        "status": "ok" if db_status else "degraded",
        "database": "connected" if db_status else "disconnected",
        "debug_mode": settings.DEBUG
    }


# API Routes
from routes_candidates import router as candidates_router
from routes_roles import router as roles_router
from routes_screening import router as screening_router

app.include_router(candidates_router)
app.include_router(roles_router)
app.include_router(screening_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )
