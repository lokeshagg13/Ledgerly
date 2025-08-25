import NewEntryTable from "./new-entry-table/NewEntryTable";
import NewEntryHeader from "./new-entry-header/NewEntryHeader";
import NewEntryControl from "./new-entry-control/NewEntryControl";
import { useContext, useEffect } from "react";
import NewEntryContext from "../../../../../store/context/newEntryContext";

function NewEntrySection() {
  const { errorSavingEntry, handleResetErrorSavingEntry } =
    useContext(NewEntryContext);

  useEffect(() => {
    if (errorSavingEntry) {
      const timeout = setTimeout(() => {
        handleResetErrorSavingEntry();
      }, 15000);
      return () => clearTimeout(timeout);
    }
  }, [errorSavingEntry, handleResetErrorSavingEntry]);

  return (
    <>
      <NewEntryHeader />
      <NewEntryTable />
      {errorSavingEntry && (
        <div className="error-message" role="alert" aria-live="polite">
          {errorSavingEntry}
        </div>
      )}
      <NewEntryControl />
    </>
  );
}

export default NewEntrySection;
