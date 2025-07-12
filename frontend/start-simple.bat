@echo off
echo ========================================
echo Hospital Management System - Frontend
echo Simple Vite Start (Alternative Method)
echo ========================================
echo.

echo This script starts Vite directly to avoid server issues
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

echo Node.js found! Version:
node --version

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
echo Starting Vite directly...
echo The application will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

cd client
npx vite --port 3000 --host

pause 