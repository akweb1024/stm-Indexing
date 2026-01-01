# 🚀 STM Indexing & Verification Platform

A comprehensive platform for managing scientific journal indexing, paper verification, reviewer recommendations, and analytics.

## 🌟 Features

- **WordPress Integration** - Automatic paper synchronization
- **Google Scholar Verification** - Automated indexing verification
- **Database Application Tracking** - Manage Scopus, PubMed, DOAJ applications
- **Reviewer Recommendation Engine** - AI-powered reviewer matching
- **Impact Factor Analytics** - Advanced citation metrics and trends
- **Email Notifications** - Automated reviewer invitations
- **Real-time Updates** - Socket.IO powered notifications
- **Admin Panel** - Comprehensive management interface
- **Audit Logging** - Complete action tracking
- **JWT Authentication** - Secure API access
- **RBAC Authorization** - Role-based permissions
- **Rate Limiting** - API protection

## 📋 Prerequisites

- Node.js 20.x or higher
- PostgreSQL 14+ (or SQLite for development)
- Redis (optional, for caching)
- npm or yarn

## 🚀 Quick Start

### Development

```bash
# Clone repository
git clone https://github.com/yourusername/stm-indexing-platform.git
cd stm-indexing-platform

# Install dependencies
npm install
cd backend && npm install && cd ..

# Set up environment
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Set up database
cd backend
npx prisma generate
npx prisma migrate dev
npm run seed

# Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - Firebase Emulator (optional)
npx firebase-tools emulators:start
```

Visit `http://localhost:5173` for the frontend and `http://localhost:5050` for the API.

### Production (Coolify)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/stm-indexing-platform.git
   git push -u origin main
   ```

2. **Deploy with Coolify**
   - Connect your GitHub repository in Coolify
   - Set environment variables (see `.env.example`)
   - Coolify will automatically detect the Dockerfile
   - Deploy!

3. **Required Environment Variables in Coolify**
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db
   JWT_SECRET=your-32-char-secret
   NODE_ENV=production
   PORT=5050
   FRONTEND_URL=https://yourdomain.com
   ```

## 📚 Documentation

- **[Features](docs/FEATURES.md)** - Complete feature list
- **[Deployment](docs/DEPLOYMENT.md)** - Deployment guide
- **[Security](docs/SECURITY_AND_FEATURES.md)** - Security documentation
- **[Launch Checklist](docs/LAUNCH_CHECKLIST.md)** - Pre-launch checklist
- **[Optimization](docs/OPTIMIZATION_SUMMARY.md)** - Code optimization details

## 🏗️ Architecture

```
stm-indexing-platform/
├── backend/                 # Express.js API
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   ├── prisma/             # Database schema & migrations
│   ├── schemas/            # Zod validation schemas
│   ├── services/           # Business logic
│   └── utils/              # Utilities
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── modules/            # Feature modules
│   ├── layout/             # Layout components
│   └── store/              # State management
├── docs/                   # Documentation
└── Dockerfile              # Production container
```

## 🔐 Security

- JWT authentication with 7-day expiration
- Role-based access control (RBAC)
- Rate limiting on all endpoints
- Input validation with Zod
- SQL injection protection (Prisma)
- XSS protection
- CORS configuration
- Security headers (Helmet.js)

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Journals
- `GET /api/journals` - List journals
- `GET /api/journals/:id` - Get journal details
- `GET /api/journals/:id/stats` - Get analytics
- `POST /api/journals/:id/sync` - Sync from WordPress

### Papers
- `GET /api/papers` - List papers
- `POST /api/papers/:id/verify` - Verify indexing
- `GET /api/papers/:id/recommend` - Get reviewer recommendations

### Admin
- `GET /api/admin/reviewers` - List reviewers
- `POST /api/admin/reviewers` - Create reviewer
- `GET /api/admin/database-configs` - List databases

See [API Documentation](docs/API.md) for complete endpoint list.

## 🛠️ Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Socket.IO
- JWT
- Winston (logging)
- Zod (validation)

### Frontend
- React 18
- TypeScript
- Vite
- Material-UI
- React Router v6
- Zustand (state)
- Socket.IO Client

## 📈 Performance

- Database connection pooling
- Query optimization
- Redis caching (optional)
- Compression enabled
- Rate limiting
- Pagination on all lists

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Google Scholar for indexing data
- Crossref for DOI resolution
- All contributors

## 📞 Support

For support, email support@yourdomain.com or open an issue on GitHub.

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

**Built with ❤️ for the scientific community**
