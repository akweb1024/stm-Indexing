#!/bin/bash

# STM Indexing Platform - GitHub Push Script
# This script helps you push your code to GitHub

echo "🚀 STM Indexing Platform - GitHub Push Helper"
echo "=============================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Git not initialized"
    echo "Run: git init"
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "Run: git add . && git commit -m 'your message'"
    exit 1
fi

# Get GitHub username and repository name
echo "📝 Please enter your GitHub details:"
echo ""
read -p "GitHub Username: " GITHUB_USER
read -p "Repository Name (default: stm-indexing-platform): " REPO_NAME
REPO_NAME=${REPO_NAME:-stm-indexing-platform}

echo ""
echo "📍 Repository will be: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
read -p "Is this correct? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "❌ Cancelled"
    exit 1
fi

# Check if remote already exists
if git remote | grep -q "^origin$"; then
    echo "⚠️  Remote 'origin' already exists"
    read -p "Remove and re-add? (y/n): " REMOVE
    if [ "$REMOVE" = "y" ]; then
        git remote remove origin
        echo "✅ Removed existing remote"
    else
        echo "❌ Cancelled"
        exit 1
    fi
fi

# Add remote
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"
git remote add origin $REPO_URL
echo "✅ Added remote: $REPO_URL"

# Set branch to main
git branch -M main
echo "✅ Set branch to main"

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
echo ""

if git push -u origin main; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "📍 Your repository: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Open Coolify dashboard"
    echo "2. Create new resource from GitHub"
    echo "3. Select your repository: $GITHUB_USER/$REPO_NAME"
    echo "4. Follow docs/COOLIFY_DEPLOYMENT.md"
    echo ""
    echo "📚 Documentation:"
    echo "- READY_TO_DEPLOY.md - Quick start guide"
    echo "- docs/COOLIFY_DEPLOYMENT.md - Coolify deployment"
    echo "- docs/LAUNCH_CHECKLIST.md - Pre-launch checklist"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "Common issues:"
    echo "1. Repository doesn't exist on GitHub"
    echo "   → Create it at: https://github.com/new"
    echo ""
    echo "2. Authentication failed"
    echo "   → Set up GitHub authentication:"
    echo "   → https://docs.github.com/en/authentication"
    echo ""
    echo "3. Permission denied"
    echo "   → Check repository permissions"
    echo ""
    exit 1
fi
