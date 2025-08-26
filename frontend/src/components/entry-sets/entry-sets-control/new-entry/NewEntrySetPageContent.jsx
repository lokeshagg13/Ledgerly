import { Button } from "react-bootstrap";
import useAppNavigate from "../../../../store/hooks/useAppNavigate";
import LeftArrowIcon from "../../../ui/icons/LeftArrowIcon";
import { HeadsProvider } from "../../../../store/context/headsContext";
import { ContextMenuProvider } from "../../../../store/context/contextMenuContext";
import { NewEntrySetContextProvider } from "../../../../store/context/newEntrySetContext";
import { FirmDashboardContextProvider } from "../../../../store/context/firmDashboardContext";
import NewEntrySetSection from "./new-entry-set-section/NewEntrySetSection";

function NewEntrySetPageContent() {
  const { handleNavigateBack } = useAppNavigate();

  return (
    <HeadsProvider>
      <NewEntrySetContextProvider>
        <FirmDashboardContextProvider>
          <ContextMenuProvider>
            <div className="new-entry-set-page-header">
              <Button
                variant="outline-light"
                className="page-back-button"
                onClick={handleNavigateBack}
              >
                <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
              </Button>
              <h2>Add new entry set</h2>
            </div>

            <div className="new-entry-set-page-body">
              <NewEntrySetSection />
            </div>
          </ContextMenuProvider>
        </FirmDashboardContextProvider>
      </NewEntrySetContextProvider>
    </HeadsProvider>
  );
}

export default NewEntrySetPageContent;
