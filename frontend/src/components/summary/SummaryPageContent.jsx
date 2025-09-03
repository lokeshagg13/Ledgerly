import { Button } from "react-bootstrap";
import useAppNavigate from "../../store/hooks/useAppNavigate";
import LeftArrowIcon from "../ui/icons/LeftArrowIcon";
import { SummaryContextProvider } from "../../store/context/summaryContext";
import SummaryTable from "./summary-table/SummaryTable";
import SummaryFilterSection from "./summary-filter-section/SummaryFilterSection";
import SummarySelectionControl from "./summary-selection-control/SummarySelectionControl";

function SummaryPageContent() {
  const { handleNavigateBack } = useAppNavigate();

  return (
    <SummaryContextProvider>
      <div className="summary-page-header">
        <Button
          variant="outline-light"
          className="page-back-button"
          onClick={handleNavigateBack}
        >
          <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
        </Button>
        <h2>Balance summary</h2>
      </div>

      <div className="summary-page-body-wrapper">
        <div className="summary-page-body">
          <SummaryFilterSection />
          <div className="summary-table-section">
            <SummarySelectionControl />
            <SummaryTable />
          </div>
        </div>
      </div>
    </SummaryContextProvider>
  );
}

export default SummaryPageContent;
