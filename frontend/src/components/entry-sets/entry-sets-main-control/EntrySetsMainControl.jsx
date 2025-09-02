import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import useAppNavigate from "../../../store/hooks/useAppNavigate";
import EntrySetContext from "../../../store/context/entrySetContext";
import DeleteSelectedEntrySetsModal from "../entry-sets-modals/DeleteSelectedEntrySetsModal";
import { normalizeDateQuery } from "../../../utils/dateUtils";

function EntrySetsMainControl() {
  const { handleNavigateToPath } = useAppNavigate();
  const {
    entrySets,
    isLoadingEntrySets,
    isDeleteSelectedEntrySetsModalVisible,
    selectedEntrySets,
    setFilteredEntrySets,
    handleOpenDeleteSelectedEntrySetsModal,
    fetchEntrySets,
  } = useContext(EntrySetContext);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!entrySets || entrySets.length === 0) {
      setFilteredEntrySets([]);
      return;
    }
    const queryDate = normalizeDateQuery(searchValue);
    if (!searchValue || (!queryDate && searchValue.trim() === "")) {
      setFilteredEntrySets(entrySets);
      return;
    }
    const filtered = entrySets.filter((es) => {
      const date = new Date(es.date);
      if (!(date instanceof Date)) return false;
      const esYear = String(date.getFullYear());
      const esMonth = date.getMonth();
      const esDay = String(date.getDate());
      if (queryDate) {
        if (typeof queryDate.year === "string") {
          if (!esYear.startsWith(queryDate.year)) return false;
        } else if (typeof queryDate.year === "number") {
          if (esYear !== String(queryDate.year)) return false;
        }
        if (
          queryDate.months?.length > 0 &&
          !queryDate.months.includes(esMonth)
        ) {
          return false;
        }
        if (queryDate.day !== undefined && !esDay.startsWith(String(queryDate.day))) {
          return false;
        }
        return true;
      }
      const esStr = date
        .toISOString()
        .replace(/[^a-z0-9]/gi, "")
        .toLowerCase();
      const cleaned = searchValue.replace(/[^a-z0-9]/gi, "").toLowerCase();
      return esStr.includes(cleaned);
    });
    setFilteredEntrySets(filtered);
  }, [searchValue, entrySets, setFilteredEntrySets]);

  return (
    <div className="entry-sets-main-control">
      <div className="entry-sets-main-control-row">
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
          aria-label="Delete selected entry sets"
          onClick={handleOpenDeleteSelectedEntrySetsModal}
          disabled={selectedEntrySets.length === 0}
        >
          Delete selected
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
      {entrySets.length > 0 && (
        <div className="entry-sets-main-control-row search-box-container">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search entry sets (year month date)"
            />
          </div>
          <Button
            type="button"
            className="control-btn btn-blue"
            aria-label="Clear"
            onClick={() => setSearchValue("")}
          >
            Clear
          </Button>
        </div>
      )}
      {isDeleteSelectedEntrySetsModalVisible && (
        <DeleteSelectedEntrySetsModal />
      )}
    </div>
  );
}

export default EntrySetsMainControl;
