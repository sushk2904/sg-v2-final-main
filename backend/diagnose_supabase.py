"""
Comprehensive Supabase Connection Diagnostic Tool
Tests DNS, network connectivity, and database connections
"""
import socket
import psycopg2
from urllib.parse import urlparse
import sys

configs = [
    ("Direct Connection + SSL", "postgresql://postgres:ZGeDS0vhKgt5HUNe@db.flaymbrucxlosgillfop.supabase.co:5432/postgres?sslmode=require"),
    ("Pooler Connection + SSL", "postgresql://postgres.flaymbrucxlosgillfop:ZGeDS0vhKgt5HUNe@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"),
    ("Direct Connection (No SSL)", "postgresql://postgres:ZGeDS0vhKgt5HUNe@db.flaymbrucxlosgillfop.supabase.co:5432/postgres"),
    ("Pooler Connection (No SSL)", "postgresql://postgres.flaymbrucxlosgillfop:ZGeDS0vhKgt5HUNe@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"),
]

print("=" * 70)
print(" SUPABASE CONNECTION DIAGNOSTICS")
print("=" * 70)

# Test 1: DNS Resolution
print("\n📡 TEST 1: DNS Resolution")
print("-" * 70)
dns_ok = True
for host in ["db.flaymbrucxlosgillfop.supabase.co", "aws-0-ap-south-1.pooler.supabase.com"]:
    try:
        ip = socket.gethostbyname(host)
        print(f"✅ {host}")
        print(f"   Resolved to: {ip}")
    except socket.gaierror as e:
        print(f"❌ {host}")
        print(f"   DNS RESOLUTION FAILED: {e}")
        dns_ok = False

if not dns_ok:
    print("\n⚠️  DNS issues detected! Check:")
    print("   - Internet connection")
    print("   - DNS settings (try 8.8.8.8)")
    print("   - Firewall/network restrictions")

# Test 2: Port Connectivity
print("\n🔌 TEST 2: Port Connectivity")
print("-" * 70)
test_ports = [
    ("db.flaymbrucxlosgillfop.supabase.co", 5432, "Direct PostgreSQL"),
    ("aws-0-ap-south-1.pooler.supabase.com", 6543, "Connection Pooler")
]

ports_ok = True
for host, port, desc in test_ports:
    try:
        sock = socket.create_connection((host, port), timeout=10)
        sock.close()
        print(f"✅ {desc}")
        print(f"   {host}:{port} - Reachable")
    except socket.timeout:
        print(f"❌ {desc}")
        print(f"   {host}:{port} - TIMEOUT (firewall/network blocking?)")
        ports_ok = False
    except Exception as e:
        print(f"❌ {desc}")
        print(f"   {host}:{port} - {type(e).__name__}: {str(e)[:50]}")
        ports_ok = False

if not ports_ok:
    print("\n⚠️  Port connectivity issues detected! Check:")
    print("   - Windows Firewall settings")
    print("   - Antivirus software")
    print("   - VPN/proxy settings")
    print("   - Corporate network restrictions")

# Test 3: Database Connection
print("\n🗄️  TEST 3: PostgreSQL Connection")
print("-" * 70)

working_config = None

for name, url in configs:
    print(f"\nTesting: {name}")
    print(f"URL: {url[:60]}...")
    
    parsed = urlparse(url)
   
    params = {
        "host": parsed.hostname,
        "port": parsed.port or 5432,
        "database": parsed.path[1:] if parsed.path else "postgres",
        "user": parsed.username,
        "password": parsed.password,
        "connect_timeout": 10
    }
    
    # Add SSL mode if in query
    if "sslmode=require" in url:
        params["sslmode"] = "require"
    elif "sslmode=prefer" in url:
        params["sslmode"] = "prefer"
    
    try:
        conn = psycopg2.connect(**params)
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        
        print(f"✅ SUCCESS! Connection established!")
        print(f"   PostgreSQL Version: {version[:50]}...")
        
        cursor.close()
        conn.close()
        
        working_config = (name, url)
        break
        
    except psycopg2.OperationalError as e:
        error_msg = str(e)
        print(f"❌ Connection Failed")
        print(f"   Error: {error_msg[:100]}")
        
        if "timeout" in error_msg.lower():
            print(f"   → Likely: Firewall or network blocking")
        elif "no such host" in error_msg.lower() or "name or service not known" in error_msg.lower():
            print(f"   → Likely: DNS issue or hostname incorrect")
        elif "authentication failed" in error_msg.lower():
            print(f"   → Likely: Wrong password or username")
        elif "ssl" in error_msg.lower():
            print(f"   → Likely: SSL configuration issue")
            
    except Exception as e:
        print(f"❌ Unexpected Error: {type(e).__name__}")
        print(f"   {str(e)[:100]}")

# Summary
print("\n" + "=" * 70)
print(" DIAGNOSTIC SUMMARY")
print("=" * 70)

if working_config:
    print(f"\n✅ WORKING CONNECTION FOUND!")
    print(f"\nConfiguration: {working_config[0]}")
    print(f"\nConnection String:")
    print(f"{working_config[1]}")
    print(f"\n📝 Update your backend/.env with this DATABASE_URL")
else:
    print(f"\n❌ NO WORKING CONNECTION")
    print(f"\nRecommended Actions:")
    
    if not dns_ok:
        print("\n1. Fix DNS resolution first")
        print("   - Check internet connection")
        print("   - Try pinging google.com")
        print("   - Contact network admin if on corporate network")
    
    if not ports_ok:
        print("\n2. Fix port connectivity")
        print("   - Check Windows Firewall")
        print("   - Disable VPN temporarily to test")
        print("   - Check antivirus settings")
        print("   - Try from different network (mobile hotspot)")
    
    print("\n3. Check Supabase Settings")
    print("   - Dashboard → Settings → Database")
    print("   - Enable connection pooling")
    print("   - Check IP allowlist (if any)")
    print("   - Get exact connection string from Supabase")

print("\n" + "=" * 70)
