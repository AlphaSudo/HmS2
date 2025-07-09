from fastapi import APIRouter, HTTPException
from typing import Optional, List
from datetime import datetime
import logging

from ....schemas.stroke import PatientStrokeData, StrokePredictionResponse, HealthResponse
from ....services import prediction_service
from ....core.eureka_client import eureka_client

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
        "version": "1.0.0",
        "description": "AI-powered stroke risk prediction",
        "model_loaded": prediction_service.model_loaded,
        "eureka_server": eureka_client.eureka_server,
        "instance_id": eureka_client.instance_id
    }

@router.post("/predict", response_model=StrokePredictionResponse)
async def predict_stroke(patient_data: PatientStrokeData, patient_id: Optional[str] = None):
    """
    Predict stroke risk for a single patient.
    """
    try:
        risk, probability = prediction_service.safe_predict(patient_data.dict())
        risk_level = prediction_service.get_risk_level(probability)
        
        return StrokePredictionResponse(
            stroke_risk=risk,
            probability=probability,
            risk_level=risk_level,
            patient_id=patient_id,
            prediction_timestamp=datetime.utcnow().isoformat()
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Failed to make a prediction.")

@router.post("/predict/batch", response_model=List[StrokePredictionResponse])
async def predict_stroke_batch(patients_data: list[PatientStrokeData]):
    """
    Predict stroke risk for a batch of patients.
    """
    predictions = []
    for patient_data in patients_data:
        try:
            risk, probability = prediction_service.safe_predict(patient_data.dict())
            risk_level = prediction_service.get_risk_level(probability)
            predictions.append(StrokePredictionResponse(
                stroke_risk=risk,
                probability=probability,
                risk_level=risk_level,
                prediction_timestamp=datetime.utcnow().isoformat()
            ))
        except Exception as e:
            logger.error(f"Batch prediction error for a patient: {e}")
            # Skip failing predictions in batch
            continue
    return predictions

@router.get("/stats")
async def get_prediction_stats():
    """
    (Placeholder) Endpoint for prediction statistics.
    """
    return {
        "service": eureka_client.service_name,
        "status": "active",
        "model_loaded": prediction_service.model_loaded,
        "predictions_today": 0,
        "average_risk_score": 0.0
    } 