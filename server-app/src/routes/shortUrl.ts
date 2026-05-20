import express, { Router } from "express"
import { createUrl, deleteUrl, getUrl, getUserUrls } from "../controller/shortUrl.js";

const router: Router = express.Router();

router.get("/userUrls", getUserUrls);
router.post("/shortUrl", createUrl);

router.get("/shortUrl/:shortUrl", getUrl);
router.delete("/shortUrl/:id", deleteUrl);

export default router;