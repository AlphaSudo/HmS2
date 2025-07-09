#!/usr/bin/env python3
"""
Simple test script for the stroke prediction API
"""

import requests
import json
import time

def test_api():
    base_url = "http://localhost:8090"
    
    # Wait for service to start
    print("Waiting for service to start...")
    time.sleep(5)
    
    # Test health endpoint
    print("\n=== Testing Health Endpoint ===")
    try:
        response = requests.get(f"{base_url}/stroke-prediction/health")
        if response.status_code == 200:
            print("✅ Health Check Passed")
            health_data = response.json()
            print(f"   Status: {health_data.get('status')}")
            print(f"   Model Loaded: {health_data.get('model_loaded')}")
        else:
            print(f"❌ Health Check Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health Check Error: {e}")
        return False
    
    # Test prediction endpoint
    print("\n=== Testing Prediction Endpoint ===")
    
    # Your original test data
    test_data = {
        "gender": "Male",
        "age": 67.0,
        "hypertension": 0,
        "heart_disease": 1,
        "ever_married": "Yes",
        "work_type": "Private",
        "Residence_type": "Urban",
        "avg_glucose_level": 228.69,
        "bmi": 36.6,
        "smoking_status": "formerly smoked"
    }
    
    try:
        response = requests.post(
            f"{base_url}/stroke-prediction/predict?patient_id=9",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Prediction Successful!")
            print(f"   Stroke Risk: {result.get('stroke_risk')}")
            print(f"   Probability: {result.get('probability'):.4f}")
            print(f"   Risk Level: {result.get('risk_level')}")
            print(f"   Patient ID: {result.get('patient_id')}")
            print(f"   Timestamp: {result.get('prediction_timestamp')}")
            return True
        else:
            print(f"❌ Prediction Failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data.get('detail')}")
            except:
                print(f"   Raw Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Prediction Error: {e}")
        return False

if __name__ == "__main__":
    print("🏥 Testing HMS Stroke Prediction API")
    print("="*50)
    
    success = test_api()
    
    if success:
        print("\n🎉 All tests passed! Your API is working correctly.")
        print("\nYou can now use this curl command:")
        print("""
curl -X 'POST' \\
  'http://localhost:8090/stroke-prediction/predict?patient_id=9' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "gender": "Male",
  "age": 67.0,
  "hypertension": 0,
  "heart_disease": 1,
  "ever_married": "Yes",
  "work_type": "Private",
  "Residence_type": "Urban",
  "avg_glucose_level": 228.69,
  "bmi": 36.6,
  "smoking_status": "formerly smoked"
}'
        """)
    else:
        print("\n❌ Tests failed. Check the service logs.") 