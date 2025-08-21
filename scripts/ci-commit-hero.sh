#!/usr/bin/env bash
set -e
# Commit hero PNG and push using GITHUB_TOKEN for authentication
if [ -f ./apps/web/public/assets/hero-4k.png ]; then
  git config user.name "github-actions[bot]"
  git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
  git add ./apps/web/public/assets/hero-4k.png
  if git diff --cached --quiet; then
    echo "No changes to commit"
    exit 0
  fi
  git commit -m "chore(hero): add generated hero-4k.png [skip ci]"
  # Use token auth for pushing
  remote_url=$(git remote get-url origin)
  # Convert remote to https if needed
  if [[ "$remote_url" == git@github.com:* ]]; then
    repo_path=${remote_url#git@github.com:}
    repo_path=${repo_path%.git}
    remote_url="https://x-access-token:${GITHUB_TOKEN}@github.com/${repo_path}.git"
  else
    # assume https remote; inject token
    remote_url=$(echo "$remote_url" | sed -E "s#https://([^@]+@)?#https://x-access-token:${GITHUB_TOKEN}@#")
  fi
  git push "$remote_url" HEAD:main
else
  echo "hero PNG not found, exiting"
fi
