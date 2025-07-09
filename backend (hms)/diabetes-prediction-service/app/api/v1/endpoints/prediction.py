from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime
import logging

from app.schemas.diabetes import DiabetesInput, DiabetesPredictionResponse, HealthResponse
from app.services import prediction_service
from app.core.eureka_client import eureka_client
from app.core import config

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if prediction_service.model_loaded else "unhealthy",
        timestamp=datetime.utcnow().isoformat(),
        service=eureka_client.service_name,
        model_loaded=prediction_service.model_loaded
    )

@router.get("/info")
async def service_info():
    """Service information endpoint"""
    return {
        "service": eureka_client.service_name,
        "version": config.VERSION,
        "description": config.DESCRIPTION,
        "model_loaded": prediction_service.model_loaded,
        "eureka_server": eureka_client.eureka_server,
        "instance_id": eureka_client.instance_id
    }

@router.post("/predict", response_model=DiabetesPredictionResponse)
async def predict_diabetes(patient_data: DiabetesInput, patient_id: Optional[str] = None):
    """
    Predict diabetes risk for a single patient.
    """
    if not prediction_service.model_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded. Please try again later.")
        
    try:
        risk, probability = prediction_service.safe_predict(patient_data.dict())
        risk_level = prediction_service.get_risk_level(probability)
        
        return DiabetesPredictionResponse(
            diabetes_risk=risk,
            probability=probability,
            risk_level=risk_level,
            patient_id=patient_id,
            prediction_timestamp=datetime.utcnow().isoformat()
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Failed to make a prediction.")

@router.get("/stats")
async def get_prediction_stats():
    """
    (Placeholder) Endpoint for prediction statistics.
    """
    return {
        "service": eureka_client.service_name,
        "status": "active",
        "model_loaded": prediction_service.model_loaded,
        "predictions_today": 0, # Placeholder
        "average_risk_score": 0.0 # Placeholder
    } 