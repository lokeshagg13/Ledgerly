import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../api/axios";
import useAppNavigate from "../hooks/useAppNavigate";

const HeadsUploadContext = createContext({
    headsFile: null,
    isExtractingHeads: false,
    extractedHeads: [],
    extractHeadsError: null,
    isEditHeadSectionVisible: false,
    editableHeads: [],
    selectedHeadIds: new Set(),
    isUploadingBulkHeads: false,
    inputFieldErrorsMap: {},
    errorUploadingHeads: null,
    checkIfHeadSelected: (id) => { },
    checkIfAnyHeadSelected: () => { },
    checkIfAllHeadsSelected: () => { },
    getEditHeadFieldError: (headId, fieldName) => { },
    handleResetAll: () => { },
    handleOpenFileUploadDialogBox: () => { },
    handleClearUploadedFile: () => { },
    handleChangeUploadedFile: (event) => { },
    handleExtractHeadsFromFile: async () => { },
    handleModifyHead: (id, field, value) => { },
    handleRemoveHead: (id) => { },
    handleResetHead: (id) => { },
    handleToggleHeadSelection: (id) => { },
    handleToggleAllHeadSelections: () => { },
    handleUploadBulkHeads: async () => { },
    handleResetErrorUploadingHeads: () => { },
    handleResetSelectedHeads: () => { },
    handleRemoveSelectedHeads: () => { },
    handleResetAllHeads: () => { }
});

export function HeadsUploadContextProvider({ children }) {
    const { handleNavigateToPath } = useAppNavigate();
    const [headsFile, setHeadsFile] = useState(null);
    const [isExtractingHeads, setIsExtractingHeads] = useState(false);
    const [extractedHeads, setExtractedHeads] = useState([]);
    const [extractHeadsError, setExtractHeadsError] = useState(null);
    const [isEditHeadSectionVisible, setIsEditHeadSectionVisible] = useState(false);
    const [editableHeads, setEditableHeads] = useState([]);
    const [selectedHeadIds, setSelectedHeadIds] = useState(new Set());
    const [isUploadingBulkHeads, setIsUploadingBulkHeads] = useState(false);
    const [inputFieldErrorsMap, setInputFieldErrorsMap] = useState({});
    const [errorUploadingHeads, setErrorUploadingHeads] = useState(null);

    useEffect(() => {
        if (isEditHeadSectionVisible && extractedHeads?.length > 0) {
            const headsCopy = extractedHeads.map((head, idx) => ({
                _id: idx,
                name: head?.name?.trim() || "",
                openingBalance: head?.openingBalance ?? 0,
                active: true,
            }));
            setEditableHeads([...headsCopy]);
            handleUnselectAllHeads();
        }
    }, [extractedHeads, isEditHeadSectionVisible]);

    function resetFileInputValue() {
        const fileInput = document.getElementById("headsFileInput");
        if (fileInput) fileInput.value = "";
    }

    function handleResetAll() {
        setHeadsFile(null);
        setIsExtractingHeads(false);
        setExtractedHeads([]);
        setExtractHeadsError(null);
        setIsEditHeadSectionVisible(false);
        setEditableHeads([]);
        handleUnselectAllHeads();
        setInputFieldErrorsMap({});
        setErrorUploadingHeads(null);
    }

    function handleOpenFileUploadDialogBox() {
        if (isEditHeadSectionVisible) return;
        document.getElementById("headsFileInput").click();
        setExtractHeadsError(null);
    }

    function handleClearUploadedFile() {
        if (isEditHeadSectionVisible) return;
        setHeadsFile(null);
        setExtractHeadsError(null);
        resetFileInputValue();
    }

    function handleChangeUploadedFile(ev) {
        if (isEditHeadSectionVisible) return;
        const file = ev.target.files[0];
        if (
            !file ||
            !file.name.endsWith(".pdf") ||
            !file.type === "application/pdf"
        ) {
            setExtractHeadsError("Must upload a .pdf file.");
            setHeadsFile(null);
            resetFileInputValue();
            return;
        }
        setHeadsFile(file);
    }

    function handleErrorExtractingHeads(error) {
        if (!error?.response) {
            setExtractHeadsError(
                "Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly."
            );
        } else if (error?.response?.data?.error) {
            setExtractHeadsError(
                `Apologies for the inconvenience. There was an error while extracting heads from the uploaded file. ${error?.response?.data?.error}`
            );
        } else {
            setExtractHeadsError(
                "Apologies for the inconvenience. There was some error while extracting heads from the uploaded file. Please try again after some time."
            );
        }
    }

    async function handleExtractHeadsFromFile() {
        if (isEditHeadSectionVisible) return;
        if (!headsFile) {
            setExtractHeadsError("A .pdf file is required.");
            return;
        }
        setExtractHeadsError(null);

        const formData = new FormData();
        formData.append("file", headsFile);
        setIsExtractingHeads(true);
        try {
            const res = await axiosPrivate.post(
                "/user/heads/extract",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res?.data?.heads) {
                setExtractedHeads(res.data.heads);
                setIsEditHeadSectionVisible(true);
            }
        } catch (error) {
            handleErrorExtractingHeads(error);
        } finally {
            setIsExtractingHeads(false);
            resetFileInputValue();
        }
    }

    const handleModifyHead = useCallback((id, field, value) => {
        setEditableHeads((prev) =>
            prev.map((head) => (head._id === id ? { ...head, [field]: value } : head))
        );

        // Clear error for the specific field if it exists
        setInputFieldErrorsMap((prevErrorsMap) => {
            const headErrors = prevErrorsMap[id];
            if (!headErrors || !headErrors[field]) return prevErrorsMap;
            const { [field]: _, ...remainingErrors } = headErrors;
            const newErrorsMap = { ...prevErrorsMap };
            if (Object.keys(remainingErrors).length === 0) {
                delete newErrorsMap[id];
            } else {
                newErrorsMap[id] = remainingErrors;
            }
            return newErrorsMap;
        });
    }, []);

    function handleRemoveHead(id) {
        const sno = editableHeads.findIndex(head => head._id === id);
        setEditableHeads((prev) => prev.filter((head) => head._id !== id));
        toast.success(`Head #${sno + 1} removed successfully.`, {
            position: "top-center",
            autoClose: 3000
        });
    };

    function handleResetHead(id) {
        const original = extractedHeads[id];
        setEditableHeads((prev) =>
            prev.map((head) => (
                head._id === id
                    ? {
                        _id: id,
                        name: original?.name?.trim() || "",
                        openingBalance: original?.openingBalance ?? 0,
                        active: true
                    }
                    : head
            ))
        );

        setInputFieldErrorsMap((prevErrorsMap) => {
            if (!prevErrorsMap[id]) return prevErrorsMap;
            const newErrorsMap = { ...prevErrorsMap };
            delete newErrorsMap[id];
            return newErrorsMap;
        });
        const sno = editableHeads.findIndex(head => head._id === id);
        toast.success(`Head #${sno + 1} reset successfully.`, {
            position: "top-center",
            autoClose: 3000
        });
    }

    function checkIfHeadSelected(id) {
        return selectedHeadIds.has(id);
    }

    function checkIfAnyHeadSelected() {
        return selectedHeadIds.size > 0;
    }

    function checkIfAllHeadsSelected() {
        return editableHeads.every((head) => selectedHeadIds.has(head._id));
    }

    function handleToggleHeadSelection(id) {
        setSelectedHeadIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }

    function handleSelectAllHeads() {
        const allIds = new Set(editableHeads.map((head) => head._id));
        setSelectedHeadIds(allIds);
    }

    function handleUnselectAllHeads() {
        setSelectedHeadIds(new Set());
    }

    function handleToggleAllHeadSelections() {
        if (checkIfAllHeadsSelected()) {
            handleUnselectAllHeads();
        } else {
            handleSelectAllHeads();
        }
    }

    function validateInputForUploadingBulkHeads() {
        const errorsMap = {};

        editableHeads.forEach((head) => {
            const errors = {};

            // Name validation
            if (!head.name || head.name.trim().length === 0) {
                errors.name = "Head name cannot be empty.";
            } else if (head.name.trim().length > 50) {
                errors.name = "Head name must not exceed 50 characters.";
            }

            // Opening balance validation (must be a number, not negative)
            if (isNaN(head.openingBalance)) {
                errors.openingBalance = "Opening balance must be a number.";
            } else if (Number(head.openingBalance) < 0) {
                errors.openingBalance = "Opening balance cannot be negative.";
            }

            if (Object.keys(errors).length > 0) {
                errorsMap[head._id] = errors;
            }
        });

        setInputFieldErrorsMap(errorsMap);
        return Object.keys(errorsMap).length === 0;
    }

    async function handleUploadBulkHeads() {
        if (!editableHeads || editableHeads.length === 0) {
            setErrorUploadingHeads("No heads found.");
            return;
        }
        setInputFieldErrorsMap({});
        setErrorUploadingHeads(null);

        const isValid = validateInputForUploadingBulkHeads();
        if (!isValid) {
            setErrorUploadingHeads("Some of these heads have errors. Please review and correct all highlighted fields before proceeding with the upload.");
            return;
        }

        setIsUploadingBulkHeads(true);
        try {
            await axiosPrivate.post("/user/heads/upload", { heads: editableHeads });
            toast.success("Heads uploaded successfully.", {
                position: "top-center",
                autoClose: 3000
            });
            handleResetAll();
            handleNavigateToPath("/heads");
        } catch (error) {
            handleErrorUploadingHeads(error);
        } finally {
            setIsUploadingBulkHeads(false);
        }
    }

    function handleErrorUploadingHeads(error) {
        if (!error?.response) {
            setErrorUploadingHeads("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setErrorUploadingHeads(`Apologies for the inconvenience. There was an error while uploading these heads. ${error?.response?.data?.error}`);
        } else {
            setErrorUploadingHeads("Apologies for the inconvenience. There was some error while uploading these heads. Please try again after some time.");
        }
    }

    function handleResetErrorUploadingHeads() {
        setErrorUploadingHeads(null);
    }

    function getEditHeadFieldError(headId, fieldName) {
        return inputFieldErrorsMap[headId]?.[fieldName] || null;
    }

    function handleResetSelectedHeads() {
        if (selectedHeadIds.size === 0) return;
        const updatedHeads = editableHeads.map((head) => {
            if (!selectedHeadIds.has(head._id)) return head;
            const original = extractedHeads[head._id];
            return {
                _id: head._id,
                name: original?.name?.trim() || "",
                openingBalance: original?.openingBalance ?? 0,
                active: true
            };
        });
        setEditableHeads(updatedHeads);
        setInputFieldErrorsMap((prevMap) => {
            const newMap = { ...prevMap };
            selectedHeadIds.forEach((id) => {
                delete newMap[id];
            });
            return newMap;
        });
        toast.success(`${selectedHeadIds.size} head(s) reset successfully.`, {
            position: "top-center",
            autoClose: 3000
        });
    }

    function handleRemoveSelectedHeads() {
        if (selectedHeadIds.size === 0) return;
        const updatedHeads = editableHeads.filter((head) => !selectedHeadIds.has(head._id));
        setEditableHeads(updatedHeads);
        setInputFieldErrorsMap((prevMap) => {
            const newMap = { ...prevMap };
            selectedHeadIds.forEach((id) => {
                delete newMap[id];
            });
            return newMap;
        });
        toast.success(`${selectedHeadIds.size} head(s) removed successfully.`, {
            position: "top-center",
            autoClose: 3000
        });
        handleUnselectAllHeads();
    }

    function handleResetAllHeads() {
        const headsCopy = extractedHeads.map((head, idx) => ({
            _id: idx,
            name: head?.name?.trim() || "",
            openingBalance: head?.openingBalance ?? 0,
            active: true,
        }));
        setEditableHeads([...headsCopy]);
        handleUnselectAllHeads();
        setInputFieldErrorsMap({});
        setErrorUploadingHeads(null);
        toast.success("All heads have been reset successfully.", {
            position: "top-center",
            autoClose: 3000
        });
    }

    const currentUploadContextValue = {
        headsFile,
        isExtractingHeads,
        extractedHeads,
        extractHeadsError,
        isEditHeadSectionVisible,
        editableHeads,
        selectedHeadIds,
        isUploadingBulkHeads,
        inputFieldErrorsMap,
        errorUploadingHeads,
        handleResetAll,
        handleOpenFileUploadDialogBox,
        handleClearUploadedFile,
        handleChangeUploadedFile,
        handleExtractHeadsFromFile,
        handleModifyHead,
        handleRemoveHead,
        handleResetHead,
        checkIfHeadSelected,
        checkIfAnyHeadSelected,
        checkIfAllHeadsSelected,
        handleToggleHeadSelection,
        handleToggleAllHeadSelections,
        handleUploadBulkHeads,
        handleResetErrorUploadingHeads,
        getEditHeadFieldError,
        handleResetSelectedHeads,
        handleRemoveSelectedHeads,
        handleResetAllHeads
    };

    return (
        <HeadsUploadContext.Provider value={currentUploadContextValue}>
            {children}
        </HeadsUploadContext.Provider>
    );
}

export default HeadsUploadContext;
