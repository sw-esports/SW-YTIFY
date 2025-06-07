@echo off
REM Build script for production deployment

REM Set environment variables
set NODE_ENV=production

REM Install dependencies
echo Installing dependencies...
call npm ci

REM Build frontend
echo Building frontend...
cd frontend
call npm ci
call npm run build
cd ..

REM Prepare backend
echo Preparing backend...
cd backend
call npm ci
cd ..

echo Build completed successfully!
