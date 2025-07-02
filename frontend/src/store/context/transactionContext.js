import { createContext, useState } from "react";

const TransactionContext = createContext({
    formData: {},
    categories: [],
    showAddTransactionModal: false,
    resetFormData: () => { },
    updateFormData: (key, value) => { },
    updateCategories: (categories) => { },
    openAddTransactionModal: () => { },
    closeAddTransactionModal: () => { },
    handleAddTransaction: () => { }
});

export const TransactionProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        type: "debit",
        amount: "",
        date: "",
        remarks: "",
        category: "",
        subcategory: "",
    });
    const [categories, setCategories] = useState([]);
    const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

    function resetFormData() {
        setFormData({
            type: "debit",
            amount: "",
            date: "",
            remarks: "",
            category: "",
            subcategory: "",
        });
    }

    function updateFormData(key, value) {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }

    function updateCategories(newCategories) {
        setCategories(newCategories);
    }

    function openAddTransactionModal() {
        console.log('opening')
        setShowAddTransactionModal(true);
    }

    function closeAddTransactionModal() {
        setShowAddTransactionModal(false);
    }

    async function handleAddTransaction() {
        console.log(formData);
    }

    const currentTransactionContext = {
        formData,
        categories,
        showAddTransactionModal,
        resetFormData,
        updateFormData,
        updateCategories,
        openAddTransactionModal,
        closeAddTransactionModal,
        handleAddTransaction
    }

    return (
        <TransactionContext.Provider value={currentTransactionContext}>
            {children}
        </TransactionContext.Provider>
    );
};

export default TransactionContext;