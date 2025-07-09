import joblib
import pandas as pd
import numpy as np
import os
import logging
from typing import Dict, Any
from ..core.config import MODEL_PATH

logger = logging.getLogger(__name__)

model_data = {}
model_loaded = False

def get_risk_level(probability: float) -> str:
    """Determine risk level based on probability"""
    if probability >= 0.7:
        return "High Risk"
    elif probability >= 0.3:
        return "Medium Risk"
    else:
        return "Low Risk"

def load_model():
    """Load the trained stroke prediction model."""
    global model_data, model_loaded
    try:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        
        model_data = joblib.load(MODEL_PATH)
        model_loaded = True
        logger.info("Stroke prediction model loaded successfully from %s", MODEL_PATH)
        return True
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        model_loaded = False
        return False

def safe_predict(patient_data_dict: Dict[str, Any]) -> tuple:
    """
    Safely make a prediction using the logic compatible with the original model.
    """
    if not model_loaded or not model_data:
        raise RuntimeError("Model is not loaded")

    try:
        # Convert input dictionary to a DataFrame
        patient_df = pd.DataFrame([patient_data_dict])
        
        # Get components from the loaded model package
        preprocessor = model_data['preprocessor']
        model = model_data['model']
        numeric_cols = model_data['numeric_cols']
        encoded_cols = model_data['encoded_cols']

        # Replicate the original, fragile feature engineering process
        patient_df[encoded_cols] = preprocessor.transform(patient_df)
        X_predict = patient_df[numeric_cols + encoded_cols]
        
        # Make prediction
        prediction = model.predict(X_predict)
        probability = model.predict_proba(X_predict)[:, 1]
        
        return int(prediction[0]), float(probability[0])

    except Exception as e:
        logger.error(f"An error occurred during prediction: {e}")
        # Re-raise as a generic exception to be caught by the API endpoint
        raise 