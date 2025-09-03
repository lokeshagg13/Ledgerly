import { useContext } from "react";
import useAuth from "../../../../../../../store/hooks/useAuth";
import ViewEntrySetContext from "../../../../../../../store/context/viewEntrySetContext";

function ViewEntrySetHeader() {
  const { auth } = useAuth();

  const { formattedEntrySetDate } = useContext(ViewEntrySetContext);

  return (
    <div className="view-entry-set-header">
      <div className="view-entry-set-section">
        <label className="view-entry-set-label">Name:</label>
        <div className="view-entry-set-value">{auth?.name || "Unknown"}</div>
      </div>
      <div className="view-entry-set-section">
        <label className="view-entry-set-label">Date:</label>
        <div className="view-entry-set-value">
          {formattedEntrySetDate || "None"}
        </div>
      </div>
    </div>
  );
}

export default ViewEntrySetHeader;
