import { createContext, createRef, useRef, useEffect, useLayoutEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';

import { axiosPrivate } from "../../api/axios";
import { formatAmountForFirstTimeInput } from "../../utils/formatUtils";
import useAppNavigate from "../hooks/useAppNavigate";
import HeadsContext from "./headsContext";

const MIN_ROWS = 20;
const MAX_ROWS = 1000;
const COLS = ["type", "head", "credit", "debit"];

const EditEntrySetContext = createContext({
    isLoadingEntrySetDetails: false,
    entrySetDate: null,
    originalEntrySetDataRows: [],
    originalEntrySetBalance: 0,
    errorFetchingEntrySetDetails: null,
    editableEntrySetDataRows: [],
    editableEntrySetBalance: 0,
    menuPosition: null,
    clickedEntryRow: null,
    entryInputFieldRefs: [],
    isUpdatingEntrySetDetails: false,
    inputFieldErrorsMap: {},
    errorUpdatingEntrySetDetails: null,
    fetchEntrySetDetails: async (manual) => { },
    getFormattedEntrySetDate: () => { },
    setEntrySetBalance: (newVal) => { },
    findFirstEmptyRowIndex: () => { },
    handleInsertEntryRow: (atIdx) => { },
    handleDeleteEntryRow: (atIdx) => { },
    handleInsertCashEntryRow: (rowIdx) => { },
    handleModifyFieldValue: (rowIdx, field, value) => { },
    handleKeyPress: (e) => { },
    handleContextMenuSetup: (e, rowIdx) => { },
    handleClearEntryRows: () => { },
    handleUpdateEntrySetDetails: async () => { },
    handleResetErrorUpdatingEntrySetDetails: () => { },
    getEntryRowFieldError: (rowIdx, fieldName) => { },
});

export const EditEntrySetContextProvider = ({ entrySetId, formattedEntrySetDate, children }) => {
    const { handleNavigateToPath } = useAppNavigate();
    const { heads } = useContext(HeadsContext);

    const [isLoadingEntrySetDetails, setIsLoadingEntrySetDetails] = useState(false);
    const [entrySetDate, setEntrySetDate] = useState(new Date());
    const [originalEntrySetDataRows, setOriginalEntrySetDataRows] = useState([]);
    const [originalEntrySetBalance, setOriginalEntrySetBalance] = useState(0);
    const [errorFetchingEntrySetDetails, setErrorFetchingEntrySetDetails] = useState(null);
    const [editableEntrySetDataRows, setEditableEntrySetDataRows] = useState([]);
    const [editableEntrySetBalance, setEditableEntrySetBalance] = useState(0);
    const [pendingFocus, setPendingFocus] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [clickedEntryRow, setClickedEntryRow] = useState(null);
    const [isUpdatingEntrySetDetails, setIsUpdatingEntrySetDetails] = useState(false);
    const [inputFieldErrorsMap, setInputFieldErrorsMap] = useState({});
    const [errorUpdatingEntrySetDetails, setErrorUpdatingEntrySetDetails] = useState(null);
    const entryInputFieldRefs = useRef([]);

    async function fetchEntrySetDetails(manual = false) {
        setErrorFetchingEntrySetDetails(null);
        setIsLoadingEntrySetDetails(true);
        try {
            const res = await axiosPrivate.get(`/user/entrySet/${entrySetId}`);
            if (res?.data) {
                setEntrySetDate(res.data.date);
                setOriginalEntrySetBalance(res.data.balance);
                setEditableEntrySetBalance(res.data.balance);

                const formattedEntries = res.data.entries.map((entry) => ({
                    sno: entry.serial,
                    type: entry.type,
                    headId: entry.headId,
                    headName: heads.find((head) => head._id === entry.headId)?.name || "",
                    credit: entry.amount && entry.type === "credit" ? entry.amount : "",
                    debit: entry.amount && entry.type === "debit" ? entry.amount : "",
                }));

                const sortedEntries = formattedEntries.sort((a, b) => a.sno - b.sno);
                setOriginalEntrySetDataRows(sortedEntries);
                setEditableEntrySetDataRows([...sortedEntries]);
            }
            if (manual) {
                toast.success("Refresh completed!", { position: "top-center", autoClose: 1000 });
            }
        } catch (error) {
            handleErrorFetchingEntrySetDetails(error);
            toast.error(
                `Error occurred while fetching entry set details: ${error?.response?.data?.error || error?.message || error}`,
                { autoClose: 5000, position: "top-center" }
            );
        } finally {
            setIsLoadingEntrySetDetails(false);
        }
    }

    function getFormattedEntrySetDate() {
        return formattedEntrySetDate;
    }

    function handleErrorFetchingEntrySetDetails(error) {
        if (!error?.response) {
            setErrorFetchingEntrySetDetails(
                "Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly."
            );
        } else if (error?.response?.data?.error) {
            setErrorFetchingEntrySetDetails(
                `Apologies for the inconvenience. There was an error while loading the details for entry set dated ${formattedEntrySetDate}. ${error?.response?.data?.error}`
            );
        } else {
            setErrorFetchingEntrySetDetails(
                `Apologies for the inconvenience. There was some error while loading the details for entry set ${formattedEntrySetDate}. Please try again after some time.`
            );
        }
    }

    function handleFocusCell(rowIdx, colIdx) {
        const ref = entryInputFieldRefs.current[rowIdx]?.[colIdx];
        if (ref && ref.current) {
            ref.current.focus();
            ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    function insertRow(atIdx = editableEntrySetDataRows.length) {
        if (editableEntrySetDataRows.length >= MAX_ROWS) return;
        setEditableEntrySetDataRows((prev) => {
            const newRow = {
                id: uuidv4(),
                sno: prev.length + 1,
                type: "",
                head: "",
                headId: "",
                credit: "",
                debit: "",
            };
            const newRows = [...prev];
            newRows.splice(atIdx, 0, newRow);
            return newRows.map((r, i) => ({ ...r, sno: i + 1 }));
        });
    }

    function deleteRow(atIdx = editableEntrySetDataRows.length - 1) {
        if (editableEntrySetDataRows.length <= 1) return;
        setEditableEntrySetDataRows(
            editableEntrySetDataRows.filter((_, i) => i !== atIdx).map((r, i) => ({ ...r, sno: i + 1 }))
        );
    }

    function isCellDisabled(rowIdx, colIdx) {
        const row = editableEntrySetDataRows[rowIdx];
        if (!row) return true;
        const field = COLS[colIdx];
        if (field === "credit") return row.type !== "C";
        if (field === "debit") return row.type !== "D";
        return false;
    }

    function calculateCashEntryValues(rows) {
        const creditTotal = rows.reduce((sum, r) => sum + (parseFloat(r.credit) || 0), 0);
        const debitTotal = rows.reduce((sum, r) => sum + (parseFloat(r.debit) || 0), 0);
        const diff = formatAmountForFirstTimeInput(Math.abs(creditTotal - debitTotal));
        if (creditTotal > debitTotal) {
            return { type: "D", debit: diff, credit: "" };
        } else {
            return { type: "C", debit: "", credit: diff };
        }
    }

    function findFirstEmptyRowIndex() {
        const idx = editableEntrySetDataRows.findIndex(row => {
            const { type, head, debit, credit } = row;
            return (
                (!type || type === "") &&
                (!head || head === "") &&
                (!credit || credit === "") &&
                (!debit || debit === "")
            );
        });
        return idx === -1 ? editableEntrySetDataRows.length : idx;
    }

    function handleModifyFieldValue(rowIdx, field, value) {
        const rowId = editableEntrySetDataRows[rowIdx].id;
        setInputFieldErrorsMap((prevErrorsMap) => {
            const txnErrors = prevErrorsMap[rowId];
            if (!txnErrors || !txnErrors[field]) return prevErrorsMap;
            const { [field]: _, ...remainingErrors } = txnErrors;
            const newErrorsMap = { ...prevErrorsMap };
            if (Object.keys(remainingErrors).length === 0) {
                delete newErrorsMap[rowId];
            } else {
                newErrorsMap[rowId] = remainingErrors;
            }
            return newErrorsMap;
        });

        let newValue = value;
        if (field === "head") {
            if (value?.trim()?.toLowerCase() === "cash") {
                const status = handleInsertCashEntryRow(rowIdx);
                if (!status) return;
            }
            const matchedHead = heads.find(h => h.name === value);
            setEditableEntrySetDataRows((prev) =>
                prev.map((row, i) =>
                    i === rowIdx ? { ...row, head: value, headId: matchedHead ? matchedHead._id : null } : row
                )
            );
            return;
        }
        if (field === "type") {
            const rawValue = value.toUpperCase();
            if (rawValue === "" || rawValue.endsWith(" ")) {
                newValue = "";
            } else if (rawValue === "C" || rawValue === "D") {
                newValue = rawValue;
            } else if (rawValue === "CD") {
                newValue = "D";
            } else if (rawValue === "DC") {
                newValue = "C";
            } else {
                return;
            }
        }
        if (field === "credit" || field === "debit") {
            const rawValue = value.replace(/,/g, "");
            const isValid = /^(\d+)?(\.\d{0,2})?$/.test(rawValue);
            const numericValue = parseFloat(rawValue);
            if (
                (isValid || rawValue === "") &&
                (rawValue === "" || numericValue <= Number.MAX_SAFE_INTEGER)
            ) {
                newValue = rawValue;
            } else {
                return;
            }
        }
        setEditableEntrySetDataRows((prev) =>
            prev.map((row, i) => (i === rowIdx ? { ...row, [field]: newValue } : row))
        );
    }

    function handleKeyPress(e) {
        const active = document.activeElement;
        let currentRow = -1;
        let currentCol = -1;
        editableEntrySetDataRows.forEach((_, r) => {
            COLS.forEach((_, c) => {
                if (entryInputFieldRefs.current[r]?.[c]?.current === active) {
                    currentRow = r;
                    currentCol = c;
                }
            });
        });
        if (currentRow === -1 || currentCol === -1) return;
        if (e.key === "Enter") {
            if (COLS[currentCol] === "head") {
                const currentValue = editableEntrySetDataRows[currentRow].head.trim().toLowerCase();
                if (currentValue === "cash") {
                    const status = handleInsertCashEntryRow(currentRow);
                    if (!status) return;
                }
            }
        }
        if (e.key === "Tab" || e.key === "Enter") {
            e.preventDefault();
            let nextRow = currentRow;
            let nextCol = currentCol;
            while (true) {
                nextCol++;
                if (nextCol >= COLS.length) {
                    nextCol = 0;
                    nextRow++;
                }
                if (nextRow >= editableEntrySetDataRows.length) {
                    handleInsertEntryRow();
                    setPendingFocus({ row: nextRow, col: 0 });
                    return;
                }
                if (!isCellDisabled(nextRow, nextCol)) {
                    handleFocusCell(nextRow, nextCol);
                    return;
                }
            }
        }
        if (e.key === "ArrowRight" && e.shiftKey) {
            e.preventDefault();
            let nextRow = currentRow;
            let nextCol = currentCol;
            while (true) {
                nextCol++;
                if (nextCol >= COLS.length) {
                    nextCol = 0;
                    nextRow++;
                }
                if (nextRow >= entrySetDataRows.length) return;
                if (!isCellDisabled(nextRow, nextCol)) {
                    handleFocusCell(nextRow, nextCol);
                    return;
                }
            }
        }
        if (e.key === "ArrowLeft" && e.shiftKey) {
            e.preventDefault();
            let prevRow = currentRow;
            let prevCol = currentCol;
            while (true) {
                prevCol--;
                if (prevCol < 0) {
                    prevCol = COLS.length - 1;
                    prevRow--;
                }
                if (prevRow < 0) return;
                if (!isCellDisabled(prevRow, prevCol)) {
                    handleFocusCell(prevRow, prevCol);
                    return;
                }
            }
        }
        if (e.key === "ArrowUp" && e.shiftKey && currentCol !== COLS.indexOf("head")) {
            e.preventDefault();
            let prevRow = currentRow - 1;
            while (prevRow >= 0) {
                if (!isCellDisabled(prevRow, currentCol)) {
                    handleFocusCell(prevRow, currentCol);
                    return;
                }
                prevRow--;
            }
        }
        if (e.key === "ArrowDown" && e.shiftKey && currentCol !== COLS.indexOf("head")) {
            e.preventDefault();
            let nextRow = currentRow + 1;
            while (nextRow < editableEntrySetDataRows.length) {
                if (!isCellDisabled(nextRow, currentCol)) {
                    handleFocusCell(nextRow, currentCol);
                    return;
                }
                nextRow++;
            }
        }
        if ((e.key === "+" || e.key === "=") && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            if (currentRow !== -1) {
                handleInsertEntryRow(currentRow + 1);
                setPendingFocus({ row: currentRow + 1, col: 0 });
            }
        }
        if ((e.key === "+" || e.key === "=") && e.shiftKey) {
            e.preventDefault();
            if (currentRow !== -1) {
                handleInsertEntryRow(currentRow);
                setPendingFocus({ row: currentRow, col: 0 });
            }
        }
    }

    function handleContextMenuSetup(e, rowIdx) {
        e.preventDefault();
        setClickedEntryRow(rowIdx);
        setMenuPosition({ x: e.clientX, y: e.clientY });
    }

    function handleInsertEntryRow(atIdx) {
        insertRow(atIdx);
        setPendingFocus({ row: atIdx, col: 0 });
    }

    function handleDeleteEntryRow(atIdx) {
        deleteRow(atIdx);
        setPendingFocus({ row: atIdx, col: 0 });
    }

    function handleInsertCashEntryRow(rowIdx) {
        const alreadyExists = editableEntrySetDataRows.some((r, idx) =>
            idx !== rowIdx && r.head.trim().toLowerCase() === "cash"
        );
        if (alreadyExists) {
            toast.error("Cash entry already exists", { position: "top-center", autoClose: 5000 });
            return false;
        }
        const otherRows = editableEntrySetDataRows.filter((_, idx) => idx !== rowIdx);
        const { type, debit, credit } = calculateCashEntryValues(otherRows);
        const cashHead = heads.find(h => h.name?.trim()?.toLowerCase() === "cash");
        const cashHeadId = cashHead ? cashHead._id : null;
        if (rowIdx < editableEntrySetDataRows.length) {
            setEditableEntrySetDataRows(prev =>
                prev.map((row, idx) =>
                    idx === rowIdx ? { ...row, head: "CASH", headId: cashHeadId, type, debit, credit } : row
                )
            );
        } else {
            setEditableEntrySetDataRows((prev) => [
                ...prev,
                {
                    sno: rowIdx + 1,
                    type,
                    head: "CASH",
                    headId: cashHeadId,
                    debit,
                    credit
                }
            ]);
        }
        setPendingFocus({ row: rowIdx, col: 1 });
        return true;
    }

    function handleClearEntryRows() {
        setEditableEntrySetDataRows(prev => prev.map((_, i) => ({
            sno: i + 1,
            type: "",
            head: "",
            headId: "",
            credit: "",
            debit: "",
        })));
        setPendingFocus({ row: 0, col: 0 });
        setInputFieldErrorsMap({});
        setErrorUpdatingEntrySetDetails(null);
    }

    function getNonEmptyEntryRows() {
        return editableEntrySetDataRows.filter(row =>
            row.head !== "" || row.type !== "" || row.credit !== "" || row.debit !== ""
        );
    }

    function validateAmountField(value) {
        if (value === "") {
            return "amount is required.";
        }
        const amount = parseFloat(value);
        if (isNaN(amount) || amount <= 0) {
            return "amount must be a positive number.";
        }
        if (amount > 1e9) {
            return "amount cannot exceed 100 crore.";
        }
        return null;
    }

    function validateInputForUpdatingEntrySetData(rows = editableEntrySetDataRows) {
        const errorsMap = {};

        // Entry data rows validation
        const serials = [];
        rows.forEach((row) => {
            const rowErrors = {};
            const { id, sno, type, head, credit, debit } = row;

            if (!head.trim()) rowErrors.head = "Head is required.";
            if (!type.trim()) rowErrors.type = "Type is required.";
            const upperType = type.trim().toUpperCase();
            if (type && !(upperType === "C" || upperType === "D")) {
                rowErrors.type = "Type must be C or D.";
            }
            if (upperType === "C") {
                const amountError = validateAmountField(credit);
                if (amountError) {
                    rowErrors.credit = `Credit ${amountError}`;
                }
            }
            if (upperType === "D") {
                const amountError = validateAmountField(debit);
                if (amountError) {
                    rowErrors.debit = `Debit ${amountError}`;
                }
            }
            serials.push(sno);

            if (Object.keys(rowErrors).length > 0) {
                errorsMap[id] = rowErrors;
            }
        });

        setInputFieldErrorsMap(errorsMap);
        if (Object.keys(errorsMap).length > 0) {
            setErrorUpdatingEntrySetDetails("Some of these rows have errors. Please review and correct all highlighted fields before updating the entry set.");
            return false;
        }

        // Check duplicate/missing serials
        const uniqueSerials = new Set(serials);
        if (uniqueSerials.size !== rows.length) {
            setErrorUpdatingEntrySetDetails("Duplicate serial numbers found.");
            return false;
        }
        for (let i = 1; i <= rows.length; i++) {
            if (!uniqueSerials.has(i)) {
                setErrorUpdatingEntrySetDetails(`Missing serial number: ${i}`);
                return false;
            }
        }

        // Must contain CASH entry
        const hasCash = rows.some(r => r.head.trim().toLowerCase() === "cash");
        if (!hasCash) {
            setErrorUpdatingEntrySetDetails("At least one cash entry is required.");
            return false;
        }

        // Validate totals
        const totalCredit = rows.reduce((sum, r) => sum + (parseFloat(r.credit) || 0), 0);
        const totalDebit = rows.reduce((sum, r) => sum + (parseFloat(r.debit) || 0), 0);
        if (Math.abs(totalCredit - totalDebit) > 0.001) {
            setErrorUpdatingEntrySetDetails("Total credits and debits must be equal.");
            return false;
        }

        return true;
    }

    async function handleUpdateEntrySetDetails() {
        const nonEmptyRows = getNonEmptyEntryRows();
        if (!nonEmptyRows || nonEmptyRows.length === 0) {
            setErrorUpdatingEntrySetDetails("Must have at least one entry row.");
            return;
        }
        setInputFieldErrorsMap({});
        setErrorUpdatingEntrySetDetails(null);

        const isValid = validateInputForUpdatingEntrySetData(nonEmptyRows);
        if (!isValid) return;

        setIsUpdatingEntrySetDetails(true);
        try {
            const payload = {
                entries: nonEmptyRows.map(r => ({
                    serial: r.sno,
                    type: r.type === "C" ? "credit" : "debit",
                    headId: r.headId,
                    amount: parseFloat(r.credit || r.debit)
                })),
                balance: editableEntrySetBalance
            };
            await axiosPrivate.put(`/user/entrySet/${entrySetId}`, JSON.stringify(payload));
            toast.success("Entry set saved successfully!", { position: "top-center", autoClose: 5000 });
            handleClearEntryRows();
            handleNavigateToPath("/entry-sets");
        } catch (error) {
            handleErrorUpdatingEntrySetDetails(error);
        } finally {
            setIsUpdatingEntrySetDetails(false);
        }
    }

    function handleErrorUpdatingEntrySetDetails(error) {
        if (!error?.response) {
            setErrorSavingEntrySet("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setErrorSavingEntrySet(`Apologies for the inconvenience. There was an error while updating the entry set. ${error?.response?.data?.error}`);
        } else {
            setErrorSavingEntrySet("Apologies for the inconvenience. There was some error while updating the entry set. Please try again after some time.");
        }
    }

    function handleResetErrorUpdatingEntrySetDetails() {
        setErrorUpdatingEntrySetDetails(null);
    }

    function getEntryRowFieldError(id, fieldName) {
        return inputFieldErrorsMap[id]?.[fieldName] || null;
    }

    useEffect(() => {
        if (!heads) return;
        fetchEntrySetDetails();
        // eslint-disable-next-line
    }, [heads]);

    useEffect(() => {
        entryInputFieldRefs.current = editableEntrySetDataRows.map(
            (_, rowIdx) => entryInputFieldRefs.current[rowIdx] || COLS.map(() => createRef())
        );
    }, [editableEntrySetDataRows]);

    useLayoutEffect(() => {
        if (pendingFocus) {
            const { row, col } = pendingFocus;
            const ref = entryInputFieldRefs.current[row]?.[col];
            if (ref && ref.current) {
                ref.current.focus();
                ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            setPendingFocus(null);
        }
    }, [editableEntrySetDataRows, pendingFocus]);


    const currentContextValue = {
        isLoadingEntrySetDetails,
        entrySetDate,
        errorFetchingEntrySetDetails,
        editableEntrySetDataRows,
        editableEntrySetBalance,
        menuPosition,
        clickedEntryRow,
        entryInputFieldRefs,
        isUpdatingEntrySetDetails,
        inputFieldErrorsMap,
        errorUpdatingEntrySetDetails,
        fetchEntrySetDetails,
        getFormattedEntrySetDate,
        setEditableEntrySetBalance,
        findFirstEmptyRowIndex,
        handleInsertEntryRow,
        handleDeleteEntryRow,
        handleInsertCashEntryRow,
        handleModifyFieldValue,
        handleKeyPress,
        handleContextMenuSetup,
        handleClearEntryRows,
        handleUpdateEntrySetDetails,
        handleResetErrorUpdatingEntrySetDetails,
        getEntryRowFieldError,
    };

    return (
        <EditEntrySetContext.Provider value={currentContextValue}>
            {children}
        </EditEntrySetContext.Provider>
    );
};

export default EditEntrySetContext;
