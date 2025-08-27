import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../api/axios";

const ViewEntrySetContext = createContext({
    isLoadingEntrySetDetails: false,
    entrySetDate: null,
    entrySetDataRows: [],
    errorFetchingEntrySetDetails: null,
    fetchEntrySetDetails: async (manual) => { },
    getFormattedEntrySetDate: () => { },
});

export const ViewEntrySetContextProvider = ({ entrySetId, formattedEntrySetDate, children }) => {
    const [entrySetDate, setEntrySetDate] = useState(new Date());
    const [entrySetDataRows, setEntrySetDataRows] = useState([]);
    const [isLoadingEntrySetDetails, setIsLoadingEntrySetDetails] = useState(false);
    const [errorFetchingEntrySetDetails, setErrorFetchingEntrySetDetails] = useState(null);

    async function fetchEntrySetDetails(manual = false) {
        setErrorFetchingEntrySetDetails(null);
        setIsLoadingEntrySetDetails(true);
        try {
            const res = await axiosPrivate.get(`/user/entrySet/${entrySetId}`);
            if (res?.data) {
                setEntrySetDate(res.data.date);
                setEntrySetDataRows(res.data.entries);
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
        fetchEntrySetDetails();
        // eslint-disable-next-line
    }, []);

    const currentContextValue = {
        isLoadingEntrySetDetails,
        entrySetDate,
        entrySetDataRows,
        errorFetchingEntrySetDetails,
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

