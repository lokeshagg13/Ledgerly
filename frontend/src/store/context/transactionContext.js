import { createContext, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { formatDateForCalendarInput } from "../../logic/formatUtils";

const TransactionContext = createContext({
    transactions: [],
    isLoadingTransactions: false,
    isAddTransactionModalVisible: false,
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
    fetchTransactionsFromDB: () => { },
    openAddTransactionModal: () => { },
    closeAddTransactionModal: () => { },
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
    const [isAddTransactionModalVisible, setIsAddTransactionModalVisible] = useState(false);
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
        setIsAddTransactionModalVisible(true);
    }

    function closeAddTransactionModal() {
        setInputFieldErrors({});
        setIsAddTransactionModalVisible(false);
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
            amount: transaction.amount,
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

    const currentTransactionContext = {
        transactions,
        isLoadingTransactions,
        isAddTransactionModalVisible,
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
        fetchTransactionsFromDB,
        openAddTransactionModal,
        closeAddTransactionModal,
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