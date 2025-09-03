import { useContext, useEffect } from "react";

import EditEntrySetControl from "./edit-entry-set-control/EditEntrySetControl";
import EditEntrySetTable from "./edit-entry-set-table/EditEntrySetTable";
import EditEntrySetHeader from "./edit-entry-set-header/EditEntrySetHeader";
import EditEntrySetContext from "../../../../../../store/context/editEntrySetContext";

function EditEntrySetSection() {
  const {
    errorUpdatingEntrySetDetails,
    handleResetErrorUpdatingEntrySetDetails,
  } = useContext(EditEntrySetContext);

  useEffect(() => {
    if (errorUpdatingEntrySetDetails) {
      const timeout = setTimeout(() => {
        handleResetErrorUpdatingEntrySetDetails();
      }, 150000);
      return () => clearTimeout(timeout);
    }
  }, [errorUpdatingEntrySetDetails, handleResetErrorUpdatingEntrySetDetails]);

  return (
    <>
      <EditEntrySetHeader />
      <div className="edit-entry-set-table-error-section">
        <EditEntrySetTable />
        {errorUpdatingEntrySetDetails && (
          <div className="error-message" role="alert" aria-live="polite">
            {errorUpdatingEntrySetDetails}
          </div>
        )}
      </div>
      <EditEntrySetControl />
    </>
  );
}

export default EditEntrySetSection;
