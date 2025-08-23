import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import AddCircleIcon from "../../../ui/icons/AddCircleIcon";
import SearchInput from "../../../ui/elements/SearchInput";
import HeadsContext from "../../../../store/context/headsContext";

const DEFAULT_ROWS = 20;

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

  const { heads } = useContext(HeadsContext);
  const headNames = heads.map((head) => head.name);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { sno: prev.length + 1, type: "", head: "", debit: "", credit: "" },
    ]);
  };

  const handleChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  return (
    <div className="new-entry-table-wrapper">
      <table className="table table-bordered table-sm new-entry-table">
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
                <input
                  className="form-control form-control-sm"
                  value={row.type}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    if (val === "" || val.endsWith(" ")) {
                      handleChange(idx, "type", "");
                    } else if (val === "C" || val === "D") {
                      handleChange(idx, "type", val);
                    } else if (val === "CD") {
                      handleChange(idx, "type", "D");
                    } else if (val === "DC") {
                      handleChange(idx, "type", "C");
                    }
                  }}
                />
              </td>
              <td>
                <SearchInput
                  id={`headInput${idx}`}
                  className="form-control form-control-sm"
                  value={row.head}
                  options={headNames}
                  onChange={(e, newValue) =>
                    handleChange(idx, "head", newValue || "")
                  }
                />
              </td>
              <td>
                <input
                  className="form-control form-control-sm"
                  type="number"
                  value={row.debit}
                  onChange={(e) => handleChange(idx, "debit", e.target.value)}
                />
              </td>
              <td>
                <input
                  className="form-control form-control-sm"
                  type="number"
                  value={row.credit}
                  onChange={(e) => handleChange(idx, "credit", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-row-container">
        <Button variant="outline-primary" size="sm" onClick={addRow}>
          <AddCircleIcon /> Add Row
        </Button>
      </div>
    </div>
  );
}

export default NewEntryTable;
