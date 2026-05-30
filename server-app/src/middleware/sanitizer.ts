import type express from "express";

/**
 * Sanitizes objects to prevent NoSQL injection and prototype pollution attacks
 * - Removes keys containing dangerous patterns (__proto__, constructor, $ operators)
 * - Recursively sanitizes nested objects
 * - Ensures type safety
 */
const sanitizeInput = (obj: any): any => {
    // Handle primitives
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj !== "object") {
        return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map((item) => sanitizeInput(item));
    }

    // Handle objects
    const sanitized: any = {};

    for (const key in obj) {
        // Skip inherited properties
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            continue;
        }

        // Block dangerous keys that could lead to prototype pollution or operator injection
        if (
            key === "__proto__" ||
            key === "constructor" ||
            key === "prototype" ||
            key.startsWith("$") // MongoDB operators
        ) {
            console.warn(`[SECURITY] Blocked dangerous key in input: ${key}`);
            continue;
        }

        // Recursively sanitize the value
        sanitized[key] = sanitizeInput(obj[key]);
    }

    return sanitized;
};

/**
 * Express middleware that sanitizes request body
 * Note: req.query and req.params are read-only in Express and are already
 * validated by Zod schemas in controllers before DB operations
 */
export const sanitizerMiddleware = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        // Sanitize request body (main injection vector)
        if (req.body && typeof req.body === "object") {
            req.body = sanitizeInput(req.body);
        }

        next();
    } catch (error) {
        console.error("[SECURITY] Error in sanitizer middleware:", error);
        res.status(400).send({ message: "Invalid request format" });
    }
};
