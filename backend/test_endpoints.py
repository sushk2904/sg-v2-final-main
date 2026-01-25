"""Test all API endpoints"""
import requests

base_url = "http://localhost:8000"
candidate_id = "test-123"

print("Testing API Endpoints...")
print("=" * 60)

# Test 1: Dashboard endpoint
print(f"\n1. GET /api/candidates/{candidate_id}/dashboard")
try:
    resp = requests.get(f"{base_url}/api/candidates/{candidate_id}/dashboard", timeout=5)
    print(f"   Status: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.json()
        print(f"   ✅ Success! CRI Score: {data['cri_score']['overall_cri']}")
    else:
        print(f"   ❌ Error: {resp.text}")
except Exception as e:
    print(f"   ❌ Failed: {e}")

# Test 2: CRI endpoint
print(f"\n2. GET /api/candidates/{candidate_id}/cri")
try:
    resp = requests.get(f"{base_url}/api/candidates/{candidate_id}/cri", timeout=5)
    print(f"   Status: {resp.status_code}")
    if resp.status_code == 200:
        print(f"   ✅ Success!")
except Exception as e:
    print(f"   ❌ Failed: {e}")

# Test 3: Alignment endpoint
print(f"\n3. GET /api/candidates/{candidate_id}/alignment")
try:
    resp = requests.get(f"{base_url}/api/candidates/{candidate_id}/alignment", timeout=5)
    print(f"   Status: {resp.status_code}")
    if resp.status_code == 200:
        print(f"   ✅ Success!")
except Exception as e:
    print(f"   ❌ Failed: {e}")

# Test 4: Signals endpoint
print(f"\n4. GET /api/candidates/{candidate_id}/signals")
try:
    resp = requests.get(f"{base_url}/api/candidates/{candidate_id}/signals", timeout=5)
    print(f"   Status: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.json()
        print(f"   ✅ Success! Skills: {len(data['skills'])}")
except Exception as e:
    print(f"   ❌ Failed: {e}")

print("\n" + "=" * 60)
print("Test complete!")
