import { createContext, useState, useEffect } from "react";

import { axiosPrivate } from "../../api/axios";
import { toast } from "react-toastify";

const EntryContext = createContext({
    isLoadingDaywiseEntries: false,
    daywiseEntries: [],
    errorFetchingDaywiseEntries: null,
    fetchDaywiseEntries: async (manual) => { }
});

export const EntryContextProvider = ({ children }) => {
    const [isLoadingDaywiseEntries, setIsLoadingDaywiseEntries] = useState(false);
    const [daywiseEntries, setDaywiseEntries] = useState([]);
    const [errorFetchingDaywiseEntries, setErrorFetchingDaywiseEntries] = useState(null);

    async function fetchDaywiseEntries(manual = false) {
        setErrorFetchingDaywiseEntries(null);
        setIsLoadingDaywiseEntries(true);
        try {
            const res = await axiosPrivate.get("/user/entries");
            if (res?.data) setDaywiseEntries(res.data);
            if (manual) {
                toast.success("Refresh completed.", {
                    autoClose: 1000,
                    position: "top-center"
                });
            }
        } catch (error) {
            handleErrorFetchingDaywiseEntries(error);
        } finally {
            setIsLoadingDaywiseEntries(false);
        }
    }

    function handleErrorFetchingDaywiseEntries(error) {
        if (!error?.response) {
            setErrorFetchingDaywiseEntries("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setErrorFetchingDaywiseEntries(`Apologies for the inconvenience. There was an error while fetching the daywise entries. ${error?.response?.data?.error}`);
        } else {
            setErrorFetchingDaywiseEntries("Apologies for the inconvenience. There was some error while fetching the daywise entries. Please try again after some time.");
        }
    }

    useEffect(() => {
        fetchDaywiseEntries();
        // eslint-disable-next-line
    }, []);

    const currentContextValue = {
        isLoadingDaywiseEntries,
        daywiseEntries,
        errorFetchingDaywiseEntries,
        fetchDaywiseEntries
    };

    return (
        <EntryContext.Provider value={currentContextValue}>
            {children}
        </EntryContext.Provider>
    );
};

export default EntryContext;

