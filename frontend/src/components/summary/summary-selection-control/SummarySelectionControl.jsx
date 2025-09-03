import { useContext } from "react";
import { Button } from "react-bootstrap";
import SummaryContext from "../../../store/context/summaryContext";

function SummarySelectionControl() {
  const {
    selectedSummaryRows,
    handleExportSelectedSummaryRowsAsExcel,
    handleExportSelectedSummaryRowsAsPDF,
  } = useContext(SummaryContext);

  if (selectedSummaryRows.length === 0) return <></>;

  return (
    <div className="summary-selection-control">
      <div className="summary-selection-text">
        {selectedSummaryRows.length} row
        {selectedSummaryRows.length > 1 ? "s" : ""} selected
      </div>
      <div className="summary-selection-buttons">
        <Button
          type="button"
          className="control-btn btn-outline-light"
          aria-label="Export selected rows as XLSX"
          onClick={handleExportSelectedSummaryRowsAsExcel}
          disabled={selectedSummaryRows.length === 0}
        >
          Export as XLSX
        </Button>
        <Button
          type="button"
          className="control-btn btn-outline-light"
          aria-label="Export selected rows as PDF"
          onClick={handleExportSelectedSummaryRowsAsPDF}
          disabled={selectedSummaryRows.length === 0}
        >
          Export as PDF
        </Button>
      </div>
    </div>
  );
}

export default SummarySelectionControl;
