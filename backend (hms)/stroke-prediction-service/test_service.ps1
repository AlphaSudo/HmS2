# Test Stroke Prediction Service Endpoints
Write-Host "Testing HMS Stroke Prediction Service..." -ForegroundColor Cyan
Write-Host "=" * 50

# Test Health Endpoint
Write-Host "`n1. Testing Health Endpoint:" -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8090/stroke-prediction/health" -Method GET
    Write-Host "✅ Health Check Success!" -ForegroundColor Green
    $healthResponse | ConvertTo-Json
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Info Endpoint  
Write-Host "`n2. Testing Info Endpoint:" -ForegroundColor Yellow
try {
    $infoResponse = Invoke-RestMethod -Uri "http://localhost:8090/stroke-prediction/info" -Method GET
    Write-Host "✅ Info Endpoint Success!" -ForegroundColor Green
    $infoResponse | ConvertTo-Json
} catch {
    Write-Host "❌ Info Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Prediction Endpoint
Write-Host "`n3. Testing Prediction Endpoint:" -ForegroundColor Yellow
$predictionData = @{
    gender = "Male"
    age = 67.0
    hypertension = 0
    heart_disease = 1
    ever_married = "Yes"
    work_type = "Private"
    Residence_type = "Urban"
    avg_glucose_level = 228.69
    bmi = 36.6
    smoking_status = "formerly smoked"
}

try {
    $predictionResponse = Invoke-RestMethod -Uri "http://localhost:8090/stroke-prediction/predict" -Method POST -Body ($predictionData | ConvertTo-Json) -ContentType "application/json"
    Write-Host "✅ Prediction Success!" -ForegroundColor Green
    $predictionResponse | ConvertTo-Json
} catch {
    Write-Host "❌ Prediction Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🌐 API Documentation: http://localhost:8090/stroke-prediction/docs" -ForegroundColor Cyan
Write-Host "📊 Alternative Docs: http://localhost:8090/stroke-prediction/redoc" -ForegroundColor Cyan 