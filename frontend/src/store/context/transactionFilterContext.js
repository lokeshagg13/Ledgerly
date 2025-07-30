import { createContext, useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";

const TransactionFilterContext = createContext({
    fromDate: null,
    toDate: null,
    categories: [],
    isLoadingCategories: false,
    selectedCategories: [],
    appliedFilters: {},
    filteringError: {},
    setFromDate: (prev) => { },
    setToDate: (prev) => { },
    setSelectedCategories: (prev) => { },
    resetFilteringError: () => { },
    applyFilters: () => { },
    clearFilters: () => { }
});

export function TransactionFilterProvider({ children }) {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [categories, setCategories] = useState(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [filteringError, setFilteringError] = useState({
        message: "",
        fromDate: false,
        toDate: false
    });

    useEffect(() => {
        fetchCategoriesFromDB();
    }, []);

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

    function resetFilteringError() {
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
        resetFilteringError();
        return true;
    }

    function applyFilters() {
        if (validateFilters()) {
            setAppliedFilters({
                fromDate,
                toDate,
                categories: selectedCategories,
            });
        }
    }

    function clearFilters() {
        setFromDate(null);
        setToDate(null);
        setSelectedCategories([]);
        setAppliedFilters(null);
        resetFilteringError();
    }

    const currentFilterContextValue = {
        fromDate,
        toDate,
        selectedCategories,
        categories,
        isLoadingCategories,
        appliedFilters,
        filteringError,
        setFromDate,
        setToDate,
        setSelectedCategories,
        resetFilteringError,
        applyFilters,
        clearFilters,
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
