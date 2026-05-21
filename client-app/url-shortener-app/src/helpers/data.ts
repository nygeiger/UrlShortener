import axios from "axios";
import { SERVER_URL } from "./Constants";

export const getUserUrls = async (ownerId: string) => {
    try {
        const response = await axios.get(`${SERVER_URL}/userUrls`, {
            params: { ownerId }
        });
        return response.data;
    } catch (error) {
        console.log("Error fetching user urls:", error);
    }
}

export const addUrl = async (fullUrl: string, ownerId: string) => {
    try {
        await axios.post(`${SERVER_URL}/shortUrl`, {
            fullUrl: fullUrl,
            ownerId: ownerId
        });
    } catch (error) {
        console.log("Error on form container submit", error);
    }
}

export const updateUrlClick = async (tinyUrl: string) => {
    try {
        await axios.post(`${SERVER_URL}/shortUrl`, {
            params: { tinyUrl }
        });
    } catch (error) {
        console.log("Error on form container submit", error);
    }
}

export const deleteUrl = async (id: string) => {
    try {
        await axios.delete(`${SERVER_URL}/shortUrl/${id}`)
    } catch (error) {
        console.log("Error deleting shortUrl: ", error);
    }
}