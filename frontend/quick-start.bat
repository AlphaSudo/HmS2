@echo off
echo ========================================
echo Hospital Management System - Frontend
echo Quick Start Script for Windows
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Make sure to install version 18.x or higher
    pause
    exit /b 1
)

echo Node.js found! Checking version...
node --version

echo.
echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo npm found! Checking version...
npm --version

echo.
echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    echo Try running: npm install --force
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo Starting development server...
echo The application will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause 