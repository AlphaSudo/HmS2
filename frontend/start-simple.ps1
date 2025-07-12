Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Hospital Management System - Frontend" -ForegroundColor Cyan
Write-Host "Simple Vite Start (Alternative Method)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script starts Vite directly to avoid server issues" -ForegroundColor Yellow
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js found! Version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Make sure to install version 18.x or higher" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
    Write-Host "Try running: npm install --force" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Start Vite directly
Write-Host ""
Write-Host "Starting Vite directly..." -ForegroundColor Yellow
Write-Host "The application will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    Set-Location client
    npx vite --port 3000 --host
} catch {
    Write-Host "Server stopped." -ForegroundColor Yellow
}

Read-Host "Press Enter to exit" 