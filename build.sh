#!/bin/bash
# Build script for production deployment

# Set environment variables
export NODE_ENV=production

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build frontend
echo "Building frontend..."
cd frontend && npm ci && npm run build && cd ..

# Prepare backend
echo "Preparing backend..."
cd backend && npm ci && cd ..

echo "Build completed successfully!"
