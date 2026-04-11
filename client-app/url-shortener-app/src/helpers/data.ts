import axios from "axios";
import { SERVER_URL } from "./Constants";

export const fetchTableData = async () => {
    try {
        const response = await axios.get(`${SERVER_URL}/shortUrl`);
        console.log("The response from the server is: ", response);
        //TODO: Add zod validation (currently redundant - which is a good thing)
        return response.data
    } catch (error) {
        console.log("Error fetching table data:", error);
    }
    return [];
}

export const addUrl = async (fullUrl: string) => {
    try {
        await axios.post(`${SERVER_URL}/shortUrl`, {
            fullUrl: fullUrl
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