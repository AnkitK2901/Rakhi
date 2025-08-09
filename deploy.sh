#!/bin/bash

# --- Configuration ---
GCE_USER="ankit_anjul"
GCE_HOST="34.93.194.88"   # Your server's domain or IP address
PROJECT_DIR="/var/www/rakhi"   # The new project folder on the server
SERVICE_NAME="nginx"
GIT_BRANCH="main"              # The git branch to deploy

# --- Script Starts Here ---

# Step 1: Push local changes to GitHub
echo "➡  Committing and pushing local changes to the '${GIT_BRANCH}' branch..."
git add .
# A more specific commit message for this project
git commit -m "Deploying Rakhi website updates: $(date)"
git push origin ${GIT_BRANCH} || { echo "❌ Git push failed! Aborting."; exit 1; }
echo "✅ Code pushed to GitHub successfully."
echo

# Step 2: Deploy changes on the GCE server
echo "🚀 Starting deployment to GCE server..."
ssh ${GCE_USER}@${GCE_HOST} "
    echo '➡  Navigating to project directory: ${PROJECT_DIR}'
    cd ${PROJECT_DIR} || { echo '❌ Directory not found on server!'; exit 1; }

    echo '🔄 Pulling latest changes from GitHub...'
    git pull origin ${GIT_BRANCH} || { echo '❌ Git pull failed on server!'; exit 1; }

    echo '♻  Reloading ${SERVICE_NAME} to apply changes without downtime...'
    sudo systemctl reload ${SERVICE_NAME}

    echo 'ℹ️  Checking status of ${SERVICE_NAME}:'
    sudo systemctl status ${SERVICE_NAME} --no-pager
"

echo
echo "✅ Deployment to s.clustercode.dev completed successfully."