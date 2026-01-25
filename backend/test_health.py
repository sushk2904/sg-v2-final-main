"""Backend Status Check Script"""
import requests
import json

def check_backend():
    print("=" * 60)
    print("BACKEND STATUS CHECK")
    print("=" * 60)
    
    # Test 1: Root endpoint
    print("\n1. Testing root endpoint (/)...")
    try:
        response = requests.get("http://localhost:8000/", timeout=5)
        print(f"   ✅ Status: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"   ❌ Failed: {e}")
    
    # Test 2: Health endpoint
    print("\n2. Testing health endpoint (/health)...")
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        print(f"   ✅ Status: {response.status_code}")
        data = response.json()
        print(f"   Response: {json.dumps(data, indent=2)}")
        
        if data.get("database") == "connected":
            print("   ✅ Database: CONNECTED")
        else:
            print("   ❌ Database: DISCONNECTED")
    except Exception as e:
        print(f"   ❌ Failed: {e}")
    
    # Test 3: API docs
    print("\n3. Testing API docs (/docs)...")
    try:
        response = requests.get("http://localhost:8000/docs", timeout=5)
        print(f"   ✅ Status: {response.status_code}")
        print(f"   Swagger UI available at: http://localhost:8000/docs")
    except Exception as e:
        print(f"   ❌ Failed: {e}")
    
    print("\n" + "=" * 60)
    print("STATUS CHECK COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    check_backend()
