import { Button } from "react-bootstrap";
import useAppNavigate from "../../store/hooks/useAppNavigate";
import LeftArrowIcon from "../ui/icons/LeftArrowIcon";
import { EntrySetContextProvider } from "../../store/context/entrySetContext";
import EntrySetsMainControl from "./entry-sets-main-control/EntrySetsMainControl";
import EntrySetsTable from "./entry-sets-table/EntrySetsTable";

function EntrySetsPageContent() {
  const { handleNavigateBack } = useAppNavigate();

  return (
    <EntrySetContextProvider>
      <div className="entry-sets-page-header">
        <Button
          variant="outline-light"
          className="page-back-button"
          onClick={handleNavigateBack}
        >
          <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
        </Button>
        <h2>Entry Sets</h2>
      </div>

      <div className="entry-sets-page-body-wrapper">
        <div className="entry-sets-page-body">
          <EntrySetsMainControl />
          <EntrySetsTable />
        </div>
      </div>
    </EntrySetContextProvider>
  );
}

export default EntrySetsPageContent;
