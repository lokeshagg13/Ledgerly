import { Button } from "react-bootstrap";
import useAppNavigate from "../../../store/hooks/useAppNavigate";
import LeftArrowIcon from "../../ui/icons/LeftArrowIcon";
import NewEntryHeader from "./new-entry-header/NewEntryHeader";
import NewEntryTable from "./new-entry-table/NewEntryTable";
import { HeadsProvider } from "../../../store/context/headsContext";

function NewEntryPageContent() {
  const { handleNavigateBack } = useAppNavigate();

  return (
    <>
      <div className="new-entry-page-header">
        <Button
          variant="outline-light"
          className="page-back-button"
          onClick={handleNavigateBack}
        >
          <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
        </Button>
        <h2>Add a new entry</h2>
      </div>

      <div className="new-entry-page-body">
        <HeadsProvider>
          <NewEntryHeader />
          <NewEntryTable />
        </HeadsProvider>
      </div>
    </>
  );
}

export default NewEntryPageContent;
