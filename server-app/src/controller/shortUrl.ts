import type express from "express"
import { urlModel } from "../model/shortUrl.js"

export const createUrl = async (req: express.Request, res: express.Response) => {
    console.log("in create url route")
    try {
        console.log("The fullUrl is ", req.body.fullUrl);
        const { fullUrl } = req.body;
        const urlFound = await urlModel.find({ fullUrl });
        if (urlFound.length > 0) {
            res.status(409).send(urlFound)
        } else {
            const shortUrl = await urlModel.create({ fullUrl })
            res.status(201).send(shortUrl)
        }
    } catch (error) {
        res.status(500).send({ message: "Error on createUrl - something went wrong" })
    }
}

export const getAllUrl = async (req: express.Request, res: express.Response) => {
    console.log("getting all urls")
    try {
        const shortUrls = await urlModel.find();
        if (shortUrls.length <= 0) {
            res.status(404).send({message: "no short urls found"})
        } else {
            res.status(200).send(shortUrls)
        }
    } catch (error) {
        res.status(500).send({ message: "Error on getAllUrl - something went wrong" })
    }
}

export const getUrl = async (req: express.Request, res: express.Response) => {
    console.log("in get a specific url route")
    try {
        res.status(451).send({message: "route not ready yest"})
    } catch (error) {
        res.status(500).send({ message: "Error on getUrl - something went wrong" })
    }
}

export const deleteUrl = async (req: express.Request, res: express.Response) => {
    console.log("in delete url route")
    try {
        res.status(451).send({message: "route not ready yest"})
    } catch (error) {
        res.status(500).send({ message: "Error on deleteUrl - something went wrong" })
    }
}