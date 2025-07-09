import joblib
import pandas as pd
import numpy as np
import os
import logging
from typing import Dict, Any
from ..core.config import MODEL_PATH

logger = logging.getLogger(__name__)

model = None
model_loaded = False

def get_risk_level(probability: float) -> str:
    """Determine risk level based on probability"""
    if probability >= 0.5:
        return "Disease"
    else:
        return "No Disease"

def load_model():
    """Load the trained liver disease prediction model."""
    global model, model_loaded
    try:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        
        model = joblib.load(MODEL_PATH)
        model_loaded = True
        logger.info("Liver disease prediction model loaded successfully from %s", MODEL_PATH)
        return True
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        model_loaded = False
        return False

def safe_predict(patient_data_dict: Dict[str, Any]) -> tuple:
    """
    Safely make a prediction using the logic compatible with the original model.
    """
    if not model_loaded or not model:
        raise RuntimeError("Model is not loaded")

    try:
        # Convert input dictionary to a DataFrame
        patient_df = pd.DataFrame([patient_data_dict])

        # Gender mapping
        patient_df['Gender'] = patient_df['Gender'].replace({'Male': 1, 'Female': 0})
        
        # Make prediction
        prediction = model.predict(patient_df)
        probability = model.predict_proba(patient_df)[:, 1]
        
        return int(prediction[0]), float(probability[0])

    except Exception as e:
        logger.error(f"An error occurred during prediction: {e}")
        # Re-raise as a generic exception to be caught by the API endpoint
        raise 