# 🚀 Quick Deployment Guide

Deploy Bloop on any server with a public IP in minutes!

## Prerequisites
- Linux server (Ubuntu/Debian/CentOS) with public IP
- Docker & Docker Compose installed

## One-Command Deployment

```bash
# Clone and deploy
git clone https://github.com/bhandiwad/bloop.git
cd bloop
./deploy.sh
```

The script will:
1. ✅ Check Docker installation
2. ✅ Create `.env` file with secure secrets
3. ✅ Build all services (App + PostgreSQL + Redis)
4. ✅ Start the application

## Access Your App

After deployment completes:
```
http://YOUR_PUBLIC_IP:5000
```

## Manual Deployment

If you prefer manual steps:

```bash
# 1. Create environment file
cp .env.example .env

# 2. Generate secure session secret
openssl rand -hex 32

# 3. Edit .env and paste the generated secret
nano .env

# 4. Build and start
docker-compose build
docker-compose up -d

# 5. Check logs
docker-compose logs -f
```

## Environment Variables

Required in `.env`:
- `SESSION_SECRET` - Secure random string (generate with `openssl rand -hex 32`)
- `DATABASE_URL` - Auto-configured by Docker Compose
- `REDIS_URL` - Auto-configured by Docker Compose

Optional:
- `AI_INTEGRATIONS_OPENAI_API_KEY` - For AI-generated fake answers

## Management Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Update application
git pull
docker-compose down && docker-compose build && docker-compose up -d

# Database backup
docker exec bloop-postgres pg_dump -U bloop bloop > backup.sql
```

## Production Recommendations

### 1. Setup Firewall
```bash
sudo ufw allow 5000/tcp
sudo ufw enable
```

### 2. Use Nginx Reverse Proxy (Optional)
```bash
# Install Nginx
sudo apt install nginx

# Configure reverse proxy (see DEPLOYMENT.md)
sudo nano /etc/nginx/sites-available/bloop

# Enable SSL with Let's Encrypt
sudo certbot --nginx -d yourdomain.com
```

### 3. Change Default Passwords
Edit `docker-compose.yml` and update:
- PostgreSQL password
- Redis password (if adding authentication)

### 4. Enable Auto-Restart
Services are configured with `restart: unless-stopped`

## Architecture

```
Internet → [Port 5000] → Bloop App (Node.js)
                           ├─→ PostgreSQL (Database)
                           └─→ Redis (Game State)
```

## Troubleshooting

**Port already in use:**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

**Services not starting:**
```bash
docker-compose ps
docker-compose logs
```

**Database connection failed:**
```bash
docker-compose logs postgres
```

## Full Documentation

For detailed deployment instructions including:
- SSL/HTTPS setup
- Domain configuration
- Monitoring setup
- Security hardening
- Database backups

See **[DEPLOYMENT.md](DEPLOYMENT.md)**

## Support

- Repository: https://github.com/bhandiwad/bloop
- Issues: https://github.com/bhandiwad/bloop/issues

---

**Ready to deploy?** Run `./deploy.sh` and you're live in 2 minutes! 🎉
