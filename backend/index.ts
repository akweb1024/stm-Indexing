import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { generateToken } from './middleware/auth';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import { getJournalStats } from './services/analyticsService';
import { recommendReviewers } from './services/reviewerRecommender';
import { startScheduledTasks } from './services/scheduler';
import { verifyGoogleScholarIndexing } from './services/scholarVerifier';
import { syncJournalPapers } from './services/wpSync';


dotenv.config();
const rawUrl = process.env.DATABASE_URL || '';
const dbUrl = rawUrl.startsWith('postgres://') ? rawUrl.replace('postgres://', 'postgresql://') : rawUrl;

const app = express();
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: dbUrl
        }
    }
} as any);
const port = process.env.PORT || 5050;

// Create HTTP server for Socket.IO
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

// Apply global rate limiting
app.use('/api/', apiLimiter);

// Socket.IO connection handling
io.on('connection', (socket: any) => {
    console.log('Client connected:', socket.id);

    socket.on('join-tenant', (tenantId: string) => {
        socket.join(`tenant:${tenantId}`);
        console.log(`Socket ${socket.id} joined tenant ${tenantId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io available globally for notifications
(global as any).io = io;

// Helper to log actions
const logAction = async (action: string, userId: string, tenantId: string, details?: string) => {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                userId: (userId === 'system' ? undefined : userId) as any,
                tenantId,
                details
            }
        });
    } catch (error) {
        console.error('Audit Log failed:', error);
    }
};

app.get('/health', async (req, res) => {
    try {
        // Check database connection
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: (error as Error).message
        });
    }
});

app.get('/api', (req, res) => {
    res.json({ message: 'STM Journal Indexing API running' });
});

// Serve static frontend files
const frontendPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendPath));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// --- Journals Routes ---

app.get('/api/journals', async (req, res) => {
    try {
        const journals = await prisma.journal.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        res.json(journals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch journals' });
    }
});

app.get('/api/journals/:id', async (req, res) => {
    try {
        const journal = await prisma.journal.findUnique({
            where: { id: req.params.id },
            include: { papers: true }
        });
        if (!journal) return res.status(404).json({ error: 'Journal not found' });
        res.json(journal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch journal' });
    }
});

app.post('/api/journals', async (req, res) => {
    try {
        const journal = await prisma.journal.create({ data: req.body });
        await logAction('CREATE_JOURNAL', req.body.userId || 'system', journal.tenantId, `Created journal: ${journal.name}`);
        res.status(201).json(journal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create journal' });
    }
});


app.get('/api/journals/:id/stats', async (req, res) => {
    try {
        const stats = await getJournalStats(req.params.id);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

app.post('/api/journals/:id/sync', async (req, res) => {
    try {
        const result = await syncJournalPapers(req.params.id);
        await logAction('WP_SYNC', 'system', 'tenant_1', result.message);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// --- Papers Routes ---

app.get('/api/papers', async (req, res) => {
    try {
        const papers = await prisma.paper.findMany({
            include: { journal: true },
            orderBy: { createdAt: 'desc' }
        });
        const formattedPapers = papers.map(p => ({
            ...p,
            authors: p.authors.split(','),
            indexing: {
                scholar: { status: p.indexingStatus, url: p.scholarUrl }
            }
        }));
        res.json(formattedPapers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch papers' });
    }
});

app.get('/api/papers/:id', async (req, res) => {
    try {
        const paper = await prisma.paper.findUnique({
            where: { id: req.params.id },
            include: { journal: true }
        });
        if (!paper) return res.status(404).json({ error: 'Paper not found' });
        res.json({
            ...paper,
            authors: paper.authors.split(','),
            indexing: {
                scholar: { status: paper.indexingStatus, url: paper.scholarUrl }
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch paper' });
    }
});

app.get('/api/papers/:id/recommend', async (req, res) => {
    try {
        const recommendations = await recommendReviewers(req.params.id);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

app.post('/api/papers/:id/verify', async (req, res) => {
    try {
        const result = await verifyGoogleScholarIndexing(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


// --- Indexing Database Routes ---

app.get('/api/databases', async (req, res) => {
    try {
        const configs = await prisma.databaseConfig.findMany({
            where: { enabled: true },
            orderBy: { name: 'asc' }
        });
        res.json(configs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch database configs' });
    }
});

app.get('/api/journals/:id/applications', async (req, res) => {
    try {
        const applications = await prisma.databaseApplication.findMany({
            where: { journalId: req.params.id },
            include: { databaseConfig: true }
        });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

app.post('/api/journals/:id/apply', async (req, res) => {
    try {
        const { databaseConfigId, status, notes } = req.body;
        const application = await prisma.databaseApplication.upsert({
            where: {
                journalId_databaseConfigId: {
                    journalId: req.params.id,
                    databaseConfigId
                }
            },
            update: { status, notes, updatedAt: new Date() },
            create: {
                journalId: req.params.id,
                databaseConfigId,
                status,
                notes,
                tenantId: 'tenant_1' // Mock tenant
            }
        });
        await logAction('DB_APPLY', req.body.userId || 'system', 'tenant_1', `Applied for ${databaseConfigId} for journal ${req.params.id}`);
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update application' });
    }
});


// --- Admin Routes ---

// Reviewers Management
app.get('/api/admin/reviewers', async (req, res) => {
    try {
        const reviewers = await prisma.reviewer.findMany({
            orderBy: { lastName: 'asc' }
        });
        res.json(reviewers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviewers' });
    }
});

app.post('/api/admin/reviewers', async (req, res) => {
    try {
        const reviewer = await prisma.reviewer.create({
            data: req.body
        });
        await logAction('CREATE_REVIEWER', req.body.userId || 'system', req.body.tenantId, `Created reviewer: ${reviewer.email}`);
        res.status(201).json(reviewer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create reviewer' });
    }
});

app.put('/api/admin/reviewers/:id', async (req, res) => {
    try {
        const reviewer = await prisma.reviewer.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(reviewer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update reviewer' });
    }
});

app.delete('/api/admin/reviewers/:id', async (req, res) => {
    try {
        await prisma.reviewer.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete reviewer' });
    }
});

// Database Configs Management
app.get('/api/admin/database-configs', async (req, res) => {
    try {
        const configs = await prisma.databaseConfig.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(configs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch database configs' });
    }
});

app.post('/api/admin/database-configs', async (req, res) => {
    try {
        const config = await prisma.databaseConfig.create({
            data: req.body
        });
        res.status(201).json(config);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create database config' });
    }
});

app.put('/api/admin/database-configs/:id', async (req, res) => {
    try {
        const config = await prisma.databaseConfig.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update database config' });
    }
});

// Send reviewer invitation
app.post('/api/admin/send-invitation', async (req, res) => {
    try {
        const { sendReviewerInvitation } = await import('./services/emailService');
        const result = await sendReviewerInvitation(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// --- Audit Logs Route ---

app.get('/api/audit_logs', async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({
            include: { user: true },
            orderBy: { timestamp: 'desc' }
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});


// --- Auth Route ---

app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // For now, simple password check (in production, use bcrypt.compare)
        // const isValid = await bcrypt.compare(password, user.password);
        const isValid = user.password === password;

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId
        });

        res.json({
            user: {
                uid: user.id,
                email: user.email,
                displayName: user.displayName,
                role: user.role,
                tenantId: user.tenantId
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
});


server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Socket.IO enabled for real-time notifications`);
    startScheduledTasks();
});
