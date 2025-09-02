import { useContext } from "react";
import useAuth from "../../../../../../store/hooks/useAuth";
import EditEntrySetContext from "../../../../../../store/context/editEntrySetContext";

function EditEntrySetHeader() {
  const { auth } = useAuth();

  const { formattedEntrySetDate } = useContext(EditEntrySetContext);

  return (
    <div className="edit-entry-set-header">
      <div className="edit-entry-set-section">
        <label className="edit-entry-set-label">Name:</label>
        <div className="edit-entry-set-value">{auth?.name || "Unknown"}</div>
      </div>
      <div className="edit-entry-set-section">
        <label className="edit-entry-set-label">Date:</label>
        <div className="edit-entry-set-value">
          {formattedEntrySetDate || "None"}
        </div>
      </div>
    </div>
  );
}

export default EditEntrySetHeader;
