import type express from "express"
import z, { ZodError } from "zod"
import { urlModel } from "../model/shortUrl.js"
import { notFound, SHORT_URLS } from "../util.js"

const createUrlSchema = z.object({ fullUrl: z.url(), ownerId: z.uuid() })
const getUrlSchema = z.object({ shortUrl: z.string().refine((val) => val.length == 19 && val.startsWith(`${SHORT_URLS.subdomain}.`) && val.endsWith(`.${SHORT_URLS.tld}`)) })
const updateUrlClickSchema = z.object({ shortUrl: z.string().refine((val) => val.length == 19 && val.startsWith(`${SHORT_URLS.subdomain}.`) && val.endsWith(`.${SHORT_URLS.tld}`)) })
const delUrlSchema = z.object({ id: z.string() })
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
            res.status(500).send({ message: "Error on publicRedirect - something went wrong", error });
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
        res.status(500).send({ message: "Error on getUserUrls - something went wrong", error });
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
        res.status(500).send({ message: "Error on createUrl - something went wrong", error });
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
        res.status(500).send({ message: "Error on getUrl - something went wrong", error });
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
        res.status(500).send({ message: "Error on createUrl - something went wrong", error });
    }
}

export const deleteUrl = async (req: express.Request, res: express.Response) => {
    try {
        const reqParams = delUrlSchema.parse(req.params)
        const shortUrl = await urlModel.findByIdAndDelete({ _id: reqParams.id })

        if (shortUrl) {
            res.status(204).send({ message: "Requested URL successfully Deleted" })
        } else {
            res.status(404).send({ message: "Requested URL not found - Nothing Deleted" })
        }
    } catch (error) {
        res.status(500).send({ message: "Error on deleteUrl - something went wrong", error });
    }
}