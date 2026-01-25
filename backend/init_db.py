"""
Initialize database and create tables
Run this once to set up the SQLite database
"""

from database import engine, Base
from models import Candidate, CRIScore, AlignmentScore, Role, Organization

print("Creating database tables...")

# Create all tables
Base.metadata.create_all(bind=engine)

print("✅ Database tables created successfully!")
print("\nTables created:")
print("  - candidates")
print("  - cri_scores")
print("  - alignment_scores")
print("  - roles")
print("  - organizations")
print("\nDatabase file: skill_genome.db")
