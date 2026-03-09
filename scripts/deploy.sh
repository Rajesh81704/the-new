#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/the-new}"
BRANCH="${BRANCH:-main}"

if [[ ! -f "$APP_DIR/backend/.env" ]]; then
  echo "[deploy] $APP_DIR/backend/.env not found. Create it before deploying."
  exit 1
fi

# Ensure Prisma commands use the VPS runtime DB URL from backend/.env.
set -a
source "$APP_DIR/backend/.env"
set +a

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "[deploy] DATABASE_URL is missing in backend/.env"
  exit 1
fi

if [[ "$DATABASE_URL" == *"@host:"* || "$DATABASE_URL" == *"/db_name"* || "$DATABASE_URL" == *"user:password"* ]]; then
  echo "[deploy] DATABASE_URL in backend/.env still contains placeholder values (host/db_name/user:password)."
  echo "[deploy] Update backend/.env on VPS with real PostgreSQL connection details and rerun deploy."
  exit 1
fi

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

echo "[deploy] building frontend"
cd "$APP_DIR/frontend"
npm ci --include=dev
npm run build

echo "[deploy] building backend"
cd "$APP_DIR/backend"
npm ci --include=dev
npx prisma generate

echo "[deploy] preparing companies.companyCode for existing rows"
PSQL_DATABASE_URL="$(printf '%s' "$DATABASE_URL" | sed -E 's/([?&])schema=[^&]*(&?)/\1\2/g; s/\?&/\?/g; s/&&/&/g; s/[?&]$//')"
psql "$PSQL_DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
ALTER TABLE "companies"
ADD COLUMN IF NOT EXISTS "companyCode" TEXT;

UPDATE "companies"
SET "companyCode" = CONCAT('CO', UPPER(SUBSTRING(MD5("id") FOR 8)))
WHERE "companyCode" IS NULL;

ALTER TABLE "companies"
ALTER COLUMN "companyCode" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "companies_companyCode_key"
ON "companies"("companyCode");

CREATE TEMP TABLE _user_dupes AS
WITH ranked AS (
  SELECT
    "id",
    "companyId",
    "email",
    FIRST_VALUE("id") OVER (
      PARTITION BY "email", "companyId"
      ORDER BY "createdAt" ASC, "id" ASC
    ) AS keep_id,
    ROW_NUMBER() OVER (
      PARTITION BY "email", "companyId"
      ORDER BY "createdAt" ASC, "id" ASC
    ) AS rn
  FROM "users"
  WHERE "companyId" IS NOT NULL
)
SELECT "id", keep_id
FROM ranked
WHERE rn > 1;

UPDATE "posts" p
SET "authorId" = d.keep_id
FROM _user_dupes d
WHERE p."authorId" = d."id";

DO $$
BEGIN
  IF to_regclass('public.friendships') IS NOT NULL THEN
    DELETE FROM "friendships"
    WHERE "requesterId" IN (SELECT "id" FROM _user_dupes)
       OR "receiverId" IN (SELECT "id" FROM _user_dupes);
  END IF;
END $$;

DELETE FROM "users" u
USING _user_dupes d
WHERE u."id" = d."id";

DROP TABLE _user_dupes;
SQL

npx prisma db push --accept-data-loss
node prisma/seed.js
npm run build

echo "[deploy] reloading backend process"
cd "$APP_DIR"
pm2 startOrReload ecosystem.config.cjs --env production
pm2 save

echo "[deploy] complete"
