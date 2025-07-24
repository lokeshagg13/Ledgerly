import { createContext, useState } from "react";
import { axiosPrivate } from "../../api/axios";

const DashboardContext = createContext({
    categories: [],
    isLoadingCategories: false,
    isLoadingOverallBalance: false,
    overallBalance: {
        amount: 0,
        latestTxnDate: null,
    },
    overallBalanceError: "",
    isLoadingFilteredBalance: false,
    filteredBalance: {
        amount: 0,
        latestTxnDate: null,
    },
    filteredBalanceError: "",
    isUpdatingFilters: false,
    updateFilterError: "",
    appliedFilters: {
        uptoDate: null,
        selectedCategories: []
    },
    filterFormData: {
        uptoDate: null,
        selectedCategories: []
    },
    resetErrorFetchingFilteredBalance: () => { },
    resetErrorUpdatingBalanceFilters: () => { },
    resetFilterFormData: () => { },
    modifyFilterFormData: (key, val) => { },
    fetchCategoriesFromDB: async () => { },
    fetchOverallBalance: async () => { },
    fetchFilteredBalanceAndFilters: async () => { },
    updateBalanceFilters: async () => { }
});

export function DashboardContextProvider({ children }) {
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isLoadingOverallBalance, setIsLoadingOverallBalance] = useState(false);
    const [overallBalance, setOverallBalance] = useState({
        amount: 0,
        latestTxnDate: null
    });
    const [overallBalanceError, setOverallBalanceError] = useState("");
    const [isLoadingFilteredBalance, setIsLoadingFilteredBalance] = useState(false);
    const [filteredBalance, setFilteredBalance] = useState({
        amount: 0,
        latestTxnDate: null
    });
    const [filteredBalanceError, setFilteredBalanceError] = useState("");
    const [isUpdatingFilters, setIsUpdatingFilters] = useState(false);
    const [updateFilterError, setUpdateFilterError] = useState({
        message: "",
        uptoDate: false,
        selectedCategories: false
    });
    const [appliedFilters, setAppliedFilters] = useState({
        uptoDate: null,
        selectedCategories: []
    });
    const [filterFormData, setFilterFormData] = useState({
        uptoDate: null,
        selectedCategories: []
    });

    function resetErrorFetchingOverallBalance() {
        setOverallBalanceError("");
    }

    function resetErrorFetchingFilteredBalance() {
        setFilteredBalanceError("");
    }

    function resetErrorUpdatingBalanceFilters() {
        setUpdateFilterError({
            message: "",
            uptoDate: false,
            selectedCategories: false
        });
    }

    function handleErrorFetchingOverallBalance(error) {
        if (!error?.response) {
            setOverallBalanceError(
                "Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly."
            );
        } else if (error?.response?.data?.error) {
            setOverallBalanceError(
                `Apologies for the inconvenience. There was an error while fetching your overall balance. ${error?.response?.data?.error}`
            );
        } else {
            setOverallBalanceError(
                "Apologies for the inconvenience. There was some error while fetching your overall balance. Please try again after some time."
            );
        }
    }

    function handleErrorFetchingFilteredBalance(error) {
        if (!error?.response) {
            setFilteredBalanceError("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly."
            );
        } else if (error?.response?.data?.error) {
            setFilteredBalanceError(`Apologies for the inconvenience. There was an error while fetching your filtered balance. ${error?.response?.data?.error}`);
        } else {
            setFilteredBalanceError("Apologies for the inconvenience. There was some error while fetching your filtered balance. Please try again after some time.");
        }
    }

    function handleErrorUpdatingBalanceFilters(error) {
        if (!error?.response) {
            setUpdateFilterError({
                message:
                    "Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.",
                uptoDate: false,
                selectedCategories: false
            });
        } else if (error?.response?.data?.error) {
            setUpdateFilterError({
                message: `Apologies for the inconvenience. There was an error while updating your filters for filtered balance. ${error?.response?.data?.error}`,
                uptoDate: false,
                selectedCategories: false
            });
        } else {
            setUpdateFilterError({
                message:
                    "Apologies for the inconvenience. There was some error while updating your filters for filtered balance. Please try again after some time.",
                uptoDate: false,
                selectedCategories: false
            });
        }
    }

    function resetFilterFormData() {
        setFilterFormData({
            uptoDate: appliedFilters.uptoDate || null,
            selectedCategories: appliedFilters.selectedCategories || []
        });
    }

    function modifyFilterFormData(key, value) {
        setFilterFormData(prev => ({
            ...prev,
            [key]: value
        }));
    }

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

    async function fetchOverallBalance() {
        setIsLoadingOverallBalance(true);
        resetErrorFetchingOverallBalance();
        try {
            const res = await axiosPrivate.get("/user/dashboard/overallBalance");
            const { balance, latestTxnDate } = res?.data;
            setOverallBalance({
                amount: balance,
                latestTxnDate
            });
        } catch (error) {
            handleErrorFetchingOverallBalance(error);
        } finally {
            setIsLoadingOverallBalance(false);
        }
    }

    async function fetchFilteredBalanceAndFilters() {
        setIsLoadingFilteredBalance(true);
        resetErrorFetchingFilteredBalance();
        try {
            const res = await axiosPrivate.get("/user/dashboard/custom/balance");
            const { balance, latestTxnDate, uptoDate, selectedCategories } = res?.data;
            setFilteredBalance({
                amount: balance,
                latestTxnDate
            });
            setAppliedFilters({ uptoDate, selectedCategories });
            setFilterFormData({ uptoDate, selectedCategories });
        } catch (error) {
            handleErrorFetchingFilteredBalance(error);
        } finally {
            setIsLoadingFilteredBalance(false);
        }
    }

    async function updateBalanceFilters() {
        setIsUpdatingFilters(true);
        resetErrorUpdatingBalanceFilters();
        let isError = false;
        try {
            const { uptoDate, selectedCategories } = filterFormData;
            if (uptoDate) {
                const inputDate = new Date(uptoDate);
                const today = new Date();
                inputDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
                if (inputDate > today) {
                    setUpdateFilterError({
                        message: "The 'Upto Date' cannot be later than today",
                        uptoDate: true,
                        selectedCategories: false
                    });
                    isError = true;
                }
            }
            await axiosPrivate.put("/user/dashboard/custom/filters", {
                uptoDate,
                selectedCategories
            });
        } catch (error) {
            handleErrorUpdatingBalanceFilters(error);
            isError = true;
        } finally {
            setIsUpdatingFilters(false);
        }
        return isError;
    }

    const currentValue = {
        isLoadingCategories,
        categories,
        isLoadingOverallBalance,
        overallBalance,
        overallBalanceError,
        isLoadingFilteredBalance,
        filteredBalance,
        filteredBalanceError,
        isUpdatingFilters,
        updateFilterError,
        appliedFilters,
        filterFormData,
        resetErrorFetchingFilteredBalance,
        resetErrorUpdatingBalanceFilters,
        resetFilterFormData,
        modifyFilterFormData,
        fetchCategoriesFromDB,
        fetchOverallBalance,
        fetchFilteredBalanceAndFilters,
        updateBalanceFilters
    };

    return (
        <DashboardContext.Provider
            value={currentValue}
        >
            {children}
        </DashboardContext.Provider>
    );
}

export default DashboardContext;
