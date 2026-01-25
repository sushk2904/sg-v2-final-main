import sys
import os

# Add current directory to path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import Candidate, AlignmentScore
from cri_service import calculate_alignment
import uuid

def backfill():
    print("Starting Alignment Score backfill...")
    db = SessionLocal()
    try:
        candidates = db.query(Candidate).all()
        print(f"Found {len(candidates)} candidates to update.")
        
        for cand in candidates:
            # Calculate alignment (uses default preferences if candidate has none)
            alignment_data = calculate_alignment(cand.work_preferences or {})
            
            # Remove any existing score to avoid duplicates
            db.query(AlignmentScore).filter(AlignmentScore.candidate_id == cand.id).delete()
            
            # Create new score record
            score = AlignmentScore(
                id=str(uuid.uuid4()),
                candidate_id=cand.id,
                overall_alignment=alignment_data["overall"],
                alignment_category=alignment_data["category"],
                key_strengths=alignment_data["key_strengths"],
                potential_gaps=alignment_data["potential_gaps"],
                role_alignment={
                    "overall": alignment_data["overall"],
                    "dimensions": alignment_data["dimensions"]
                },
                org_alignment={
                    "overall": 0,
                    "dimensions": []
                } 
            )
            db.add(score)
            print(f"  ✓ Updated alignment for: {cand.full_name} ({alignment_data['category'].title()})")
        
        db.commit()
        print("\nSuccess! All candidates now have alignment scores.")
    except Exception as e:
        print(f"Error during backfill: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    backfill()
