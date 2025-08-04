
# --- Configuration ---
# Make sure to replace the GCE_HOST with the correct IP for your new server.

GCE_USER="ankit_anjul"                                 # Your username on the GCE server
GCE_HOST="34.93.194.88"                          # <-- IMPORTANT: Put the static IP of your new server here
PROJECT_DIR="/var/www/Birthday"               # The project folder on the server
SERVICE_NAME="nginx"                                   # The web server service
GIT_BRANCH="main"                                      # The git branch to deploy

# --- Script Starts Here ---

# Step 1: Push local changes to GitHub
echo "➡  Committing and pushing local changes to the '${GIT_BRANCH}' branch..."
git add .
git commit -m "Deploying updates: $(date)"
git push origin ${GIT_BRANCH} || { echo "❌ Git push failed! Aborting."; exit 1; }
echo "✅ Code pushed to GitHub successfully."
echo

# Step 2: Deploy changes on the GCE server
echo "🚀 Starting deployment to GCE server..."
ssh ${GCE_USER}@${GCE_HOST} "
    echo '➡  Navigating to project directory: ${PROJECT_DIR}'
    cd ${PROJECT_DIR} || { echo '❌ Directory not found on server!'; exit 1; }

    echo '🔄 Pulling latest changes from GitHub...'
    sudo git pull origin ${GIT_BRANCH} || { echo '❌ Git pull failed on server!'; exit 1; }

    echo '♻  Restarting ${SERVICE_NAME} to apply changes...'
    sudo systemctl restart ${SERVICE_NAME}
    
    echo 'ℹ️  Checking status of ${SERVICE_NAME}:'
    sudo systemctl status ${SERVICE_NAME} --no-pager
"

echo
echo "✅ Deployment to k.clustercode.dev completed successfully."