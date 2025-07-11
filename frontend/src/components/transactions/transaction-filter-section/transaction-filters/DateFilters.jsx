import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import {
  getDateBeforeGivenMonths,
  getDateBeforeGivenYears,
  getFinancialYearRange,
  getStartOfMonth,
  getStartOfYear,
  getToday,
} from "../../../../logic/dateUtils";

function DateFilters() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const updateFilterDates = (from, to) => {
    setFromDate(from);
    setToDate(to);
    // onDateChange?.(from, to);
  };

  const financialYears = {
    currentFY: getFinancialYearRange(0),
    prevFY1: getFinancialYearRange(1),
    prevFY2: getFinancialYearRange(2),
    prevFY3: getFinancialYearRange(3),
  };

  return (
    <div className="date-filter-section">
      <div className="date-filter-row">
        <div className="date-filter-range">
          <div className="date-filter-range-input from">
            <Form.Label>From</Form.Label>
            <Form.Control
              type="date"
              value={fromDate}
              max={getToday()}
              onChange={(e) => updateFilterDates(e.target.value, toDate)}
            />
          </div>
          <div className="date-filter-range-input to">
            <Form.Label>To</Form.Label>
            <Form.Control
              type="date"
              value={toDate}
              min={fromDate}
              max={getToday()}
              onChange={(e) => updateFilterDates(fromDate, e.target.value)}
            />
          </div>
        </div>
        <div className="date-filter-quick-actions">
          <div className="date-filter-action today">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => updateFilterDates(getToday(), getToday())}
            >
              Today
            </Button>
          </div>
          <div className="date-filter-action this-month">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => updateFilterDates(getStartOfMonth(), getToday())}
            >
              This Month
            </Button>
          </div>
          <div className="date-filter-action last-one-month">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() =>
                updateFilterDates(getDateBeforeGivenMonths(1), getToday())
              }
            >
              Last 1 Month
            </Button>
          </div>
          <div className="date-filter-action last-two-months">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() =>
                updateFilterDates(getDateBeforeGivenMonths(2), getToday())
              }
            >
              Last 2 Months
            </Button>
          </div>
          <div className="date-filter-action last-three-months">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() =>
                updateFilterDates(getDateBeforeGivenMonths(3), getToday())
              }
            >
              Last 3 Months
            </Button>
          </div>
          <div className="date-filter-action last-six-months">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() =>
                updateFilterDates(getDateBeforeGivenMonths(6), getToday())
              }
            >
              Last 6 Months
            </Button>
          </div>
          <div className="date-filter-action last-one-year">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() =>
                updateFilterDates(getDateBeforeGivenYears(1), getToday())
              }
            >
              Last 1 Year
            </Button>
          </div>
          <div className="date-filter-action this-calendar-year">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => updateFilterDates(getStartOfYear(), getToday())}
            >
              This Calendar Year
            </Button>
          </div>
          {Object.values(financialYears).map(({ label, from, to }, idx) => (
            <div
              key={idx}
              className={`date-filter-action financial-year ${label
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => updateFilterDates(from, to)}
              >
                {label}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DateFilters;
