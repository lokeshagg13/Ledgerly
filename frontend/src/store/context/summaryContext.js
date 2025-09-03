import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { axiosPrivate } from "../../api/axios";
import { formatAmountForDisplay } from "../../utils/formatUtils";

const SummaryContext = createContext({
    isLoadingBalanceSummary: false,
    balanceSummaryRows: [],
    selectedSummaryRows: [],
    filteredSummaryRows: [],
    appliedFilters: {},
    errorFetchingBalanceSummary: null,
    checkIfAllSummaryRowsSelected: () => { },
    setFilteredSummaryRows: (newValue) => { },
    fetchBalanceSummary: async (manual, mode, from, to) => { },
    handleToggleSummaryRowSelection: (headId) => { },
    handleToggleAllSummaryRowSelections: () => { },
    handleExportFilteredSummaryRowsAsExcel: () => { },
    handleExportFilteredSummaryRowsAsPDF: () => { },
    handleExportSelectedSummaryRowsAsExcel: () => { },
    handleExportSelectedSummaryRowsAsPDF: () => { }
});

export const SummaryContextProvider = ({ children }) => {
    const [isLoadingBalanceSummary, setIsLoadingBalanceSummary] = useState(false);
    const [balanceSummaryRows, setBalanceSummaryRows] = useState([]);
    const [selectedSummaryRows, setSelectedSummaryRows] = useState([]);
    const [filteredSummaryRows, setFilteredSummaryRows] = useState([]);
    const [appliedFilters, setAppliedFilters] = useState({});
    const [errorFetchingBalanceSummary, setErrorFetchingBalanceSummary] = useState(null);

    function checkIfAllSummaryRowsSelected() {
        return filteredSummaryRows.every((row) => selectedSummaryRows.includes(row.headId));
    }

    async function fetchBalanceSummary(manual = false, mode = "all", from = null, to = null, currentFilters = {}) {
        setIsLoadingBalanceSummary(true);
        setErrorFetchingBalanceSummary(null);
        setAppliedFilters({ from, to, ...currentFilters });  // <-- store filters globally
        try {
            let apiCall = `/user/summary/balanceSummary?mode=${mode}`;
            if (mode === "filtered") {
                if (from) apiCall += `&from=${encodeURIComponent(from)}`;
                if (to) apiCall += `&to=${encodeURIComponent(to)}`;
            }
            const res = await axiosPrivate.get(apiCall);
            if (res?.data?.summary) {
                setBalanceSummaryRows(res.data.summary);
                setFilteredSummaryRows(res.data.summary);
            }
            setSelectedSummaryRows([]);
            if (manual) {
                toast.success("Balance summary refreshed.", {
                    autoClose: 500,
                    position: "top-center"
                });
            }
        } catch (error) {
            handleErrorFetchingBalanceSummary(error);
            toast.error(
                `Error occurred while fetching balance summary: ${error?.response?.data?.error || error?.message || error}`,
                { autoClose: 5000, position: "top-center" }
            );
        } finally {
            setIsLoadingBalanceSummary(false);
        }
    }

    function handleErrorFetchingBalanceSummary(error) {
        if (!error?.response) {
            setErrorFetchingBalanceSummary("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setErrorFetchingBalanceSummary(`Apologies for the inconvenience. There was an error while loading the balance summary. ${error?.response?.data?.error}`);
        } else {
            setErrorFetchingBalanceSummary("Apologies for the inconvenience. There was some error while loading the balance summary. Please try again after some time.");
        }
    }

    function handleToggleSummaryRowSelection(headId) {
        setSelectedSummaryRows((prev) =>
            prev.includes(headId) ? prev.filter((id) => id !== headId) : [...prev, headId]
        );
    }

    function handleToggleAllSummaryRowSelections() {
        if (checkIfAllSummaryRowsSelected()) {
            setSelectedSummaryRows([]);
        } else {
            setSelectedSummaryRows(filteredSummaryRows.map((row) => row.headId));
        }
    }

    function handleExportFilteredSummaryRowsAsExcel() {
        if (!filteredSummaryRows || filteredSummaryRows.length === 0) {
            toast.error("No summary rows to export!", {
                position: "top-center",
                autoClose: 5000
            });
            return;
        }

        const data = filteredSummaryRows.map((row, index) => ({
            "S. No.": index + 1,
            "Head Name": row?.headName || "",
            "Debit Balance": row?.calculatedBalance < 0 ? Math.abs(row?.calculatedBalance) : 0,
            "Credit Balance": row?.calculatedBalance > 0 ? row?.calculatedBalance : 0,
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Balance Summary");
        XLSX.writeFile(workbook, "balance_summary.xlsx");
    }

    function handleExportFilteredSummaryRowsAsPDF() {
        if (!filteredSummaryRows || filteredSummaryRows.length === 0) {
            toast.error("No summary rows to export!", {
                position: "top-center",
                autoClose: 5000
            });
            return;
        }

        const data = filteredSummaryRows.map((row, index) => [
            index + 1,
            row?.headName || "",
            formatAmountForDisplay(row?.calculatedBalance < 0 ? Math.abs(row?.calculatedBalance) : 0, false),
            formatAmountForDisplay(row?.calculatedBalance > 0 ? row?.calculatedBalance : 0, false)
        ]);
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Balance Summary", 14, 15);
        autoTable(doc, {
            startY: 25,
            head: [["S.No", "Head Name", "Debit Balance", "Credit Balance"]],
            body: data,
            styles: { halign: "left", valign: "middle" },
            columnStyles: {
                2: { halign: "right" },
                3: { halign: "right" }
            },
            headStyles: { fillColor: [41, 128, 185] },
        });
        doc.save("balance_summary.pdf");
    }

    function handleExportSelectedSummaryRowsAsExcel() {
        if (!selectedSummaryRows || selectedSummaryRows.length === 0) {
            toast.error("No summary rows selected to export!", {
                position: "top-center",
                autoClose: 5000
            });
            return;
        }

        const selectedRows = balanceSummaryRows.filter((row) => selectedSummaryRows.includes(row.headId));
        const data = selectedRows.map((row, index) => ({
            "S. No.": index + 1,
            "Head Name": row?.headName || "",
            "Debit Balance": row?.calculatedBalance < 0 ? Math.abs(row?.calculatedBalance) : 0,
            "Credit Balance": row?.calculatedBalance > 0 ? row?.calculatedBalance : 0,
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Balance Summary");
        XLSX.writeFile(workbook, "balance_summary.xlsx");
    }

    function handleExportSelectedSummaryRowsAsPDF() {
        if (!selectedSummaryRows || selectedSummaryRows.length === 0) {
            toast.error("No summary rows selected to export!", {
                position: "top-center",
                autoClose: 5000
            });
            return;
        }

        const selectedRows = balanceSummaryRows.filter((row) => selectedSummaryRows.includes(row.headId));
        const data = selectedRows.map((row, index) => [
            index + 1,
            row?.headName || "",
            formatAmountForDisplay(row?.calculatedBalance < 0 ? Math.abs(row?.calculatedBalance) : 0, false),
            formatAmountForDisplay(row?.calculatedBalance > 0 ? row?.calculatedBalance : 0, false)
        ]);
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Balance Summary", 14, 15);
        autoTable(doc, {
            startY: 25,
            head: [["S.No", "Head Name", "Debit Balance", "Credit Balance"]],
            body: data,
            styles: { halign: "left", valign: "middle" },
            columnStyles: {
                2: { halign: "right" },
                3: { halign: "right" }
            },
            headStyles: { fillColor: [41, 128, 185] },
        });
        doc.save("balance_summary.pdf");
    }

    useEffect(() => {
        fetchBalanceSummary(false, "all");
        // eslint-disable-next-line
    }, []);

    const currentSummaryContext = {
        isLoadingBalanceSummary,
        balanceSummaryRows,
        selectedSummaryRows,
        filteredSummaryRows,
        appliedFilters,
        errorFetchingBalanceSummary,
        checkIfAllSummaryRowsSelected,
        setFilteredSummaryRows,
        fetchBalanceSummary,
        handleToggleSummaryRowSelection,
        handleToggleAllSummaryRowSelections,
        handleExportFilteredSummaryRowsAsExcel,
        handleExportFilteredSummaryRowsAsPDF,
        handleExportSelectedSummaryRowsAsExcel,
        handleExportSelectedSummaryRowsAsPDF
    };

    return (
        <SummaryContext.Provider value={currentSummaryContext}>
            {children}
        </SummaryContext.Provider>
    );
};

export default SummaryContext;