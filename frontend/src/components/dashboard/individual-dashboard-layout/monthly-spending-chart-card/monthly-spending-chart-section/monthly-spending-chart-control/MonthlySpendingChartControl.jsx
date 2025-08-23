import { useContext } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

import RotateIcon from "../../../../../ui/icons/RotateIcon";
import IndividualDashboardContext from "../../../../../../store/context/individualDashboardContext";

function MonthlySpendingChartControl({
  financialYears,
  selectedYear,
  onYearSelect,
  onRefresh,
}) {
  const { isLoadingFinancialYears } = useContext(IndividualDashboardContext);
  return (
    <div className="monthly-spending-chart-controls">
      <div className="monthly-spending-year-selector">
        <select
          id="monthlySpendingFYSelect"
          value={selectedYear || ""}
          onChange={(e) => onYearSelect(e.target.value)}
        >
          {isLoadingFinancialYears ? (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            financialYears.map((fy) => (
              <option key={fy} value={fy}>
                FY {fy}
              </option>
            ))
          )}
        </select>
      </div>
      <ButtonGroup>
        <Button
          className="monthly-spending-chart-btn"
          variant="outline-primary"
          onClick={onRefresh}
          title="Refresh"
        >
          <RotateIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default MonthlySpendingChartControl;
