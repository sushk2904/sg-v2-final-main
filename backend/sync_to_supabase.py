"""
Sync data from SQLite to Supabase PostgreSQL
This script migrates all candidates, CRI scores, and alignment scores from the local SQLite database to Supabase.
"""

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
from models import Base, Candidate, CRIScore, AlignmentScore, Role, Organization
from config import settings
import sys

# Database URLs
SQLITE_URL = "sqlite:///./skill_genome.db"
SUPABASE_URL = "postgresql://postgres.flaymbrucxlosgillfop:ZGeDS0vhKgt5HUNe@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"


def create_tables_in_supabase(supabase_engine):
    """Create all tables in Supabase if they don't exist."""
    print("📊 Creating tables in Supabase...")
    Base.metadata.create_all(bind=supabase_engine)
    print("✅ Tables created successfully")


def sync_candidates(sqlite_session, supabase_session):
    """Sync all candidates from SQLite to Supabase."""
    print("\n👥 Syncing candidates...")
    
    # Get all candidates from SQLite
    sqlite_candidates = sqlite_session.query(Candidate).all()
    print(f"Found {len(sqlite_candidates)} candidates in SQLite")
    
    synced = 0
    skipped = 0
    
    for candidate in sqlite_candidates:
        # Check if candidate already exists in Supabase
        existing = supabase_session.query(Candidate).filter(Candidate.id == candidate.id).first()
        
        if existing:
            print(f"⏭️  Skipping {candidate.full_name} (already exists)")
            skipped += 1
            continue
        
        # Create new candidate in Supabase
        new_candidate = Candidate(
            id=candidate.id,
            recruiter_id=candidate.recruiter_id,
            role_id=candidate.role_id,
            email=candidate.email,
            full_name=candidate.full_name,
            status=candidate.status,
            github_username=candidate.github_username,
            github_data=candidate.github_data,
            leetcode_username=candidate.leetcode_username,
            leetcode_data=candidate.leetcode_data,
            resume_url=candidate.resume_url,
            resume_parsed=candidate.resume_parsed,
            work_preferences=candidate.work_preferences,
            questionnaire_responses=candidate.questionnaire_responses,
            created_at=candidate.created_at,
            updated_at=candidate.updated_at
        )
        
        supabase_session.add(new_candidate)
        print(f"✅ Synced {candidate.full_name} ({candidate.email})")
        synced += 1
    
    supabase_session.commit()
    print(f"\n📊 Candidates: {synced} synced, {skipped} skipped")
    return synced


def sync_cri_scores(sqlite_session, supabase_session):
    """Sync all CRI scores from SQLite to Supabase."""
    print("\n📈 Syncing CRI scores...")
    
    sqlite_scores = sqlite_session.query(CRIScore).all()
    print(f"Found {len(sqlite_scores)} CRI scores in SQLite")
    
    synced = 0
    skipped = 0
    
    for score in sqlite_scores:
        existing = supabase_session.query(CRIScore).filter(CRIScore.id == score.id).first()
        
        if existing:
            skipped += 1
            continue
        
        new_score = CRIScore(
            id=score.id,
            candidate_id=score.candidate_id,
            role_id=score.role_id,
            technical_readiness=score.technical_readiness,
            problem_solving_consistency=score.problem_solving_consistency,
            learning_growth=score.learning_growth,
            work_discipline=score.work_discipline,
            context_alignment=score.context_alignment,
            overall_cri=score.overall_cri,
            confidence_level=score.confidence_level,
            readiness_trend=score.readiness_trend,
            explanations=score.explanations,
            created_at=score.created_at
        )
        
        supabase_session.add(new_score)
        synced += 1
    
    supabase_session.commit()
    print(f"📊 CRI Scores: {synced} synced, {skipped} skipped")
    return synced


def sync_alignment_scores(sqlite_session, supabase_session):
    """Sync all alignment scores from SQLite to Supabase."""
    print("\n🎯 Syncing alignment scores...")
    
    sqlite_scores = sqlite_session.query(AlignmentScore).all()
    print(f"Found {len(sqlite_scores)} alignment scores in SQLite")
    
    synced = 0
    skipped = 0
    
    for score in sqlite_scores:
        existing = supabase_session.query(AlignmentScore).filter(AlignmentScore.id == score.id).first()
        
        if existing:
            skipped += 1
            continue
        
        new_score = AlignmentScore(
            id=score.id,
            candidate_id=score.candidate_id,
            role_id=score.role_id,
            organization_id=score.organization_id,
            role_alignment=score.role_alignment,
            org_alignment=score.org_alignment,
            overall_alignment=score.overall_alignment,
            alignment_category=score.alignment_category,
            key_strengths=score.key_strengths,
            potential_gaps=score.potential_gaps,
            created_at=score.created_at
        )
        
        supabase_session.add(new_score)
        synced += 1
    
    supabase_session.commit()
    print(f"📊 Alignment Scores: {synced} synced, {skipped} skipped")
    return synced


def main():
    """Main sync function."""
    print("🚀 Starting SQLite → Supabase sync...\n")
    
    try:
        # Create engines
        print("🔌 Connecting to databases...")
        sqlite_engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
        supabase_engine = create_engine(
            SUPABASE_URL,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10
        )
        
        # Test connections
        with sqlite_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ SQLite connected")
        
        with supabase_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Supabase connected")
        
        # Create tables in Supabase
        create_tables_in_supabase(supabase_engine)
        
        # Create sessions
        SQLiteSession = sessionmaker(bind=sqlite_engine)
        SupabaseSession = sessionmaker(bind=supabase_engine)
        
        sqlite_session = SQLiteSession()
        supabase_session = SupabaseSession()
        
        # Perform sync
        total_synced = 0
        total_synced += sync_candidates(sqlite_session, supabase_session)
        total_synced += sync_cri_scores(sqlite_session, supabase_session)
        total_synced += sync_alignment_scores(sqlite_session, supabase_session)
        
        # Close sessions
        sqlite_session.close()
        supabase_session.close()
        
        print(f"\n✨ Sync complete! Total records synced: {total_synced}")
        print("\n💡 Next steps:")
        print("1. Update backend/.env to use Supabase DATABASE_URL")
        print("2. Restart the backend server")
        print("3. Your frontend will now show the synced data!")
        
    except Exception as e:
        print(f"\n❌ Error during sync: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
