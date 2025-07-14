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
    caPrintPreviewImageData: null,
    tablePrintPreviewImageData: null,
    isPrintSectionVisible: false,
    printStyle: null,
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
    const [caPrintPreviewImageData, setCAPrintPreviewImageData] = useState(null);
    const [tablePrintPreviewImageData, setTablePrintPreviewImageData] = useState(null);
    const [isPrintSectionVisible, setIsPrintSectionVisible] = useState(false);
    const [printStyle, setPrintStyle] = useState("ca");    // "ca" | "table"

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

    function resetAll() {
        setLastN(10);
        setFromDate(null);
        setToDate(null);
        setSelectedCategories([]);
        setTransactions([]);
        setCAPrintPreviewImageData(null);
        setTablePrintPreviewImageData(null);
        setIsLoadingTransactions(false);
        setIsPrintSectionVisible(false);
        setPrintStyle("ca");
        resetErrorFetchingTransactions();
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
                if (res?.data?.caPreviewImage) setCAPrintPreviewImageData(res.data.caPreviewImage);
                if (res?.data?.tablePreviewImage) setTablePrintPreviewImageData(res.data.table)
                setIsPrintSectionVisible(true);
            }
        } catch (error) {
            handleErrorFetchingTransactions(error)
        } finally {
            setIsLoadingTransactions(false);
        }
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
        caPrintPreviewImageData,
        tablePrintPreviewImageData,
        isPrintSectionVisible,
        printStyle,
        setFetchMode,
        setLastN,
        setFromDate,
        setToDate,
        setSelectedCategories,
        fetchCategoriesFromDB,
        fetchTransactionsFromDB,
        resetAll,
        resetErrorFetchingTransactions,
        setPrintStyle
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
