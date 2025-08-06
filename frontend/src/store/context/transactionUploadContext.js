import { createContext, useCallback, useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { toast } from "react-toastify";
import { formatAmountForFirstTimeInput, formatCustomDateFormatForCalendarInput } from "../../utils/formatUtils";
import useAppNavigate from "../hooks/useAppNavigate";

const TransactionUploadContext = createContext({
    transactionFile: null,
    isExtractingTransactions: false,
    extractedTransactions: [],
    extractTransactionError: null,
    isEditTransactionSectionVisible: false,
    editableTransactions: [],
    selectedTransactionIds: new Set(),
    isUploadingBulkTransactions: false,
    inputFieldErrorsMap: {},
    errorUploadingTransactions: null,
    checkIfTransactionSelected: (id) => { },
    checkIfAnyTransactionSelected: () => { },
    checkIfAllTransactionSelected: () => { },
    getEditTransactionFieldError: (txnId, fieldName) => { },
    handleResetAll: () => { },
    handleOpenFileUploadDialogBox: () => { },
    handleClearUploadedFile: () => { },
    handleChangeUploadedFile: (event) => { },
    handleExtractTransactionsFromFile: async () => { },
    handleModifyTransaction: (id, field, value) => { },
    handleRemoveTransaction: (id) => { },
    handleResetTransaction: (id) => { },
    handleToggleTransactionSelection: (id) => { },
    handleToggleAllTransactionSelections: () => { },
    handleUploadBulkTransactions: async () => { },
    handleResetErrorUploadingTransactions: () => { },
    handleResetSelectedTransactions: () => { },
    handleRemoveSelectedTransactions: () => { },
});

export function TransactionUploadContextProvider({ children }) {
    const { handleNavigateToPath } = useAppNavigate();
    const [transactionFile, setTransactionFile] = useState(null);
    const [isExtractingTransactions, setIsExtractingTransactions] = useState(false);
    const [extractedTransactions, setExtractedTransactions] = useState([]);
    const [extractTransactionError, setExtractTransactionError] = useState(null);
    const [isEditTransactionSectionVisible, setIsEditTransactionSectionVisible] = useState(false);
    const [editableTransactions, setEditableTransactions] = useState([]);
    const [selectedTransactionIds, setSelectedTransactionIds] = useState(new Set());
    const [isUploadingBulkTransactions, setIsUploadingBulkTransactions] = useState(false);
    const [inputFieldErrorsMap, setInputFieldErrorsMap] = useState({});
    const [errorUploadingTransactions, setErrorUploadingTransactions] = useState(null);

    useEffect(() => {
        if (isEditTransactionSectionVisible && extractedTransactions?.length > 0) {
            const tCopy = extractedTransactions.map(txn => ({
                ...txn,
                date: formatCustomDateFormatForCalendarInput(txn.date, "dd/mm/yyyy"),
                amount: formatAmountForFirstTimeInput(txn.amount),
                categoryId: "",
                subcategoryId: "",
            }))
            setEditableTransactions([...tCopy]);
            handleUnselectAllTransactions();
        }
    }, [extractedTransactions, isEditTransactionSectionVisible]);

    function resetFileInputValue() {
        const fileInput = document.getElementById("transactionFileInput");
        if (fileInput) fileInput.value = "";
    }

    function handleResetAll() {
        setTransactionFile(null);
        setIsExtractingTransactions(false);
        setExtractedTransactions([]);
        setExtractTransactionError(null);
        setIsEditTransactionSectionVisible(false);
        setEditableTransactions([]);
        handleUnselectAllTransactions();
        setInputFieldErrorsMap({});
        setErrorUploadingTransactions(null);
    }

    function handleOpenFileUploadDialogBox() {
        if (isEditTransactionSectionVisible) return;
        document.getElementById("transactionFileInput").click();
        setExtractTransactionError(null);
    }

    function handleClearUploadedFile() {
        if (isEditTransactionSectionVisible) return;
        setTransactionFile(null);
        setExtractTransactionError(null);
        resetFileInputValue();
    }

    function handleChangeUploadedFile(ev) {
        if (isEditTransactionSectionVisible) return;
        const file = ev.target.files[0];
        if (
            !file ||
            !file.name.endsWith(".pdf") ||
            !file.type === "application/pdf"
        ) {
            setExtractTransactionError("Must upload a .pdf file.");
            setTransactionFile(null);
            resetFileInputValue();
            return;
        }
        setTransactionFile(file);
    }

    function handleErrorExtractingTransactions(error) {
        if (!error?.response) {
            setExtractTransactionError(
                "Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly."
            );
        } else if (error?.response?.data?.error) {
            setExtractTransactionError(
                `Apologies for the inconvenience. There was an error while extract transactions from the uploaded file. ${error?.response?.data?.error}`
            );
        } else {
            setExtractTransactionError(
                "Apologies for the inconvenience. There was some error while extract transactions from the uploaded file. Please try again after some time."
            );
        }
    }

    async function handleExtractTransactionsFromFile() {
        if (isEditTransactionSectionVisible) return;
        if (!transactionFile) {
            setExtractTransactionError("A .pdf file is required.");
            return;
        }
        setExtractTransactionError(null);

        const formData = new FormData();
        formData.append("file", transactionFile);
        setIsExtractingTransactions(true);
        try {
            const res = await axiosPrivate.post(
                "/user/transactions/extract",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res?.data?.transactions) {
                setExtractedTransactions(res?.data?.transactions);
                setIsEditTransactionSectionVisible(true);
            }
        } catch (error) {
            handleErrorExtractingTransactions(error);
        } finally {
            setIsExtractingTransactions(false);
            resetFileInputValue();
        }
    }

    const handleModifyTransaction = useCallback((id, field, value) => {
        setEditableTransactions((prev) =>
            prev.map((txn) => (txn._id === id ? { ...txn, [field]: value } : txn))
        );

        // Clear error for the specific field if it exists
        setInputFieldErrorsMap((prevErrorsMap) => {
            const txnErrors = prevErrorsMap[id];
            if (!txnErrors || !txnErrors[field]) return prevErrorsMap;
            const { [field]: _, ...remainingErrors } = txnErrors;
            const newErrorsMap = { ...prevErrorsMap };
            if (Object.keys(remainingErrors).length === 0) {
                delete newErrorsMap[id];
            } else {
                newErrorsMap[id] = remainingErrors;
            }
            return newErrorsMap;
        })
    }, []);

    function handleRemoveTransaction(id) {
        const sno = editableTransactions.findIndex(txn => txn._id === id);
        setEditableTransactions((prev) => prev.filter((txn) => txn._id !== id));
        toast.success(`Transaction ID ${sno + 1} removed successfully.`, {
            position: "top-center",
            autoClose: 3000
        });
    };

    function handleResetTransaction(id) {
        const originalData = extractedTransactions.find(txn => txn._id === id);
        setEditableTransactions((prev) =>
            prev.map((txn) => (
                txn._id === id
                    ? {
                        ...originalData,
                        date: formatCustomDateFormatForCalendarInput(originalData.date, "dd/mm/yyyy"),
                        amount: formatAmountForFirstTimeInput(originalData.amount),
                        categoryId: "",
                        subcategoryId: "",
                    }
                    : txn
            ))
        );

        setInputFieldErrorsMap((prevErrorsMap) => {
            if (!prevErrorsMap[id]) return prevErrorsMap;
            const newErrorsMap = { ...prevErrorsMap };
            delete newErrorsMap[id];
            return newErrorsMap;
        });
        const sno = editableTransactions.findIndex(txn => txn._id === id);
        toast.success(`Transaction ID ${sno + 1} reset successfully.`, {
            position: "top-center",
            autoClose: 3000
        });
    }

    function checkIfTransactionSelected(id) {
        return selectedTransactionIds.has(id);
    }

    function checkIfAnyTransactionSelected() {
        return selectedTransactionIds.size > 0;
    }

    function checkIfAllTransactionSelected() {
        return editableTransactions.every((txn) => selectedTransactionIds.has(txn._id));
    }

    function handleToggleTransactionSelection(id) {
        setSelectedTransactionIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }

    function handleSelectAllTransactions() {
        const allIds = new Set(editableTransactions.map((txn) => txn._id));
        setSelectedTransactionIds(allIds);
    }

    function handleUnselectAllTransactions() {
        setSelectedTransactionIds(new Set());
    }

    function handleToggleAllTransactionSelections() {
        if (checkIfAllTransactionSelected()) {
            handleUnselectAllTransactions();
        } else {
            handleSelectAllTransactions();
        }
    }

    function validateInputForUploadingBulkTransactions() {
        const errorsMap = {};

        editableTransactions.forEach((txn) => {
            const errors = {};

            // Type
            if (!txn.type || (txn.type !== "debit" && txn.type !== "credit")) {
                errors.type = "Invalid or missing transaction type.";
            }

            // Amount
            const amount = parseFloat(txn.amount);
            if (!txn.amount || isNaN(amount)) {
                errors.amount = "Amount must be a valid number.";
            } else if (amount <= 0) {
                errors.amount = "Amount must be greater than zero.";
            } else if (!Number.isFinite(amount) || amount > Number.MAX_SAFE_INTEGER) {
                errors.amount = "Amount exceeds maximum safe limit.";
            }

            // Date
            if (!txn.date || isNaN(new Date(txn.date).getTime())) {
                errors.date = "Invalid or missing date.";
            } else {
                const inputDate = new Date(txn.date);
                const today = new Date();
                inputDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
                if (inputDate > today) {
                    errors.date = "Date cannot be in the future.";
                }
            }

            // Remarks
            if (!txn.remarks || txn.remarks.trim().length === 0) {
                errors.remarks = "Remarks cannot be empty.";
            } else if (txn.remarks.trim().length > 50) {
                errors.remarks = "Remarks cannot exceed 50 characters.";
            }

            // Category
            if (!txn.categoryId || txn.categoryId.trim() === "") {
                errors.categoryId = "Category is required.";
            }

            if (Object.keys(errors).length > 0) {
                errorsMap[txn._id] = errors;
            }
        });

        setInputFieldErrorsMap(errorsMap);
        return Object.keys(errorsMap).length === 0;
    }

    async function handleUploadBulkTransactions() {
        if (!editableTransactions || editableTransactions.length === 0) {
            setErrorUploadingTransactions("No transactions found.");
            return;
        }
        setInputFieldErrorsMap({});
        setErrorUploadingTransactions(null);

        const isValid = validateInputForUploadingBulkTransactions();
        if (!isValid) {
            setErrorUploadingTransactions("Some of these transactions have errors. Please review and correct all highlighted fields before proceeding with the upload.");
            return;
        }

        setIsUploadingBulkTransactions(true);
        try {
            await axiosPrivate.post("/user/transactions/upload", {
                transactions: editableTransactions
            });
            toast.success("Transactions uploaded successfully.", {
                position: "top-center",
                autoClose: 3000
            });
            handleResetAll();
            handleNavigateToPath("/transactions");
        } catch (error) {
            handleErrorUploadingTransactions(error);
        } finally {
            setIsUploadingBulkTransactions(false);
        }
    }

    function handleErrorUploadingTransactions(error) {
        if (!error?.response) {
            setErrorUploadingTransactions(
                "Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly."
            );
        } else if (error?.response?.data?.error) {
            setErrorUploadingTransactions(
                `Apologies for the inconvenience. There was an error while uploading these transactions. ${error?.response?.data?.error}`
            );
        } else {
            setErrorUploadingTransactions(
                "Apologies for the inconvenience. There was some error while uploading these transactions. Please try again after some time."
            );
        }
    }

    function handleResetErrorUploadingTransactions() {
        setErrorUploadingTransactions(null);
    }

    function getEditTransactionFieldError(txnId, fieldName) {
        return inputFieldErrorsMap[txnId]?.[fieldName] || null;
    }

    function handleResetSelectedTransactions() {
        if (selectedTransactionIds.size === 0) return;
        const updatedTransactions = editableTransactions.map((txn) => {
            if (!selectedTransactionIds.has(txn._id)) return txn;
            const original = extractedTransactions.find((origTxn) => origTxn._id === txn._id);
            return {
                ...original,
                date: formatCustomDateFormatForCalendarInput(original.date, "dd/mm/yyyy"),
                amount: formatAmountForFirstTimeInput(original.amount),
                categoryId: "",
                subcategoryId: "",
            };
        });
        setEditableTransactions(updatedTransactions);
        setInputFieldErrorsMap((prevMap) => {
            const newMap = { ...prevMap };
            selectedTransactionIds.forEach((id) => {
                delete newMap[id];
            });
            return newMap;
        });
        toast.success(`${selectedTransactionIds.size} transaction(s) reset successfully.`, {
            position: "top-center",
            autoClose: 3000
        });
    }

    function handleRemoveSelectedTransactions() {
        if (selectedTransactionIds.size === 0) return;
        const updatedTransactions = editableTransactions.filter((txn) => !selectedTransactionIds.has(txn._id));
        setEditableTransactions(updatedTransactions);
        setInputFieldErrorsMap((prevMap) => {
            const newMap = { ...prevMap };
            selectedTransactionIds.forEach((id) => {
                delete newMap[id];
            });
            return newMap;
        });
        toast.success(`${selectedTransactionIds.size} transaction(s) removed successfully.`, {
            position: "top-center",
            autoClose: 3000
        });
        handleUnselectAllTransactions();
    }

    const currentUploadContextValue = {
        transactionFile,
        isExtractingTransactions,
        extractedTransactions,
        extractTransactionError,
        isEditTransactionSectionVisible,
        editableTransactions,
        selectedTransactionIds,
        isUploadingBulkTransactions,
        inputFieldErrorsMap,
        errorUploadingTransactions,
        handleResetAll,
        handleOpenFileUploadDialogBox,
        handleClearUploadedFile,
        handleChangeUploadedFile,
        handleExtractTransactionsFromFile,
        handleModifyTransaction,
        handleRemoveTransaction,
        handleResetTransaction,
        checkIfTransactionSelected,
        checkIfAnyTransactionSelected,
        checkIfAllTransactionSelected,
        handleToggleTransactionSelection,
        handleToggleAllTransactionSelections,
        handleUploadBulkTransactions,
        handleResetErrorUploadingTransactions,
        getEditTransactionFieldError,
        handleResetSelectedTransactions,
        handleRemoveSelectedTransactions
    };

    return (
        <TransactionUploadContext.Provider
            value={currentUploadContextValue}
        >
            {children}
        </TransactionUploadContext.Provider>
    );
}

export default TransactionUploadContext;
