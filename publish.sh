#!/bin/bash
echo "=== AIEH 2026 Git Commit Helper ==="
git add .
git commit -m "feat: AIEH 2026 interactive agenda with chronological panel ordering"
git branch -M main
echo "========================="
echo "Files committed successfully!"
echo "Now run the following commands to link and push to your GitHub:"
echo "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "  git push -u origin main"
