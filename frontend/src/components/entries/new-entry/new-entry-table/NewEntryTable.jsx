import {
  useContext,
  useState,
  useMemo,
  useRef,
  useEffect,
  createRef,
  useLayoutEffect,
} from "react";
import { Button, Form } from "react-bootstrap";
import AddCircleIcon from "../../../ui/icons/AddCircleIcon";
import SearchInput from "../../../ui/elements/SearchInput";
import HeadsContext from "../../../../store/context/headsContext";
import {
  formatAmountForDisplay,
  formatAmountWithCommas,
} from "../../../../utils/formatUtils";

const DEFAULT_ROWS = 20;
const COLS = ["type", "head", "debit", "credit"];

function NewEntryTable() {
  const [rows, setRows] = useState(
    Array.from({ length: DEFAULT_ROWS }, (_, i) => ({
      sno: i + 1,
      type: "",
      head: "",
      debit: "",
      credit: "",
    }))
  );
  const [pendingFocus, setPendingFocus] = useState(null);

  const { heads } = useContext(HeadsContext);
  const headNames = heads.map((head) => head.name);

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = rows.map(
      (_, rowIdx) => inputRefs.current[rowIdx] || COLS.map(() => createRef())
    );
  }, [rows]);

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
  }, [rows, pendingFocus]);

  const addRow = (atIndex = rows.length) => {
    console.log(atIndex);
    console.log(rows);
    setRows((prev) => {
      const newRow = {
        sno: prev.length + 1,
        type: "",
        head: "",
        debit: "",
        credit: "",
      };
      const newRows = [...prev];
      newRows.splice(atIndex, 0, newRow);
      return newRows.map((r, i) => ({ ...r, sno: i + 1 }));
    });
  };

  const handleChange = (index, field, value) => {
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

    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: newValue } : row))
    );
  };

  const totalDebit = useMemo(
    () => rows.reduce((sum, row) => sum + (parseFloat(row.debit) || 0), 0),
    [rows]
  );
  const totalCredit = useMemo(
    () => rows.reduce((sum, row) => sum + (parseFloat(row.credit) || 0), 0),
    [rows]
  );
  const balance = totalDebit - totalCredit;

  const focusCell = (rowIdx, colIdx) => {
    const ref = inputRefs.current[rowIdx]?.[colIdx];
    console.log(ref);
    console.log(inputRefs.current);
    if (ref && ref.current) {
      ref.current.focus();
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleKeyDown = (e) => {
    console.log(e.key);
    const active = document.activeElement;
    let currentRow = -1;
    let currentCol = -1;

    // Find current focused cell
    rows.forEach((_, r) => {
      COLS.forEach((_, c) => {
        if (inputRefs.current[r]?.[c]?.current === active) {
          currentRow = r;
          currentCol = c;
        }
      });
    });

    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      console.log(currentRow, currentCol);

      let nextRow = currentRow;
      let nextCol = currentCol + 1;

      if (nextCol >= COLS.length) {
        nextCol = 0;
        nextRow++;
      }

      console.log(nextRow, nextCol);
      console.log(rows.length);

      if (nextRow >= rows.length) {
        addRow();
        setPendingFocus({ row: nextRow, col: 0 });
      } else {
        focusCell(nextRow, nextCol);
      }
    }

    if ((e.key === "+" || e.key === "=") && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (currentRow !== -1) {
        addRow(currentRow + 1);
        setPendingFocus({ row: currentRow + 1, col: 0 });
      }
    }

    if ((e.key === "+" || e.key === "=") && e.shiftKey) {
      e.preventDefault();
      if (currentRow !== -1) {
        addRow(currentRow);
        setPendingFocus({ row: currentRow, col: 0 });
      }
    }
  };

  return (
    <div
      className="new-entry-table-wrapper"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <table className="table table-bordered new-entry-table">
        <thead className="table-warning">
          <tr>
            <th className="col-sno"></th>
            <th className="col-type">Type</th>
            <th className="col-head">Head</th>
            <th className="col-debit">Debit</th>
            <th className="col-credit">Credit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.sno}</td>
              <td>
                <Form.Control
                  ref={inputRefs.current[idx]?.[0]}
                  id={`entryType${idx}`}
                  value={row.type}
                  onChange={(e) => handleChange(idx, "type", e.target.value)}
                  autoComplete="off"
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <SearchInput
                  id={`entryHead${idx}`}
                  ref={inputRefs.current[idx]?.[1]}
                  options={headNames}
                  value={row.head}
                  onChange={(_, newValue) =>
                    handleChange(idx, "head", newValue || "")
                  }
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <Form.Control
                  ref={inputRefs.current[idx]?.[2]}
                  type="text"
                  id={`entryDebitAmount${idx}`}
                  value={
                    row.debit !== "" ? formatAmountWithCommas(row.debit) : ""
                  }
                  onChange={(e) => handleChange(idx, "debit", e.target.value)}
                  autoComplete="off"
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <Form.Control
                  ref={inputRefs.current[idx]?.[3]}
                  type="text"
                  id={`entryCreditAmount${idx}`}
                  value={
                    row.credit !== "" ? formatAmountWithCommas(row.credit) : ""
                  }
                  onChange={(e) => handleChange(idx, "credit", e.target.value)}
                  autoComplete="off"
                  className="form-control form-control-sm"
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="table-warning footer-row">
            <td></td>
            <td></td>
            <td>
              <strong>Balance: {formatAmountForDisplay(balance)}</strong>
            </td>
            <td>
              <strong>{formatAmountForDisplay(totalDebit)}</strong>
            </td>
            <td>
              <strong>{formatAmountForDisplay(totalCredit)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="add-row-container">
        <Button variant="outline-primary" size="sm" onClick={() => addRow()}>
          <AddCircleIcon /> Add Row
        </Button>
      </div>
    </div>
  );
}

export default NewEntryTable;
