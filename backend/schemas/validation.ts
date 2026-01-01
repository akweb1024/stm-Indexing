import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

// Journal schemas
export const createJournalSchema = z.object({
    name: z.string().min(1, 'Journal name is required'),
    code: z.string().min(1, 'Journal code is required'),
    issn: z.string().regex(/^\d{4}-\d{3}[\dX]$/, 'Invalid ISSN format'),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
    wordpressUrl: z.string().url('Invalid WordPress URL'),
    tenantId: z.string().min(1, 'Tenant ID is required'),
    userId: z.string().optional()
});

// Paper schemas
export const createPaperSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    doi: z.string().min(1, 'DOI is required'),
    authors: z.string().min(1, 'Authors are required'),
    pubDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    journalId: z.string().min(1, 'Journal ID is required'),
    tenantId: z.string().min(1, 'Tenant ID is required')
});

// Reviewer schemas
export const createReviewerSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    institution: z.string().optional(),
    expertise: z.string().min(1, 'Expertise is required'),
    tenantId: z.string().min(1, 'Tenant ID is required')
});

export const updateReviewerSchema = createReviewerSchema.partial();

// Database application schemas
export const createDatabaseApplicationSchema = z.object({
    journalId: z.string().min(1, 'Journal ID is required'),
    databaseConfigId: z.string().min(1, 'Database config ID is required'),
    status: z.enum(['PENDING', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED']).default('PENDING'),
    submittedAt: z.string().datetime().optional(),
    notes: z.string().optional()
});

// Email invitation schema
export const sendInvitationSchema = z.object({
    reviewerEmail: z.string().email('Invalid email address'),
    reviewerName: z.string().min(1, 'Reviewer name is required'),
    paperTitle: z.string().min(1, 'Paper title is required'),
    paperDoi: z.string().min(1, 'Paper DOI is required'),
    journalName: z.string().min(1, 'Journal name is required'),
    invitationLink: z.string().url('Invalid invitation link'),
    tenantId: z.string().min(1, 'Tenant ID is required')
});

// Pagination schema
export const paginationSchema = z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
});

// Query filters
export const paperFiltersSchema = z.object({
    journalId: z.string().optional(),
    indexingStatus: z.enum(['INDEXED', 'NOT_INDEXED', 'NOT_FOUND', 'PENDING']).optional(),
    search: z.string().optional()
});

export const journalFiltersSchema = z.object({
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    search: z.string().optional()
});
