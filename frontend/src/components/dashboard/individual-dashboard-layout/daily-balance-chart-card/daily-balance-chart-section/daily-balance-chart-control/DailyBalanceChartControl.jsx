import { useContext } from "react";
import { ButtonGroup, Button } from "react-bootstrap";

import CaretDownIcon from "../../../../../ui/icons/CaretDownIcon";
import ZoomInIcon from "../../../../../ui/icons/ZoomInIcon";
import ZoomOutIcon from "../../../../../ui/icons/ZoomOutIcon";
import RotateIcon from "../../../../../ui/icons/RotateIcon";
import IndividualDashboardContext from "../../../../../../store/context/individualDashboardContext";

function DailyBalanceChartControl({
  financialYears,
  selectedYear,
  onYearSelect,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onRefresh,
  canPrev,
  canNext,
  canZoomIn,
  canZoomOut,
}) {
  const { isLoadingFinancialYears } = useContext(IndividualDashboardContext);
  return (
    <div className="daily-balance-chart-controls">
      <div className="daily-balance-year-selector">
        <select
          id="dailyBalanceFYSelect"
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
          className="daily-balance-chart-btn left"
          variant="outline-primary"
          onClick={onPrev}
          disabled={!canPrev}
          title="Previous"
        >
          <CaretDownIcon />
        </Button>
        <Button
          className="daily-balance-chart-btn right"
          variant="outline-primary"
          onClick={onNext}
          disabled={!canNext}
          title="Next"
        >
          <CaretDownIcon />
        </Button>
        <Button
          className="daily-balance-chart-btn"
          variant="outline-primary"
          onClick={onZoomIn}
          disabled={!canZoomIn}
          title="Zoom In"
        >
          <ZoomInIcon />
        </Button>
        <Button
          className="daily-balance-chart-btn"
          variant="outline-primary"
          onClick={onZoomOut}
          disabled={!canZoomOut}
          title="Zoom Out"
        >
          <ZoomOutIcon />
        </Button>
        <Button
          className="daily-balance-chart-btn"
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

export default DailyBalanceChartControl;
