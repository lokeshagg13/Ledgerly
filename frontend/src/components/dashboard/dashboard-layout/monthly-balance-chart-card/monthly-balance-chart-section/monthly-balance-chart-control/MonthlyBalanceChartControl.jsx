import { useContext } from "react";
import { ButtonGroup, Button } from "react-bootstrap";

import RotateIcon from "../../../../../ui/icons/RotateIcon";
import DashboardContext from "../../../../../../store/context/dashboardContext";

function MonthlyBalanceChartControl({
  financialYears,
  selectedYear,
  onYearSelect,
  onRefresh,
}) {
  const { isLoadingFinancialYears } = useContext(DashboardContext);
  return (
    <div className="monthly-balance-chart-controls">
      <div className="monthly-balance-year-selector">
        <select
          id="monthlyBalanceFYSelect"
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
          className="monthly-balance-chart-btn"
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

export default MonthlyBalanceChartControl;
