from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import threading
import uvicorn
from contextlib import asynccontextmanager

from app.api.v1.endpoints import prediction as liver_prediction_router
from app.services import prediction_service
from app.core.eureka_client import eureka_client, heartbeat_worker
from app.core import config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the model on startup
    prediction_service.load_model()
    # Register with Eureka and start heartbeat
    if eureka_client.register():
        heartbeat = threading.Thread(target=heartbeat_worker, daemon=True)
        heartbeat.start()
    yield
    # Deregister from Eureka on shutdown
    eureka_client.deregister()

app = FastAPI(
    title="Liver Disease Prediction Service",
    description="A service to predict liver disease.",
    version="1.0.0",
    docs_url="/liver-disease-prediction/docs",
    redoc_url="/liver-disease-prediction/redoc",
    openapi_url="/liver-disease-prediction/openapi.json",
    lifespan=lifespan
)

# CORS middleware for integration with HMS frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
app.include_router(liver_prediction_router.router, prefix="/liver-disease-prediction")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8091, log_level="info") 