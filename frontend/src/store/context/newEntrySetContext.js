import { createContext, createRef, useRef, useEffect, useLayoutEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';

import { axiosPrivate } from "../../api/axios";
import { formatAmountForFirstTimeInput } from "../../utils/formatUtils";
import useAppNavigate from "../hooks/useAppNavigate";
import HeadsContext from "./headsContext";

const DEFAULT_ROWS = 20;
const MAX_ROWS = 1000;
const COLS = ["type", "headName", "credit", "debit"];   // will also affect ref order in row component of new entry set table

const NewEntrySetContext = createContext({
    entrySetDate: null,
    entrySetDataRows: [],
    entrySetBalance: 0,
    menuPosition: null,
    clickedEntryRow: null,
    entryInputFieldRefs: [],
    isSavingNewEntrySet: false,
    inputFieldErrorsMap: {},
    errorSavingEntrySet: null,
    setEntrySetDate: (newVal) => { },
    setEntrySetBalance: (newVal) => { },
    findFirstEmptyRowIndex: () => { },
    handleInsertEntryRow: (atIdx) => { },
    handleDeleteEntryRow: (atIdx) => { },
    handleInsertCashEntryRow: (rowIdx) => { },
    handleModifyFieldValue: (rowIdx, field, value) => { },
    handleKeyPress: (e) => { },
    handleContextMenuSetup: (e, rowIdx) => { },
    handleClearEntryRows: () => { },
    handleSaveNewEntrySet: async () => { },
    handleResetErrorSavingEntrySet: () => { },
    getEntryRowFieldError: (rowIdx, fieldName) => { },
});

export const NewEntrySetContextProvider = ({ children }) => {
    const { handleNavigateToPath } = useAppNavigate();
    const { heads } = useContext(HeadsContext);
    const [entrySetDate, setEntrySetDate] = useState(new Date());
    const [entrySetDataRows, setEntrySetDataRows] = useState(Array.from({ length: DEFAULT_ROWS }, (_, i) => ({
        id: uuidv4(),
        sno: i + 1,
        type: "",
        headName: "",
        headId: "",
        credit: "",
        debit: "",
    })));
    const [entrySetBalance, setEntrySetBalance] = useState(0);
    const [pendingFocus, setPendingFocus] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [clickedEntryRow, setClickedEntryRow] = useState(null);
    const [isSavingNewEntrySet, setIsSavingNewEntrySet] = useState(false);
    const [inputFieldErrorsMap, setInputFieldErrorsMap] = useState({});
    const [errorSavingEntrySet, setErrorSavingEntrySet] = useState(null);

    const entryInputFieldRefs = useRef([]);

    function handleFocusCell(rowIdx, colIdx) {
        const ref = entryInputFieldRefs.current[rowIdx]?.[colIdx];
        if (ref && ref.current) {
            ref.current.focus();
            ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    function insertRow(atIdx = entrySetDataRows.length) {
        if (entrySetDataRows.length >= MAX_ROWS) return;
        setEntrySetDataRows((prev) => {
            const newRow = {
                id: uuidv4(),
                sno: prev.length + 1,
                type: "",
                headName: "",
                headId: "",
                credit: "",
                debit: "",
            };
            const newRows = [...prev];
            newRows.splice(atIdx, 0, newRow);
            return newRows.map((r, i) => ({ ...r, sno: i + 1 }));
        });
    }

    function deleteRow(atIdx = entrySetDataRows.length - 1) {
        if (entrySetDataRows.length <= 1) return;
        setEntrySetDataRows(
            entrySetDataRows.filter((_, i) => i !== atIdx).map((r, i) => ({ ...r, sno: i + 1 }))
        );
    }

    function isCellDisabled(rowIdx, colIdx) {
        const row = entrySetDataRows[rowIdx];
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
        const idx = entrySetDataRows.findIndex(row => {
            const { type, headName, debit, credit } = row;
            return (
                (!type || type === "") &&
                (!headName || headName === "") &&
                (!credit || credit === "") &&
                (!debit || debit === "")
            );
        });
        return idx === -1 ? entrySetDataRows.length : idx;
    }

    function handleModifyFieldValue(rowIdx, field, value) {
        const rowId = entrySetDataRows[rowIdx].id;
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
        if (field === "headName") {
            if (value?.trim()?.toLowerCase() === "cash") {
                const status = handleInsertCashEntryRow(rowIdx);
                if (!status) return;
            }
            const matchedHead = heads.find(h => h.name === value);
            setEntrySetDataRows((prev) =>
                prev.map((row, i) =>
                    i === rowIdx ? { ...row, headName: value, headId: matchedHead ? matchedHead._id : null } : row
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
        setEntrySetDataRows((prev) =>
            prev.map((row, i) => (i === rowIdx ? { ...row, [field]: newValue } : row))
        );
    }

    function handleKeyPress(e) {
        const active = document.activeElement;
        let currentRow = -1;
        let currentCol = -1;
        entrySetDataRows.forEach((_, r) => {
            COLS.forEach((_, c) => {
                if (entryInputFieldRefs.current[r]?.[c]?.current === active) {
                    currentRow = r;
                    currentCol = c;
                }
            });
        });
        if (currentRow === -1 || currentCol === -1) return;
        if (e.key === "Enter") {
            if (COLS[currentCol] === "headName") {
                const currentValue = entrySetDataRows[currentRow].headName.trim().toLowerCase();
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
                if (nextRow >= entrySetDataRows.length) {
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
        if (e.key === "ArrowUp" && e.shiftKey && currentCol !== COLS.indexOf("headName")) {
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
        if (e.key === "ArrowDown" && e.shiftKey && currentCol !== COLS.indexOf("headName")) {
            e.preventDefault();
            let nextRow = currentRow + 1;
            while (nextRow < entrySetDataRows.length) {
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
        const alreadyExists = entrySetDataRows.some((r, idx) =>
            idx !== rowIdx && r.headName.trim().toLowerCase() === "cash"
        );
        if (alreadyExists) {
            toast.error("Cash entry already exists", { position: "top-center", autoClose: 5000 });
            return false;
        }
        const otherRows = entrySetDataRows.filter((_, idx) => idx !== rowIdx);
        const { type, debit, credit } = calculateCashEntryValues(otherRows);
        const cashHead = heads.find(h => h.name?.trim()?.toLowerCase() === "cash");
        const cashHeadId = cashHead ? cashHead._id : null;
        if (rowIdx < entrySetDataRows.length) {
            setEntrySetDataRows(prev =>
                prev.map((row, idx) =>
                    idx === rowIdx ? { ...row, headName: "CASH", headId: cashHeadId, type, debit, credit } : row
                )
            );
        } else {
            setEntrySetDataRows((prev) => [
                ...prev,
                {
                    sno: rowIdx + 1,
                    type,
                    headName: "CASH",
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
        setEntrySetDataRows(prev => prev.map((_, i) => ({
            sno: i + 1,
            type: "",
            headName: "",
            headId: "",
            credit: "",
            debit: "",
        })));
        setPendingFocus({ row: 0, col: 0 });
        setInputFieldErrorsMap({});
        setErrorSavingEntrySet(null);
    }

    function getNonEmptyEntryRows() {
        return entrySetDataRows.filter(row =>
            row.headName !== "" || row.type !== "" || row.credit !== "" || row.debit !== ""
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

    function validateInputForSavingEntrySetData(rows = entrySetDataRows) {
        const errorsMap = {};

        // Entry date validation
        if (!entrySetDate) {
            setErrorSavingEntrySet("Entry set date is invalid");
            return false;
        }
        const selectedDate = new Date(entrySetDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        if (selectedDate > today) {
            setErrorSavingEntrySet("Entry set date must not exceed today.");
            return false;
        }

        // Entry data rows validation
        const serials = [];
        rows.forEach((row) => {
            const rowErrors = {};
            const { id, sno, type, headName, credit, debit } = row;

            if (!headName.trim()) rowErrors.headName = "Head is required.";
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
            setErrorSavingEntrySet("Some of these rows have errors. Please review and correct all highlighted fields before saving the entry set.");
            return false;
        }

        // Check duplicate/missing serials
        const uniqueSerials = new Set(serials);
        if (uniqueSerials.size !== rows.length) {
            setErrorSavingEntrySet("Duplicate serial numbers found.");
            return false;
        }
        for (let i = 1; i <= rows.length; i++) {
            if (!uniqueSerials.has(i)) {
                setErrorSavingEntrySet(`Missing serial number: ${i}`);
                return false;
            }
        }

        // Must contain CASH entry
        const hasCash = rows.some(r => r.headName.trim().toLowerCase() === "cash");
        if (!hasCash) {
            setErrorSavingEntrySet("At least one cash entry is required.");
            return false;
        }

        // Validate totals
        const totalCredit = rows.reduce((sum, r) => sum + (parseFloat(r.credit) || 0), 0);
        const totalDebit = rows.reduce((sum, r) => sum + (parseFloat(r.debit) || 0), 0);
        if (Math.abs(totalCredit - totalDebit) > 0.001) {
            setErrorSavingEntrySet("Total credits and debits must be equal.");
            return false;
        }

        return true;
    }

    async function handleSaveNewEntrySet() {
        const nonEmptyRows = getNonEmptyEntryRows();
        if (!nonEmptyRows || nonEmptyRows.length === 0) {
            setErrorSavingEntrySet("Must have at least one entry row.");
            return;
        }
        setInputFieldErrorsMap({});
        setErrorSavingEntrySet(null);

        const isValid = validateInputForSavingEntrySetData(nonEmptyRows);
        if (!isValid) return;

        setIsSavingNewEntrySet(true);
        try {
            const payload = {
                date: entrySetDate,
                entries: nonEmptyRows.map(r => ({
                    serial: r.sno,
                    type: r.type === "C" ? "credit" : "debit",
                    headId: r.headId,
                    amount: parseFloat(r.credit || r.debit)
                })),
                balance: entrySetBalance
            };
            await axiosPrivate.post("/user/entrySet", JSON.stringify(payload));
            toast.success("Entry set saved successfully!", { position: "top-center", autoClose: 5000 });
            handleClearEntryRows();
            handleNavigateToPath("/entry-sets");
        } catch (error) {
            handleErrorSavingEntrySet(error);
        } finally {
            setIsSavingNewEntrySet(false);
        }
    }

    function handleErrorSavingEntrySet(error) {
        if (!error?.response) {
            setErrorSavingEntrySet("Apologies for the inconvenience. We couldn’t connect to the server at the moment. This might be a temporary issue. Kindly try again shortly.");
        } else if (error?.response?.data?.error) {
            setErrorSavingEntrySet(`Apologies for the inconvenience. There was an error while saving the entry set. ${error?.response?.data?.error}`);
        } else {
            setErrorSavingEntrySet("Apologies for the inconvenience. There was some error while saving the entry set. Please try again after some time.");
        }
    }

    function handleResetErrorSavingEntrySet() {
        setErrorSavingEntrySet(null);
    }

    function getEntryRowFieldError(id, fieldName) {
        return inputFieldErrorsMap[id]?.[fieldName] || null;
    }

    useEffect(() => {
        entryInputFieldRefs.current = entrySetDataRows.map(
            (_, rowIdx) => entryInputFieldRefs.current[rowIdx] || COLS.map(() => createRef())
        );
    }, [entrySetDataRows]);

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
    }, [entrySetDataRows, pendingFocus]);


    const currentContextValue = {
        entrySetDate,
        entrySetDataRows,
        entrySetBalance,
        menuPosition,
        clickedEntryRow,
        entryInputFieldRefs,
        isSavingNewEntrySet,
        inputFieldErrorsMap,
        errorSavingEntrySet,
        setEntrySetDate,
        setEntrySetBalance,
        findFirstEmptyRowIndex,
        handleInsertEntryRow,
        handleDeleteEntryRow,
        handleInsertCashEntryRow,
        handleModifyFieldValue,
        handleKeyPress,
        handleContextMenuSetup,
        handleClearEntryRows,
        handleSaveNewEntrySet,
        handleResetErrorSavingEntrySet,
        getEntryRowFieldError,
    };

    return (
        <NewEntrySetContext.Provider value={currentContextValue}>
            {children}
        </NewEntrySetContext.Provider>
    );
};

export default NewEntrySetContext;

