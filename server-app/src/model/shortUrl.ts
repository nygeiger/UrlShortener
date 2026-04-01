import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { SHORT_URLS } from "../util.js";

const shortUrlSchema = new mongoose.Schema({
    fullUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        default: () => `${SHORT_URLS.subdomain}.${nanoid().substring(0, 10)}.${SHORT_URLS.tld}`
    },
    clicks: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    });

export const urlModel = mongoose.model("ShortUrl", shortUrlSchema);