from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Role
import uuid

router = APIRouter(prefix="/api/roles", tags=["roles"])

@router.get("/")
def get_roles(db: Session = Depends(get_db)):
    """Fetch all available roles."""
    roles = db.query(Role).all()
    
    # Simple serialization
    return [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description
        } 
        for r in roles
    ]

@router.post("/")
def create_role(title: str, description: str = None, db: Session = Depends(get_db)):
    """Create a new role (helper for testing)."""
    new_role = Role(
        id=str(uuid.uuid4()),
        title=title,
        description=description
    )
    db.add(new_role)
    db.commit()
    return {"id": new_role.id, "title": new_role.title}
