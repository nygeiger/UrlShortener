import { useEffect, useState } from "react";
import FormContainer from "../form-container/FormContainer";
import type { UrlData } from "../../interface/UrlData";
import DataTable from "../data-table/DataTable";
import { fetchTableData } from "../../helpers/data";

export default function Container() {
    const [data, setData] = useState<UrlData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const refreshTableData = async () => {
        setIsLoading(true);
        setData(await fetchTableData());
        setIsLoading(false);
        setCurrentPage(1);
    }

    useEffect(() => { refreshTableData() }, [])

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
