import { createContext, createRef, useRef, useEffect, useLayoutEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';

import { axiosPrivate } from "../../api/axios";
import { formatAmountForFirstTimeInput } from "../../utils/formatUtils";
import useAppNavigate from "../hooks/useAppNavigate";
import HeadsContext from "./headsContext";

const DEFAULT_ROWS = 20;
const MAX_ROWS = 1000;
const COLS = ["type", "head", "credit", "debit"];   // will also affect ref order in row component of new entry table

const NewEntryContext = createContext({
    entryDate: null,
    entryDataRows: [],
    menuPos: null,
    clickedRow: null,
    inputRefs: [],
    isSavingNewEntry: false,
    inputFieldErrorsMap: {},
    errorSavingEntry: null,
    setEntryDate: (newVal) => { },
    findFirstEmptyRowIndex: () => { },
    handleInsertRow: (atIdx) => { },
    handleDeleteRow: (atIdx) => { },
    handleInsertCashEntryRow: (rowIdx) => { },
    handleModifyFieldValue: (rowIdx, field, value) => { },
    handleKeyPress: (e) => { },
    handleContextMenuSetup: (e, rowIdx) => { },
    handleClearRows: () => { },
    handleSaveNewEntry: async () => { },
    handleResetErrorSavingEntry: () => { },
    getEntryFieldError: (rowIdx, fieldName) => { },
});

export const NewEntryContextProvider = ({ children }) => {
    const { handleNavigateToPath } = useAppNavigate();
    const { heads } = useContext(HeadsContext);
    const [entryDate, setEntryDate] = useState(new Date());
    const [entryDataRows, setEntryDataRows] = useState(Array.from({ length: DEFAULT_ROWS }, (_, i) => ({
        id: uuidv4(),
        sno: i + 1,
        type: "",
        head: "",
        headId: "",
        credit: "",
        debit: "",
    })));
    const [pendingFocus, setPendingFocus] = useState(null);
    const [menuPos, setMenuPos] = useState(null);
    const [clickedRow, setClickedRow] = useState(null);
    const [isSavingNewEntry, setIsSavingNewEntry] = useState(false);
    const [inputFieldErrorsMap, setInputFieldErrorsMap] = useState({});
    const [errorSavingEntry, setErrorSavingEntry] = useState(null);

    const inputRefs = useRef([]);

    function handleFocusCell(rowIdx, colIdx) {
        const ref = inputRefs.current[rowIdx]?.[colIdx];
        if (ref && ref.current) {
            ref.current.focus();
            ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    function insertRow(atIdx = entryDataRows.length) {
        if (entryDataRows.length >= MAX_ROWS) return;
        setEntryDataRows((prev) => {
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

    function deleteRow(atIdx = entryDataRows.length - 1) {
        if (entryDataRows.length <= 1) return;
        setEntryDataRows(
            entryDataRows.filter((_, i) => i !== atIdx).map((r, i) => ({ ...r, sno: i + 1 }))
        );
    }

    function isCellDisabled(rowIdx, colIdx) {
        const row = entryDataRows[rowIdx];
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
        const idx = entryDataRows.findIndex(row => {
            const { type, head, debit, credit } = row;
            return (
                (!type || type === "") &&
                (!head || head === "") &&
                (!credit || credit === "") &&
                (!debit || debit === "")
            );
        });
        return idx === -1 ? entryDataRows.length : idx;
    }

    function handleModifyFieldValue(rowIdx, field, value) {
        const rowId = entryDataRows[rowIdx].id;
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
            setEntryDataRows((prev) =>
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
        setEntryDataRows((prev) =>
            prev.map((row, i) => (i === rowIdx ? { ...row, [field]: newValue } : row))
        );
    }

    function handleKeyPress(e) {
        const active = document.activeElement;
        let currentRow = -1;
        let currentCol = -1;
        entryDataRows.forEach((_, r) => {
            COLS.forEach((_, c) => {
                if (inputRefs.current[r]?.[c]?.current === active) {
                    currentRow = r;
                    currentCol = c;
                }
            });
        });
        if (currentRow === -1 || currentCol === -1) return;
        if (e.key === "Enter") {
            if (COLS[currentCol] === "head") {
                const currentValue = entryDataRows[currentRow].head.trim().toLowerCase();
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
                if (nextRow >= entryDataRows.length) {
                    handleInsertRow();
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
                if (nextRow >= entryDataRows.length) return;
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
            while (nextRow < entryDataRows.length) {
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
                handleInsertRow(currentRow + 1);
                setPendingFocus({ row: currentRow + 1, col: 0 });
            }
        }
        if ((e.key === "+" || e.key === "=") && e.shiftKey) {
            e.preventDefault();
            if (currentRow !== -1) {
                handleInsertRow(currentRow);
                setPendingFocus({ row: currentRow, col: 0 });
            }
        }
    }

    function handleContextMenuSetup(e, rowIdx) {
        e.preventDefault();
        setClickedRow(rowIdx);
        setMenuPos({ x: e.clientX, y: e.clientY });
    }

    function handleInsertRow(atIdx) {
        insertRow(atIdx);
        setPendingFocus({ row: atIdx, col: 0 });
    }

    function handleDeleteRow(atIdx) {
        deleteRow(atIdx);
        setPendingFocus({ row: atIdx, col: 0 });
    }

    function handleInsertCashEntryRow(rowIdx) {
        const alreadyExists = entryDataRows.some((r, idx) =>
            idx !== rowIdx && r.head.trim().toLowerCase() === "cash"
        );
        if (alreadyExists) {
            toast.error("Cash entry already exists", { position: "top-center", autoClose: 5000 });
            return false;
        }
        const otherRows = entryDataRows.filter((_, idx) => idx !== rowIdx);
        const { type, debit, credit } = calculateCashEntryValues(otherRows);
        const cashHead = heads.find(h => h.name?.trim()?.toLowerCase() === "cash");
        const cashHeadId = cashHead ? cashHead._id : null;
        if (rowIdx < entryDataRows.length) {
            setEntryDataRows(prev =>
                prev.map((row, idx) =>
                    idx === rowIdx ? { ...row, head: "CASH", headId: cashHeadId, type, debit, credit } : row
                )
            );
        } else {
            setEntryDataRows((prev) => [
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

    function handleClearRows() {
        setEntryDataRows(prev => prev.map((_, i) => ({
            sno: i + 1,
            type: "",
            head: "",
            headId: "",
            credit: "",
            debit: "",
        })));
        setPendingFocus({ row: 0, col: 0 });
        setInputFieldErrorsMap({});
        setErrorSavingEntry(null);
    }

    function getNonEmptyRows() {
        return entryDataRows.filter(row =>
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

    function validateInputForSavingEntryData(rows = entryDataRows) {
        const errorsMap = {};

        // Entry date validation
        if (!entryDate) {
            setErrorSavingEntry("Entry date is invalid");
            return false;
        }
        const selectedDate = new Date(entryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        if (selectedDate > today) {
            setErrorSavingEntry("Entry date must not exceed today.");
            return false;
        }

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
            setErrorSavingEntry("Some of these rows have errors. Please review and correct all highlighted fields before saving the entries.");
            return false;
        }

        // Check duplicate/missing serials
        const uniqueSerials = new Set(serials);
        if (uniqueSerials.size !== rows.length) {
            setErrorSavingEntry("Duplicate serial numbers found.");
            return false;
        }
        for (let i = 1; i <= rows.length; i++) {
            if (!uniqueSerials.has(i)) {
                setErrorSavingEntry(`Missing serial number: ${i}`);
                return false;
            }
        }

        // Must contain CASH entry
        const hasCash = rows.some(r => r.head.trim().toLowerCase() === "cash");
        if (!hasCash) {
            setErrorSavingEntry("At least one Cash entry is required.");
            return false;
        }

        // Validate totals
        const totalCredit = rows.reduce((sum, r) => sum + (parseFloat(r.credit) || 0), 0);
        const totalDebit = rows.reduce((sum, r) => sum + (parseFloat(r.debit) || 0), 0);
        if (Math.abs(totalCredit - totalDebit) > 0.001) {
            setErrorSavingEntry("Total credits and debits must be equal.");
            return false;
        }

        return true;
    }

    async function handleSaveNewEntry() {
        const nonEmptyRows = getNonEmptyRows();
        if (!nonEmptyRows || nonEmptyRows.length === 0) {
            setErrorSavingEntry("Must have at least one data entry row.");
            return;
        }
        setInputFieldErrorsMap({});
        setErrorSavingEntry(null);

        const isValid = validateInputForSavingEntryData(nonEmptyRows);
        if (!isValid) return;

        setIsSavingNewEntry(true);
        try {
            const payload = {
                date: entryDate,
                entries: nonEmptyRows.map(r => ({
                    serial: r.sno,
                    type: r.type === "C" ? "credit" : "debit",
                    headId: r.headId,
                    amount: parseFloat(r.credit || r.debit)
                }))
            };
            await axiosPrivate.post("/user/entries", JSON.stringify(payload));
            toast.success("Entry saved successfully!", { position: "top-center", autoClose: 5000 });
            handleClearRows();
            handleNavigateToPath("/entries");
        } catch (error) {
            handleErrorSavingEntry(error);
        } finally {
            setIsSavingNewEntry(false);
        }
    }

    function handleErrorSavingEntry(error) {
        if (!error?.response) {
            setErrorSavingEntry("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setErrorSavingEntry(`Apologies for the inconvenience. There was an error while saving these entries. ${error?.response?.data?.error}`);
        } else {
            setErrorSavingEntry("Apologies for the inconvenience. There was some error while saving these entries. Please try again after some time.");
        }
    }

    function handleResetErrorSavingEntry() {
        setErrorSavingEntry(null);
    }

    function getEntryFieldError(id, fieldName) {
        return inputFieldErrorsMap[id]?.[fieldName] || null;
    }

    useEffect(() => {
        inputRefs.current = entryDataRows.map(
            (_, rowIdx) => inputRefs.current[rowIdx] || COLS.map(() => createRef())
        );
    }, [entryDataRows]);

    useLayoutEffect(() => {
        if (pendingFocus) {
            const { row, col } = pendingFocus;
            const ref = inputRefs.current[row]?.[col];
            if (ref && ref.current) {
                ref.current.focus();
                ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            setPendingFocus(null);
        }
    }, [entryDataRows, pendingFocus]);


    const currentContextValue = {
        entryDate,
        entryDataRows,
        menuPos,
        clickedRow,
        inputRefs,
        isSavingNewEntry,
        inputFieldErrorsMap,
        errorSavingEntry,
        setEntryDate,
        findFirstEmptyRowIndex,
        handleInsertRow,
        handleDeleteRow,
        handleInsertCashEntryRow,
        handleModifyFieldValue,
        handleKeyPress,
        handleContextMenuSetup,
        handleClearRows,
        handleSaveNewEntry,
        handleResetErrorSavingEntry,
        getEntryFieldError,
    };

    return (
        <NewEntryContext.Provider value={currentContextValue}>
            {children}
        </NewEntryContext.Provider>
    );
};

export default NewEntryContext;

