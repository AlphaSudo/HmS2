from pydantic import BaseModel, Field
from typing import Optional

class PatientStrokeData(BaseModel):
    gender: str = Field(..., description="Patient gender: Male/Female")
    age: float = Field(..., ge=0, le=120, description="Patient age")
    hypertension: int = Field(..., ge=0, le=1, description="Hypertension: 0=No, 1=Yes")
    heart_disease: int = Field(..., ge=0, le=1, description="Heart disease: 0=No, 1=Yes")
    ever_married: str = Field(..., description="Ever married: Yes/No")
    work_type: str = Field(..., description="Work type: Private/Self-employed/Govt_job/children/Never_worked")
    Residence_type: str = Field(..., description="Residence type: Urban/Rural")
    avg_glucose_level: float = Field(..., ge=0, description="Average glucose level")
    bmi: float = Field(..., ge=0, description="Body Mass Index")
    smoking_status: str = Field(..., description="Smoking status: Unknown/never smoked/formerly smoked/smokes")

    model_config = {
        "json_schema_extra": {
            "example": {
                "gender": "Male",
                "age": 67.0,
                "hypertension": 0,
                "heart_disease": 1,
                "ever_married": "Yes",
                "work_type": "Private",
                "Residence_type": "Urban",
                "avg_glucose_level": 228.69,
                "bmi": 36.6,
                "smoking_status": "formerly smoked"
            }
        }
    }

class StrokePredictionResponse(BaseModel):
    stroke_risk: int = Field(..., description="Stroke prediction: 0=Low Risk, 1=High Risk")
    probability: float = Field(..., description="Probability of stroke (0-1)")
    risk_level: str = Field(..., description="Risk level description")
    patient_id: Optional[str] = Field(None, description="Patient identifier")
    prediction_timestamp: str = Field(..., description="Timestamp of prediction")

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    service: str
    model_loaded: bool 