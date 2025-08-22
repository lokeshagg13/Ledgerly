import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../api/axios";

const HeadsContext = createContext({
    heads: [],
    selectedHeads: [],
    isLoadingHeads: false,
    isAddHeadModalVisible: false,
    isDeleteSelectedHeadsModalVisible: false,
    fetchHeadsFromDB: async (manual) => { },
    handleToggleHeadSelection: (headId) => { },
    handleOpenAddHeadModal: () => { },
    handleCloseAddHeadModal: () => { },
    handleOpenDeleteSelectedHeadsModal: () => { },
    handleCloseDeleteSelectedHeadsModal: () => { },

});

export const HeadsProvider = ({ children }) => {
    const [heads, setHeads] = useState([]);
    const [selectedHeads, setSelectedHeads] = useState([]);
    const [isLoadingHeads, setIsLoadingHeads] = useState(false);
    const [isAddHeadModalVisible, setIsAddHeadModalVisible] = useState(false);
    const [isDeleteSelectedHeadsModalVisible, setIsDeleteSelectedHeadsModalVisible] = useState(false);

    useEffect(() => {
        fetchHeadsFromDB();
    }, []);

    async function fetchHeadsFromDB(manual = false, onlyActive = true) {
        setIsLoadingHeads(true);
        try {
            let apiCall = `/user/heads`;
            if (onlyActive) apiCall += `?active=true`;
            const res = await axiosPrivate.get(apiCall);
            if (res?.data?.heads) setHeads(res.data.heads);
            setSelectedHeads([]);
            if (manual) {
                toast.success("Refresh completed.", {
                    autoClose: 500,
                    position: "top-center"
                });
            }
            return res.data.heads;
        } catch (error) {
            toast.error(`Error occured while fetching heads: ${error?.response?.data?.error || error?.message || error}`, {
                autoClose: 5000,
                position: "top-center"
            });
        } finally {
            setIsLoadingHeads(false);
        }
        return [];
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

    const currentHeadsContext = {
        heads,
        selectedHeads,
        isLoadingHeads,
        isAddHeadModalVisible,
        isDeleteSelectedHeadsModalVisible,
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