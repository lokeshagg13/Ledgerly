import { createContext, useState, useEffect } from "react";

import { axiosPrivate } from "../../api/axios";
import { toast } from "react-toastify";

// An entry set is a set of entries of a particular date
const EntrySetContext = createContext({
    isLoadingEntrySets: false,
    entrySets: [],
    errorFetchingEntrySets: null,
    fetchEntrySets: async (manual) => { }
});

export const EntrySetContextProvider = ({ children }) => {
    const [isLoadingEntrySets, setIsLoadingEntrySets] = useState(false);
    const [entrySets, setEntrySets] = useState([]);
    const [errorFetchingEntrySets, setErrorFetchingEntrySets] = useState(null);

    async function fetchEntrySets(manual = false) {
        setErrorFetchingEntrySets(null);
        setIsLoadingEntrySets(true);
        try {
            const res = await axiosPrivate.get("/user/entrySet");
            if (res?.data) setEntrySets(res.data);
            if (manual) {
                toast.success("Refresh completed.", {
                    autoClose: 1000,
                    position: "top-center"
                });
            }
        } catch (error) {
            handleErrorFetchingEntrySets(error);
            toast.error(`Error occured while fetching entry sets: ${error?.response?.data?.error || error?.message || error}`, {
                autoClose: 5000,
                position: "top-center"
            });
        } finally {
            setIsLoadingEntrySets(false);
        }
    }

    function handleErrorFetchingEntrySets(error) {
        if (!error?.response) {
            setErrorFetchingEntrySets("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setErrorFetchingEntrySets(`Apologies for the inconvenience. There was an error while fetching the daywise entries. ${error?.response?.data?.error}`);
        } else {
            setErrorFetchingEntrySets("Apologies for the inconvenience. There was some error while fetching the daywise entries. Please try again after some time.");
        }
    }

    useEffect(() => {
        fetchEntrySets();
        // eslint-disable-next-line
    }, []);

    const currentContextValue = {
        isLoadingEntrySets,
        entrySets,
        errorFetchingEntrySets,
        fetchEntrySets
    };

    return (
        <EntrySetContext.Provider value={currentContextValue}>
            {children}
        </EntrySetContext.Provider>
    );
};

export default EntrySetContext;

