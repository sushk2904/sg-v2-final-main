"""
Sync data from SQLite to Supabase using REST API
Alternative approach using Supabase's PostgREST API instead of direct PostgreSQL connection
"""

import requests
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Candidate, CRIScore, AlignmentScore
from datetime import datetime

# Supabase configuration
SUPABASE_URL = "https://flaymbrucxlosgillfop.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYXltYnJ1Y3hsb3NnaWxsZm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNTY2NzQsImV4cCI6MjA4NDgzMjY3NH0.nxsPP5qgS-gVoLeopmaUKcdyZkHP1CjvEDIAMJ7lp3Y"

# SQLite configuration
SQLITE_URL = "sqlite:///./skill_genome.db"

# Request headers
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}


def datetime_to_iso(dt):
    """Convert datetime to ISO string."""
    if dt is None:
        return None
    if isinstance(dt, datetime):
        return dt.isoformat()
    return dt


def sync_candidates(session):
    """Sync candidates to Supabase."""
    print("\n👥 Syncing candidates...")
    
    candidates = session.query(Candidate).all()
    print(f"Found {len(candidates)} candidates in SQLite")
    
    synced = 0
    for candidate in candidates:
        data = {
            "id": candidate.id,
            "recruiter_id": candidate.recruiter_id,
            "role_id": candidate.role_id,
            "email": candidate.email,
            "full_name": candidate.full_name,
            "status": candidate.status,
            "github_username": candidate.github_username,
            "github_data": candidate.github_data,
            "leetcode_username": candidate.leetcode_username,
            "leetcode_data": candidate.leetcode_data,
            "resume_url": candidate.resume_url,
            "resume_parsed": candidate.resume_parsed,
            "work_preferences": candidate.work_preferences,
            "questionnaire_responses": candidate.questionnaire_responses,
            "created_at": datetime_to_iso(candidate.created_at),
            "updated_at": datetime_to_iso(candidate.updated_at)
        }
        
        try:
            # Try to insert (upsert)
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/candidates",
                headers=headers,
                json=data
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Synced {candidate.full_name}")
                synced += 1
            elif response.status_code == 409:
                # Already exists, try update
                print(f"⏭️  {candidate.full_name} already exists, updating...")
                response = requests.patch(
                    f"{SUPABASE_URL}/rest/v1/candidates?id=eq.{candidate.id}",
                    headers=headers,
                    json=data
                )
                if response.status_code == 200:
                    print(f"✅ Updated {candidate.full_name}")
                    synced += 1
            else:
                print(f"❌ Failed to sync {candidate.full_name}: {response.text}")
                
        except Exception as e:
            print(f"❌ Error syncing {candidate.full_name}: {e}")
    
    print(f"📊 Candidates: {synced}/{len(candidates)} synced")
    return synced


def sync_cri_scores(session):
    """Sync CRI scores to Supabase."""
    print("\n📈 Syncing CRI scores...")
    
    scores = session.query(CRIScore).all()
    print(f"Found {len(scores)} CRI scores in SQLite")
    
    synced = 0
    for score in scores:
        data = {
            "id": score.id,
            "candidate_id": score.candidate_id,
            "role_id": score.role_id,
            "technical_readiness": score.technical_readiness,
            "problem_solving_consistency": score.problem_solving_consistency,
            "learning_growth": score.learning_growth,
            "work_discipline": score.work_discipline,
            "context_alignment": score.context_alignment,
            "overall_cri": score.overall_cri,
            "confidence_level": score.confidence_level,
            "readiness_trend": score.readiness_trend,
            "explanations": score.explanations,
            "created_at": datetime_to_iso(score.created_at)
        }
        
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/cri_scores",
                headers=headers,
                json=data
            )
            
            if response.status_code in [200, 201]:
                synced += 1
            elif response.status_code == 409:
                response = requests.patch(
                    f"{SUPABASE_URL}/rest/v1/cri_scores?id=eq.{score.id}",
                    headers=headers,
                    json=data
                )
                if response.status_code == 200:
                    synced += 1
                    
        except Exception as e:
            print(f"❌ Error syncing CRI score: {e}")
    
    print(f"📊 CRI Scores: {synced}/{len(scores)} synced")
    return synced


def sync_alignment_scores(session):
    """Sync alignment scores to Supabase."""
    print("\n🎯 Syncing alignment scores...")
    
    scores = session.query(AlignmentScore).all()
    print(f"Found {len(scores)} alignment scores in SQLite")
    
    synced = 0
    for score in scores:
        data = {
            "id": score.id,
            "candidate_id": score.candidate_id,
            "role_id": score.role_id,
            "organization_id": score.organization_id,
            "role_alignment": score.role_alignment,
            "org_alignment": score.org_alignment,
            "overall_alignment": score.overall_alignment,
            "alignment_category": score.alignment_category,
            "key_strengths": score.key_strengths,
            "potential_gaps": score.potential_gaps,
            "created_at": datetime_to_iso(score.created_at)
        }
        
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/alignment_scores",
                headers=headers,
                json=data
            )
            
            if response.status_code in [200, 201]:
                synced += 1
            elif response.status_code == 409:
                response = requests.patch(
                    f"{SUPABASE_URL}/rest/v1/alignment_scores?id=eq.{score.id}",
                    headers=headers,
                    json=data
                )
                if response.status_code == 200:
                    synced += 1
                    
        except Exception as e:
            print(f"❌ Error syncing alignment score: {e}")
    
    print(f"📊 Alignment Scores: {synced}/{len(scores)} synced")
    return synced


def main():
    """Main sync function using REST API."""
    print("🚀 Starting SQLite → Supabase sync (via REST API)...\n")
    
    try:
        # Connect to SQLite
        print("🔌 Connecting to SQLite...")
        engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
        Session = sessionmaker(bind=engine)
        session = Session()
        print("✅ SQLite connected")
        
        # Test Supabase API
        print("🔌 Testing Supabase API...")
        test_response = requests.get(
            f"{SUPABASE_URL}/rest/v1/",
            headers=headers
        )
        if test_response.status_code == 200:
            print("✅ Supabase API connected")
        else:
            print(f"⚠️  Supabase API response: {test_response.status_code}")
        
        # Perform sync
        total_synced = 0
        total_synced += sync_candidates(session)
        total_synced += sync_cri_scores(session)
        total_synced += sync_alignment_scores(session)
        
        session.close()
        
        print(f"\n✨ Sync complete! Total records synced: {total_synced}")
        print("\n💡 Your data is now in Supabase!")
        print("The frontend should now display your candidates.")
        
    except Exception as e:
        print(f"\n❌ Error during sync: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
