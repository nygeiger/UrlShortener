import rateLimit from "express-rate-limit";

// *: Technically AWS apigateway rate-limits innately

// General rate limiter for public redirect endpoint (IP-based)
export const publicRedirectLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes per IP
    message: "Too many redirect requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for health checks if needed
        return false;
    }
});

// Rate limiter for API endpoints (IP-based, more lenient)
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes per IP
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limiter for URL creation (prevents spam creation)
export const createUrlLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 URL creations per hour per IP
    message: "Too many URLs created, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limiter for deletions (prevents data destruction attacks)
export const deleteUrlLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 deletions per hour per IP
    message: "Too many deletion requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});
