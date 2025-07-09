# Base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY ./app /app/app

# Copy the model
COPY ./app/models/model.joblib /app/app/models/model.joblib

# Expose the service port
EXPOSE 8090

# Environment variables for Eureka (can be overridden)
ENV EUREKA_SERVER="http://discovery-server-service:8761/eureka"
ENV SERVICE_PORT="8090"

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8090"] 