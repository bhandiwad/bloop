# Bloop - Docker Deployment Guide

## Quick Start - Deploy on Public Server

### Prerequisites
- A Linux server with a public IP (Ubuntu, Debian, CentOS, etc.)
- Docker and Docker Compose installed
- Domain name (optional, but recommended)

---

## Step 1: Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

---

## Step 2: Clone Repository on Server

```bash
# Clone your repository
git clone https://github.com/bhandiwad/bloop.git
cd bloop
```

---

## Step 3: Configure Environment Variables

### Generate Secure Session Secret
```bash
# Generate a secure 64-character session secret
openssl rand -hex 32
```

### Create Production .env File
```bash
# Copy the example file
cp .env.example .env

# Edit the file with your values
nano .env
```

### Required Environment Variables (.env)
```env
# CRITICAL: Generate secure session secret
SESSION_SECRET=<paste_output_from_openssl_rand_command>

# Database (auto-configured by docker-compose, no changes needed)
DATABASE_URL=postgresql://bloop:bloop_dev_password@postgres:5432/bloop

# Redis (auto-configured by docker-compose, no changes needed)
REDIS_URL=redis://redis:6379

# OpenAI API Key (optional - for AI-generated fake answers)
AI_INTEGRATIONS_OPENAI_API_KEY=sk-your-api-key-here

# Server Configuration
NODE_ENV=production
PORT=5000
```

**🔒 SECURITY NOTES:**
- **NEVER** commit your `.env` file to git
- Use strong, randomly generated secrets
- In production, consider using Docker secrets or environment variable management tools

---

## Step 4: Update Production Passwords

For production, update the database password in `docker-compose.yml`:

```bash
nano docker-compose.yml
```

Change these lines (services.postgres.environment and services.app.environment):
```yaml
  postgres:
    environment:
      POSTGRES_PASSWORD: <STRONG_PASSWORD_HERE>
  
  app:
    environment:
      DATABASE_URL: postgresql://bloop:<STRONG_PASSWORD_HERE>@postgres:5432/bloop
```

---

## Step 5: Build and Start Services

```bash
# Build the application
docker-compose build

# Start all services (postgres, redis, app)
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f app
```

---

## Step 6: Configure Firewall

```bash
# Allow port 5000 (application port)
sudo ufw allow 5000/tcp

# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Step 7: Access Your Application

Your application is now running on:
```
http://YOUR_PUBLIC_IP:5000
```

---

## Optional: Setup Nginx Reverse Proxy with SSL

### Install Nginx & Certbot
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/bloop
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support for Socket.io
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Nginx Configuration
```bash
sudo ln -s /etc/nginx/sites-available/bloop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Get SSL Certificate (Let's Encrypt)
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Access with HTTPS
```
https://yourdomain.com
```

---

## Management Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Just the app
docker-compose logs -f app

# Just postgres
docker-compose logs -f postgres
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart just app
docker-compose restart app
```

### Stop Services
```bash
docker-compose down
```

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Database Backup
```bash
# Backup
docker exec bloop-postgres pg_dump -U bloop bloop > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
docker exec -i bloop-postgres psql -U bloop bloop < backup_file.sql
```

### View Database
```bash
# Connect to PostgreSQL
docker exec -it bloop-postgres psql -U bloop -d bloop
```

### View Redis
```bash
# Connect to Redis
docker exec -it bloop-redis redis-cli
```

---

## Monitoring & Troubleshooting

### Check Service Health
```bash
docker-compose ps
```

### Monitor Resource Usage
```bash
docker stats
```

### Check App Health
```bash
curl http://localhost:5000
```

### Common Issues

**Port already in use:**
```bash
# Find what's using port 5000
sudo lsof -i :5000

# Kill the process
sudo kill -9 <PID>
```

**Database connection failed:**
```bash
# Check if postgres is healthy
docker-compose ps postgres

# View postgres logs
docker-compose logs postgres
```

**App won't start - SESSION_SECRET error:**
- Make sure SESSION_SECRET is set in .env file
- Must be at least 32 characters
- Generate with: `openssl rand -hex 32`

---

## Production Checklist

- [ ] Generated secure SESSION_SECRET
- [ ] Updated database password in docker-compose.yml
- [ ] Created .env file with all required variables
- [ ] Configured firewall (ufw)
- [ ] Set up domain name (optional)
- [ ] Configured Nginx reverse proxy (optional)
- [ ] Enabled SSL with Let's Encrypt (optional)
- [ ] Set up automated backups
- [ ] Configured monitoring/alerting
- [ ] Tested application functionality
- [ ] Documented any custom configurations

---

## Support & Resources

- **Repository:** https://github.com/bhandiwad/bloop
- **Docker Docs:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **Nginx:** https://nginx.org/en/docs/
- **Let's Encrypt:** https://letsencrypt.org/

---

## Architecture

```
┌─────────────────────────────────────────┐
│           Public Internet               │
└────────────────┬────────────────────────┘
                 │
                 ▼
       ┌─────────────────┐
       │  Nginx (Port 80) │  (Optional)
       │  SSL/Reverse     │
       │  Proxy           │
       └────────┬─────────┘
                │
                ▼
       ┌─────────────────┐
       │  Bloop App       │
       │  (Port 5000)     │
       │  Node.js/Express │
       └────┬───────┬─────┘
            │       │
            │       │
    ┌───────▼──┐  ┌▼──────────┐
    │PostgreSQL│  │   Redis   │
    │(Port 5432)│  │(Port 6379)│
    └──────────┘  └───────────┘
```

All services run in isolated Docker containers connected via a private bridge network.
