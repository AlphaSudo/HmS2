from pydantic import BaseModel, Field
from typing import Optional

class LiverPatientData(BaseModel):
    Age: int = Field(..., ge=0, description="Patient age")
    Gender: str = Field(..., description="Patient gender: Male/Female")
    Total_Bilirubin: float = Field(..., ge=0, description="Total Bilirubin")
    Direct_Bilirubin: float = Field(..., ge=0, description="Direct Bilirubin")
    Alkaline_Phosphotase: int = Field(..., ge=0, description="Alkaline Phosphotase")
    Alamine_Aminotransferase: int = Field(..., ge=0, description="Alamine Aminotransferase")
    Aspartate_Aminotransferase: int = Field(..., ge=0, description="Aspartate Aminotransferase")
    Total_Protiens: float = Field(..., ge=0, description="Total Protiens")
    Albumin: float = Field(..., ge=0, description="Albumin")
    Albumin_and_Globulin_Ratio: float = Field(..., ge=0, description="Albumin and Globulin Ratio")

    model_config = {
        "json_schema_extra": {
            "example": {
                "Age": 65,
                "Gender": "Female",
                "Total_Bilirubin": 0.7,
                "Direct_Bilirubin": 0.1,
                "Alkaline_Phosphotase": 187,
                "Alamine_Aminotransferase": 16,
                "Aspartate_Aminotransferase": 18,
                "Total_Protiens": 6.8,
                "Albumin": 3.3,
                "Albumin_and_Globulin_Ratio": 0.9
            }
        }
    }

class LiverDiseasePredictionResponse(BaseModel):
    liver_disease_risk: int = Field(..., description="Liver disease prediction: 0=No Disease, 1=Disease")
    probability: float = Field(..., description="Probability of liver disease (0-1)")
    risk_level: str = Field(..., description="Risk level description")
    patient_id: Optional[str] = Field(None, description="Patient identifier")
    prediction_timestamp: str = Field(..., description="Timestamp of prediction")

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    service: str
    model_loaded: bool 