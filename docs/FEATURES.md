# STM Indexing & Verification Platform - Feature Summary

## Overview
A comprehensive platform for managing scientific journal indexing, paper verification, reviewer recommendations, and analytics.

## Implemented Features

### 1. Email Notification System ✅
**Location**: `backend/services/emailService.ts`

**Features**:
- Nodemailer-based email service
- Reviewer invitation emails with rich HTML templates
- Development mode (logs emails instead of sending)
- Production-ready SMTP configuration
- Bulk invitation support

**Configuration** (`.env`):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@stm-indexing.com
```

**API Endpoint**:
- `POST /api/admin/send-invitation` - Send reviewer invitation

### 2. Automated Scheduling System ✅
**Location**: `backend/services/scheduler.ts`

**Features**:
- Node-cron based task scheduler
- Daily Google Scholar verification (2 AM)
- Weekly analytics generation (Monday 3 AM)
- Automatic re-verification of unindexed papers
- Rate limiting to avoid API blocks

**Schedules**:
- **Daily**: Verify papers not checked in 7 days
- **Weekly**: Generate analytics reports for all journals

**Status**: Auto-starts when backend server launches

### 3. Admin Panel ✅
**Location**: `src/modules/admin/AdminPanelPage.tsx`

**Features**:
#### Reviewer Management
- View all reviewers in a table
- Add new reviewers with expertise tags
- Edit existing reviewer details
- Delete reviewers
- Search and filter capabilities

#### Database Configuration
- View all indexing databases (Scopus, PubMed, DOAJ, etc.)
- Enable/disable databases
- Configure check frequencies
- Manage application statuses

**API Endpoints**:
- `GET /api/admin/reviewers` - List all reviewers
- `POST /api/admin/reviewers` - Create reviewer
- `PUT /api/admin/reviewers/:id` - Update reviewer
- `DELETE /api/admin/reviewers/:id` - Delete reviewer
- `GET /api/admin/database-configs` - List databases
- `POST /api/admin/database-configs` - Create database config
- `PUT /api/admin/database-configs/:id` - Update database config

**Navigation**: Accessible via sidebar "Admin" menu item

## Previously Implemented Features

### 4. WordPress Paper Sync
- Automatic synchronization from WordPress journals
- Upsert logic to prevent duplicates
- Metadata extraction (title, DOI, authors, pub date)

### 5. Google Scholar Verification
- Manual and automated verification
- Status tracking (INDEXED, NOT_INDEXED, NOT_FOUND)
- Scholar URL capture
- Rate-limited to avoid blocking

### 6. Database Application Tracking
- Track journal applications to Scopus, PubMed, DOAJ
- Status management (PENDING, SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED)
- Application history and notes

### 7. Reviewer Recommendation Engine
- Keyword-based matching algorithm
- Match score calculation
- Expertise highlighting
- Top 5 recommendations per paper

### 8. Impact Factor & Analytics
- Journal-level metrics
- Indexing rate calculation
- Simulated impact factor
- Database coverage dashboard
- Publication type breakdown

### 9. Audit Logging
- System-level action tracking
- User action history
- Support for null userId (system actions)
- Searchable audit trail

## Technology Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: SQLite (Prisma ORM)
- **Scheduling**: node-cron
- **Email**: nodemailer
- **Scraping**: axios + cheerio

### Frontend
- **Framework**: React + TypeScript
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **State**: Zustand
- **Build**: Vite

### Database Schema
- User
- Journal
- Paper
- DatabaseConfig
- DatabaseApplication
- Reviewer
- AuditLog

## Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=5050
NODE_ENV=development

# Email (Optional - for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@stm-indexing.com
```

## Running the Application

### Backend
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
npm run seed
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

### Firebase Emulator (for Firestore compatibility)
```bash
npx firebase-tools emulators:start
```

## Key Routes

### Frontend
- `/` - Dashboard
- `/journals` - Journals list
- `/journals/:id` - Journal details
- `/journals/:id/analytics` - Analytics dashboard
- `/papers` - Papers list
- `/databases` - Database overview
- `/databases/:id` - Journal database dashboard
- `/admin` - Admin panel
- `/audit-logs` - Audit trail

### Backend API
- `/api/journals` - Journal CRUD
- `/api/papers` - Paper CRUD
- `/api/papers/:id/verify` - Trigger verification
- `/api/papers/:id/recommend` - Get reviewer recommendations
- `/api/journals/:id/stats` - Get analytics
- `/api/journals/:id/sync` - Sync from WordPress
- `/api/admin/reviewers` - Reviewer management
- `/api/admin/database-configs` - Database management
- `/api/admin/send-invitation` - Send email invitation
- `/api/audit_logs` - Audit logs

## Security Considerations

1. **Authentication**: Currently using mock auth - implement proper JWT/OAuth for production
2. **Authorization**: Add role-based access control (RBAC)
3. **Rate Limiting**: Implement API rate limiting
4. **Input Validation**: Add Zod/Joi validation for all inputs
5. **CORS**: Configure proper CORS policies
6. **Environment Variables**: Never commit `.env` files

## Future Enhancements

1. **Real-time Notifications**: WebSocket support for live updates
2. **Advanced Analytics**: Citation tracking, h-index calculation
3. **AI-Powered Matching**: Use embeddings for reviewer recommendations
4. **Multi-tenant Support**: Full tenant isolation
5. **Export Features**: PDF reports, CSV exports
6. **Dashboard Widgets**: Customizable dashboard
7. **Mobile App**: React Native companion app

## Deployment Checklist

- [ ] Set up production database (PostgreSQL recommended)
- [ ] Configure SMTP credentials
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring (PM2, New Relic)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Enable error tracking (Sentry)
- [ ] Configure CDN for static assets
- [ ] Set up logging aggregation

## Support

For issues or questions, refer to:
- Backend logs: `backend/logs/`
- Frontend console: Browser DevTools
- Database: `backend/dev.db` (SQLite browser)

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-01  
**Status**: Production Ready (with security hardening needed)
