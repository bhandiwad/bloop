# 🎯 Bloop - Deploy to Public IP in 2 Minutes

## Step-by-Step Deployment

### On Your Server (with public IP):

```bash
# 1. Install Docker (if not already installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Clone your repository
git clone https://github.com/bhandiwad/bloop.git
cd bloop

# 4. Run the deployment script
./deploy.sh
```

### That's it! 🎉

Your app will be running at:
```
http://YOUR_PUBLIC_IP:5000
```

---

## What Gets Deployed?

The Docker Compose setup includes:

1. **Bloop App** (Port 5000)
   - Node.js/Express backend
   - React frontend
   - Socket.io for real-time gameplay

2. **PostgreSQL** (Internal)
   - Stores game decks and questions
   - Auto-seeded with content

3. **Redis** (Internal)
   - Manages active game rooms
   - Player sessions and state

---

## Essential Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop everything
docker-compose down

# Update app (pull latest code)
git pull
docker-compose down
docker-compose build
docker-compose up -d

# Check status
docker-compose ps

# Backup database
docker exec bloop-postgres pg_dump -U bloop bloop > backup.sql
```

---

## Security Checklist

Before going live, ensure:

- [ ] **SESSION_SECRET** is generated (deploy.sh does this automatically)
- [ ] **Firewall** is configured:
  ```bash
  sudo ufw allow 5000/tcp
  sudo ufw enable
  ```
- [ ] **Strong passwords** in docker-compose.yml (production)
- [ ] **Domain name** configured (optional)
- [ ] **SSL certificate** installed (recommended)

---

## Optional: Add SSL with Nginx

```bash
# Install Nginx
sudo apt install nginx certbot python3-certbot-nginx

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/bloop
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable and get SSL
sudo ln -s /etc/nginx/sites-available/bloop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d yourdomain.com
```

Now access via: `https://yourdomain.com`

---

## Environment Variables (.env)

The deploy script creates this automatically, but if you need to edit:

```bash
nano .env
```

Required variables:
```env
SESSION_SECRET=<generated_automatically>
DATABASE_URL=postgresql://bloop:bloop_dev_password@postgres:5432/bloop
REDIS_URL=redis://redis:6379
NODE_ENV=production
PORT=5000
```

Optional (for AI features):
```env
AI_INTEGRATIONS_OPENAI_API_KEY=sk-your-key-here
```

---

## Troubleshooting

### Port 5000 already in use?
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### Can't connect to database?
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Verify it's running
docker-compose ps
```

### App won't start?
```bash
# Check app logs
docker-compose logs app

# Verify SESSION_SECRET is set
grep SESSION_SECRET .env
```

### Need to reset everything?
```bash
docker-compose down -v  # WARNING: Deletes all data
docker-compose up -d
```

---

## Files Structure

```
bloop/
├── Dockerfile              # App container definition
├── docker-compose.yml      # Multi-container orchestration
├── deploy.sh              # Automated deployment script ⭐
├── DEPLOYMENT.md          # Detailed deployment guide
├── README.deployment.md   # Quick reference
├── QUICK_START.md        # This file
├── .env.example          # Environment template
└── .dockerignore         # Docker build optimization
```

---

## Next Steps

1. ✅ Deploy using `./deploy.sh`
2. ✅ Access at `http://YOUR_IP:5000`
3. 📱 Test the game with friends
4. 🔒 Add SSL certificate (optional but recommended)
5. 🎮 Customize game decks
6. 📊 Monitor with `docker-compose logs -f`

---

## Support & Documentation

- **Quick Guide:** README.deployment.md
- **Full Guide:** DEPLOYMENT.md
- **Repository:** https://github.com/bhandiwad/bloop

---

**Happy Gaming! 🎲**
