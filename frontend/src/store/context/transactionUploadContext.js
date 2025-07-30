import { createContext, useCallback, useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
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
    resetAll: () => { },
    handleOpenFileUploadDialogBox: () => { },
    handleClearUploadedFile: () => { },
    handleChangeUploadedFile: (event) => { },
    handleExtractTransactionsFromFile: () => { },
    handleModifyTransaction: (id, field, value) => { },
    handleRemoveTransaction: (id) => { },
    handleResetTransaction: (id) => { }
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
            handleErrorExtractingTransactions();
        } finally {
            setIsExtractingTransactions(false);
            resetFileInputValue();
        }
    }

    const handleModifyTransaction = useCallback((id, field, value) => {
        setEditableTransactions((prev) =>
            prev.map((txn) => (txn._id === id ? { ...txn, [field]: value } : txn))
        );
    }, []);

    function handleRemoveTransaction(id) {
        setEditableTransactions((prev) => prev.filter((txn) => txn._id !== id));
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
        resetAll,
        handleOpenFileUploadDialogBox,
        handleClearUploadedFile,
        handleChangeUploadedFile,
        handleExtractTransactionsFromFile,
        handleModifyTransaction,
        handleRemoveTransaction,
        handleResetTransaction
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
