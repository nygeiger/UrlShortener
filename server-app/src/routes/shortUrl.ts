import express, { Router } from "express"
import { createUrl, deleteUrl, getUrl, getUserUrls, updateUrlClick } from "../controller/shortUrl.js";
import { createUrlLimiter, deleteUrlLimiter } from "../middleware/rateLimiter.js";

const router: Router = express.Router();

router.get("/userUrls", getUserUrls);
router.post("/shortUrl", createUrlLimiter, createUrl);

router.get("/shortUrl/:shortUrl", getUrl);
router.post("/shortUrl/:shortUrl", updateUrlClick);
router.delete("/shortUrl/:id", deleteUrlLimiter, deleteUrl);

export default router;