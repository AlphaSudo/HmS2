# HMS Stroke Prediction Microservice

## 🏥 Overview

This is a **FastAPI-based microservice** for stroke risk prediction, designed to integrate with the Hospital Management System (HMS). It uses a pre-trained machine learning model (`model.joblib`) to predict stroke risk based on patient demographics and medical data.

## ✨ Features

- **Fast API endpoints** for real-time stroke prediction
- **Batch prediction** support for multiple patients
- **Automatic model loading** on service startup
- **Health checks** and monitoring endpoints
- **OpenAPI documentation** (Swagger UI)
- **Docker support** for easy deployment

## 🔧 Technical Stack

- **FastAPI** - Modern, fast web framework for Python APIs
- **Scikit-learn** - Machine learning model
- **Pandas/Numpy** - Data processing
- **Joblib** - Model serialization
- **Uvicorn** - ASGI server
- **Docker** - Containerization

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- An existing `model.joblib` file placed in the root of this service directory.
- Docker (optional)

### 1. Setup Environment

```bash
# Navigate to the service directory
cd backend/stroke-prediction-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Run the Service

Place your pre-trained `model.joblib` in the root of the `stroke-prediction-service` directory.

#### Option A: Direct Python
```bash
# Run with uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 9000 --reload
```

#### Option B: Docker Compose
```bash
# Run with docker-compose
docker-compose up --build
```

### 3. Access the API

- **API Documentation**: http://localhost:9000/docs
- **Health Check**: http://localhost:9000/health

## 📡 API Endpoints

### Core Endpoints

#### 🔮 Prediction
```http
POST /stroke-prediction/predict
```

**Request Body:**
```json
{
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
```
**Response:**
```json
{
  "stroke_risk": 1,
  "probability": 0.75,
  "risk_level": "High Risk",
  "patient_id": null,
  "prediction_timestamp": "2024-01-15T10:30:00"
}
```

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t hms-stroke-prediction:latest .
```

### Run Container
```bash
# Make sure model.joblib is in the current directory
docker run -d \
  --name hms-stroke-prediction \
  -p 9000:8090 \
  -v $(pwd)/model.joblib:/app/model.joblib:ro \
  hms-stroke-prediction:latest
```

## 🏗️ HMS Architecture Integration

This service follows HMS microservice patterns. It can be registered with a Eureka discovery server and accessed via an API Gateway.

---

**🎯 Ready to predict stroke risk with AI-powered precision!** 