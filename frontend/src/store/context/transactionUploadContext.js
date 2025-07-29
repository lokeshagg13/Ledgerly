import { createContext, useState } from "react";
import { axiosPrivate } from "../../api/axios";

const TransactionUploadContext = createContext({
    transactionFile: null,
    isExtractingTransactions: false,
    extractedTransactions: [],
    extractTransactionError: null,
    isEditTransactionSectionVisible: false,
    resetAll: () => { },
    handleOpenFileUploadDialogBox: () => { },
    handleClearUploadedFile: () => { },
    handleChangeUploadedFile: (event) => { },
    handleExtractTransactionsFromFile: () => { },
});

export function TransactionUploadContextProvider({ children }) {
    const [transactionFile, setTransactionFile] = useState(null);
    const [isExtractingTransactions, setIsExtractingTransactions] = useState(false);
    const [extractedTransactions, setExtractedTransactions] = useState([]);
    const [extractTransactionError, setExtractTransactionError] = useState(null);
    const [isEditTransactionSectionVisible, setIsEditTransactionSectionVisible] = useState(false);

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

            console.log(res?.data?.transactions);
        } catch (error) {
            handleErrorExtractingTransactions();
        } finally {
            setIsExtractingTransactions(false);
            resetFileInputValue();
        }
    }

    const currentUploadContextValue = {
        transactionFile,
        isExtractingTransactions,
        extractedTransactions,
        extractTransactionError,
        isEditTransactionSectionVisible,
        resetAll,
        handleOpenFileUploadDialogBox,
        handleClearUploadedFile,
        handleChangeUploadedFile,
        handleExtractTransactionsFromFile
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
