import { createContext, useState } from "react";
import { axiosPrivate } from "../../api/axios";

const TransactionContext = createContext({
    transactions: [],
    isLoadingTransactions: false,
    showAddTransactionModal: false,
    transactionFormData: {},
    categories: [],
    isLoadingCategories: false,
    subcategories: [],
    isLoadingSubcategories: false,
    showAddCategoryForm: false,
    showAddSubcategoryForm: false,
    inputFieldErrors: {},
    fetchTransactionsFromDB: () => { },
    openAddTransactionModal: () => { },
    closeAddTransactionModal: () => { },
    resetTransactionFormData: () => { },
    updateTransactionFormData: (key, value) => { },
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
    const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
    const [transactionFormData, setTransactionFormData] = useState({
        type: "debit",
        amount: "",
        date: "",
        remarks: "",
        category: "",
        subcategory: "",
    });
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [subcategories, setSubcategories] = useState([]);
    const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
    const [showAddSubcategoryForm, setShowAddSubcategoryForm] = useState(false);
    const [inputFieldErrors, setInputFieldErrors] = useState({});

    async function fetchTransactionsFromDB() {
        setIsLoadingTransactions(true);
        try {
            const res = await axiosPrivate.get("/user/transactions");
            if (res?.data?.transactions) setTransactions(res.data.transactions);
        } catch (error) {
            console.log("Error while fetching transactions:", error);
        } finally {
            setIsLoadingTransactions(false);
        }
    }

    function openAddTransactionModal() {
        setShowAddTransactionModal(true);
    }

    function closeAddTransactionModal() {
        setShowAddTransactionModal(false);
        setInputFieldErrors({});
    }

    function resetTransactionFormData() {
        setTransactionFormData({
            type: "debit",
            amount: "",
            date: "",
            remarks: "",
            category: "",
            subcategory: "",
        });
    }

    function updateTransactionFormData(key, value) {
        setTransactionFormData((prev) => ({ ...prev, [key]: value }));
    }

    function openAddCategoryForm() {
        setShowAddCategoryForm(true);
    }

    function closeAddCategoryForm() {
        setShowAddCategoryForm(false);
    }

    function openAddSubcategoryForm() {
        setShowAddSubcategoryForm(true);
    }

    function closeAddSubcategoryForm() {
        setShowAddSubcategoryForm(false);
    }

    async function fetchCategoriesFromDB() {
        setIsLoadingCategories(true);
        try {
            const res = await axiosPrivate.get("/user/transactions/categories");
            if (res?.data?.categories) setCategories(res.data.categories);
        } catch (error) {
            console.log("Error while fetching categories:", error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    async function fetchSubcategoriesFromDB() {
        if (!transactionFormData.category) {
            setSubcategories([]);
            updateTransactionFormData("subcategory", null);
            return;
        }
        setIsLoadingSubcategories(true);
        try {
            const res = await axiosPrivate.get(`/user/transactions/subcategories/${transactionFormData.category}`);
            const fetched = res.data.subcategories || [];
            setSubcategories(fetched);
            if (fetched.length === 0) {
                updateTransactionFormData("subcategory", null);
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

    const currentTransactionContext = {
        transactions,
        isLoadingTransactions,
        showAddTransactionModal,
        transactionFormData,
        categories,
        isLoadingCategories,
        subcategories,
        isLoadingSubcategories,
        showAddCategoryForm,
        showAddSubcategoryForm,
        inputFieldErrors,
        fetchTransactionsFromDB,
        openAddTransactionModal,
        closeAddTransactionModal,
        resetTransactionFormData,
        updateTransactionFormData,
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