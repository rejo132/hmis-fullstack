#!/usr/bin/env python3
"""
Simple test script to verify backend API endpoints
"""

import requests
import json
import sys

BASE_URL = "http://localhost:5000"

def test_health_endpoint():
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health check: {response.status_code}")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print("❌ Health check failed")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check error: {e}")
        return False

def test_api_endpoint():
    """Test the API test endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/test")
        print(f"API test GET: {response.status_code}")
        if response.status_code == 200:
            print("✅ API test GET passed")
            print(f"Response: {response.json()}")
            return True
        else:
            print("❌ API test GET failed")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ API test GET error: {e}")
        return False

def test_api_post_endpoint():
    """Test the API test POST endpoint"""
    try:
        test_data = {
            "invoice_id": 123,
            "phone_number": "254700000000",
            "amount": 1000
        }
        response = requests.post(f"{BASE_URL}/api/test", json=test_data)
        print(f"API test POST: {response.status_code}")
        if response.status_code == 200:
            print("✅ API test POST passed")
            print(f"Response: {response.json()}")
            return True
        else:
            print("❌ API test POST failed")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ API test POST error: {e}")
        return False

def test_cors_headers():
    """Test CORS headers"""
    try:
        response = requests.options(f"{BASE_URL}/api/test")
        print(f"CORS test: {response.status_code}")
        
        cors_headers = response.headers.get('Access-Control-Allow-Origin')
        if cors_headers:
            print(f"✅ CORS headers found: {cors_headers}")
            # Check for duplicate headers
            if ',' in cors_headers:
                print("⚠️  Warning: Multiple CORS origins detected")
            return True
        else:
            print("❌ No CORS headers found")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ CORS test error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Backend API...")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health_endpoint),
        ("API Test GET", test_api_endpoint),
        ("API Test POST", test_api_post_endpoint),
        ("CORS Headers", test_cors_headers),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing: {test_name}")
        print("-" * 30)
        if test_func():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Backend is working correctly.")
        return 0
    else:
        print("❌ Some tests failed. Please check the backend configuration.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 