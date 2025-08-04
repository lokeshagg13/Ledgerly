import { createContext, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { formatAmountForFirstTimeInput, formatDateForCalendarInput } from "../../utils/formatUtils";

const TransactionContext = createContext({
    transactions: [],
    isLoadingTransactions: false,
    errorFetchingTransactions: null,
    isAddTransactionModalVisible: false,
    addTransactionFormData: {},
    isEditTransactionModalVisible: false,
    editTransactionFormData: {},
    isAddCategoryFormVisible: false,
    isAddSubcategoryFormVisible: false,
    inputFieldErrors: {},
    fetchTransactions: (appliedFilters) => { },
    checkIfInputFieldInvalid: (fieldName) => { },
    handleResetErrorFetchingTransactions: () => { },
    handleOpenAddTransactionModal: () => { },
    handleCloseAddTransactionModal: () => { },
    handleResetAddTransactionFormData: () => { },
    handleModifyAddTransactionFormData: (key, value) => { },
    handleOpenEditTransactionModal: (transaction) => { },
    handleCloseEditTransactionModal: () => { },
    handleResetEditTransactionFormData: () => { },
    handleModifyEditTransactionFormData: (key, value) => { },
    handleOpenAddCategoryForm: () => { },
    handleCloseAddCategoryForm: () => { },
    handleOpenAddSubcategoryForm: () => { },
    handleCloseAddSubcategoryForm: () => { },
    handleUpdateInputFieldErrors: (errors) => { }
});

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
    const [errorFetchingTransactions, setErrorFetchingTransactions] = useState(null);
    const [isAddTransactionModalVisible, setIsAddTransactionModalVisible] =
        useState(false);
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

    function handleResetErrorFetchingTransactions() {
        setErrorFetchingTransactions(null);
    }

    function handleOpenAddTransactionModal() {
        setIsAddTransactionModalVisible(true);
    }

    function handleCloseAddTransactionModal() {
        setInputFieldErrors({});
        setIsEditTransactionModalVisible(false);
    }

    function handleResetAddTransactionFormData() {
        setAddTransactionFormData({
            type: "debit",
            amount: "",
            date: "",
            remarks: "",
            categoryId: "",
            subcategoryId: "",
        });
    }

    function handleModifyAddTransactionFormData(key, value) {
        setAddTransactionFormData((prev) => ({ ...prev, [key]: value }));
    }

    function handleOpenEditTransactionModal(transaction) {
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

    function handleCloseEditTransactionModal() {
        handleResetEditTransactionFormData();
        setInputFieldErrors({});
        setIsEditTransactionModalVisible(false);
    }

    function handleResetEditTransactionFormData() {
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

    function handleModifyEditTransactionFormData(key, value) {
        setEditTransactionFormData((prev) => ({ ...prev, [key]: value }));
    }

    function handleOpenAddCategoryForm() {
        setIsAddCategoryFormVisible(true);
    }

    function handleCloseAddCategoryForm() {
        setIsAddCategoryFormVisible(false);
    }

    function handleOpenAddSubcategoryForm() {
        setIsAddSubcategoryFormVisible(true);
    }

    function handleCloseAddSubcategoryForm() {
        setIsAddSubcategoryFormVisible(false);
    }

    function checkIfInputFieldInvalid(fieldName) {
        return (Object.keys(inputFieldErrors).includes(fieldName));
    };

    function handleUpdateInputFieldErrors(errors) {
        setInputFieldErrors(errors);
    }

    const currentTransactionContext = {
        transactions,
        isLoadingTransactions,
        errorFetchingTransactions,
        isAddTransactionModalVisible,
        addTransactionFormData,
        isEditTransactionModalVisible,
        editTransactionFormData,
        isAddCategoryFormVisible,
        isAddSubcategoryFormVisible,
        inputFieldErrors,
        fetchTransactions,
        handleResetErrorFetchingTransactions,
        handleOpenAddTransactionModal,
        handleCloseAddTransactionModal,
        handleResetAddTransactionFormData,
        handleModifyAddTransactionFormData,
        handleOpenEditTransactionModal,
        handleCloseEditTransactionModal,
        handleResetEditTransactionFormData,
        handleModifyEditTransactionFormData,
        handleOpenAddCategoryForm,
        handleCloseAddCategoryForm,
        handleOpenAddSubcategoryForm,
        handleCloseAddSubcategoryForm,
        checkIfInputFieldInvalid,
        handleUpdateInputFieldErrors
    }

    return (
        <TransactionContext.Provider value={currentTransactionContext}>
            {children}
        </TransactionContext.Provider>
    );
};

export default TransactionContext;