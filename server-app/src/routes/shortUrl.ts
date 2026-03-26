import express, { Router } from "express"
import { createUrl, deleteUrl, getAllUrl, getUrl } from "../controller/shortUrl.js";

const router: Router = express.Router();

router.post("/shortUrl", createUrl);
router.get("/shortUrl", getAllUrl);

router.post("/shortUrl:id", getUrl);
router.get("/shortUrl:id", deleteUrl);

export default router;