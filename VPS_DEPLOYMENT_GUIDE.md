# VPS Deployment Guide

This project deploys with GitHub Actions CD to a VPS via SSH.

## Architecture

- Frontend: Vite static build served by Nginx
- Backend: Node.js TypeScript app managed by PM2 on port `8080`
- Reverse proxy: Nginx routes `/api/*` to backend and all other paths to frontend SPA

## One-time Server Setup

Run these commands on the VPS:

```bash
sudo mkdir -p /var/www
sudo git clone https://github.com/Ayush-Anonymous/the-new.git /var/www/the-new
sudo chown -R $USER:$USER /var/www/the-new

cd /var/www/the-new
chmod +x scripts/deploy.sh

# Create backend env file
cat > backend/.env << 'EOF'
PORT=8080
NODE_ENV=production
JWT_SECRET=change-this-secret
DATABASE_URL=postgresql://user:password@host:5432/db_name?schema=public
EOF

# Install dependencies once (deploy script also handles this)
cd frontend && npm ci
cd ../backend && npm ci && npx prisma generate && npm run build

# PM2 startup and first launch
cd /var/www/the-new
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup

# Nginx site setup
sudo cp deploy/nginx/the-new.conf /etc/nginx/sites-available/the-new
sudo ln -sf /etc/nginx/sites-available/the-new /etc/nginx/sites-enabled/the-new
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## GitHub Repository Secrets

In GitHub: `Settings -> Secrets and variables -> Actions -> New repository secret`

- `DEPLOY_HOST`: your VPS public IP or domain
- `DEPLOY_USER`: SSH user (example: `root`)
- `DEPLOY_SSH_KEY`: private key content used to SSH into VPS
- `DEPLOY_PORT`: usually `22`

## Deploy Flow

1. Push to `main`
2. `.github/workflows/cd.yml` triggers
3. Workflow SSHes into VPS and runs `/var/www/the-new/scripts/deploy.sh`
4. Script pulls latest code, rebuilds frontend/backend, and reloads PM2

