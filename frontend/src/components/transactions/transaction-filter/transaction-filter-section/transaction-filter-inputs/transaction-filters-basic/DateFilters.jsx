import { useContext } from "react";
import { Button } from "react-bootstrap";
import {
  getDateBeforeGivenMonths,
  getDateBeforeGivenYears,
  getFinancialYearRange,
  getLocalDateString,
  getStartOfMonth,
  getStartOfYear,
  getToday,
} from "../../../../../../utils/dateUtils";
import FilterDatePicker from "../../../../../ui/elements/FilterDatePicker";
import TransactionFilterContext from "../../../../../../store/context/transactionFilterContext";

function DateFilters() {
  const {
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    filteringError,
    resetFilteringError,
  } = useContext(TransactionFilterContext);

  const updateFilterDates = (from, to) => {
    resetFilteringError();
    if (from) setFromDate(getLocalDateString(from));
    if (to) setToDate(getLocalDateString(to));
  };

  const today = getToday();

  const quickActions = [
    { label: "Today", from: today, to: today },
    { label: "This Month", from: getStartOfMonth(), to: today },
    { label: "Last 1 Month", from: getDateBeforeGivenMonths(1), to: today },
    { label: "Last 2 Months", from: getDateBeforeGivenMonths(2), to: today },
    { label: "Last 3 Months", from: getDateBeforeGivenMonths(3), to: today },
    { label: "Last 6 Months", from: getDateBeforeGivenMonths(6), to: today },
    { label: "Last 1 Year", from: getDateBeforeGivenYears(1), to: today },
    { label: "This Calendar Year", from: getStartOfYear(), to: today },
    ...[0, 1, 2, 3].map((n) => getFinancialYearRange(n)),
  ];

  return (
    <div className="date-filter-section">
      <div className="date-filter-heading">
        <h5>Filter by Date Range</h5>
      </div>
      <div className="date-filter-row">
        <div className="date-filter-range">
          <div
            className={`date-filter-range-input from ${
              filteringError.fromDate ? "shake" : ""
            }`}
          >
            <FilterDatePicker
              label="From Date"
              name="fromDate"
              value={fromDate}
              onChange={(date) => updateFilterDates(date, toDate)}
              maxDate={today}
              isInvalid={filteringError.fromDate}
            />
          </div>
          <div
            className={`date-filter-range-input to ${
              filteringError.toDate ? "shake" : ""
            }`}
          >
            <FilterDatePicker
              label="To Date"
              name="toDate"
              value={toDate}
              onChange={(date) => updateFilterDates(fromDate, date)}
              minDate={fromDate}
              maxDate={today}
              isInvalid={filteringError.toDate}
            />
          </div>
        </div>
        <div className="date-filter-quick-actions">
          <div className="date-filter-action-group">
            <div className="date-filter-buttons">
              {quickActions.map(({ label, from, to }, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant="outline-primary"
                  onClick={() => updateFilterDates(from, to)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DateFilters;
