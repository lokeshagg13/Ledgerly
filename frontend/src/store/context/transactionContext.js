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
    subcategories: [],
    isLoadingSubcategories: false,
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
    fetchSubcategoriesFromDB: () => { },
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
    const [subcategories, setSubcategories] = useState([]);
    const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
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

    async function fetchSubcategoriesFromDB() {
        if (!addTransactionFormData.categoryId) {
            setSubcategories([]);
            modifyAddTransactionFormData("subcategory", null);
            return;
        }
        setIsLoadingSubcategories(true);
        try {
            const res = await axiosPrivate.get(`/user/subcategories/${addTransactionFormData.categoryId}`);
            const fetched = res.data.subcategories || [];
            setSubcategories(fetched);
            if (fetched.length === 0) {
                modifyAddTransactionFormData("subcategory", null);
            }
        } catch (error) {
            console.log("Error while fetching subcategories:", error);
        } finally {
            setIsLoadingSubcategories(false);
        }
    };

    function checkIfInputFieldInvalid(fieldName) {
        return (Object.keys(inputFieldErrors).includes(fieldName));
    };

    function updateInputFieldErrors(errors) {
        setInputFieldErrors(errors);
    }

    useEffect(() => {
        fetchCategoriesFromDB();
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
        subcategories,
        isLoadingSubcategories,
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
        fetchSubcategoriesFromDB,
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