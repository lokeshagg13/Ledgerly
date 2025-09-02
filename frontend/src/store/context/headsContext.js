import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

import { axiosPrivate } from "../../api/axios";

const HeadsContext = createContext({
    isLoadingHeads: false,
    heads: [],
    selectedHeads: [],
    filteredHeads: [],
    errorFetchingHeads: null,
    isAddHeadModalVisible: false,
    isDeleteSelectedHeadsModalVisible: false,
    checkIfAllHeadsSelected: () => { },
    setFilteredHeads: (newValue) => { },
    fetchHeadsFromDB: async (manual) => { },
    handleToggleHeadSelection: (headId) => { },
    handleToggleAllHeadSelections: () => { },
    handleOpenAddHeadModal: () => { },
    handleCloseAddHeadModal: () => { },
    handleOpenDeleteSelectedHeadsModal: () => { },
    handleCloseDeleteSelectedHeadsModal: () => { },
    handleExportSelectedHeadsAsExcel: () => { },
    handleExportSelectedHeadsAsPDF: () => { }
});

export const HeadsProvider = ({ children }) => {
    const [isLoadingHeads, setIsLoadingHeads] = useState(false);
    const [heads, setHeads] = useState([]);
    const [selectedHeads, setSelectedHeads] = useState([]);
    const [filteredHeads, setFilteredHeads] = useState([]);
    const [errorFetchingHeads, setErrorFetchingHeads] = useState(null);
    const [isAddHeadModalVisible, setIsAddHeadModalVisible] = useState(false);
    const [isDeleteSelectedHeadsModalVisible, setIsDeleteSelectedHeadsModalVisible] = useState(false);

    function checkIfAllHeadsSelected() {
        return filteredHeads.every((head) => selectedHeads.includes(head._id));
    }

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

    function handleToggleAllHeadSelections() {
        if (checkIfAllHeadsSelected()) {
            setSelectedHeads([]);
        } else {
            setSelectedHeads(filteredHeads.map((head) => head._id));
        }
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

    function handleExportSelectedHeadsAsExcel() {
        if (!selectedHeads || selectedHeads.length === 0) {
            toast.error("No heads selected to export!", {
                position: "top-center",
                autoClose: 5000
            });
            return;
        }

        const selectedHeadObjects = heads.filter((head) => selectedHeads.includes(head._id));
        const data = selectedHeadObjects.map((head, index) => ({
            "S. No.": index + 1,
            "Head Name": head?.name || "",
            "Opening Balance": head?.openingBalance?.amount || 0
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Heads");
        XLSX.writeFile(workbook, "selected_heads.xlsx");
    }

    function handleExportSelectedHeadsAsPDF() {
        if (!selectedHeads || selectedHeads.length === 0) {
            toast.error("No heads selected to export!", {
                position: "top-center",
                autoClose: 5000
            });
            return;
        }

        const selectedHeadObjects = heads.filter((head) => selectedHeads.includes(head._id));
        const data = selectedHeadObjects.map((head, index) => [
            index + 1,
            head?.name || "",
            head?.openingBalance?.amount || 0
        ]);
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Selected Heads Report", 14, 15);
        autoTable(doc, {
            startY: 25,
            head: [["S.No", "Head Name", "Opening Balance"]],
            body: data,
            styles: { halign: "left", valign: "middle" },
            headStyles: { fillColor: [41, 128, 185] },
        });
        doc.save("selected_heads.pdf");
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
        checkIfAllHeadsSelected,
        setFilteredHeads,
        fetchHeadsFromDB,
        handleToggleHeadSelection,
        handleToggleAllHeadSelections,
        handleOpenAddHeadModal,
        handleCloseAddHeadModal,
        handleOpenDeleteSelectedHeadsModal,
        handleCloseDeleteSelectedHeadsModal,
        handleExportSelectedHeadsAsExcel,
        handleExportSelectedHeadsAsPDF
    };

    return (
        <HeadsContext.Provider value={currentHeadsContext}>
            {children}
        </HeadsContext.Provider>
    );
};

export default HeadsContext;