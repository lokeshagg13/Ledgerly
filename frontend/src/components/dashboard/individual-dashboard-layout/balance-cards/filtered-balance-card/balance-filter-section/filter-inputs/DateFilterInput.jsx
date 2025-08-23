import { useContext } from "react";
import { Button } from "react-bootstrap";
import {
  getLocalDateString,
  getToday,
  getYesterday,
  getEndOfLastMonth,
  getEndDateOfFinancialYear,
} from "../../../../../../../utils/dateUtils";
import FilterDatePicker from "../../../../../../ui/elements/FilterDatePicker";
import IndividualDashboardContext from "../../../../../../../store/context/individualDashboardContext";
import CancelIcon from "../../../../../../ui/icons/CancelIcon";

function DateFilterInput() {
  const {
    filterFormData,
    filteredBalanceError,
    handleModifyFilterFormData,
    handleResetErrorFetchingFilteredBalance,
  } = useContext(IndividualDashboardContext);

  const modifyUptoDate = (uptoDate) => {
    handleResetErrorFetchingFilteredBalance();
    if (uptoDate)
      handleModifyFilterFormData("uptoDate", getLocalDateString(uptoDate));
  };

  const today = getToday();
  const quickActions = [
    { label: "Today", date: today },
    { label: "Yesterday", date: getYesterday() },
    { label: "Last Month", date: getEndOfLastMonth() },
    ...[1, 2, 3].map((n) => getEndDateOfFinancialYear(n)),
  ];

  return (
    <div className="balance-filter date-filter-section">
      <div className="date-filter-row">
        <div className="date-filter-range">
          <div
            className={`date-filter-range-input to ${
              filteredBalanceError.uptoDate ? "shake" : ""
            }`}
          >
            <div className="date-picker-with-clear">
              <FilterDatePicker
                label="Upto Date"
                name="uptoDate"
                value={filterFormData.uptoDate}
                onChange={(date) => modifyUptoDate(date)}
                maxDate={today}
                isInvalid={filteredBalanceError.uptoDate}
                paddedCalendar={true}
              />
              {filterFormData.uptoDate && (
                <button
                  type="button"
                  className="clear-date-button"
                  onClick={() => handleModifyFilterFormData("uptoDate", null)}
                  aria-label="Clear date"
                >
                  <CancelIcon />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="date-filter-quick-actions">
          <div className="date-filter-action-group">
            <div className="date-filter-buttons">
              {quickActions.map(({ label, date }, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant="outline-primary"
                  onClick={() => modifyUptoDate(date)}
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

export default DateFilterInput;
