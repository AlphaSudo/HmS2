import joblib
import pandas as pd
import numpy as np
import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Globals for the model and related objects
model = None
scaler = None
model_columns = None
model_loaded = False

def get_risk_level(probability: float) -> str:
    """Determine risk level based on probability."""
    if probability >= 0.5:
        return "Disease"
    else:
        return "No Disease"

def load_model():
    """Load the trained model, scaler, and columns."""
    global model, scaler, model_columns, model_loaded
    try:
        model_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
        model_path = os.path.join(model_dir, 'model.joblib')
        scaler_path = os.path.join(model_dir, 'scaler.joblib')
        columns_path = os.path.join(model_dir, 'model_columns.joblib')

        if not all(os.path.exists(p) for p in [model_path, scaler_path, columns_path]):
            raise FileNotFoundError("One or more model files are missing.")

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        model_columns = joblib.load(columns_path)
        model_loaded = True
        logger.info("Diabetes prediction model loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        model_loaded = False

def safe_predict(patient_data_dict: Dict[str, Any]) -> tuple:
    """
    Safely make a prediction using the full preprocessing pipeline.
    """
    if not model_loaded:
        raise RuntimeError("Model is not loaded")

    try:
        # Create a DataFrame from the input
        patient_df = pd.DataFrame([patient_data_dict])

        # Apply the same feature engineering as in the training script
        # BMI categories
        NewBMI = pd.Series(["Underweight", "Normal", "Overweight", "Obesity 1", "Obesity 2", "Obesity 3"], dtype="category")
        patient_df['NewBMI'] = NewBMI
        patient_df.loc[patient_df["BMI"] < 18.5, "NewBMI"] = NewBMI[0]
        patient_df.loc[(patient_df["BMI"] > 18.5) & (patient_df["BMI"] <= 24.9), "NewBMI"] = NewBMI[1]
        patient_df.loc[(patient_df["BMI"] > 24.9) & (patient_df["BMI"] <= 29.9), "NewBMI"] = NewBMI[2]
        patient_df.loc[(patient_df["BMI"] > 29.9) & (patient_df["BMI"] <= 34.9), "NewBMI"] = NewBMI[3]
        patient_df.loc[(patient_df["BMI"] > 34.9) & (patient_df["BMI"] <= 39.9), "NewBMI"] = NewBMI[4]
        patient_df.loc[patient_df["BMI"] > 39.9, "NewBMI"] = NewBMI[5]

        # Insulin score
        def set_insulin(row):
            if 16 <= row["Insulin"] <= 166: return "Normal"
            else: return "Abnormal"
        patient_df['NewInsulinScore'] = patient_df.apply(set_insulin, axis=1)

        # Glucose categories
        NewGlucose = pd.Series(["Low", "Normal", "Overweight", "Secret", "High"], dtype="category")
        patient_df["NewGlucose"] = NewGlucose
        patient_df.loc[patient_df["Glucose"] <= 70, "NewGlucose"] = NewGlucose[0]
        patient_df.loc[(patient_df["Glucose"] > 70) & (patient_df["Glucose"] <= 99), "NewGlucose"] = NewGlucose[1]
        patient_df.loc[(patient_df["Glucose"] > 99) & (patient_df["Glucose"] <= 126), "NewGlucose"] = NewGlucose[2]
        patient_df.loc[patient_df["Glucose"] > 126, "NewGlucose"] = NewGlucose[3]

        # One-hot encoding
        patient_df = pd.get_dummies(patient_df, columns=["NewBMI", "NewInsulinScore", "NewGlucose"], drop_first=True)

        # Align columns with the training data
        patient_df_aligned = patient_df.reindex(columns=model_columns, fill_value=0)

        # Scaling and Prediction
        X_scaled = scaler.transform(patient_df_aligned)  # type: ignore
        prediction = model.predict(X_scaled)  # type: ignore
        probability = model.predict_proba(X_scaled)[:, 1]  # type: ignore

        return int(prediction[0]), float(probability[0])

    except Exception as e:
        logger.error(f"An error occurred during prediction: {e}")
        raise 