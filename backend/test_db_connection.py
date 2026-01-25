"""
Test different Supabase connection strings - with detailed output
"""
from sqlalchemy import create_engine, text
import sys

# Test configurations
configs = [
    {
        "name": "Direct Connection + SSL",
        "url": "postgresql://postgres:ZGeDS0vhKgt5HUNe@db.flaymbrucxlosgillfop.supabase.co:5432/postgres?sslmode=require"
    },
    {
        "name": "Pooler Connection + SSL", 
        "url": "postgresql://postgres.flaymbrucxlosgillfop:ZGeDS0vhKgt5HUNe@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"
    },
    {
        "name": "Direct Connection (no SSL)",
        "url": "postgresql://postgres:ZGeDS0vhKgt5HUNe@db.flaymbrucxlosgillfop.supabase.co:5432/postgres"
    }
]

print("TESTING SUPABASE CONNECTION STRINGS", file=sys.stderr)
print("="*60, file=sys.stderr)

working_url = None

for i, config in enumerate(configs, 1):
    print(f"\n{i}. Testing: {config['name']}", file=sys.stderr)
    
    try:
        engine = create_engine(config['url'], pool_pre_ping=True, echo=False)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print(f"   ✅ SUCCESS!", file=sys.stderr)
            working_url = config['url']
            break
    except Exception as e:
        print(f"   ❌ Failed: {type(e).__name__}", file=sys.stderr)
        print(f"   Error: {str(e)}", file=sys.stderr)

print("\n" + "="*60, file=sys.stderr)

if working_url:
    print(f"\n✅ WORKING URL FOUND:", file=sys.stderr)
    print(working_url, file=sys.stderr)
else:
    print("\n❌ NO WORKING URL FOUND", file=sys.stderr)
    print("\nThis might be a network/firewall issue.", file=sys.stderr)
    print("Or the Supabase project settings might need adjustment.", file=sys.stderr)
