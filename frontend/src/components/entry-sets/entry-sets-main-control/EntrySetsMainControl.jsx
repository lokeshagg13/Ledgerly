import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import useAppNavigate from "../../../store/hooks/useAppNavigate";
import EntrySetsContext from "../../../store/context/entrySetsContext";
import { normalizeDateQuery } from "../../../utils/dateUtils";
import CancelIcon from "../../ui/icons/CancelIcon";

function EntrySetsMainControl() {
  const { handleNavigateToPath } = useAppNavigate();
  const {
    entrySets,
    isLoadingEntrySets,
    setFilteredEntrySets,
    fetchEntrySets,
  } = useContext(EntrySetsContext);
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
        if (
          queryDate.day !== undefined &&
          !esDay.startsWith(String(queryDate.day))
        ) {
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
        {entrySets.length > 0 && (
          <div className="search-box-container">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
              />
              {searchValue && (
                <div
                  className="search-clear-icon"
                  onClick={() => setSearchValue("")}
                >
                  <CancelIcon />
                </div>
              )}
            </div>
          </div>
        )}
        <Button
          type="button"
          className="control-btn btn-blue"
          aria-label="Add a new daily entry"
          onClick={() => handleNavigateToPath("/entry-sets/new")}
          disabled={isLoadingEntrySets}
        >
          Add an entry set
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
    </div>
  );
}

export default EntrySetsMainControl;
