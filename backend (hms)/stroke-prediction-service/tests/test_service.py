#!/usr/bin/env python3
"""
Test script for the stroke prediction service
"""

import requests
import json
import time

def test_health_check(base_url="http://localhost:8090"):
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{base_url}/stroke-prediction/health")
        if response.status_code == 200:
            data = response.json()
            print("✅ Health Check Passed")
            print(f"   Status: {data.get('status')}")
            print(f"   Service: {data.get('service')}")
            print(f"   Model Loaded: {data.get('model_loaded')}")
            return True
        else:
            print(f"❌ Health Check Failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health Check Failed: {e}")
        return False

def test_model_info(base_url="http://localhost:8090"):
    """Test the model info endpoint"""
    try:
        response = requests.get(f"{base_url}/stroke-prediction/model/info")
        if response.status_code == 200:
            data = response.json()
            print("✅ Model Info Retrieved")
            print(f"   Model Type: {data.get('model_type')}")
            print(f"   Features: {data.get('features')}")
            return True
        else:
            print(f"❌ Model Info Failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Model Info Failed: {e}")
        return False

def test_prediction(base_url="http://localhost:8090"):
    """Test the stroke prediction endpoint"""
    
    # Test data from the notebook
    test_cases = [
        {
            "name": "High Risk Patient",
            "data": {
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
        },
        {
            "name": "Low Risk Patient",
            "data": {
                "gender": "Female",
                "age": 25.0,
                "hypertension": 0,
                "heart_disease": 0,
                "ever_married": "No",
                "work_type": "Private",
                "Residence_type": "Urban",
                "avg_glucose_level": 85.0,
                "bmi": 22.5,
                "smoking_status": "never smoked"
            }
        }
    ]
    
    for test_case in test_cases:
        print(f"\n🧪 Testing: {test_case['name']}")
        try:
            response = requests.post(
                f"{base_url}/predict",
                json=test_case['data'],
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Prediction Successful")
                print(f"   Stroke Risk: {result.get('stroke_risk')}")
                print(f"   Probability: {result.get('probability'):.4f}")
                print(f"   Risk Level: {result.get('risk_level')}")
                print(f"   Timestamp: {result.get('prediction_timestamp')}")
            else:
                print(f"❌ Prediction Failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Prediction Failed: {e}")
            return False
    
    return True

def test_batch_prediction(base_url="http://localhost:8090"):
    """Test the batch prediction endpoint"""
    
    batch_data = [
        {
            "gender": "Male",
            "age": 67.0,
            "hypertension": 1,
            "heart_disease": 1,
            "ever_married": "Yes",
            "work_type": "Private",
            "Residence_type": "Urban",
            "avg_glucose_level": 228.69,
            "bmi": 36.6,
            "smoking_status": "smokes"
        },
        {
            "gender": "Female",
            "age": 30.0,
            "hypertension": 0,
            "heart_disease": 0,
            "ever_married": "Yes",
            "work_type": "Private",
            "Residence_type": "Rural",
            "avg_glucose_level": 95.0,
            "bmi": 24.0,
            "smoking_status": "never smoked"
        }
    ]
    
    print("\n🧪 Testing Batch Prediction")
    try:
        response = requests.post(
            f"{base_url}/stroke-prediction/predict/batch",
            json=batch_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Batch Prediction Successful")
            print(f"   Total Patients: {result.get('total_patients')}")
            for i, pred in enumerate(result.get('predictions', [])):
                print(f"   Patient {i+1}: Risk={pred.get('stroke_risk')}, Probability={pred.get('probability'):.4f}")
            return True
        else:
            print(f"❌ Batch Prediction Failed: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Batch Prediction Failed: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 HMS Stroke Prediction Service Test Suite")
    print("=" * 60)
    
    base_url = "http://localhost:8090"
    
    # Wait for service to start
    print("⏳ Waiting for service to start...")
    max_retries = 10
    for i in range(max_retries):
        try:
            response = requests.get(f"{base_url}/stroke-prediction/health", timeout=5)
            if response.status_code == 200:
                break
        except:
            pass
        
        if i < max_retries - 1:
            print(f"   Retry {i+1}/{max_retries}...")
            time.sleep(2)
        else:
            print("❌ Service not responding. Please ensure it's running on port 8090.")
            return False
    
    # Run tests
    tests_passed = 0
    total_tests = 4
    
    print("\n🏥 Running Test Suite...")
    
    # Test 1: Health Check
    if test_health_check(base_url):
        tests_passed += 1
    
    # Test 2: Model Info
    if test_model_info(base_url):
        tests_passed += 1
    
    # Test 3: Individual Predictions
    if test_prediction(base_url):
        tests_passed += 1
    
    # Test 4: Batch Prediction
    if test_batch_prediction(base_url):
        tests_passed += 1
    
    # Results
    print("\n📊 Test Results")
    print("=" * 30)
    print(f"Tests Passed: {tests_passed}/{total_tests}")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Service is working correctly.")
        return True
    else:
        print("⚠️  Some tests failed. Please check the service.")
        return False

if __name__ == "__main__":
    main() 