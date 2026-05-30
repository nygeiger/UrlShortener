import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/dbConfig.js"; // imported after compiling (check pnpm start)
import shortURL from "./routes/shortUrl.js";
import { publicRedirect } from "./controller/shortUrl.js";
import { publicRedirectLimiter, apiLimiter } from "./middleware/rateLimiter.js";
import { sanitizerMiddleware } from "./middleware/sanitizer.js";
import { logger } from "./middleware/logger.js";

dotenv.config();
await connectDb(); //TODO: Handle failed db connection
const serverPort = process.env.SERVER_PORT || 4001;
const clientPort = process.env.CLIENT_PORT || 3005;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: `http://localhost:${clientPort}` }));

// Apply input sanitization middleware to all routes (prevents injection attacks)
app.use(sanitizerMiddleware);

// Apply general API rate limiter to all /api routes
app.use("/api", apiLimiter);
app.use("/api", shortURL);

// Apply rate limiter to public redirect endpoint
app.get("/:shortUrl", publicRedirectLimiter, publicRedirect);

app.use((err: any, req: express.Request, res: any, next: any) => {
    const safeContext = logger.getSafeRequestContext(req);
    const errorId = logger.logError("Unhandled error", err, safeContext);

    if (!res.headersSent) { // Check if a response has already been sent
        res.status(500).send({ message: "Something went wrong. Please try again later.", errorId });
    }
});

app.listen(serverPort, () => {
    logger.logInfo(`Server listening on port: ${serverPort}`);
})