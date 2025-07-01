#!/bin/bash
set -e  # Exit on error

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the SDK
echo "Building SDK..."
npm run build

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
  echo "Error: gcloud command not found. Please install Google Cloud SDK first."
  echo "Visit: https://cloud.google.com/sdk/docs/install"
  exit 1
fi

# Upload to GCP bucket
echo "Uploading to GCP bucket..."
gsutil cp ./dist/sdk.js gs://yvplatform-dev-public-files/sdk.js

echo "Verifying upload..."
gsutil ls -l gs://yvplatform-dev-public-files/sdk.js

echo "\nDeployment completed successfully!"
echo "SDK is available at: https://storage.googleapis.com/yvplatform-dev-public-files/sdk.js"
echo "And therefore at: https://api-dev.youversion.com/sdk.js"
