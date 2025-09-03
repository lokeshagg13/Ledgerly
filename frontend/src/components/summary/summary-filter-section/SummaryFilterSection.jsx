import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import CancelIcon from "../../ui/icons/CancelIcon";
import SummaryContext from "../../../store/context/summaryContext";
import FilterDatePicker from "../../ui/elements/FilterDatePicker";
import { getLocalDateString, getToday } from "../../../utils/dateUtils";

function SummaryFilterSection() {
  const {
    balanceSummaryRows,
    filteredSummaryRows,
    isLoadingBalanceSummary,
    appliedFilters,
    setFilteredSummaryRows,
    fetchBalanceSummary,
    handleExportFilteredSummaryRowsAsExcel,
    handleExportFilteredSummaryRowsAsPDF,
  } = useContext(SummaryContext);

  const [searchValue, setSearchValue] = useState("");
  const [excludeZero, setExcludeZero] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (appliedFilters?.from) setFromDate(appliedFilters.from);
    if (appliedFilters?.to) setToDate(appliedFilters.to);
    if (appliedFilters?.searchValue !== undefined)
      setSearchValue(appliedFilters.searchValue);
    if (appliedFilters?.excludeZero !== undefined)
      setExcludeZero(appliedFilters.excludeZero);
  }, [appliedFilters]);

  useEffect(() => {
    if (!balanceSummaryRows || balanceSummaryRows.length === 0) {
      setFilteredSummaryRows([]);
      return;
    }

    const cleaned = searchValue.replace(/[^a-z0-9]/gi, "");
    let rows = balanceSummaryRows;

    // Exclude zero balance rows if checked
    if (excludeZero) {
      rows = rows.filter((r) => (r.calculatedBalance || 0) !== 0);
    }

    // Filter by search
    if (cleaned !== "") {
      const regex = new RegExp("^" + cleaned, "i");
      rows = rows.filter((h) =>
        regex.test(h.headName.replace(/[^a-z0-9]/gi, ""))
      );
    }
    setFilteredSummaryRows(rows);
  }, [searchValue, excludeZero, balanceSummaryRows, setFilteredSummaryRows]);

  const updateFilterDates = (from, to) => {
    if (from) setFromDate(getLocalDateString(from));
    if (to) setToDate(getLocalDateString(to));
  };

  const handleApplyDateFilter = () => {
    fetchBalanceSummary(true, "filtered", fromDate, toDate, {
      searchValue,
      excludeZero,
    });
  };

  const handleClearDateFilter = () => {
    setFromDate("");
    setToDate("");
    fetchBalanceSummary(true, "all");
  };

  const today = getToday();

  return (
    <div className="summary-filter-section">
      {/* Date Filters */}
      <h6>Date Filters</h6>
      <div className="summary-filter-row">
        <div className="date-filter">
          <FilterDatePicker
            label="From Date"
            name="fromDate"
            value={fromDate}
            onChange={(date) => updateFilterDates(date, toDate)}
            maxDate={today}
          />
        </div>
        <div className="date-filter">
          <FilterDatePicker
            label="To Date"
            name="toDate"
            value={toDate}
            onChange={(date) => updateFilterDates(fromDate, date)}
            minDate={fromDate}
            maxDate={today}
          />
        </div>
        <Button
          type="button"
          className="apply-btn"
          onClick={handleApplyDateFilter}
          disabled={isLoadingBalanceSummary || (!fromDate && !toDate)}
        >
          Apply Date Filters
        </Button>
        <Button
          type="button"
          className="clear-btn"
          onClick={handleClearDateFilter}
          disabled={isLoadingBalanceSummary || (!fromDate && !toDate)}
        >
          Clear
        </Button>
      </div>

      {/* Search and Exclude Zero */}
      <h6>Row Filters</h6>
      <div className="summary-filter-row">
        {balanceSummaryRows.length > 0 && (
          <div className="search-box-container">
            <input
              type="text"
              className="search-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search Heads"
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
        )}

        <Form.Check
          type="checkbox"
          className="exclude-zero-checkbox"
          label="Exclude zero balance heads"
          checked={excludeZero}
          onChange={() => setExcludeZero(!excludeZero)}
        />
      </div>

      {/* Export Buttons */}
      <div className="summary-filter-row button-row">
        <Button
          type="button"
          className="reload-btn btn-outline-light"
          aria-label="Refresh summary"
          onClick={() => {
            const mode = fromDate || toDate ? "filtered" : "all";
            fetchBalanceSummary(true, mode, fromDate, toDate, {
              searchValue,
              excludeZero,
            });
          }}
          disabled={isLoadingBalanceSummary}
          title="Click to reload summary"
        >
          {isLoadingBalanceSummary ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Refreshing...
            </>
          ) : (
            "Reload"
          )}
        </Button>
        <Button
          variant="primary"
          className="export-btn"
          onClick={handleExportFilteredSummaryRowsAsPDF}
          disabled={filteredSummaryRows.length === 0}
        >
          Export All as PDF
        </Button>
        <Button
          variant="success"
          className="export-btn"
          onClick={handleExportFilteredSummaryRowsAsExcel}
          disabled={filteredSummaryRows.length === 0}
        >
          Export All as XLSX
        </Button>
      </div>
    </div>
  );
}

export default SummaryFilterSection;
