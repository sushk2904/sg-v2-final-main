from sqlalchemy.orm import Session
from database import SessionLocal
from models import Role
import uuid

def seed_roles():
    db = SessionLocal()
    
    roles = [
        {"title": "Software Engineer", "description": "General purpose software engineering role"},
        {"title": "Frontend Developer", "description": "React/Next.js specialist"},
        {"title": "Backend Developer", "description": "Python/FastAPI/Node.js specialist"},
        {"title": "Data Scientist", "description": "ML/AI and data analysis"}
    ]
    
    for r in roles:
        exists = db.query(Role).filter(Role.title == r["title"]).first()
        if not exists:
            new_role = Role(
                id=str(uuid.uuid4()),
                title=r["title"],
                description=r["description"]
            )
            db.add(new_role)
            print(f"Added role: {r['title']}")
        else:
            print(f"Role exists: {r['title']}")
            
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_roles()
