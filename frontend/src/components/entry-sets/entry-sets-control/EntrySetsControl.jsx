import { useContext } from "react";
import { Button } from "react-bootstrap";
import useAppNavigate from "../../../store/hooks/useAppNavigate";
import EntrySetContext from "../../../store/context/entrySetContext";

function EntrySetsControl() {
  const { handleNavigateToPath } = useAppNavigate();
  const { isLoadingEntrySets, fetchEntrySets } = useContext(EntrySetContext);
  return (
    <div className="entry-sets-controls">
      <Button
        type="button"
        className="control-btn btn-blue"
        aria-label="Add a new daily entry"
        onClick={() => handleNavigateToPath("/entry-sets/new")}
        disabled={isLoadingEntrySets}
      >
        Add a new daily entry
      </Button>
      <Button
        type="button"
        className="control-btn btn-outline-light"
        aria-label="Reload daywise entry sets"
        onClick={() => fetchEntrySets(true)}
        disabled={isLoadingEntrySets}
        title="Click to reload daywise entry sets"
      >
        {isLoadingEntrySets ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Refreshing...
          </>
        ) : (
          "Refresh Entry Sets"
        )}
      </Button>
    </div>
  );
}

export default EntrySetsControl;
