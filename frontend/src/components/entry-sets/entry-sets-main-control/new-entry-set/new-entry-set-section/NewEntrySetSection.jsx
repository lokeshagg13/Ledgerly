import { useContext, useEffect } from "react";

import NewEntrySetTable from "./new-entry-set-table/NewEntrySetTable";
import NewEntrySetHeader from "./new-entry-set-header/NewEntrySetHeader";
import NewEntrySetControl from "./new-entry-set-control/NewEntrySetControl";
import NewEntrySetContext from "../../../../../store/context/newEntrySetContext";

function NewEntrySetSection() {
  const { errorSavingEntrySet, handleResetErrorSavingEntrySet } =
    useContext(NewEntrySetContext);

  useEffect(() => {
    if (errorSavingEntrySet) {
      const timeout = setTimeout(() => {
        handleResetErrorSavingEntrySet();
      }, 150000);
      return () => clearTimeout(timeout);
    }
  }, [errorSavingEntrySet, handleResetErrorSavingEntrySet]);

  return (
    <>
      <NewEntrySetHeader />
      <div className="new-entry-set-table-error-section">
        <NewEntrySetTable />
        {errorSavingEntrySet && (
          <div className="error-message" role="alert" aria-live="polite">
            {errorSavingEntrySet}
          </div>
        )}
      </div>
      <NewEntrySetControl />
    </>
  );
}

export default NewEntrySetSection;
