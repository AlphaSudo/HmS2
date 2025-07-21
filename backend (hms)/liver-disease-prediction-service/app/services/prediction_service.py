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
scaler_means = None
scaler_stds = None

def get_risk_level(probability: float) -> str:
    """Determine risk level based on probability"""
    if probability >= 0.5:
        return "Disease"
    else:
        return "No Disease"

def load_model():
    """Load the trained liver disease prediction model."""
    global model, model_loaded, scaler_means, scaler_stds
    try:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        
        model = joblib.load(MODEL_PATH)
        model_loaded = True
        
        # Check if model is actually a model or just a float (accuracy score)
        if isinstance(model, (int, float)):
            logger.error(f"Model file contains a number ({model}), not a trained model!")
            logger.error("This suggests the wrong object was saved during training.")
            model_loaded = False
            return False
            
        logger.info("Liver disease prediction model loaded successfully from %s", MODEL_PATH)
        logger.info(f"Model type: {type(model)}")
        
        # Load or set default scaler parameters (from training notebook)
        # These are the means and stds from the training data
        scaler_means = {
            'Age': 44.746,
            'Gender': 0.5,  # Will be handled separately
            'Total_Bilirubin': 3.298,
            'Direct_Bilirubin': 1.095,
            'Alkaline_Phosphotase': 290.576,
            'Alamine_Aminotransferase': 80.713,
            'Aspartate_Aminotransferase': 109.915,
            'Total_Protiens': 6.483,
            'Albumin': 3.142,
            'Albumin_and_Globulin_Ratio': 1.183
        }
        
        scaler_stds = {
            'Age': 16.189,
            'Gender': 0.5,  # Will be handled separately
            'Total_Bilirubin': 6.208,
            'Direct_Bilirubin': 2.035,
            'Alkaline_Phosphotase': 242.938,
            'Alamine_Aminotransferase': 182.617,
            'Aspartate_Aminotransferase': 288.198,
            'Total_Protiens': 1.088,
            'Albumin': 0.769,
            'Albumin_and_Globulin_Ratio': 0.359
        }
        
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
        
        # Debug logging
        logger.info(f"Raw input data: {patient_data_dict}")
        
        # Gender mapping - CORRECTED to match training (Male=0, Female=1)
        patient_df['Gender'] = patient_df['Gender'].replace({'Male': 0, 'Female': 1})
        
        # Apply the same standardization as in training
        if scaler_means and scaler_stds:
            for column in patient_df.columns:
                if column in scaler_means and column in scaler_stds:
                    if scaler_stds[column] != 0:  # Avoid division by zero
                        patient_df[column] = (patient_df[column] - scaler_means[column]) / scaler_stds[column]
        
        logger.info(f"Preprocessed data: {patient_df.to_dict('records')[0]}")
        
        # Make prediction
        prediction = model.predict(patient_df)
        probability = model.predict_proba(patient_df)[:, 1]
        
        logger.info(f"Model prediction: {prediction[0]}, probability: {probability[0]}")
        
        return int(prediction[0]), float(probability[0])

    except Exception as e:
        logger.error(f"An error occurred during prediction: {e}")
        # Re-raise as a generic exception to be caught by the API endpoint
        raise