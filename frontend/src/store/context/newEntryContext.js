import { createContext, createRef, useRef, useEffect, useLayoutEffect, useState } from "react";
import { formatAmountForFirstTimeInput } from "../../utils/formatUtils";
import { toast } from "react-toastify";

const DEFAULT_ROWS = 20;
const MAX_ROWS = 1000;
const COLS = ["type", "head", "credit", "debit"];   // will also affect ref order in row component of new entry table

const NewEntryContext = createContext({
    entryDate: null,
    entryDataRows: [],
    menuPos: null,
    clickedRow: null,
    inputRefs: [],
    setEntryDate: (newVal) => { },
    findFirstEmptyRowIndex: () => { },
    handleInsertRow: (atIdx) => { },
    handleDeleteRow: (atIdx) => { },
    handleInsertCashEntryRow: (rowIdx) => { },
    handleModifyFieldValue: (rowIdx, field, value) => { },
    handleKeyPress: (e) => { },
    handleContextMenuSetup: (e, rowIdx) => { },
    handleClearRows: () => { },
});

export const NewEntryContextProvider = ({ children }) => {
    const [entryDate, setEntryDate] = useState(new Date());
    const [entryDataRows, setEntryDataRows] = useState(Array.from({ length: DEFAULT_ROWS }, (_, i) => ({
        sno: i + 1,
        type: "",
        head: "",
        credit: "",
        debit: "",
    })));
    const [pendingFocus, setPendingFocus] = useState(null);
    const [menuPos, setMenuPos] = useState(null);
    const [clickedRow, setClickedRow] = useState(null);
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
                sno: prev.length + 1,
                type: "",
                head: "",
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
        let newValue = value;
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
        if (field === "head" && value?.trim()?.toLowerCase() === "cash") {
            const status = handleInsertCashEntryRow(rowIdx);
            if (!status) return;
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
        if (e.key === "ArrowRight") {
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
        if (e.key === "ArrowLeft") {
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
        if (e.key === "ArrowUp" && currentCol !== COLS.indexOf("head")) {
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
        if (e.key === "ArrowDown" && currentCol !== COLS.indexOf("head")) {
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
        if (rowIdx < entryDataRows.length) {
            setEntryDataRows(prev =>
                prev.map((row, idx) =>
                    idx === rowIdx ? { ...row, head: "CASH", type, debit, credit } : row
                )
            );
        } else {
            setEntryDataRows((prev) => [
                ...prev,
                {
                    sno: rowIdx + 1,
                    type,
                    head: "CASH",
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
            credit: "",
            debit: "",
        })));
        setPendingFocus({ row: 0, col: 0 });
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
        setEntryDate,
        findFirstEmptyRowIndex,
        handleInsertRow,
        handleDeleteRow,
        handleInsertCashEntryRow,
        handleModifyFieldValue,
        handleKeyPress,
        handleContextMenuSetup,
        handleClearRows
    };

    return (
        <NewEntryContext.Provider value={currentContextValue}>
            {children}
        </NewEntryContext.Provider>
    );
};

export default NewEntryContext;

