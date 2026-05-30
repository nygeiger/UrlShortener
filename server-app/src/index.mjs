//*: File used in AWS lambda function instead of "server.ts"

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { configure as serverlessExpress } from "@codegenie/serverless-express";
import connectDb from "./config/dbConfig.mjs";
import shortURL from "./routes/shortUrl.mjs";
import { publicRedirect } from "./controller/shortUrl.mjs";
import { publicRedirectLimiter, apiLimiter } from "./middleware/rateLimiter.mjs";
import { sanitizerMiddleware } from "./middleware/sanitizer.mjs";
import { logger } from "./middleware/logger.mjs";

let serverlessExpressInstance;
let cachedDb = null;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// Apply input sanitization middleware to all routes (prevents injection attacks)
app.use(sanitizerMiddleware);

// Apply general API rate limiter to all /api routes
app.use("/api", apiLimiter);
app.use("/api", shortURL);

// Apply rate limiter to public redirect endpoint
app.get("/:shortUrl", publicRedirectLimiter, publicRedirect);

app.use((err, req, res, next) => {
    const safeContext = logger.getSafeRequestContext(req);
    const errorId = logger.logError("Unhandled error", err, safeContext);

    if (!res.headersSent) { // Check if a response has already been sent
        res.status(500).json({ message: "Something went wrong. Please try again later.", errorId });
    }
});

async function handleDBConnection(context) {
    // Prevent the function from hanging while the DB connection is open
    context.callbackWaitsForEmptyEventLoop = false;

    if (!cachedDb) {
        logger.logInfo("DB connecting...");
        cachedDb = connectDb()
        logger.logInfo("Connected to MongoDB");
    } else {
        logger.logInfo("Using cached DB connection");
    }
    return cachedDb;
}

function setup(event, context) {
    dotenv.config()
    handleDBConnection(context)
    serverlessExpressInstance = serverlessExpress({ app })
    return serverlessExpressInstance(event, context)
}


export function handler(event, context) {
    if (serverlessExpressInstance) return serverlessExpressInstance(event, context)
    return setup(event, context)
}