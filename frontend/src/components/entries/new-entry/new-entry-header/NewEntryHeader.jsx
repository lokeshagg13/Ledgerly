import { useState } from "react";
import useAuth from "../../../../store/hooks/useAuth";
import FormDatePicker from "../../../ui/elements/FormDatePicker";

function NewEntryHeader() {
  const { auth } = useAuth();
  const [entryDate, setEntryDate] = useState(null);

  return (
    <div className="new-entry-header">
      <div className="new-entry-section">
        <label className="new-entry-label">Name:</label>
        <div className="new-entry-value">{auth?.name || "Unknown"}</div>
      </div>
      <div className="new-entry-section">
        <label className="new-entry-label">Date:</label>
        <div className="new-entry-date">
          <FormDatePicker
            name="date"
            id="entryDate"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            maxDate={new Date()}
          />
        </div>
      </div>
    </div>
  );
}

export default NewEntryHeader;
