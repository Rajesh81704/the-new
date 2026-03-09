#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/the-new}"
BRANCH="${BRANCH:-main}"

echo "[deploy] app dir: $APP_DIR"

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "[deploy] Missing git repository at $APP_DIR"
  exit 1
fi

cd "$APP_DIR"

echo "[deploy] syncing repository"
git fetch --all --prune
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

if [[ ! -f backend/.env ]]; then
  echo "[deploy] backend/.env not found. Create it before deploying."
  exit 1
fi

echo "[deploy] building frontend"
cd "$APP_DIR/frontend"
npm ci
npm run build

echo "[deploy] building backend"
cd "$APP_DIR/backend"
npm ci
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run build

echo "[deploy] reloading backend process"
cd "$APP_DIR"
pm2 startOrReload ecosystem.config.cjs --env production
pm2 save

echo "[deploy] complete"
