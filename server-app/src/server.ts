import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/dbConfig.js"; // imported after compiling (check pnpm start)
import shortURL from "./routes/shortUrl.js";
import { publicRedirect } from "./controller/shortUrl.js";

dotenv.config();
await connectDb(); //TODO: Handle failed db connection
const serverPort = process.env.SERVER_PORT || 4001;
const clientPort = process.env.CLIENT_PORT || 3005;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: `http://localhost:${clientPort}` }));

app.use("/api", shortURL);
app.get("/:shortUrl", publicRedirect);

app.use((err: any, req: express.Request, res: any, next: any) => {
    console.error("Global error handler caught:", err.stack); // Log the full stack trace
    if (!res.headersSent) { // Check if a response has already been sent
        res.status(500).send('Global Handler - Something broke!');
    }
});

app.listen(serverPort, () => {
    console.log(`Sever listening on port: ${serverPort}`);
})