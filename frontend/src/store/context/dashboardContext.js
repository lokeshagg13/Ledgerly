import { createContext, useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";

const MAX_PIES = 5;
const COLORS = ["#4254FB", "#FFB422", "#FA4F58", "#0DBEFF", "#22BF75"];


const DashboardContext = createContext({
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
    isLoadingSpendingPieChart: false,
    spendingPieChartError: "",
    isLoadingFinancialYears: false,
    financialYears: [],
    financialYearsFetchError: "",
    isLoadingDailyBalanceChart: false,
    dailyBalanceChartError: "",
    isLoadingMonthlySpendingChart: false,
    monthlySpendingChartError: "",
    isLoadingMonthlyBalanceChart: false,
    monthlyBalanceChartError: "",
    fetchOverallBalance: async () => { },
    fetchFilteredBalanceAndFilters: async () => { },
    handleResetErrorFetchingFilteredBalance: () => { },
    handleResetErrorUpdatingBalanceFilters: () => { },
    handleResetFilterFormData: () => { },
    handleModifyFilterFormData: (key, val) => { },
    handleUpdateBalanceFilters: async () => { },
    fetchSpendingPieChartData: async () => { },
    fetchDailyBalanceChartData: async (fy) => { },
    fetchMonthlySpendingChartData: async (fy) => { },
    fetchMonthlyBalanceChartData: async (fy) => { }
});

export function DashboardContextProvider({ children }) {
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
    const [isLoadingSpendingPieChart, setIsLoadingSpendingPieChart] = useState(false);
    const [spendingPieChartError, setSpendingPieChartError] = useState("");
    const [isLoadingDailyBalanceChart, setIsLoadingDailyBalanceChart] = useState(false);
    const [dailyBalanceChartError, setDailyBalanceChartError] = useState("");
    const [isLoadingFinancialYears, setIsLoadingFinancialYears] = useState(false);
    const [financialYears, setFinancialYears] = useState([]);
    const [financialYearsFetchError, setFinancialYearsFetchError] = useState("");
    const [isLoadingMonthlySpendingChart, setIsLoadingMonthlySpendingChart] = useState(false);
    const [monthlySpendingChartError, setMonthlySpendingChartError] = useState("");
    const [isLoadingMonthlyBalanceChart, setIsLoadingMonthlyBalanceChart] = useState(false);
    const [monthlyBalanceChartError, setMonthlyBalanceChartError] = useState("");

    function resetErrorFetchingOverallBalance() {
        setOverallBalanceError("");
    }

    function handleResetErrorFetchingFilteredBalance() {
        setFilteredBalanceError("");
    }

    function handleResetErrorUpdatingBalanceFilters() {
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

    function handleResetFilterFormData() {
        setFilterFormData({
            uptoDate: appliedFilters.uptoDate || null,
            selectedCategories: appliedFilters.selectedCategories || []
        });
    }

    function handleModifyFilterFormData(key, value) {
        setFilterFormData(prev => ({
            ...prev,
            [key]: value
        }));
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
        handleResetErrorFetchingFilteredBalance();
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

    async function handleUpdateBalanceFilters() {
        setIsUpdatingFilters(true);
        handleResetErrorUpdatingBalanceFilters();
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

    function handleErrorFetchingSpendingPieChartData(error) {
        if (!error?.response) {
            setSpendingPieChartError("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setSpendingPieChartError(`Apologies for the inconvenience. There was an error while fetching data for spending pie chart. ${error?.response?.data?.error}`);
        } else {
            setSpendingPieChartError("Apologies for the inconvenience. There was some error while fetching data for spending pie chart. Please try again after some time.");
        }
    }

    async function fetchSpendingPieChartData() {
        let chartData = [];
        try {
            setIsLoadingSpendingPieChart(true);
            const res = await axiosPrivate.get("/user/transactions?type=debit");
            const transactions = res?.data?.transactions || [];

            // 1. Aggregate totals by category
            const categoryTotals = {};
            for (const txn of transactions) {
                const categoryName = txn.categoryName || "Others";
                categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + txn.amount;
            }

            // 2. Sort categories by total amount (descending)
            const sortedData = Object.entries(categoryTotals)
                .map(([name, amount]) => ({ label: name, value: amount }))
                .sort((a, b) => b.value - a.value);

            // 3. Compute total to calculate angles
            const total = sortedData.reduce((sum, item) => sum + item.value, 0);

            // 4. Separate out small slices (<10 degrees of pie angle)
            const smallSlices = [];
            const largeSlices = [];
            sortedData.forEach(item => {
                const angle = (item.value / total) * 360;
                if (angle < 10) {
                    smallSlices.push(item);
                } else {
                    largeSlices.push(item);
                }
            });

            // 5. Combine small slices into "Others"
            const smallTotal = smallSlices.reduce((sum, item) => sum + item.value, 0);
            let combined = [...largeSlices];
            if (smallTotal > 0) {
                combined.push({ label: "Others", value: smallTotal });
            }

            // 6. Keep only top MAX_PIES categories (including "Others" if present)
            const topCategories = combined.slice(0, MAX_PIES);

            // 7. Map to chart data with colors
            chartData = topCategories.map((item, index) => ({
                id: index,
                label: item.label,
                value: item.value.toFixed(2),
                color: COLORS[index]
            }));
        } catch (error) {
            handleErrorFetchingSpendingPieChartData(error);
        } finally {
            setIsLoadingSpendingPieChart(false);
        }
        return chartData;
    }

    function handleErrorFetchingFinancialYearsData(error) {
        if (!error?.response) {
            setFinancialYearsFetchError("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setFinancialYearsFetchError(`Apologies for the inconvenience. There was an error while fetching data for financial years. ${error?.response?.data?.error}`);
        } else {
            setFinancialYearsFetchError("Apologies for the inconvenience. There was some error while fetching data for financial years. Please try again after some time.");
        }
    }

    async function fetchFinancialYearsData() {
        try {
            setIsLoadingFinancialYears(true);
            const res = await axiosPrivate.get("/user/dashboard/financial-years");
            setFinancialYears(res?.data || []);
        } catch (error) {
            handleErrorFetchingFinancialYearsData(error);
        } finally {
            setIsLoadingFinancialYears(false);
        }
    }

    function handleErrorFetchingDailyBalanceChartData(error) {
        if (!error?.response) {
            setDailyBalanceChartError("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setDailyBalanceChartError(`Apologies for the inconvenience. There was an error while fetching data for daily balance chart. ${error?.response?.data?.error}`);
        } else {
            setDailyBalanceChartError("Apologies for the inconvenience. There was some error while fetching data for daily balance chart. Please try again after some time.");
        }
    }

    async function fetchDailyBalanceChartData(fy) {
        let chartData = [];
        try {
            setIsLoadingDailyBalanceChart(true);
            const res = await axiosPrivate.get(`/user/dashboard/series/dailyBalance?fy=${fy}`);
            const series = res?.data || [];
            chartData = series.map(item => ({
                date: new Date(item.date),
                balance: item.balance || 0
            }));
            chartData.sort((a, b) => a.date - b.date);
        } catch (error) {
            handleErrorFetchingDailyBalanceChartData(error);
        } finally {
            setIsLoadingDailyBalanceChart(false);
        }
        return chartData;
    }

    function handleErrorFetchingMonthlySpendingChartData(error) {
        if (!error?.response) {
            setMonthlySpendingChartError("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setMonthlySpendingChartError(`Apologies for the inconvenience. There was an error while fetching data for monthly debit vs credit chart. ${error?.response?.data?.error}`);
        } else {
            setMonthlySpendingChartError("Apologies for the inconvenience. There was some error while fetching data for monthly debit vs credit chart. Please try again after some time.");
        }
    }

    async function fetchMonthlySpendingChartData(fy) {
        let chartData = [];
        try {
            setIsLoadingMonthlySpendingChart(true);
            const res = await axiosPrivate.get(`/user/dashboard/series/monthlySpending?fy=${fy}`);
            const data = res?.data || [];
            chartData = data.map(item => ({
                month: item.month,
                year: item.year,
                credit: item.credit || 0,
                debit: item.debit || 0
            }));
        } catch (error) {
            handleErrorFetchingMonthlySpendingChartData(error);
        } finally {
            setIsLoadingMonthlySpendingChart(false);
        }
        return chartData;
    }

    function handleErrorFetchingMonthlyBalanceChartData(error) {
        if (!error?.response) {
            setMonthlyBalanceChartError("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setMonthlyBalanceChartError(`Apologies for the inconvenience. There was an error while fetching data for monthly balance chart. ${error?.response?.data?.error}`);
        } else {
            setMonthlyBalanceChartError("Apologies for the inconvenience. There was some error while fetching data for monthly balance chart. Please try again after some time.");
        }
    }

    async function fetchMonthlyBalanceChartData(fy) {
        let chartData = [];
        try {
            setIsLoadingMonthlyBalanceChart(true);
            const res = await axiosPrivate.get(`/user/dashboard/series/monthlyBalance?fy=${fy}`);
            const data = res?.data || [];
            chartData = data.map(item => ({
                month: item.month,
                year: item.year,
                balance: item.balance || 0
            }));
        } catch (error) {
            handleErrorFetchingMonthlyBalanceChartData(error);
        } finally {
            setIsLoadingMonthlyBalanceChart(false);
        }
        return chartData;
    }

    useEffect(() => {
        fetchFinancialYearsData();
    }, []);

    const currentValue = {
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
        isLoadingSpendingPieChart,
        spendingPieChartError,
        isLoadingFinancialYears,
        financialYears,
        financialYearsFetchError,
        isLoadingDailyBalanceChart,
        dailyBalanceChartError,
        isLoadingMonthlySpendingChart,
        monthlySpendingChartError,
        isLoadingMonthlyBalanceChart,
        monthlyBalanceChartError,
        handleResetErrorFetchingFilteredBalance,
        handleResetErrorUpdatingBalanceFilters,
        handleResetFilterFormData,
        handleModifyFilterFormData,
        fetchOverallBalance,
        fetchFilteredBalanceAndFilters,
        handleUpdateBalanceFilters,
        fetchSpendingPieChartData,
        fetchDailyBalanceChartData,
        fetchMonthlySpendingChartData,
        fetchMonthlyBalanceChartData
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
