import type express from "express"
import z, { ZodError } from "zod"
import { urlModel } from "../model/shortUrl.js"
import { notFound, SHORT_URLS } from "../util.js"
import { logger } from "../middleware/logger.js"

const createUrlSchema = z.object({ fullUrl: z.url(), ownerId: z.uuid() })
const getUrlSchema = z.object({ shortUrl: z.string().refine((val) => val.length == 19 && val.startsWith(`${SHORT_URLS.subdomain}.`) && val.endsWith(`.${SHORT_URLS.tld}`)) })
const updateUrlClickSchema = z.object({ shortUrl: z.string().refine((val) => val.length == 19 && val.startsWith(`${SHORT_URLS.subdomain}.`) && val.endsWith(`.${SHORT_URLS.tld}`)) })
const delUrlSchema = z.object({ id: z.string(), ownerId: z.uuid() })
const getUserUrlsSchema = z.object({ ownerId: z.string().uuid() })

// * * route: "/"

export const publicRedirect = async (req: express.Request, res: express.Response) => {
    try {
        const validParams = getUrlSchema.parse(req.params)
        const shortUrl = await urlModel.findOne({ shortUrl: validParams.shortUrl })

        if (!shortUrl) {
            res.status(404).send({ message: "Link not found or has expired" })
        } else {
            shortUrl.clicks++;
            shortUrl.save();
            res.redirect(`${shortUrl.fullUrl}`)
        }
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(404).send(notFound(process.env.FRONT_END_URL as string));
        } else {
            const errorId = logger.logError("Error on publicRedirect", error);
            res.status(500).send({ message: "Something went wrong. Please try again later.", errorId });
        }
    }
}

// * * route: "/api"

export const getUserUrls = async (req: express.Request, res: express.Response) => {
    try {
        const validQuery = getUserUrlsSchema.parse(req.query)
        const userUrls = await urlModel.find({ ownerId: validQuery.ownerId }).sort({ createdAt: -1 });

        res.status(200).send(userUrls);
    } catch (error) {
        const errorId = logger.logError("Error on getUserUrls", error);
        res.status(500).send({ message: "Something went wrong. Please try again later.", errorId });
    }
}

export const createUrl = async (req: express.Request, res: express.Response) => {
    try {
        const validReq = createUrlSchema.parse(req.body)
        const urlFound = await urlModel.find({ fullUrl: validReq.fullUrl, ownerId: validReq.ownerId });

        if (urlFound.length > 0) {
            res.status(409).send(urlFound);
        } else {
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            const shortUrl = await urlModel.create({
                fullUrl: validReq.fullUrl,
                ownerId: validReq.ownerId,
                expiresAt: expiresAt
            })
            res.status(201).send(shortUrl);
        }
    } catch (error) {
        const errorId = logger.logError("Error on createUrl", error);
        res.status(500).send({ message: "Something went wrong. Please try again later.", errorId });
    }
}

export const getUrl = async (req: express.Request, res: express.Response) => {
    try {
        const validParams = getUrlSchema.parse(req.params)
        const shortUrl = await urlModel.findOne({ shortUrl: validParams.shortUrl })

        if (!shortUrl) {
            res.status(404).send({ message: "Link not found or has expired" })
        } else {
            shortUrl.clicks++;
            shortUrl.save();
            res.redirect(`${shortUrl.fullUrl}`)
        }
    } catch (error) {
        const errorId = logger.logError("Error on getUrl", error);
        res.status(500).send({ message: "Something went wrong. Please try again later.", errorId });
    }
}

export const updateUrlClick = async (req: express.Request, res: express.Response) => {
    try {
        const validParams = updateUrlClickSchema.parse(req.params)
        const shortUrl = await urlModel.findOne({ shortUrl: validParams.shortUrl })

        if (!shortUrl) {
            res.status(404).send({ message: "Link not found or has expired" })
        } else {
            shortUrl.clicks++;
            shortUrl.save();
            res.status(200).send()
        }
    } catch (error) {
        const errorId = logger.logError("Error on updateUrlClick", error);
        res.status(500).send({ message: "Something went wrong. Please try again later.", errorId });
    }
}

export const deleteUrl = async (req: express.Request, res: express.Response) => {
    try {
        const reqParams = delUrlSchema.parse({ id: req.params.id, ownerId: req.body.ownerId })

        // Fetch the URL first to verify ownership
        const shortUrl = await urlModel.findById(reqParams.id)

        if (!shortUrl) {
            res.status(404).send({ message: "Requested URL not found - Nothing Deleted" })
        } else if (shortUrl.ownerId !== reqParams.ownerId) {
            // Verify the user owns this URL
            res.status(403).send({ message: "Unauthorized - You do not own this URL" })
        } else {
            // User owns the URL, safe to delete
            await urlModel.findByIdAndDelete({ _id: reqParams.id })
            res.status(204).send({ message: "Requested URL successfully Deleted" })
        }
    } catch (error) {
        const errorId = logger.logError("Error on deleteUrl", error);
        res.status(500).send({ message: "Something went wrong. Please try again later.", errorId });
    }
}