# ✅ Production Launch Checklist

## Pre-Launch Tasks

### 🔴 Critical (Must Complete)

- [ ] **Implement Bcrypt Password Hashing**
  - Install: `npm install bcrypt @types/bcrypt`
  - Update `backend/middleware/auth.ts`
  - Hash passwords on user creation
  - Compare hashed passwords on login

- [ ] **Generate Strong JWT Secret**
  - Run: `openssl rand -base64 32`
  - Add to `.env`: `JWT_SECRET="generated-value"`
  - Minimum 32 characters required

- [ ] **Apply Error Handler**
  - Import in `backend/index.ts`
  - Add before `server.listen()`:
    ```typescript
    app.use(notFoundHandler);
    app.use(errorHandler);
    ```

- [ ] **Add Security Headers (Helmet)**
  - Install: `npm install helmet`
  - Add to `backend/index.ts`: `app.use(helmet())`

- [ ] **Configure Production CORS**
  - Update CORS in `backend/index.ts`
  - Set `origin` to production domain
  - Enable `credentials: true`

- [ ] **Apply Input Validation**
  - Import schemas from `backend/schemas/validation.ts`
  - Wrap route handlers with `asyncHandler`
  - Parse request bodies with Zod schemas

- [ ] **Set Up PostgreSQL Database**
  - Create production database
  - Update `DATABASE_URL` in `.env`
  - Run migrations: `npx prisma migrate deploy`

- [ ] **Configure Environment Variables**
  - Copy `.env.example` to `.env`
  - Fill in all required values
  - Validate with: `npm run dev` (should start without errors)

### 🟡 High Priority (Recommended)

- [ ] **Add Database Indexes**
  - Add to `prisma/schema.prisma`:
    ```prisma
    @@index([tenantId])
    @@index([email])
    @@index([indexingStatus])
    ```
  - Run: `npx prisma migrate dev`

- [ ] **Implement Pagination**
  - Update `/api/journals` endpoint
  - Update `/api/papers` endpoint
  - Update `/api/admin/reviewers` endpoint

- [ ] **Set Up SSL/TLS**
  - Obtain SSL certificate (Let's Encrypt)
  - Configure Nginx with HTTPS
  - Force HTTPS redirect

- [ ] **Configure Nginx Reverse Proxy**
  - Set up Nginx configuration
  - Configure proxy headers
  - Enable gzip compression

- [ ] **Set Up PM2 Process Manager**
  - Create `ecosystem.config.js`
  - Configure cluster mode
  - Set up auto-restart

- [ ] **Enable Compression**
  - Install: `npm install compression`
  - Add to `backend/index.ts`: `app.use(compression())`

- [ ] **Set Up Monitoring**
  - Configure Sentry for error tracking
  - Set up uptime monitoring (UptimeRobot)
  - Configure log aggregation

- [ ] **Database Backups**
  - Create backup script
  - Schedule daily backups (cron)
  - Test backup restoration

### 🟢 Medium Priority (Nice to Have)

- [ ] **Redis Caching**
  - Install Redis
  - Configure connection
  - Implement caching for analytics

- [ ] **Request Sanitization**
  - Install: `npm install express-mongo-sanitize`
  - Add middleware

- [ ] **API Documentation**
  - Set up Swagger/OpenAPI
  - Document all endpoints
  - Add example requests/responses

- [ ] **Unit Tests**
  - Install Jest
  - Write tests for critical paths
  - Achieve >70% coverage

- [ ] **Integration Tests**
  - Test authentication flow
  - Test CRUD operations
  - Test real-time notifications

- [ ] **Performance Testing**
  - Run load tests with Apache Bench
  - Identify bottlenecks
  - Optimize slow queries

## Deployment Tasks

### Server Setup

- [ ] **Provision Server**
  - Choose hosting provider
  - Set up VPS or PaaS
  - Configure firewall

- [ ] **Install Dependencies**
  - Node.js 20.x
  - PostgreSQL
  - Redis (optional)
  - Nginx
  - PM2

- [ ] **Clone Repository**
  - Set up SSH keys
  - Clone from Git
  - Install npm packages

- [ ] **Configure Environment**
  - Create `.env` file
  - Set production values
  - Validate configuration

- [ ] **Database Migration**
  - Run Prisma migrations
  - Seed initial data
  - Verify data integrity

- [ ] **Build Application**
  - Run TypeScript build
  - Verify build output
  - Test built application

### Frontend Deployment

- [ ] **Build Frontend**
  - Run: `npm run build`
  - Verify build output
  - Test production build locally

- [ ] **Deploy Static Files**
  - Upload to hosting (Vercel/Netlify)
  - Or configure Nginx to serve
  - Set up CDN (optional)

- [ ] **Update API URLs**
  - Point to production API
  - Update Socket.IO URL
  - Test connectivity

## Post-Deployment

### Verification

- [ ] **Health Check**
  - Test: `curl https://api.yourdomain.com/health`
  - Should return `{ "status": "healthy" }`

- [ ] **API Endpoints**
  - Test login: `POST /api/auth/login`
  - Test journals: `GET /api/journals`
  - Test papers: `GET /api/papers`

- [ ] **Real-time Features**
  - Connect Socket.IO client
  - Verify notifications work
  - Test tenant rooms

- [ ] **Frontend**
  - Open in browser
  - Test login flow
  - Verify all pages load

- [ ] **SSL Certificate**
  - Check: https://www.ssllabs.com/ssltest/
  - Should get A or A+ rating

### Monitoring Setup

- [ ] **Error Tracking**
  - Verify Sentry integration
  - Test error reporting
  - Set up alert rules

- [ ] **Uptime Monitoring**
  - Add health check URL
  - Configure alerts
  - Test notifications

- [ ] **Performance Monitoring**
  - Set up APM tool
  - Configure dashboards
  - Set performance budgets

- [ ] **Log Aggregation**
  - Configure log shipping
  - Set up log retention
  - Create log alerts

### Security Audit

- [ ] **Run npm audit**
  - Execute: `npm audit`
  - Fix critical vulnerabilities
  - Update dependencies

- [ ] **Security Headers**
  - Check: https://securityheaders.com/
  - Should get A rating

- [ ] **OWASP Top 10**
  - Review checklist
  - Address vulnerabilities
  - Document mitigations

- [ ] **Penetration Testing**
  - Run automated scans
  - Manual security review
  - Fix identified issues

## Documentation

- [ ] **Update README**
  - Add production setup instructions
  - Document environment variables
  - Add troubleshooting guide

- [ ] **API Documentation**
  - Document all endpoints
  - Add authentication guide
  - Include example requests

- [ ] **Deployment Guide**
  - Step-by-step instructions
  - Rollback procedures
  - Troubleshooting tips

- [ ] **Runbook**
  - Common issues and fixes
  - Maintenance procedures
  - Emergency contacts

## Team Handoff

- [ ] **Knowledge Transfer**
  - Train team on deployment
  - Review architecture
  - Explain monitoring setup

- [ ] **Access Management**
  - Set up team accounts
  - Configure permissions
  - Document credentials (securely)

- [ ] **On-Call Setup**
  - Define on-call rotation
  - Set up alert routing
  - Create escalation policy

## Launch Day

- [ ] **Final Checks**
  - All tests passing
  - No critical errors in logs
  - Monitoring active

- [ ] **Backup Plan**
  - Rollback procedure ready
  - Previous version tagged
  - Database backup created

- [ ] **Communication**
  - Notify stakeholders
  - Prepare status page
  - Monitor social media

- [ ] **Go Live**
  - Switch DNS (if applicable)
  - Monitor closely for 1 hour
  - Address any issues immediately

## Post-Launch (First Week)

- [ ] **Monitor Metrics**
  - Error rates
  - Response times
  - User activity

- [ ] **Review Logs**
  - Check for errors
  - Identify patterns
  - Optimize as needed

- [ ] **Gather Feedback**
  - User feedback
  - Performance issues
  - Feature requests

- [ ] **Optimize**
  - Address bottlenecks
  - Tune database queries
  - Adjust caching

## Continuous Improvement

- [ ] **Weekly Reviews**
  - Review error logs
  - Check performance metrics
  - Update documentation

- [ ] **Monthly Maintenance**
  - Update dependencies
  - Review security alerts
  - Optimize database

- [ ] **Quarterly Audits**
  - Security audit
  - Performance review
  - Architecture assessment

---

## Quick Reference

### Critical Commands

```bash
# Start application
pm2 start ecosystem.config.js

# View logs
pm2 logs stm-api

# Restart application
pm2 restart stm-api

# Database backup
pg_dump -U stm_user stm_indexing > backup.sql

# Check health
curl https://api.yourdomain.com/health

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Emergency Contacts

- DevOps Lead: [contact]
- Database Admin: [contact]
- Security Team: [contact]
- On-Call: [rotation schedule]

---

**Last Updated**: 2026-01-01
**Status**: Ready for production deployment
