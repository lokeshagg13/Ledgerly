import { createContext, useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { formatAmountForFirstTimeInput, formatDateForCalendarInput } from "../../utils/formatUtils";

const TransactionContext = createContext({
    transactions: [],
    isLoadingTransactions: false,
    errorFetchingTransactions: null,
    addTransactionFormData: {},
    isEditTransactionModalVisible: false,
    editTransactionFormData: {},
    categories: [],
    isLoadingCategories: false,
    subcategoryMapping: [],
    isLoadingSubcategoryMapping: false,
    isAddCategoryFormVisible: false,
    isAddSubcategoryFormVisible: false,
    inputFieldErrors: {},
    resetErrorFetchingTransactions: () => { },
    fetchTransactions: (appliedFilters) => { },
    resetAddTransactionFormData: () => { },
    modifyAddTransactionFormData: (key, value) => { },
    openEditTransactionModal: (transaction) => { },
    closeEditTransactionModal: () => { },
    resetEditTransactionFormData: () => { },
    modifyEditTransactionFormData: (key, value) => { },
    openAddCategoryForm: () => { },
    closeAddCategoryForm: () => { },
    openAddSubcategoryForm: () => { },
    closeAddSubcategoryForm: () => { },
    fetchCategoriesFromDB: () => { },
    fetchSubcategoryMappingFromDB: () => { },
    getSubcategoriesForCategory: (categoryId) => { },
    checkIfInputFieldInvalid: (fieldName) => { },
    updateInputFieldErrors: (errors) => { }
});

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
    const [errorFetchingTransactions, setErrorFetchingTransactions] = useState(null);
    const [addTransactionFormData, setAddTransactionFormData] = useState({
        type: "debit",
        amount: "",
        date: "",
        remarks: "",
        categoryId: "",
        subcategoryId: "",
    });
    const [isEditTransactionModalVisible, setIsEditTransactionModalVisible] = useState(false);
    const [editTransactionFormData, setEditTransactionFormData] = useState({
        type: "debit",
        amount: "",
        date: "",
        remarks: "",
        categoryId: "",
        subcategoryId: "",
    });
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [subcategoryMapping, setSubcategoryMapping] = useState([]);
    const [isLoadingSubcategoryMapping, setIsLoadingSubcategoryMapping] = useState(false);
    const [isAddCategoryFormVisible, setIsAddCategoryFormVisible] = useState(false);
    const [isAddSubcategoryFormVisible, setIsAddSubcategoryFormVisible] = useState(false);
    const [inputFieldErrors, setInputFieldErrors] = useState({});

    async function fetchTransactionsFromDB({ mode = "all", limit = 10, from, to, type, categoryIds } = {}) {
        setIsLoadingTransactions(true);
        setErrorFetchingTransactions(null);
        try {
            const params = new URLSearchParams();
            params.append("mode", mode);
            if (mode === "recent") {
                params.append("limit", limit);
            }
            if (mode === "filtered") {
                if (from) params.append("from", from);
                if (to) params.append("to", to);
                if (type) params.append("type", type);
                if (Array.isArray(categoryIds)) {
                    categoryIds.forEach((id) => params.append("categoryIds", id));
                } else if (typeof categoryIds === "string") {
                    params.append("categoryIds", categoryIds);
                }
            }
            const res = await axiosPrivate.get(`/user/transactions?${params.toString()}`);
            if (res?.data?.transactions) setTransactions(res.data.transactions);
        } catch (error) {
            if (!error?.response) {
                setErrorFetchingTransactions(
                    "Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly."
                );
            } else if (error?.response?.data?.error) {
                setErrorFetchingTransactions(
                    `Apologies for the inconvenience. There was an error while fetching your transactions. Please try again after some time. ${error?.response?.data?.error}`
                );
            } else {
                setErrorFetchingTransactions(
                    "Apologies for the inconvenience. There was an error while fetching your transactions. Please try again after some time."
                );
            }
        } finally {
            setIsLoadingTransactions(false);
        }
    }

    function fetchTransactions(appliedFilters) {
        if (appliedFilters === null) {
            fetchTransactionsFromDB();
        } else {
            fetchTransactionsFromDB({
                mode: "filtered",
                from: appliedFilters.fromDate,
                to: appliedFilters.toDate,
                categoryIds: appliedFilters.categories,
            });
        }
    }

    function resetErrorFetchingTransactions() {
        setErrorFetchingTransactions(null);
    }

    function resetAddTransactionFormData() {
        setAddTransactionFormData({
            type: "debit",
            amount: "",
            date: "",
            remarks: "",
            categoryId: "",
            subcategoryId: "",
        });
    }

    function modifyAddTransactionFormData(key, value) {
        setAddTransactionFormData((prev) => ({ ...prev, [key]: value }));
    }

    function openEditTransactionModal(transaction) {
        setEditTransactionFormData({
            _id: transaction._id,
            type: transaction.type,
            amount: formatAmountForFirstTimeInput(transaction.amount),
            date: formatDateForCalendarInput(transaction.date),
            remarks: transaction.remarks,
            categoryId: transaction.categoryId,
            subcategoryId: transaction.subcategoryId,
        });
        setIsEditTransactionModalVisible(true);
    }

    function closeEditTransactionModal() {
        resetEditTransactionFormData();
        setInputFieldErrors({});
        setIsEditTransactionModalVisible(false);
    }

    function resetEditTransactionFormData() {
        setEditTransactionFormData({
            _id: "",
            type: "debit",
            amount: "",
            date: "",
            remarks: "",
            categoryId: "",
            subcategoryId: "",
        });
    }

    function modifyEditTransactionFormData(key, value) {
        setEditTransactionFormData((prev) => ({ ...prev, [key]: value }));
    }

    function openAddCategoryForm() {
        setIsAddCategoryFormVisible(true);
    }

    function closeAddCategoryForm() {
        setIsAddCategoryFormVisible(false);
    }

    function openAddSubcategoryForm() {
        setIsAddSubcategoryFormVisible(true);
    }

    function closeAddSubcategoryForm() {
        setIsAddSubcategoryFormVisible(false);
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
    };

    async function fetchSubcategoryMappingFromDB() {
        setIsLoadingSubcategoryMapping(true);
        try {
            const res = await axiosPrivate.get("/user/subcategories");
            if (res?.data?.groupedSubcategories) setSubcategoryMapping(res.data.groupedSubcategories);
        } catch (error) {
            console.log("Error while fetching subcategory mapping:", error);
        } finally {
            setIsLoadingSubcategoryMapping(false);
        }
    }

    function getSubcategoriesForCategory(categoryId) {
        if (!categoryId || isLoadingSubcategoryMapping) return [];
        const categoryName = categories.filter((cat) => cat._id === categoryId)?.[0]
            ?.name;
        if (!categoryName) return [];
        return subcategoryMapping?.[categoryName] || [];
    };

    function checkIfInputFieldInvalid(fieldName) {
        return (Object.keys(inputFieldErrors).includes(fieldName));
    };

    function updateInputFieldErrors(errors) {
        setInputFieldErrors(errors);
    }

    useEffect(() => {
        fetchCategoriesFromDB();
        fetchSubcategoryMappingFromDB();
    }, []);

    const currentTransactionContext = {
        transactions,
        isLoadingTransactions,
        errorFetchingTransactions,
        addTransactionFormData,
        isEditTransactionModalVisible,
        editTransactionFormData,
        categories,
        isLoadingCategories,
        subcategoryMapping,
        isLoadingSubcategoryMapping,
        isAddCategoryFormVisible,
        isAddSubcategoryFormVisible,
        inputFieldErrors,
        fetchTransactions,
        resetErrorFetchingTransactions,
        resetAddTransactionFormData,
        modifyAddTransactionFormData,
        openEditTransactionModal,
        closeEditTransactionModal,
        resetEditTransactionFormData,
        modifyEditTransactionFormData,
        openAddCategoryForm,
        closeAddCategoryForm,
        openAddSubcategoryForm,
        closeAddSubcategoryForm,
        fetchCategoriesFromDB,
        fetchSubcategoryMappingFromDB,
        getSubcategoriesForCategory,
        checkIfInputFieldInvalid,
        updateInputFieldErrors
    }

    return (
        <TransactionContext.Provider value={currentTransactionContext}>
            {children}
        </TransactionContext.Provider>
    );
};

export default TransactionContext;