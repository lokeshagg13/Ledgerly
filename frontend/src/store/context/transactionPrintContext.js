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
    printStyle: null,
    setFetchMode: (prev) => { },
    setLastN: (prev) => { },
    setFromDate: (prev) => { },
    setToDate: (prev) => { },
    setSelectedCategories: (prev) => { },
    fetchCategoriesFromDB: () => { },
    fetchTransactionsFromDB: () => { },
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
        message: "",
        lastN: false,
        fromDate: false,
        toDate: false,
    })
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

    function resetErrorFetchingTransactions() {
        setErrorFetchingTransactions({
            message: "",
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
            setErrorFetchingTransactions({ message: errorMessage, ...errorState });
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
        if (!error?.response) {
            setErrorFetchingTransactions({
                ...errorFetchingTransactions,
                message:
                    "Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly."
            });
        } else if (error?.response?.data?.error) {
            setErrorFetchingTransactions({
                ...errorFetchingTransactions,
                message: `Apologies for the inconvenience. There was an error while fetching your transactions. Please try again after some time. ${error?.response?.data?.error}`
            });
        } else {
            setErrorFetchingTransactions({
                ...errorFetchingTransactions,
                message:
                    "Apologies for the inconvenience. There was an error while fetching your transactions. Please try again after some time."
            });
        }
    }

    async function fetchTransactionsFromDB() {
        setIsLoadingTransactions(true);
        resetErrorFetchingTransactions();
        try {
            if (validateInputForFetchingTransactions()) {
                const res = await axiosPrivate.get(`/user/transactions?${generateParamStringForAPI()}`);
                console.log(res?.data)
                if (res?.data?.transactions) setTransactions(res.data.transactions);
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
        printStyle,
        setFetchMode,
        setLastN,
        setFromDate,
        setToDate,
        setSelectedCategories,
        fetchCategoriesFromDB,
        fetchTransactionsFromDB,
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
