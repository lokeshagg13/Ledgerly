import { createContext, useState } from "react";
import { axiosPrivate } from "../../api/axios";

const TransactionPrintContext = createContext({
    fetchMode: null,
    lastN: null,
    fromDate: null,
    toDate: null,
    selectedCategories: [],
    categories: [],
    isLoadingCategories: false,
    transactions: [],
    isLoadingTransactions: false,
    errorFetchingTransactions: {},
    isPrintSectionVisible: false,
    printStyle: null,
    isPrintPreviewVisible: false,
    printPreviewCurrentData: {},
    printPreviewSlideDirection: null,
    setFetchMode: (prev) => { },
    setLastN: (prev) => { },
    setFromDate: (prev) => { },
    setToDate: (prev) => { },
    setSelectedCategories: (prev) => { },
    fetchCategoriesFromDB: () => { },
    fetchTransactionsFromDB: () => { },
    resetAll: () => { },
    resetErrorFetchingTransactions: () => { },
    setPrintStyle: (prev) => { },
    handleOpenPrintPreview: () => { },
    handleClosePrintPreview: () => { },
    isOnFirstPrintPreviewPage: () => { },
    isOnLastPrintPreviewPage: () => { },
    moveToPrevPrintPreviewPage: () => { },
    moveToNextPrintPreviewPage: () => { }
});

export function TransactionPrintContextProvider({ children }) {
    const [fetchMode, setFetchMode] = useState("recent"); // "recent" | "filtered"
    const [lastN, setLastN] = useState(10);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
    const [errorFetchingTransactions, setErrorFetchingTransactions] = useState({
        type: "", // "input" / "api"
        message: "",
        lastN: false,
        fromDate: false,
        toDate: false,
    })
    const [isPrintSectionVisible, setIsPrintSectionVisible] = useState(false);
    const [printStyle, setPrintStyle] = useState("ca");    // "ca" | "table"
    const [isPrintPreviewVisible, setIsPrintPreviewVisible] = useState(false);
    const [printPreviewCurrentData, setPrintPreviewCurrentData] = useState({
        currentPage: 0,    // Starting from 1
        totalPages: 0,
        printStyle: null,
        imageData: null,
    });
    const [printPreviewSlideDirection, setPrintPreviewSlideDirection] = useState(null);
    const [caPrintPreviewImages, setCAPrintPreviewImages] = useState([]);
    const [tablePrintPreviewImages, setTablePrintPreviewImages] = useState([]);

    async function fetchCategoriesFromDB() {
        setIsLoadingCategories(true);
        try {
            const res = await axiosPrivate.get("/user/categories");
            if (res?.data?.categories) setCategories(res.data.categories);
        } catch (error) {
            console.log("Error while fetching categories:", error);
        } finally {
            setIsLoadingCategories(false);
        }
    }

    function resetErrorFetchingTransactions() {
        setErrorFetchingTransactions({
            message: "",
            type: "",
            lastN: false,
            fromDate: false,
            toDate: false,
        });
    }

    function resetAll() {
        setLastN(10);
        setFromDate(null);
        setToDate(null);
        setSelectedCategories([]);
        setTransactions([]);
        setIsLoadingTransactions(false);
        resetErrorFetchingTransactions();
        setIsPrintSectionVisible(false);
        setPrintStyle("ca");
        setIsPrintPreviewVisible(false);
        setPrintPreviewCurrentData({
            currentPage: 0,
            totalPages: 0,
            printStyle: null,
            imageData: null,
        });
        setCAPrintPreviewImages([]);
        setTablePrintPreviewImages([]);
    }

    function validateInputForFetchingTransactions() {
        let hasError = false;
        let errorMessage = "";
        const errorState = { lastN: false, fromDate: false, toDate: false };

        if (fetchMode === "recent") {
            if (!lastN || typeof lastN !== "number") {
                errorMessage =
                    "Please enter a valid number to fetch the most recent transactions.";
                errorState.lastN = true;
                hasError = true;
            } else if (lastN <= 0) {
                errorMessage =
                    "The number of recent transactions must be greater than zero.";
                errorState.lastN = true;
                hasError = true;
            } else if (lastN > 50) {
                errorMessage =
                    "You can fetch a maximum of 50 recent transactions using this option. For more, please use the custom filter.";
                errorState.lastN = true;
                hasError = true;
            }
        } else if (fetchMode === "filtered") {
            if (!fromDate && !toDate && selectedCategories.length === 0) {
                errorMessage =
                    "Please select at least one filter — date range or category — to proceed.";
                hasError = true;
            } else if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
                errorMessage = "The 'From Date' cannot be later than the 'To Date'.";
                errorState.fromDate = true;
                errorState.toDate = true;
                hasError = true;
            }
        }

        if (hasError) {
            setErrorFetchingTransactions({
                message: errorMessage,
                type: "input",
                ...errorState
            });
            return false;
        }
        resetErrorFetchingTransactions();
        return true;
    }

    function generateParamStringForAPI() {
        const params = new URLSearchParams();
        params.append("mode", fetchMode);
        if (fetchMode === "recent") {
            params.append("limit", lastN);
        }
        if (fetchMode === "filtered") {
            if (fromDate) params.append("from", fromDate);
            if (toDate) params.append("to", toDate);
            if (Array.isArray(selectedCategories)) {
                selectedCategories.forEach((id) => params.append("categoryIds", id));
            } else if (typeof selectedCategories === "string") {
                params.append("categoryIds", selectedCategories);
            }
        }
        return params.toString();
    }

    function handleErrorFetchingTransactions(error) {
        if (fetchMode === "recent") setLastN(10);
        if (fetchMode === "filtered") {
            setFromDate(null);
            setToDate(null);
            setSelectedCategories([]);
        }
        if (!error?.response) {
            setErrorFetchingTransactions({
                ...errorFetchingTransactions,
                type: "api",
                message:
                    "Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly."
            });
        } else if (error?.response?.data?.error) {
            setErrorFetchingTransactions({
                ...errorFetchingTransactions,
                type: "api",
                message: [<div key="1">Apologies for the inconvenience. There was an error while fetching your transactions.</div>, <div key="2"><br /><b>{error?.response?.data?.error}</b></div>]
            });
        } else {
            setErrorFetchingTransactions({
                ...errorFetchingTransactions,
                type: "api",
                message:
                    "Apologies for the inconvenience. There was some error while fetching your transactions. Please try again after some time."
            });
        }
    }

    async function fetchTransactionsFromDB() {
        setIsLoadingTransactions(true);
        resetErrorFetchingTransactions();
        try {
            if (validateInputForFetchingTransactions()) {
                const res = await axiosPrivate.get(`/user/transactions/print?${generateParamStringForAPI()}`);
                if (res?.data?.transactions) setTransactions(res.data.transactions);
                if (res?.data?.caPreviewImages) setCAPrintPreviewImages(res.data.caPreviewImages);
                if (res?.data?.tablePreviewImage) setTablePrintPreviewImages(res.data.table)
                setIsPrintSectionVisible(true);
            }
        } catch (error) {
            handleErrorFetchingTransactions(error)
        } finally {
            setIsLoadingTransactions(false);
        }
    }

    function handleOpenPrintPreview() {
        if (!printPreviewCurrentData?.printStyle || printPreviewCurrentData.printStyle !== printStyle) {
            setPrintPreviewCurrentData({
                currentPage: 1,
                totalPages: printStyle === "ca" ? caPrintPreviewImages.length : tablePrintPreviewImages.length,
                printStyle,
                imageData: printStyle === "ca" ? caPrintPreviewImages[0] : tablePrintPreviewImages[0]
            });
        }
        setIsPrintPreviewVisible(true);
    }

    function handleClosePrintPreview() {
        setIsPrintPreviewVisible(false);
    }

    function isOnFirstPrintPreviewPage() {
        return !printPreviewCurrentData?.currentPage || printPreviewCurrentData.currentPage <= 1;
    }

    function isOnLastPrintPreviewPage() {
        return (
            !printPreviewCurrentData?.currentPage ||
            !printPreviewCurrentData?.totalPages ||
            printPreviewCurrentData.currentPage >= printPreviewCurrentData.totalPages
        );
    }

    function moveToPrevPrintPreviewPage() {
        setPrintPreviewSlideDirection("right");
        setPrintPreviewCurrentData((prev) => {
            if (!prev || prev.currentPage <= 1) return prev;
            const prevPage = prev.currentPage - 1;
            return {
                ...prev,
                currentPage: prevPage,
                imageData: prev.printStyle === "ca"
                    ? caPrintPreviewImages[prevPage - 1] // As page number is 1-indexed but array is 0-indexed
                    : tablePrintPreviewImages[prevPage - 1]
            };
        });
    }

    function moveToNextPrintPreviewPage() {
        setPrintPreviewSlideDirection("left");
        setPrintPreviewCurrentData((prev) => {
            if (!prev || prev.currentPage >= prev.totalPages) return prev;
            const nextPage = prev.currentPage + 1;
            return {
                ...prev,
                currentPage: nextPage,
                imageData: prev.printStyle === "ca"
                    ? caPrintPreviewImages[nextPage - 1] // As page number is 1-indexed but array is 0-indexed
                    : tablePrintPreviewImages[nextPage - 1]
            };
        });
    }

    const currentPrintContextValue = {
        fetchMode,
        lastN,
        fromDate,
        toDate,
        selectedCategories,
        categories,
        isLoadingCategories,
        transactions,
        isLoadingTransactions,
        errorFetchingTransactions,
        isPrintSectionVisible,
        printStyle,
        isPrintPreviewVisible,
        printPreviewCurrentData,
        printPreviewSlideDirection,
        setFetchMode,
        setLastN,
        setFromDate,
        setToDate,
        setSelectedCategories,
        fetchCategoriesFromDB,
        fetchTransactionsFromDB,
        resetAll,
        resetErrorFetchingTransactions,
        setPrintStyle,
        handleOpenPrintPreview,
        handleClosePrintPreview,
        isOnFirstPrintPreviewPage,
        isOnLastPrintPreviewPage,
        moveToPrevPrintPreviewPage,
        moveToNextPrintPreviewPage,
    };

    return (
        <TransactionPrintContext.Provider
            value={currentPrintContextValue}
        >
            {children}
        </TransactionPrintContext.Provider>
    );
}

export default TransactionPrintContext;
