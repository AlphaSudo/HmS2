from pydantic import BaseModel, Field
from typing import Optional

class DiabetesInput(BaseModel):
    Pregnancies: int = Field(..., ge=0, description="Number of times pregnant")
    Glucose: int = Field(..., ge=0, description="Plasma glucose concentration a 2 hours in an oral glucose tolerance test")
    BloodPressure: int = Field(..., ge=0, description="Diastolic blood pressure (mm Hg)")
    SkinThickness: int = Field(..., ge=0, description="Triceps skin fold thickness (mm)")
    Insulin: int = Field(..., ge=0, description="2-Hour serum insulin (mu U/ml)")
    BMI: float = Field(..., ge=0, description="Body mass index (weight in kg/(height in m)^2)")
    DiabetesPedigreeFunction: float = Field(..., ge=0, description="Diabetes pedigree function")
    Age: int = Field(..., ge=0, description="Age in years")

    model_config = {
        "json_schema_extra": {
            "example": {
                "Pregnancies": 6,
                "Glucose": 148,
                "BloodPressure": 72,
                "SkinThickness": 35,
                "Insulin": 0,
                "BMI": 33.6,
                "DiabetesPedigreeFunction": 0.627,
                "Age": 50
            }
        }
    }

class DiabetesPredictionResponse(BaseModel):
    diabetes_risk: int = Field(..., description="Diabetes prediction: 0=No Disease, 1=Disease")
    probability: float = Field(..., description="Probability of diabetes (0-1)")
    risk_level: str = Field(..., description="Risk level description")
    patient_id: Optional[str] = Field(None, description="Patient identifier")
    prediction_timestamp: str = Field(..., description="Timestamp of prediction")

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    service: str
    model_loaded: bool 