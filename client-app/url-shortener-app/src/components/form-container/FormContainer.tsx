import { useState, type ChangeEvent, type SubmitEventHandler } from "react"
import axios from "axios";
import { SERVER_URL } from "../../helpers/Constants";

interface IFormContainerProps {
}

export default function FormContainer(props: IFormContainerProps) {
    const [fullUrl, setFullUrl] = useState<string>("");
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post(`${SERVER_URL}/shortUrl`, {
                fullUrl: fullUrl
            });
            setFullUrl("");
        } catch (error) {
            console.log("Error on form container submit", error);
        }
    }
    return (
        <div className="container mx-auto p-2">
            <div className="bg-[url(./src/assets/banner_bg.JPG)] my-8 rounded-xl bg-cover bg-center">
                <div className="w-full h-full rounded-xl p-20 backdrop-brightness-50">
                    <h2 className="pb-4 text-white text-4xl text-center">URL Shortener</h2>
                    <p className="pb-2 text-white text-center text-xl font-extralight">paste your untidy link to shorten</p>
                    <p className="pb-4 text-white text-center text-small font-thin">free tool to shorten a URL or reduce link, Use our URL shortening tool to create a shortened & neat link making it easy to use</p>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 inset-s-0 flex items-center ps-2 pointer-events-none text-slate-800">Messy link /</div>
                        <input
                            className="block w-full p-4 ps-24 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                            type="text"
                            placeholder="add your link"
                            value={fullUrl}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFullUrl(e.target.value)}
                            required />
                        <button type="submit" className="absolute top-0 inset-e-0 p-2.5 text-sm font-medium h-full text-white bg-blue-500 rounded-lg border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 hover:cursor-pointer">
                            Shorten URL
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
