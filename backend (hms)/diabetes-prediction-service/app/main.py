from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import threading
from contextlib import asynccontextmanager
import uvicorn

from app.api.v1.endpoints import prediction as diabetes_prediction_router
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
    title=config.PROJECT_NAME,
    description=config.DESCRIPTION,
    version=config.VERSION,
    docs_url=f"{config.API_PREFIX}{config.DOCS_URL}",
    redoc_url=f"{config.API_PREFIX}{config.REDOC_URL}",
    openapi_url=f"{config.API_PREFIX}{config.OPENAPI_URL}",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
app.include_router(diabetes_prediction_router.router, prefix=config.API_PREFIX)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=config.SERVICE_PORT, log_level="info") 