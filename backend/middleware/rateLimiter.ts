import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for authentication endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true,
});

// Limiter for email sending
export const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit to 10 emails per hour
    message: 'Email rate limit exceeded, please try again later.',
});

// Limiter for Google Scholar verification
export const verificationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit to 5 verifications per minute
    message: 'Verification rate limit exceeded, please slow down.',
});
