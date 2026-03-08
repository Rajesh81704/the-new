# VPS Deployment & CI/CD Pipeline Guide

Follow this step-by-step guide to set up your VPS (Virtual Private Server) from scratch, configure PostgreSQL, and enable Auto-Deployment (CI/CD) via GitHub Actions for **ConnectPro**.

---

## Phase 1: VPS Initial Setup

Login to your VPS via SSH:
```bash
ssh root@YOUR_VPS_IP
```

### 1. Install Node.js, Git, and PM2
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install curl and git
sudo apt install curl git -y

# Install Node.js (LTS version)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager for keeping backend alive)
sudo npm install -g pm2
```

### 2. Install PostgreSQL Database
```bash
sudo apt install postgresql postgresql-contrib -y

# Start and enable PostgreSQL to start on boot
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Create Database and User (Table Creation)
Log into the Postgres console:
```bash
sudo -u postgres psql
```
Run these SQL commands to create the database and a dedicated user:
```sql
CREATE DATABASE connectpro;
CREATE USER connectprouser WITH PASSWORD 'your_secure_password';
ALTER ROLE connectprouser SET client_encoding TO 'utf8';
ALTER ROLE connectprouser SET default_transaction_isolation TO 'read committed';
ALTER ROLE connectprouser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE connectpro TO connectprouser;
\q
```
*Your Database URL will look like this:* 
`postgresql://connectprouser:your_secure_password@localhost:5432/connectpro?schema=public`

### 4. Clone the Repository on VPS
```bash
mkdir -p /var/www
cd /var/www

# Clone your private repo (you may need to set up SSH keys for GitHub or use a Personal Access Token)
git clone https://github.com/Ayush-Anonymous/the-new.git connectpro-ui
cd connectpro-ui
```

### 5. Configure Environment Variables
Inside the `backend` folder, create your `.env` file:
```bash
cd /var/www/connectpro-ui/backend
nano .env
```
Paste your production environment variables:
```env
PORT=8080
DATABASE_URL="postgresql://connectprouser:your_secure_password@localhost:5432/connectpro?schema=public"
JWT_SECRET="your_very_secure_jwt_secret"
JWT_SECRET_EXPIRES_IN="7d"
CORS_ORIGIN="http://YOUR_VPS_IP_OR_DOMAIN"
```

Inside the `frontend` folder, create the `.env` file:
```bash
cd /var/www/connectpro-ui/frontend
nano .env
```
Paste frontend vars:
```env
VITE_API_URL="http://YOUR_VPS_IP_OR_DOMAIN/api"
```

---

## Phase 2: Nginx Web Server Setup (To serve the app)

### 1. Install Nginx
```bash
sudo apt install nginx -y
```

### 2. Configure Nginx
Create a configuration file for your app:
```bash
sudo nano /etc/nginx/sites-available/connectpro
```
Add the following configuration:
```nginx
server {
    listen 80;
    server_name YOUR_VPS_IP_OR_DOMAIN;

    # Serve Frontend from dist folder
    location / {
        root /var/www/connectpro-ui/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Backend
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Enable Configuration
```bash
sudo ln -s /etc/nginx/sites-available/connectpro /etc/nginx/sites-enabled/
# Test Nginx
sudo nginx -t
# Restart Nginx
sudo systemctl restart nginx
```

---

## Phase 3: Setup GitHub Actions (Auto-Deployment CI/CD)

To allow GitHub Actions to automatically deploy code to your VPS whenever you push to `main`, we will use an SSH action (the `cd.yml` is already updated in your repo).

### 1. Generate SSH Keys for GitHub Actions
On your VPS, generate an SSH key specifically for GitHub Actions root login:
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions@connectpro"
# Save it to default path (e.g., ~/.ssh/id_rsa) with NO passphrase.
```

Next, add this newly generated public key to your `authorized_keys` so GitHub can login:
```bash
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

Now, view your **Private Key**:
```bash
cat ~/.ssh/id_rsa
```
*(Copy the ENTIRE output, including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)*

### 2. Add Secrets to GitHub
Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.

Add the following 3 secrets exactly with these names:
1. `VPS_HOST` : Your VPS public IP address (e.g., `192.168.1.10`)
2. `VPS_USERNAME` : `root` (or ubuntu/debian whatever user you use to SSH)
3. `VPS_SSH_KEY` : Paste the Private Key you copied in the previous step.

---

## Phase 4: Initial Manual Run

Before the pipeline takes over, do a manual initial run to ensure everything is fine:

```bash
cd /var/www/connectpro-ui/backend
npm install
npx prisma generate
npx prisma migrate dev --name init # This creates the tables!
npx prisma db push
npm run build
pm2 start dist/app.js --name connectpro-backend

cd ../frontend
npm install
npm run build
```

## You're Done! 🎉
Now, whenever you push any changes to the `main` branch on GitHub:
1. The GitHub Action goes to your VPS via SSH.
2. It pulls the latest code (`git pull`).
3. It installs dependencies, generates prisma, completely handles database migrations.
4. It rebuilds the backend and frontend.
5. It restarts the server with PM2!
