import type express from "express"
import z from "zod"
import { urlModel } from "../model/shortUrl.js"
import { SHORT_URLS } from "../util.js"

const createUrlSchema = z.object({ fullUrl: z.url() })
const getUrlSchema = z.object({ shortUrl: z.string().refine((val) => val.length == 19 && val.startsWith(`${SHORT_URLS.subdomain}.`) && val.endsWith(`.${SHORT_URLS.tld}`)) })
const delUrlSchema = z.object({ id: z.string() })

export const getAllUrl = async (req: express.Request, res: express.Response) => {
    try {
        const shortUrls = await urlModel.find().sort({ createdAt: -1 });

        if (shortUrls.length <= 0) {
            res.status(404).send({ message: "no short urls found" });
        } else {
            res.status(200).send(shortUrls);
        }
    } catch (error) {
        res.status(500).send({ message: "Error on getAllUrl - something went wrong", error });
    }
}

export const createUrl = async (req: express.Request, res: express.Response) => {
    try {
        const validReq = createUrlSchema.parse(req.body)
        const urlFound = await urlModel.find({ fullUrl: validReq.fullUrl });

        if (urlFound.length > 0) {
            res.status(409).send(urlFound);
        } else {
            const shortUrl = await urlModel.create({ fullUrl: validReq.fullUrl })
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
            res.status(404).send({ message: "Full Url not found" })
        } else {
            shortUrl.clicks++;
            shortUrl.save();
            res.redirect(`${shortUrl.fullUrl}`)
        }
    } catch (error) {
        res.status(500).send({ message: "Error on getUrl - something went wrong", error });
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