# 🚀 Coolify Deployment Guide

## Prerequisites

- Coolify instance running on your VPS
- GitHub account
- Domain name (optional but recommended)

## Step 1: Prepare Repository

Your repository is now ready with:
- ✅ Dockerfile for containerization
- ✅ docker-compose.yml for local testing
- ✅ .gitignore for security
- ✅ .env.example for configuration
- ✅ Health check endpoint

## Step 2: Push to GitHub

```bash
cd "/home/itb-09/Desktop/architecture/stm indexing firebase studio"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Production-ready STM Indexing Platform"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/stm-indexing-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Configure Coolify

### 3.1 Create New Project

1. Log into your Coolify dashboard
2. Click **"New Resource"**
3. Select **"Public Repository"**
4. Enter your GitHub repository URL
5. Select **"main"** branch

### 3.2 Configure Build Settings

Coolify will auto-detect the Dockerfile. Verify:

- **Build Pack**: Dockerfile
- **Dockerfile Location**: `/Dockerfile`
- **Port**: 5050
- **Health Check Path**: `/health`

### 3.3 Set Environment Variables

In Coolify, add these environment variables:

#### Required Variables

```bash
# Database (Coolify can provision PostgreSQL for you)
DATABASE_URL=postgresql://username:password@postgres:5432/stm_indexing

# Security (CRITICAL - Generate new secret!)
JWT_SECRET=your-super-secret-32-character-minimum-key

# Server
NODE_ENV=production
PORT=5050
FRONTEND_URL=https://yourdomain.com

# Logging
LOG_LEVEL=info
```

#### Optional Variables (Email)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

#### Optional Variables (Advanced)

```bash
# Redis (if you add Redis service)
REDIS_URL=redis://redis:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# External APIs
CROSSREF_API_KEY=your-key
SEMANTIC_SCHOLAR_API_KEY=your-key
```

### 3.4 Add PostgreSQL Database

1. In Coolify, go to your project
2. Click **"Add Service"**
3. Select **"PostgreSQL"**
4. Note the connection details
5. Update `DATABASE_URL` environment variable

### 3.5 Add Redis (Optional)

1. Click **"Add Service"**
2. Select **"Redis"**
3. Note the connection URL
4. Add `REDIS_URL` environment variable

## Step 4: Generate JWT Secret

**IMPORTANT**: Never use the example secret in production!

```bash
# On your local machine or VPS
openssl rand -base64 32

# Copy the output and set as JWT_SECRET in Coolify
```

## Step 5: Deploy

1. Click **"Deploy"** in Coolify
2. Monitor the build logs
3. Wait for deployment to complete (5-10 minutes)

### Build Process

Coolify will:
1. Clone your repository
2. Build Docker image
3. Run Prisma migrations
4. Start the application
5. Run health checks

## Step 6: Configure Domain (Optional)

### 6.1 Add Domain in Coolify

1. Go to your application settings
2. Click **"Domains"**
3. Add your domain: `api.yourdomain.com`
4. Coolify will automatically provision SSL certificate

### 6.2 Update DNS

Add an A record pointing to your VPS IP:

```
Type: A
Name: api
Value: YOUR_VPS_IP
TTL: 3600
```

### 6.3 Update Environment

Update `FRONTEND_URL` to your actual domain:

```bash
FRONTEND_URL=https://yourdomain.com
```

## Step 7: Verify Deployment

### 7.1 Check Health

```bash
curl https://api.yourdomain.com/health

# Expected response:
# {"status":"healthy","timestamp":"...","uptime":123}
```

### 7.2 Test API

```bash
# Test login
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test journals
curl https://api.yourdomain.com/api/journals
```

### 7.3 Check Logs

In Coolify:
1. Go to your application
2. Click **"Logs"**
3. Verify no errors

## Step 8: Deploy Frontend

### Option A: Deploy to Vercel/Netlify

```bash
# Build frontend
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=dist
```

### Option B: Serve with Coolify

1. Create new application in Coolify
2. Use same repository
3. Set build command: `npm run build`
4. Set start command: `npx serve -s dist -l 3000`
5. Add domain: `yourdomain.com`

## Step 9: Post-Deployment

### 9.1 Run Database Migrations

Migrations run automatically on deployment, but to run manually:

```bash
# In Coolify console
cd backend
npx prisma migrate deploy
```

### 9.2 Seed Database (Optional)

```bash
# In Coolify console
cd backend
npm run seed
```

### 9.3 Set Up Monitoring

1. Configure uptime monitoring (UptimeRobot, Pingdom)
2. Monitor: `https://api.yourdomain.com/health`
3. Set up alerts for downtime

## Troubleshooting

### Build Fails

**Check Coolify logs for errors:**

```bash
# Common issues:
# 1. Missing environment variables
# 2. Database connection failed
# 3. Prisma migration errors
```

**Solutions:**
- Verify all required env vars are set
- Check DATABASE_URL is correct
- Ensure PostgreSQL service is running

### Application Won't Start

**Check application logs in Coolify**

Common issues:
1. Port already in use
2. Database connection failed
3. Missing JWT_SECRET

### Database Connection Issues

```bash
# Verify DATABASE_URL format:
postgresql://username:password@host:port/database

# Test connection in Coolify console:
psql $DATABASE_URL -c "SELECT 1"
```

### Health Check Fails

```bash
# Check if app is listening on correct port
curl http://localhost:5050/health

# Verify PORT environment variable
echo $PORT
```

## Scaling

### Horizontal Scaling

In Coolify:
1. Go to application settings
2. Increase **"Replicas"** count
3. Coolify will load balance automatically

### Database Scaling

1. Upgrade PostgreSQL instance
2. Enable connection pooling
3. Add read replicas (advanced)

## Backup Strategy

### Database Backups

Coolify automatically backs up PostgreSQL. To configure:

1. Go to PostgreSQL service
2. Click **"Backups"**
3. Set schedule (daily recommended)
4. Set retention period

### Manual Backup

```bash
# In Coolify console
pg_dump $DATABASE_URL > backup.sql
```

## Monitoring

### Application Metrics

Monitor in Coolify dashboard:
- CPU usage
- Memory usage
- Request count
- Error rate

### Set Up Alerts

1. Configure webhook in Coolify
2. Integrate with Slack/Discord
3. Set alert thresholds

## Updates & Maintenance

### Deploy New Version

```bash
# On local machine
git add .
git commit -m "Update: description"
git push origin main

# Coolify auto-deploys on push (if configured)
# Or manually trigger deploy in Coolify UI
```

### Rollback

In Coolify:
1. Go to **"Deployments"**
2. Find previous successful deployment
3. Click **"Redeploy"**

## Security Checklist

- [x] JWT_SECRET is strong and unique
- [x] DATABASE_URL contains strong password
- [x] HTTPS enabled via Coolify
- [ ] Firewall configured on VPS
- [ ] Regular security updates
- [ ] Backup strategy in place

## Cost Optimization

- Use Coolify's built-in PostgreSQL (free)
- Enable Redis only if needed
- Monitor resource usage
- Scale down during low traffic

## Support

- **Coolify Docs**: https://coolify.io/docs
- **GitHub Issues**: Your repository issues
- **Community**: Coolify Discord

---

## Quick Reference

### Essential Commands

```bash
# View logs
# (Use Coolify UI)

# Restart application
# (Use Coolify UI - Click "Restart")

# Run migrations
# (Automatic on deploy)

# Access database
# (Use Coolify console)
```

### Environment Variables Checklist

- [x] DATABASE_URL
- [x] JWT_SECRET (32+ characters)
- [x] NODE_ENV=production
- [x] PORT=5050
- [x] FRONTEND_URL
- [ ] SMTP_* (if using email)
- [ ] REDIS_URL (if using Redis)

---

**Deployment Status**: Ready for Coolify! 🚀
