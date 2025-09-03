import { createContext, useState, useEffect } from "react";

import { axiosPrivate } from "../../api/axios";
import { toast } from "react-toastify";

// An entry set is a set of entries of a particular date
const EntrySetsContext = createContext({
    isLoadingEntrySets: false,
    entrySets: [],
    selectedEntrySets: [],
    filteredEntrySets: [],
    errorFetchingEntrySets: null,
    isDeleteSelectedEntrySetsModalVisible: false,
    checkIfAllEntrySetsSelected: () => { },
    setFilteredEntrySets: (newValue) => { },
    fetchEntrySets: async (manual) => { },
    handleToggleEntrySetSelected: (entrySetId) => { },
    handleToggleAllEntrySetsSelected: () => { },
    handleOpenDeleteSelectedEntrySetsModal: () => { },
    handleCloseDeleteSelectedEntrySetsModal: () => { },
});

export const EntrySetsContextProvider = ({ children }) => {
    const [isLoadingEntrySets, setIsLoadingEntrySets] = useState(false);
    const [entrySets, setEntrySets] = useState([]);
    const [selectedEntrySets, setSelectedEntrySets] = useState([]);
    const [filteredEntrySets, setFilteredEntrySets] = useState([]);
    const [errorFetchingEntrySets, setErrorFetchingEntrySets] = useState(null);
    const [isDeleteSelectedEntrySetsModalVisible, setIsDeleteSelectedEntrySetsModalVisible] = useState(false);

    function checkIfAllEntrySetsSelected() {
        return filteredEntrySets.every((es) => selectedEntrySets.includes(es._id));
    }

    async function fetchEntrySets(manual = false) {
        setErrorFetchingEntrySets(null);
        setIsLoadingEntrySets(true);
        try {
            const res = await axiosPrivate.get("/user/entrySet");
            if (res?.data) {
                setEntrySets(res.data);
                setFilteredEntrySets(res.data);
            }
            setSelectedEntrySets([]);
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

    function handleToggleEntrySetSelected(entrySetId) {
        setSelectedEntrySets((prev) =>
            prev.includes(entrySetId)
                ? prev.filter((c) => c !== entrySetId)
                : [...prev, entrySetId]
        );
    }

    function handleToggleAllEntrySetsSelected() {
        if (checkIfAllEntrySetsSelected()) {
            setSelectedEntrySets([]);
        } else {
            setSelectedEntrySets(filteredEntrySets.map((es) => es._id));
        }
    }

    function handleOpenDeleteSelectedEntrySetsModal() {
        setIsDeleteSelectedEntrySetsModalVisible(true);
    }

    function handleCloseDeleteSelectedEntrySetsModal() {
        setIsDeleteSelectedEntrySetsModalVisible(false);
    }

    useEffect(() => {
        fetchEntrySets();
        // eslint-disable-next-line
    }, []);

    const currentContextValue = {
        isLoadingEntrySets,
        entrySets,
        selectedEntrySets,
        filteredEntrySets,
        errorFetchingEntrySets,
        isDeleteSelectedEntrySetsModalVisible,
        checkIfAllEntrySetsSelected,
        setFilteredEntrySets,
        fetchEntrySets,
        handleToggleEntrySetSelected,
        handleToggleAllEntrySetsSelected,
        handleOpenDeleteSelectedEntrySetsModal,
        handleCloseDeleteSelectedEntrySetsModal
    };

    return (
        <EntrySetsContext.Provider value={currentContextValue}>
            {children}
        </EntrySetsContext.Provider>
    );
};

export default EntrySetsContext;

