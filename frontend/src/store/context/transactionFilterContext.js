import { createContext, useState } from "react";

const TransactionFilterContext = createContext({
    fromDate: null,
    toDate: null,
    selectedCategories: [],
    appliedFilters: {},
    filteringError: {},
    setFromDate: (prev) => { },
    setToDate: (prev) => { },
    setSelectedCategories: (prev) => { },
    handleResetFilteringError: () => { },
    handleApplyFilters: () => { },
    handleClearFilters: () => { }
});

export function TransactionFilterContextProvider({ children }) {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [filteringError, setFilteringError] = useState({
        message: "",
        fromDate: false,
        toDate: false
    });

    function handleResetFilteringError() {
        setFilteringError({
            message: "",
            fromDate: false,
            toDate: false
        });
    }

    function validateFilters() {
        let hasError = false;
        let errorMessage = "";
        const errorState = { fromDate: false, toDate: false };

        if (!fromDate && !toDate && selectedCategories.length === 0) {
            errorMessage = "No filters selected to apply.";
            hasError = true;
        } else if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
            errorMessage = "From Date must never be higher than To Date."
            errorState.fromDate = true;
            errorState.toDate = true;
            hasError = true;
        }

        if (hasError) {
            setFilteringError({ message: errorMessage, ...errorState });
            return false;
        }
        handleResetFilteringError();
        return true;
    }

    function handleApplyFilters() {
        if (validateFilters()) {
            setAppliedFilters({
                fromDate,
                toDate,
                categories: selectedCategories,
            });
        }
    }

    function handleClearFilters() {
        setFromDate(null);
        setToDate(null);
        setSelectedCategories([]);
        setAppliedFilters(null);
        handleResetFilteringError();
    }

    const currentFilterContextValue = {
        fromDate,
        toDate,
        selectedCategories,
        appliedFilters,
        filteringError,
        setFromDate,
        setToDate,
        setSelectedCategories,
        handleResetFilteringError,
        handleApplyFilters,
        handleClearFilters,
    };

    return (
        <TransactionFilterContext.Provider
            value={currentFilterContextValue}
        >
            {children}
        </TransactionFilterContext.Provider>
    );
}

export default TransactionFilterContext;
