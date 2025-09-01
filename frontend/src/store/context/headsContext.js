import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../api/axios";

const HeadsContext = createContext({
    isLoadingHeads: false,
    heads: [],
    selectedHeads: [],
    filteredHeads: [],
    errorFetchingHeads: null,
    isAddHeadModalVisible: false,
    isDeleteSelectedHeadsModalVisible: false,
    setFilteredHeads: (newValue) => { },
    fetchHeadsFromDB: async (manual) => { },
    handleToggleHeadSelection: (headId) => { },
    handleOpenAddHeadModal: () => { },
    handleCloseAddHeadModal: () => { },
    handleOpenDeleteSelectedHeadsModal: () => { },
    handleCloseDeleteSelectedHeadsModal: () => { },

});

export const HeadsProvider = ({ children }) => {
    const [isLoadingHeads, setIsLoadingHeads] = useState(false);
    const [heads, setHeads] = useState([]);
    const [selectedHeads, setSelectedHeads] = useState([]);
    const [filteredHeads, setFilteredHeads] = useState([]);
    const [errorFetchingHeads, setErrorFetchingHeads] = useState(null);
    const [isAddHeadModalVisible, setIsAddHeadModalVisible] = useState(false);
    const [isDeleteSelectedHeadsModalVisible, setIsDeleteSelectedHeadsModalVisible] = useState(false);

    async function fetchHeadsFromDB(manual = false, onlyActive = null) {
        setIsLoadingHeads(true);
        try {
            let apiCall = `/user/heads`;
            if (onlyActive) apiCall += `?active=true`;
            const res = await axiosPrivate.get(apiCall);
            if (res?.data?.heads) {
                setHeads(res.data.heads);
                setFilteredHeads(res.data.heads);
            }
            setSelectedHeads([]);
            if (manual) {
                toast.success("Refresh completed.", {
                    autoClose: 500,
                    position: "top-center"
                });
            }
            return res.data.heads;
        } catch (error) {
            handleErrorFetchingHeads();
            toast.error(`Error occured while fetching heads: ${error?.response?.data?.error || error?.message || error}`, {
                autoClose: 5000,
                position: "top-center"
            });
        } finally {
            setIsLoadingHeads(false);
        }
        return [];
    }

    function handleErrorFetchingHeads(error) {
        if (!error?.response) {
            setErrorFetchingHeads("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setErrorFetchingHeads(`Apologies for the inconvenience. There was an error while loading the heads. ${error?.response?.data?.error}`);
        } else {
            setErrorFetchingHeads("Apologies for the inconvenience. There was some error while loading the heads. Please try again after some time.");
        }
    }

    function handleToggleHeadSelection(headId) {
        setSelectedHeads((prev) =>
            prev.includes(headId)
                ? prev.filter((c) => c !== headId)
                : [...prev, headId]
        );
    }

    function handleOpenAddHeadModal() {
        setIsAddHeadModalVisible(true);
    }

    function handleCloseAddHeadModal() {
        setIsAddHeadModalVisible(false);
    }

    function handleOpenDeleteSelectedHeadsModal() {
        setIsDeleteSelectedHeadsModalVisible(true);
    }

    function handleCloseDeleteSelectedHeadsModal() {
        setIsDeleteSelectedHeadsModalVisible(false);
    }

    useEffect(() => {
        fetchHeadsFromDB();
        // eslint-disable-next-line
    }, []);

    const currentHeadsContext = {
        isLoadingHeads,
        heads,
        selectedHeads,
        filteredHeads,
        errorFetchingHeads,
        isAddHeadModalVisible,
        isDeleteSelectedHeadsModalVisible,
        setFilteredHeads,
        fetchHeadsFromDB,
        handleToggleHeadSelection,
        handleOpenAddHeadModal,
        handleCloseAddHeadModal,
        handleOpenDeleteSelectedHeadsModal,
        handleCloseDeleteSelectedHeadsModal
    };

    return (
        <HeadsContext.Provider value={currentHeadsContext}>
            {children}
        </HeadsContext.Provider>
    );
};

export default HeadsContext;