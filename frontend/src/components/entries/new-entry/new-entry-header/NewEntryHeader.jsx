import useAuth from "../../../../store/hooks/useAuth";
import DatePicker from "../../../ui/elements/FormDatePicker";

function NewEntryHeader() {
  const { auth } = useAuth();

  return (
    <div className="new-entry-header">
      <div className="new-entry-section">
        <label className="new-entry-label">Name:</label>
        <div className="new-entry-value">{auth?.name || "Unknown"}</div>
      </div>
      <div className="new-entry-section">
        <label className="new-entry-label">Date:</label>
        <div className="new-entry-date"><DatePicker /></div>
      </div>
    </div>
  );
}

export default NewEntryHeader;
