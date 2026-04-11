import { Link } from "react-router-dom";
import type { UrlData } from "../../interface/UrlData"
import { SERVER_URL } from "../../helpers/Constants";
import { deleteUrl } from "../../helpers/data";

interface IDataTableProps {
    data: UrlData[];
    refreshTableData: () => void;
}

const copyToClipboard = async (url: string) => {
        try {
            const urlString = `${SERVER_URL}/shortUrl/${url}`;
            await navigator.clipboard.writeText(urlString);
            //TODO: Change alert to a visual cue in dom so that it's more consistent on devices (Change color to green and add "copied" text)
            alert(`URL copied: ${urlString}`);
        } catch (error) {
            console.log("Error copying clipboard: ", error);
        }
    }

export default function DataTable(props: IDataTableProps) {
    const { data, refreshTableData } = props;

    const handleDelete = async (id: string) => {
        await deleteUrl(id);
        refreshTableData();
    }

    const renderTableData = () => {
        return data.map((item) => {
            return (
                <tr key={item._id} className="border-b text-white bg-gray-600 hover:bg-white hover:text-gray-800">
                    <td className="px-6 py-3">
                        <Link to={item.fullUrl} target="_blank" rel="noreferrer noopener">{item.fullUrl}</Link>
                    </td>
                    <td className="px-6 py-3">
                        <Link to={`${SERVER_URL}/shortUrl/${item.shortUrl}`} target="_blank" rel="noreferrer noopener" onClick={() => refreshTableData()}>{item.shortUrl}</Link>
                    </td>
                    <td className="px-6 py-3">
                        {item.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                        <div className="flex flex-row gap-2">
                            <div className="cursor-pointer" onClick={() => copyToClipboard(item.shortUrl)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                                    <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
                                </svg>
                            </div>
                            <div className="cursor-pointer" onClick={() => handleDelete(item._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </div>
                        </div>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className="mx-4 md:container md:mx-auto pt-2 pb-10 relative overflow-x-auto shadow-sm sm:rounded-lg">
            <table className="md:w-full table-fixed text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-md uppercase text-gray-50 bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 w-6/12">FullUrl</th>
                        <th scope="col" className="px-6 py-3 w-3/12">ShortUrl</th>
                        <th scope="col" className="px-6 py-3">Clicks</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>{renderTableData()}</tbody>
            </table>
        </div>
    )
}