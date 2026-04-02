#!/usr/bin/env bash
# Render Build Script
# This script is used as the "Build Command" on Render

set -o errexit  # exit on error

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

echo "==> Installing Node dependencies and building React frontend..."
cd frontend
npm install
npm run build
cd ..

echo "==> Build complete!"
