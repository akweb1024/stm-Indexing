# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

### ✅ Code Quality
- [x] Prisma schema regenerated
- [x] Environment validation implemented
- [x] Error handling centralized
- [x] Input validation with Zod
- [x] Logging with Winston
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Unit tests written and passing
- [ ] Security audit completed

### ✅ Security
- [x] JWT authentication implemented
- [x] RBAC authorization in place
- [x] Rate limiting configured
- [ ] Bcrypt password hashing (implement before production)
- [ ] HTTPS/TLS certificates obtained
- [ ] CORS properly configured
- [ ] Security headers added (Helmet)
- [ ] Input sanitization enabled

### ✅ Performance
- [x] Database connection pooling
- [ ] Redis caching configured
- [ ] Database indexes created
- [ ] Query optimization completed
- [ ] Pagination implemented
- [ ] Compression enabled

### ✅ Monitoring
- [x] Winston logging configured
- [ ] Error tracking (Sentry) set up
- [ ] Performance monitoring configured
- [ ] Uptime monitoring enabled
- [ ] Alerts configured

## Step-by-Step Deployment

### 1. Server Setup

#### Option A: VPS (DigitalOcean, Linode, AWS EC2)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis (optional)
sudo apt install redis-server -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 globally
sudo npm install -g pm2
```

#### Option B: Platform as a Service (Heroku, Railway, Render)

Follow platform-specific documentation for Node.js deployment.

### 2. Database Setup

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE stm_indexing;
CREATE USER stm_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE stm_indexing TO stm_user;
\q

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://stm_user:your-secure-password@localhost:5432/stm_indexing"
```

### 3. Application Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/stm-indexing.git
cd stm-indexing/backend

# Install dependencies
npm install --production

# Copy and configure environment
cp .env.example .env
nano .env  # Edit with production values

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run seed

# Build TypeScript
npm run build
```

### 4. Generate Strong JWT Secret

```bash
# Generate a secure JWT secret
openssl rand -base64 32

# Add to .env
JWT_SECRET="generated-secret-here"
```

### 5. Configure PM2

```bash
# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'stm-api',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5050
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    max_memory_restart: '1G',
    autorestart: true,
    watch: false
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 6. Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/stm-api

# Add configuration:
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Socket.IO support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/stm-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 7. SSL/TLS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal:
sudo certbot renew --dry-run
```

### 8. Frontend Deployment

```bash
cd ../  # Go to project root

# Build frontend
npm run build

# Deploy to static hosting (Vercel, Netlify, etc.)
# Or serve with Nginx:
sudo cp -r dist/* /var/www/html/

# Update Nginx for frontend
sudo nano /etc/nginx/sites-available/stm-frontend

# Add:
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Enable and restart
sudo ln -s /etc/nginx/sites-available/stm-frontend /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### 9. Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 10. Set Up Monitoring

#### Sentry (Error Tracking)

```bash
npm install @sentry/node

# Add to index.ts:
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

#### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

Configure to monitor:
- `https://api.yourdomain.com/health`
- Alert on downtime

### 11. Database Backups

```bash
# Create backup script
cat > /home/user/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/user/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U stm_user stm_indexing > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -type f -mtime +7 -delete
EOF

chmod +x /home/user/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/user/backup-db.sh
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Check API health
curl https://api.yourdomain.com/health

# Check PM2 status
pm2 status

# Check logs
pm2 logs stm-api --lines 100

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### 2. Performance Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test API performance
ab -n 1000 -c 10 https://api.yourdomain.com/api/journals
```

### 3. Security Scan

```bash
# Run npm audit
npm audit

# Fix vulnerabilities
npm audit fix

# Check SSL configuration
https://www.ssllabs.com/ssltest/
```

## Maintenance

### Daily
- Monitor error logs
- Check application uptime
- Review performance metrics

### Weekly
- Review security alerts
- Check disk space
- Analyze slow queries

### Monthly
- Update dependencies
- Review and rotate logs
- Test backup restoration
- Security audit

## Rollback Procedure

```bash
# If deployment fails, rollback:
pm2 stop stm-api
git checkout previous-stable-tag
npm install
npx prisma migrate deploy
npm run build
pm2 restart stm-api
```

## Scaling

### Horizontal Scaling

```bash
# Increase PM2 instances
pm2 scale stm-api +2

# Or set specific number
pm2 scale stm-api 4
```

### Database Scaling

- Enable connection pooling (PgBouncer)
- Set up read replicas
- Implement database sharding

### Load Balancing

Use Nginx or cloud load balancers to distribute traffic across multiple servers.

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs stm-api --err

# Check environment
pm2 env stm-api

# Restart
pm2 restart stm-api
```

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### High Memory Usage

```bash
# Monitor with PM2
pm2 monit

# Restart if needed
pm2 restart stm-api

# Adjust max memory in ecosystem.config.js
```

## Support

For issues:
1. Check logs: `pm2 logs stm-api`
2. Review documentation
3. Check GitHub issues
4. Contact support team

---

**Deployment Checklist**: Complete all items before going live!
