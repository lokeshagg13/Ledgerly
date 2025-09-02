import { useContext } from "react";
import useAuth from "../../../../../../store/hooks/useAuth";
import FormDatePicker from "../../../../../ui/elements/FormDatePicker";
import NewEntrySetContext from "../../../../../../store/context/newEntrySetContext";

function NewEntrySetHeader() {
  const { auth } = useAuth();

  const { entrySetDate, setEntrySetDate } = useContext(NewEntrySetContext);

  return (
    <div className="new-entry-set-header">
      <div className="new-entry-set-section">
        <label className="new-entry-set-label">Name:</label>
        <div className="new-entry-set-value">{auth?.name || "Unknown"}</div>
      </div>
      <div className="new-entry-set-section">
        <label className="new-entry-set-label">Date:</label>
        <div className="new-entry-set-date">
          <FormDatePicker
            name="date"
            id="entrySetDate"
            value={entrySetDate}
            onChange={(e) => setEntrySetDate(e.target.value)}
            maxDate={new Date()}
          />
        </div>
      </div>
    </div>
  );
}

export default NewEntrySetHeader;
