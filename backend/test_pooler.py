"""Test pooler connection variations"""
import psycopg2

configs = [
    ("Pooler with SSL", {
        "host": "aws-0-ap-south-1.pooler.supabase.com",
        "port": 6543,
        "database": "postgres",
        "user": "postgres.flaymbrucxlosgillfop",
        "password": "ZGeDS0vhKgt5HUNe",
        "sslmode": "require",
        "connect_timeout": 10
    }),
    ("Pooler without SSL", {
        "host": "aws-0-ap-south-1.pooler.supabase.com",
        "port": 6543,
        "database": "postgres",
        "user": "postgres.flaymbrucxlosgillfop",
        "password": "ZGeDS0vhKgt5HUNe",
        "connect_timeout": 10
    }),
    ("Pooler SSL prefer", {
        "host": "aws-0-ap-south-1.pooler.supabase.com",
        "port": 6543,
        "database": "postgres",
        "user": "postgres.flaymbrucxlosgillfop",
        "password": "ZGeDS0vhKgt5HUNe",
        "sslmode": "prefer",
        "connect_timeout": 10
    }),
    ("Different user format", {
        "host": "aws-0-ap-south-1.pooler.supabase.com",
        "port": 6543,
        "database": "postgres",
        "user": "postgres",
        "password": "ZGeDS0vhKgt5HUNe",
        "sslmode": "require",
        "connect_timeout": 10
    }),
]

print("Testing Pooler Connection Variations...")
print("=" * 60)

for name, params in configs:
    print(f"\n{name}:")
    print(f"  Host: {params['host']}")
    print(f"  Port: {params['port']}")
    print(f"  User: {params['user']}")
    print(f"  SSL: {params.get('sslmode', 'not set')}")
    
    try:
        conn = psycopg2.connect(**params)
        cursor = conn.cursor()
        cursor.execute("SELECT 1;")
        result = cursor.fetchone()
        
        print(f"  ✅ SUCCESS! Result: {result}")
        
        cursor.close()
        conn.close()
        
        print(f"\n🎉 WORKING CONNECTION FOUND!")
        print(f"\nUse these parameters:")
        for key, val in params.items():
            if key != "password":
                print(f"  {key}: {val}")
        
        # Build connection string
        ssl_param = f"?sslmode={params['sslmode']}" if 'sslmode' in params else ""
        conn_string = f"postgresql://{params['user']}:{params['password']}@{params['host']}:{params['port']}/{params['database']}{ssl_param}"
        print(f"\nConnection String:")
        print(conn_string)
        break
        
    except Exception as e:
        print(f"  ❌ Failed: {type(e).__name__}")
        print(f"  Error: {str(e)[:100]}")

print("\n" + "=" * 60)
