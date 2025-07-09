# HMS Diabetes Prediction Microservice

## 🏥 Overview

This is a **FastAPI-based microservice** for diabetes prediction, designed to integrate with the Hospital Management System (HMS). It uses a pre-trained machine learning model (`model.joblib`) to predict diabetes risk based on patient diagnostics.

## ✨ Features

- **Fast API endpoints** for real-time diabetes prediction
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
- The model files (`model.joblib`, `scaler.joblib`, `model_columns.joblib`) must exist in the `app/models/` directory. Run `train_model.py` to generate them.
- Docker (optional)

### 1. Setup Environment

```bash
# Navigate to the service directory
cd backend "(hms)/diabetes-prediction-service"

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Run the Service

Ensure your pre-trained model files are in the `app/models/` directory.

#### Option A: Direct Python
```bash
# Run with uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8088 --reload
```

#### Option B: Docker Compose
```bash
# Run with docker-compose
docker-compose up --build
```

### 3. Access the API

- **API Documentation**: http://localhost:8088/diabetes-prediction/docs
- **Health Check**: http://localhost:8088/diabetes-prediction/health

## 📡 API Endpoints

### Core Endpoints

#### 🔮 Prediction
```http
POST /diabetes-prediction/predict
```

**Request Body:**
```json
{
  "Pregnancies": 6,
  "Glucose": 148,
  "BloodPressure": 72,
  "SkinThickness": 35,
  "Insulin": 0,
  "BMI": 33.6,
  "DiabetesPedigreeFunction": 0.627,
  "Age": 50
}
```
**Response:**
```json
{
  "diabetes_risk": 1,
  "probability": 0.85,
  "risk_level": "Disease",
  "patient_id": null,
  "prediction_timestamp": "2024-01-15T10:30:00"
}
```

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t hms-diabetes-prediction:latest .
```

### Run Container
```bash
# Make sure model files are in the app/models directory
docker run -d \
  --name hms-diabetes-prediction \
  -p 8088:8088 \
  -v $(pwd)/app/models/model.joblib:/app/app/models/model.joblib:ro \
  -v $(pwd)/app/models/scaler.joblib:/app/app/models/scaler.joblib:ro \
  -v $(pwd)/app/models/model_columns.joblib:/app/app/models/model_columns.joblib:ro \
  hms-diabetes-prediction:latest
```

## 🏗️ HMS Architecture Integration

This service follows HMS microservice patterns. It can be registered with a Eureka discovery server and accessed via an API Gateway.

---

**🎯 Ready to predict diabetes risk with AI-powered precision!** 