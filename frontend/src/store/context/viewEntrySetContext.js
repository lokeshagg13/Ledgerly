import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../api/axios";
import HeadsContext from "./headsContext";

const ViewEntrySetContext = createContext({
    isLoadingEntrySetDetails: false,
    entrySetDate: null,
    entrySetDataRows: [],
    entrySetBalance: 0,
    errorFetchingEntrySetDetails: null,
    fetchEntrySetDetails: async (manual) => { },
    getFormattedEntrySetDate: () => { },
});

export const ViewEntrySetContextProvider = ({ entrySetId, formattedEntrySetDate, children }) => {
    const { heads } = useContext(HeadsContext);
    const [entrySetDate, setEntrySetDate] = useState(new Date());
    const [entrySetDataRows, setEntrySetDataRows] = useState([]);
    const [entrySetBalance, setEntrySetBalance] = useState(0);
    const [isLoadingEntrySetDetails, setIsLoadingEntrySetDetails] = useState(false);
    const [errorFetchingEntrySetDetails, setErrorFetchingEntrySetDetails] = useState(null);

    async function fetchEntrySetDetails(manual = false) {
        setErrorFetchingEntrySetDetails(null);
        setIsLoadingEntrySetDetails(true);
        try {
            const res = await axiosPrivate.get(`/user/entrySet/${entrySetId}`);
            if (res?.data) {
                setEntrySetDate(res.data.date);
                setEntrySetBalance(res.data.balance);
                const formattedEntries = res.data.entries.map((entry) => ({
                    sno: entry.serial,
                    type: entry.type,
                    headId: entry.headId,
                    headName: heads.find((head) => head._id === entry.headId)?.name,
                    credit: entry.amount && entry.type === "credit" ? entry.amount : "",
                    debit: entry.amount && entry.type === "debit" ? entry.amount : "",
                }));
                const sortedEntries = formattedEntries.sort((a, b) => a.serial - b.serial);
                console.log(sortedEntries)
                setEntrySetDataRows(sortedEntries);
            }
            if (manual) {
                toast.success("Refresh completed!", { position: "top-center", autoClose: 1000 });
            }
        } catch (error) {
            handleErrorFetchingEntrySetDetails(error);
            toast.error(`Error occured while fetching entry set details: ${error?.response?.data?.error || error?.message || error}`, {
                autoClose: 5000,
                position: "top-center"
            });
        } finally {
            setIsLoadingEntrySetDetails(false);
        }
    }

    function handleErrorFetchingEntrySetDetails(error) {
        if (!error?.response) {
            setErrorFetchingEntrySetDetails("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setErrorFetchingEntrySetDetails(`Apologies for the inconvenience. There was an error while loading the details for entry set dated ${formattedEntrySetDate}. ${error?.response?.data?.error}`);
        } else {
            setErrorFetchingEntrySetDetails(`Apologies for the inconvenience. There was some error while loading the details for entry set ${formattedEntrySetDate}. Please try again after some time.`);
        }
    }

    function getFormattedEntrySetDate() {
        return formattedEntrySetDate;
    }

    useEffect(() => {
        if (!heads) return;
        fetchEntrySetDetails();
        // eslint-disable-next-line
    }, [heads]);

    const currentContextValue = {
        isLoadingEntrySetDetails,
        entrySetDate,
        entrySetDataRows,
        entrySetBalance,
        errorFetchingEntrySetDetails,
        setEntrySetBalance,
        fetchEntrySetDetails,
        getFormattedEntrySetDate
    };

    return (
        <ViewEntrySetContext.Provider value={currentContextValue}>
            {children}
        </ViewEntrySetContext.Provider>
    );
};

export default ViewEntrySetContext;

