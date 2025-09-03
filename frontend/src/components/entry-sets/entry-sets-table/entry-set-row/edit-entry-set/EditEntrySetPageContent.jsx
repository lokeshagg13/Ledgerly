import { Button } from "react-bootstrap";
import useAppNavigate from "../../../../../store/hooks/useAppNavigate";
import LeftArrowIcon from "../../../../ui/icons/LeftArrowIcon";
import { HeadsProvider } from "../../../../../store/context/headsContext";
import { ContextMenuProvider } from "../../../../../store/context/contextMenuContext";
import { EditEntrySetContextProvider } from "../../../../../store/context/editEntrySetContext";
import EditEntrySetSection from "./edit-entry-set-section/EditEntrySetSection";

function EditEntrySetPageContent({ entrySetId, formattedEntrySetDate }) {
  const { handleNavigateBack } = useAppNavigate();

  return (
    <HeadsProvider>
      <EditEntrySetContextProvider
        entrySetId={entrySetId}
        formattedEntrySetDate={formattedEntrySetDate}
      >
        <ContextMenuProvider>
          <div className="edit-entry-set-page-header">
            <Button
              variant="outline-light"
              className="page-back-button"
              onClick={handleNavigateBack}
            >
              <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
            </Button>
            <h2>Edit entry set for {formattedEntrySetDate}</h2>
          </div>

          <div className="edit-entry-set-page-body">
            <EditEntrySetSection />
          </div>
        </ContextMenuProvider>
      </EditEntrySetContextProvider>
    </HeadsProvider>
  );
}

export default EditEntrySetPageContent;
