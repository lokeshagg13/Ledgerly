import { createContext, useCallback, useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { toast } from "react-toastify";
import { formatAmountForFirstTimeInput, formatCustomDateFormatForCalendarInput } from "../../utils/formatUtils";

const TransactionUploadContext = createContext({
    transactionFile: null,
    isExtractingTransactions: false,
    extractedTransactions: [],
    extractTransactionError: null,
    isEditTransactionSectionVisible: false,
    isLoadingCategories: false,
    categories: [],
    isLoadingSubcategoryMapping: false,
    subcategoryMapping: {},
    editableTransactions: [],
    isUploadingBulkTransactions: false,
    inputFieldErrorsMap: {},
    errorUploadingTransactions: null,
    resetAll: () => { },
    handleOpenFileUploadDialogBox: () => { },
    handleClearUploadedFile: () => { },
    handleChangeUploadedFile: (event) => { },
    handleExtractTransactionsFromFile: () => { },
    handleModifyTransaction: (id, field, value) => { },
    handleRemoveTransaction: (id) => { },
    handleResetTransaction: (id) => { },
    handleUploadBulkTransactions: () => { },
    resetErrorUploadingTransactions: () => { },
    getEditTransactionFieldError: (txnId, fieldName) => { }
});

export function TransactionUploadContextProvider({ children }) {
    const [transactionFile, setTransactionFile] = useState(null);
    const [isExtractingTransactions, setIsExtractingTransactions] = useState(false);
    const [extractedTransactions, setExtractedTransactions] = useState([]);
    const [extractTransactionError, setExtractTransactionError] = useState(null);
    const [isEditTransactionSectionVisible, setIsEditTransactionSectionVisible] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isLoadingSubcategoryMapping, setIsLoadingSubcategoryMapping] = useState(false);
    const [subcategoryMapping, setSubcategoryMapping] = useState({});
    const [editableTransactions, setEditableTransactions] = useState([]);
    const [isUploadingBulkTransactions, setIsUploadingBulkTransactions] = useState(false);
    const [inputFieldErrorsMap, setInputFieldErrorsMap] = useState({});
    const [errorUploadingTransactions, setErrorUploadingTransactions] = useState(null);

    useEffect(() => {
        fetchCategoriesFromDB();
        fetchSubcategoryMappingFromDB();
    }, []);

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
        }
    }, [extractedTransactions, isEditTransactionSectionVisible]);

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

    function resetFileInputValue() {
        const fileInput = document.getElementById("transactionFileInput");
        if (fileInput) fileInput.value = "";
    }

    function resetAll() {
        setTransactionFile(null);
        setIsExtractingTransactions(false);
        setExtractedTransactions([]);
        setExtractTransactionError(null);
        setIsEditTransactionSectionVisible(false);
        setEditableTransactions([]);
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
        const sno = editableTransactions.findIndex(txn => txn._id === id);
        toast.success(`Transaction ID ${sno + 1} reset successfully.`, {
            position: "top-center",
            autoClose: 3000
        });
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
            const res = await axiosPrivate.post("/user/transactions/upload", {
                transactions: editableTransactions
            });
            toast.success("Transactions uploaded successfully.", {
                position: "top-center",
                autoClose: 3000
            });
            resetAll();
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

    function resetErrorUploadingTransactions() {
        setErrorUploadingTransactions(null);
    }

    function getEditTransactionFieldError(txnId, fieldName) {
        return inputFieldErrorsMap[txnId]?.[fieldName] || null;
    }

    const currentUploadContextValue = {
        transactionFile,
        isExtractingTransactions,
        extractedTransactions,
        extractTransactionError,
        isEditTransactionSectionVisible,
        isLoadingCategories,
        categories,
        isLoadingSubcategoryMapping,
        subcategoryMapping,
        editableTransactions,
        isUploadingBulkTransactions,
        inputFieldErrorsMap,
        errorUploadingTransactions,
        resetAll,
        handleOpenFileUploadDialogBox,
        handleClearUploadedFile,
        handleChangeUploadedFile,
        handleExtractTransactionsFromFile,
        handleModifyTransaction,
        handleRemoveTransaction,
        handleResetTransaction,
        handleUploadBulkTransactions,
        resetErrorUploadingTransactions,
        getEditTransactionFieldError,
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
