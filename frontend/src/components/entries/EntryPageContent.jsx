import { Button } from "react-bootstrap";
import useAppNavigate from "../../store/hooks/useAppNavigate";
import LeftArrowIcon from "../ui/icons/LeftArrowIcon";

function EntryPageContent() {
  const { handleNavigateToPath, handleNavigateBack } = useAppNavigate();

  return (
    <>
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
          <Button onClick={() => handleNavigateToPath("/entries/add")}>Add a new entry</Button>
        </div>
      </div>
    </>
  );
}

export default EntryPageContent;
