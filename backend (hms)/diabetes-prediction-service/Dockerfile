# Base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY ./app /app/app

# Copy the model files
COPY ./app/models/model.joblib /app/app/models/model.joblib
COPY ./app/models/scaler.joblib /app/app/models/scaler.joblib
COPY ./app/models/model_columns.joblib /app/app/models/model_columns.joblib


# Expose the service port
EXPOSE 8088

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8088"] 