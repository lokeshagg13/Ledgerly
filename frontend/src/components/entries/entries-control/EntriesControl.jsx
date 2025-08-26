import { useContext } from "react";
import { Button } from "react-bootstrap";
import useAppNavigate from "../../../store/hooks/useAppNavigate";
import EntryContext from "../../../store/context/entryContext";

function EntriesControl() {
  const { handleNavigateToPath } = useAppNavigate();
  const { isLoadingDaywiseEntries, fetchDaywiseEntries } =
    useContext(EntryContext);
  return (
    <div className="entries-controls">
      <Button
        type="button"
        className="control-btn btn-blue"
        aria-label="Add a new daily entry"
        onClick={() => handleNavigateToPath("/entries/add")}
        disabled={isLoadingDaywiseEntries}
      >
        Add a new daily entry
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Reload daywise entries"
        onClick={() => fetchDaywiseEntries(true)}
        disabled={isLoadingDaywiseEntries}
        title="Click to reload daywise entries"
      >
        {isLoadingDaywiseEntries ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Refreshing...
          </>
        ) : (
          "Refresh Entries"
        )}
      </Button>
    </div>
  );
}

export default EntriesControl;
