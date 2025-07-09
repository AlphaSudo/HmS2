# HMS Liver Disease Prediction Microservice

## 🏥 Overview

This is a **FastAPI-based microservice** for liver disease prediction, designed to integrate with the Hospital Management System (HMS). It uses a pre-trained machine learning model (`model.joblib`) to predict liver disease risk based on patient demographics and medical data.

## ✨ Features

- **Fast API endpoints** for real-time liver disease prediction
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
- An existing `model.joblib` file placed in the `app/models/` directory.
- Docker (optional)

### 1. Setup Environment

```bash
# Navigate to the service directory
cd backend "(hms)/liver-disease-prediction-service"

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Run the Service

Place your pre-trained `model.joblib` in the `app/models/` directory.

#### Option A: Direct Python
```bash
# Run with uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8091 --reload
```

#### Option B: Docker Compose
```bash
# Run with docker-compose
docker-compose up --build
```

### 3. Access the API

- **API Documentation**: http://localhost:8091/liver-disease-prediction/docs
- **Health Check**: http://localhost:8091/liver-disease-prediction/health

## 📡 API Endpoints

### Core Endpoints

#### 🔮 Prediction
```http
POST /liver-disease-prediction/predict
```

**Request Body:**
```json
{
  "Age": 65,
  "Gender": "Female",
  "Total_Bilirubin": 0.7,
  "Direct_Bilirubin": 0.1,
  "Alkaline_Phosphotase": 187,
  "Alamine_Aminotransferase": 16,
  "Aspartate_Aminotransferase": 18,
  "Total_Protiens": 6.8,
  "Albumin": 3.3,
  "Albumin_and_Globulin_Ratio": 0.9
}
```
**Response:**
```json
{
  "liver_disease_risk": 1,
  "probability": 0.85,
  "risk_level": "Disease",
  "patient_id": null,
  "prediction_timestamp": "2024-01-15T10:30:00"
}
```

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t hms-liver-disease-prediction:latest .
```

### Run Container
```bash
# Make sure model.joblib is in the app/models directory
docker run -d \
  --name hms-liver-disease-prediction \
  -p 8091:8091 \
  -v $(pwd)/app/models/model.joblib:/app/app/models/model.joblib:ro \
  hms-liver-disease-prediction:latest
```

## 🏗️ HMS Architecture Integration

This service follows HMS microservice patterns. It can be registered with a Eureka discovery server and accessed via an API Gateway.

---

**🎯 Ready to predict liver disease risk with AI-powered precision!** 