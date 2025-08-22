import { Button } from "react-bootstrap";
import LeftArrowIcon from "../ui/icons/LeftArrowIcon";
import useAppNavigate from "../../store/hooks/useAppNavigate";
import { HeadsProvider } from "../../store/context/headsContext";
import HeadsControl from "./heads-control/HeadsControl";
import HeadsTable from "./heads-table/HeadsTable";

function HeadsPageContent() {
  const { handleNavigateBack } = useAppNavigate();

  return (
    <HeadsProvider>
      <div className="heads-page-header">
        <Button
          variant="outline-light"
          className="page-back-button"
          onClick={handleNavigateBack}
        >
          <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
        </Button>
        <h2>Heads</h2>
      </div>

      <div className="heads-page-body-wrapper">
        <div className="heads-page-body">
          <HeadsControl />
          <HeadsTable />
        </div>
      </div>
    </HeadsProvider>
  );
}

export default HeadsPageContent;
