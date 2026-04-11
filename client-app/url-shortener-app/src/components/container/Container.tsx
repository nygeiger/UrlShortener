import { useEffect, useState } from "react";
import FormContainer from "../form-container/FormContainer";
import type { UrlData } from "../../interface/UrlData";
import DataTable from "../data-table/DataTable";
import { fetchTableData } from "../../helpers/data";

export default function Container() {
    const [data, setData] = useState<UrlData[]>([]);

    const refreshTableData = async () => {
        setData(await fetchTableData())
    }

    useEffect(() => { refreshTableData() }, [])

    //TODO: Add pagination
    return (
        <>
            <FormContainer refreshTableData={refreshTableData} />
            <DataTable data={data} refreshTableData={refreshTableData} />
        </>
    )
}
