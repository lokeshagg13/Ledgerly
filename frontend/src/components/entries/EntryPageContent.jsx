import { Button } from "react-bootstrap";
import useAppNavigate from "../../store/hooks/useAppNavigate";
import LeftArrowIcon from "../ui/icons/LeftArrowIcon";
import { EntryContextProvider } from "../../store/context/entryContext";
import EntriesControl from "./entries-control/EntriesControl";
import EntriesTable from "./entries-table/EntriesTable";

function EntryPageContent() {
  const { handleNavigateBack } = useAppNavigate();

  return (
    <EntryContextProvider>
      <div className="entry-page-header">
        <Button
          variant="outline-light"
          className="page-back-button"
          onClick={handleNavigateBack}
        >
          <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
        </Button>
        <h2>Entries</h2>
      </div>

      <div className="entry-page-body-wrapper">
        <div className="entry-page-body">
          <EntriesControl />
          <EntriesTable />
        </div>
      </div>
    </EntryContextProvider>
  );
}

export default EntryPageContent;
