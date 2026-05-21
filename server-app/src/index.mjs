//*: File used in AWS lambda function instead of "server.ts"

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { configure as serverlessExpress } from "@codegenie/serverless-express";
import connectDb from "./config/dbConfig.mjs";
import shortURL from "./routes/shortUrl.mjs";
import { publicRedirect } from "./controller/shortUrl.mjs";

let serverlessExpressInstance;
let cachedDb = null;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", shortURL);
app.get("/:shortUrl", publicRedirect);

app.use((err, req, res, next) => {
    console.error("Global error handler caught:", err.stack); // Log the full stack trace
    if (!res.headersSent) { // Check if a response has already been sent
        res.status(500).json({ message: "Global Handler - Something broke! ERROR:", error: err.stack });
    }
});

async function handleDBConnection(context) {
    // Prevent the function from hanging while the DB connection is open
    context.callbackWaitsForEmptyEventLoop = false;

    if (!cachedDb) {
        console.log("DB connecting...")
        cachedDb = connectDb()
        console.log("connected to mongo DB")
    } else {
        console.log("Using cached DB connection");
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