import os
import socket

# Service metadata
PROJECT_NAME = "HMS Stroke Prediction Service"
VERSION = "1.0.0"
DESCRIPTION = "Microservice for stroke risk prediction using machine learning"

# API configuration
API_PREFIX = "/stroke-prediction"
DOCS_URL = "/docs"
REDOC_URL = "/redoc"
OPENAPI_URL = "/openapi.json"

# Eureka configuration
EUREKA_SERVER = os.getenv("EUREKA_SERVER", "http://localhost:8761/eureka")
SERVICE_NAME = "stroke-prediction-service"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", "8090"))
SERVICE_HOST = os.getenv("SERVICE_HOST", socket.gethostbyname(socket.gethostname()))

# Model path
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models', 'model.joblib')) 