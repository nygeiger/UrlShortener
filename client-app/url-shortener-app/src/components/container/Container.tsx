import { useEffect, useState } from "react";
import FormContainer from "../form-container/FormContainer";
import type { UrlData } from "../../interface/UrlData";
import DataTable from "../data-table/DataTable";
import { getUserUrls } from "../../helpers/data";
import { useOwnerId } from "../../hooks/useOwnerId";

export default function Container() {
    const [data, setData] = useState<UrlData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const ownerId = useOwnerId();

    const refreshTableData = async () => {
        setIsLoading(true);
        if (ownerId) {
            setData(await getUserUrls(ownerId));
        }
        setIsLoading(false);
        setCurrentPage(1);
    }

    useEffect(() => {
        if (ownerId) {
            refreshTableData();
        }
    }, [ownerId])

    return (
        <div className="flex-1">
            <FormContainer refreshTableData={refreshTableData} />
            <DataTable
                data={data}
                isLoading={isLoading}
                refreshTableData={refreshTableData}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
            />
        </div>
    )
}
