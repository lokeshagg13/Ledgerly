import { createContext, useState } from "react";
import { axiosPrivate } from "../../api/axios";

const TransactionContext = createContext({
    showAddTransactionModal: false,
    transactionFormData: {},
    categories: [],
    isCategoriesLoading: false,
    subcategories: [],
    isSubcategoriesLoading: false,
    showAddCategoryForm: false,
    newCategoryInput: "",
    showAddSubcategoryForm: false,
    newSubcategoryInput: "",
    openAddTransactionModal: () => { },
    closeAddTransactionModal: () => { },
    resetTransactionFormData: () => { },
    updateTransactionFormData: (key, value) => { },
    openAddCategoryForm: () => { },
    closeAddCategoryForm: () => { },
    setNewCategoryInput: (value) => { },
    openAddSubcategoryForm: () => { },
    closeAddSubcategoryForm: () => { },
    setNewSubcategoryInput: (value) => { },
    fetchCategoriesFromDB: () => { },
    fetchSubcategoriesFromDB: () => { },
    handleAddTransaction: () => { }
});

export const TransactionProvider = ({ children }) => {
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
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
    const [subcategories, setSubcategories] = useState([]);
    const [isSubcategoriesLoading, setIsSubcategoriesLoading] = useState(false);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
    const [newCategoryInput, setNewCategoryInput] = useState("");
    const [showAddSubcategoryForm, setShowAddSubcategoryForm] = useState(false);
    const [newSubcategoryInput, setNewSubcategoryInput] = useState("");

    function openAddTransactionModal() {
        setShowAddTransactionModal(true);
    }

    function closeAddTransactionModal() {
        setShowAddTransactionModal(false);
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
        setNewCategoryInput("");
    }

    function closeAddCategoryForm() {
        setShowAddCategoryForm(false);
    }

    function openAddSubcategoryForm() {
        setShowAddSubcategoryForm(true);
        setNewSubcategoryInput("");
    }

    function closeAddSubcategoryForm() {
        setShowAddSubcategoryForm(false);
    }

    async function fetchCategoriesFromDB() {
        setIsCategoriesLoading(true);
        try {
            const res = await axiosPrivate.get("/user/transactions/categories");
            if (res?.data?.categories) setCategories(res.data.categories);
        } catch (error) {
            console.error("Error fetching categories", error);
        } finally {
            setIsCategoriesLoading(false);
        }
    };

    async function fetchSubcategoriesFromDB() {
        if (!transactionFormData.category) {
            setSubcategories([]);
            updateTransactionFormData("subcategory", null);
            return;
        }
        setIsSubcategoriesLoading(true);
        try {
            const res = await axiosPrivate.get(`/user/transactions/subcategories/${transactionFormData.category}`);
            const fetched = res.data.subcategories || [];
            setSubcategories(fetched);
            if (fetched.length === 0) {
                updateTransactionFormData("subcategory", null);
            }
        } catch (error) {
            console.error("Error fetching subcategories", error);
        } finally {
            setIsSubcategoriesLoading(false);
        }
    };

    async function handleAddTransaction() {
        console.log(transactionFormData);
    }

    const currentTransactionContext = {
        showAddTransactionModal,
        transactionFormData,
        categories,
        isCategoriesLoading,
        subcategories,
        isSubcategoriesLoading,
        showAddCategoryForm,
        newCategoryInput,
        showAddSubcategoryForm,
        newSubcategoryInput,
        openAddTransactionModal,
        closeAddTransactionModal,
        resetTransactionFormData,
        updateTransactionFormData,
        openAddCategoryForm,
        closeAddCategoryForm,
        setNewCategoryInput,
        openAddSubcategoryForm,
        closeAddSubcategoryForm,
        setNewSubcategoryInput,
        fetchCategoriesFromDB,
        fetchSubcategoriesFromDB,
        handleAddTransaction
    }

    return (
        <TransactionContext.Provider value={currentTransactionContext}>
            {children}
        </TransactionContext.Provider>
    );
};

export default TransactionContext;