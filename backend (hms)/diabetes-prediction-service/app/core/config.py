import os
import socket

# Service metadata
PROJECT_NAME = "HMS Diabetes Prediction Service"
VERSION = "1.0.0"
DESCRIPTION = "Microservice for diabetes prediction using machine learning"

# API configuration
API_PREFIX = "/diabetes-prediction"
DOCS_URL = "/docs"
REDOC_URL = "/redoc"
OPENAPI_URL = "/openapi.json"

# Eureka configuration
EUREKA_SERVER = os.getenv("EUREKA_SERVER", "http://discovery-server-service:8761/eureka")
SERVICE_NAME = "diabetes-prediction-service"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", "8088"))
SERVICE_HOST = os.getenv("SERVICE_HOST", socket.gethostbyname(socket.gethostname()))

# Model paths
MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
MODEL_PATH = os.path.join(MODEL_DIR, 'model.joblib')
SCALER_PATH = os.path.join(MODEL_DIR, 'scaler.joblib')
COLUMNS_PATH = os.path.join(MODEL_DIR, 'model_columns.joblib') 