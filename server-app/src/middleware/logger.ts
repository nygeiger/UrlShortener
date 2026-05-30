import type express from "express";

type LogLevel = "info" | "warn" | "error";

/**
 * Safe logger that prevents logging of sensitive information
 * - Development: Logs more details for debugging
 * - Production: Minimal logging to prevent information leakage
 */
export class SafeLogger {
    private isDev: boolean;

    constructor() {
        this.isDev = process.env.NODE_ENV !== "production";
    }

    /**
     * Generate or retrieve a unique error ID for reference
     */
    private generateErrorId(): string {
        return `ERR-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }

    /**
     * Log server-side only (never sent to client)
     */
    private logServerOnly(level: LogLevel, message: string, context?: any) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

        if (level === "error") {
            console.error(prefix, message, context || "");
        } else if (level === "warn") {
            console.warn(prefix, message, context || "");
        } else {
            console.log(prefix, message, context || "");
        }
    }

    /**
     * Log general info (safe for client if needed)
     */
    public logInfo(message: string, context?: Record<string, any>) {
        this.logServerOnly("info", message, context);
    }

    /**
     * Log warning without sensitive data
     */
    public logWarn(message: string, context?: Record<string, any>) {
        this.logServerOnly("warn", message, context);
    }

    /**
     * Log errors safely - returns error ID for client reference
     * NEVER logs sensitive data like fullUrl, ownerId, request bodies
     */
    public logError(
        message: string,
        error: any,
        context?: Record<string, any>
    ): string {
        const errorId = this.generateErrorId();

        if (this.isDev) {
            // Development: Log full details for debugging
            this.logServerOnly("error", `${message} [${errorId}]`, {
                error: error?.message || String(error),
                stack: error?.stack,
                context,
            });
        } else {
            // Production: Log minimal info only
            this.logServerOnly("error", `${message} [${errorId}]`, {
                errorType: error?.name || "Unknown",
                // Don't log stack traces or sensitive context in production
            });
        }

        return errorId;
    }

    /**
     * Extract safe context from request (no sensitive data)
     */
    public getSafeRequestContext(req: express.Request): Record<string, any> {
        return {
            method: req.method,
            path: req.path,
            ip: req.ip,
            userAgent: req.get("user-agent")?.substring(0, 50), // Truncate
            // Never include: body, query params with sensitive data, auth headers
        };
    }
}

export const logger = new SafeLogger();
