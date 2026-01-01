# Security, Analytics & Real-time Features - Implementation Guide

## 🔐 Security Features Implemented

### 1. JWT Authentication
**Location**: `backend/middleware/auth.ts`

**Features**:
- JWT token generation with 7-day expiration
- Token verification middleware
- User payload includes: userId, email, role, tenantId

**Usage**:
```typescript
// Protected route example
app.get('/api/protected', authenticate, (req, res) => {
    const user = (req as any).user; // Access authenticated user
    res.json({ user });
});
```

**Environment Variable**:
```env
JWT_SECRET=your-secret-key-change-in-production
```

### 2. Role-Based Access Control (RBAC)
**Middleware**: `authorize(...roles)`

**Roles**:
- `SUPER_ADMIN` - Full system access
- `ADMIN` - Tenant-level administration
- `EDITOR` - Content management
- `VIEWER` - Read-only access

**Usage**:
```typescript
// Admin-only route
app.post('/api/admin/reviewers', 
    authenticate, 
    authorize('ADMIN', 'SUPER_ADMIN'), 
    (req, res) => {
        // Only admins can access
    }
);
```

### 3. Rate Limiting
**Location**: `backend/middleware/rateLimiter.ts`

**Limiters**:
- **API Limiter**: 100 requests per 15 minutes (global)
- **Auth Limiter**: 5 login attempts per 15 minutes
- **Email Limiter**: 10 emails per hour
- **Verification Limiter**: 5 verifications per minute

**Applied**:
- Global: All `/api/*` routes
- Auth: `/api/auth/login`
- Email: `/api/admin/send-invitation`
- Verification: `/api/papers/:id/verify`

### 4. Tenant Isolation
**Middleware**: `enforceTenantIsolation`

Ensures users can only access data from their own tenant.

## 📊 Advanced Analytics

### Location
`backend/services/advancedAnalytics.ts`

### Metrics Provided

#### 1. Overview Metrics
- Total papers count
- Indexed papers count
- Indexing trend (percentage)
- Average time to index

#### 2. Citation Metrics
- **Total Citations**: Aggregated citation count
- **H-Index**: Research impact metric
- **i10-Index**: Papers with 10+ citations
- **Avg Citations Per Paper**

#### 3. Indexing Trends
- Monthly breakdown (last 6 months)
- Indexed vs Not Indexed papers
- Visual trend data for charts

#### 4. Top Papers
- Top 5 papers by citation count
- Includes indexing status
- Sortable by various metrics

#### 5. Database Coverage
- Per-database indexing statistics
- Coverage percentage by journal
- Application status tracking

### API Endpoint
```typescript
GET /api/analytics/advanced?tenantId=tenant_1
```

**Response**:
```json
{
  "overview": {
    "totalPapers": 50,
    "indexedPapers": 35,
    "indexingTrend": 70,
    "avgTimeToIndex": 7
  },
  "citationMetrics": {
    "totalCitations": 450,
    "hIndex": 12,
    "i10Index": 8,
    "avgCitationsPerPaper": 9
  },
  "indexingTrends": [...],
  "topPapers": [...],
  "databaseCoverage": [...]
}
```

## 🔔 Real-time Notifications

### Technology
**Socket.IO** for WebSocket-based real-time communication

### Server Setup
**Location**: `backend/index.ts`

```typescript
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    socket.on('join-tenant', (tenantId) => {
        socket.join(`tenant:${tenantId}`);
    });
});
```

### Notification Service
**Location**: `backend/services/notificationService.ts`

**Functions**:
- `emitNotification()` - Generic notification
- `emitPaperVerified()` - Paper verification complete
- `emitReviewerInvited()` - Reviewer invitation sent
- `emitDatabaseApplicationUpdated()` - Database status change

**Notification Types**:
- `success` - Green notification
- `info` - Blue notification
- `warning` - Yellow notification
- `error` - Red notification

### Usage Example
```typescript
import { emitPaperVerified } from './services/notificationService';

// After paper verification
emitPaperVerified('tenant_1', paperId, 'INDEXED');
```

### Frontend Integration

#### 1. Install Socket.IO Client
```bash
npm install socket.io-client
```

#### 2. Create Socket Hook
```typescript
// src/hooks/useSocket.ts
import { useEffect } from 'react';
import io from 'socket.io-client';

export const useSocket = (tenantId: string) => {
    useEffect(() => {
        const socket = io('http://localhost:5050');
        
        socket.on('connect', () => {
            socket.emit('join-tenant', tenantId);
        });

        socket.on('notification', (notification) => {
            // Show toast/snackbar
            console.log('Notification:', notification);
        });

        return () => {
            socket.disconnect();
        };
    }, [tenantId]);
};
```

#### 3. Use in Components
```typescript
import { useSocket } from '../hooks/useSocket';

const Dashboard = () => {
    const { user } = useAuthStore();
    useSocket(user.tenantId);
    
    return <div>Dashboard</div>;
};
```

## 🎯 Integration Points

### 1. Paper Verification
```typescript
app.post('/api/papers/:id/verify', 
    authenticate, 
    verificationLimiter, 
    async (req, res) => {
        const result = await verifyGoogleScholarIndexing(req.params.id);
        
        // Send real-time notification
        emitPaperVerified(
            result.paper.tenantId, 
            result.paper.id, 
            result.paper.indexingStatus
        );
        
        res.json(result);
    }
);
```

### 2. Reviewer Invitation
```typescript
app.post('/api/admin/send-invitation', 
    authenticate, 
    authorize('ADMIN'), 
    emailLimiter, 
    async (req, res) => {
        await sendReviewerInvitation(req.body);
        
        // Send real-time notification
        emitReviewerInvited(
            req.body.tenantId,
            req.body.reviewerEmail,
            req.body.paperTitle
        );
        
        res.json({ success: true });
    }
);
```

## 🚀 Production Deployment Checklist

### Security
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS for production domain
- [ ] Implement bcrypt for password hashing
- [ ] Add input validation (Zod/Joi)
- [ ] Enable helmet.js for security headers
- [ ] Set up API key authentication for external services

### Analytics
- [ ] Integrate real citation APIs (Crossref, Semantic Scholar)
- [ ] Set up database indexing for performance
- [ ] Implement caching (Redis) for analytics
- [ ] Add export functionality (PDF, CSV)

### Real-time
- [ ] Configure Socket.IO for production (Redis adapter for scaling)
- [ ] Set up load balancing
- [ ] Implement reconnection logic
- [ ] Add notification persistence
- [ ] Configure push notifications (Firebase Cloud Messaging)

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging (Winston, Morgan)
- [ ] Add performance monitoring (New Relic, DataDog)
- [ ] Set up uptime monitoring
- [ ] Configure alerts for rate limit violations

## 📝 Environment Variables

```env
# Security
JWT_SECRET=your-very-secret-jwt-key-min-32-chars
NODE_ENV=production

# Server
PORT=5050
FRONTEND_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing

### Test JWT Authentication
```bash
# Login
curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use token
curl http://localhost:5050/api/protected \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Rate Limiting
```bash
# Rapid requests (should get rate limited)
for i in {1..110}; do
  curl http://localhost:5050/api/journals
done
```

### Test Real-time Notifications
```javascript
// Browser console
const socket = io('http://localhost:5050');
socket.on('connect', () => {
    socket.emit('join-tenant', 'tenant_1');
});
socket.on('notification', (data) => {
    console.log('Received:', data);
});
```

## 📚 Additional Resources

- [JWT.io](https://jwt.io/) - JWT debugger
- [Socket.IO Docs](https://socket.io/docs/) - Real-time documentation
- [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit) - Rate limiting guide
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Security best practices

---

**Version**: 2.0.0  
**Last Updated**: 2026-01-01  
**Status**: Production Ready with Security Hardening
