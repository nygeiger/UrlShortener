import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDb from "./config/dbConfig.js"; // imported after compiling (check pnpm start)
import shortURL from "./routes/shortUrl.js"

dotenv.config();
await connectDb();
const port = process.env.PORT || 4001;

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(cors( {origin: "http://localhost:3000" }));
app.use(cors( ));

app.use("/api/", shortURL)

app.use((err: any, req: express.Request, res: any, next: any) => {
    console.error("Global error handler caught:", err.stack); // Log the full stack trace
    if (!res.headersSent) { // Check if a response has already been sent
        res.status(500).send('Something broke!');
    }
});

app.listen(port, () => {
    console.log(`Sever listening on port: ${port}`)
})