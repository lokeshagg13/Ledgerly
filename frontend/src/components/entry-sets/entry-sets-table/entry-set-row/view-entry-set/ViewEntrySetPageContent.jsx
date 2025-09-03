import { Button } from "react-bootstrap";
import useAppNavigate from "../../../../../store/hooks/useAppNavigate";
import LeftArrowIcon from "../../../../ui/icons/LeftArrowIcon";
import { HeadsProvider } from "../../../../../store/context/headsContext";
import { ViewEntrySetContextProvider } from "../../../../../store/context/viewEntrySetContext";
import ViewEntrySetSection from "./view-entry-set-section/ViewEntrySetSection";

function ViewEntrySetPageContent({ entrySetId, formattedEntrySetDate }) {
  const { handleNavigateBack } = useAppNavigate();

  return (
    <HeadsProvider>
      <ViewEntrySetContextProvider
        entrySetId={entrySetId}
        formattedEntrySetDate={formattedEntrySetDate}
      >
        <div className="view-entry-set-page-header">
          <Button
            variant="outline-light"
            className="page-back-button"
            onClick={handleNavigateBack}
          >
            <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
          </Button>
          <h2>Entry set for {formattedEntrySetDate}</h2>
        </div>

        <div className="view-entry-set-page-body">
          <ViewEntrySetSection />
        </div>
      </ViewEntrySetContextProvider>
    </HeadsProvider>
  );
}

export default ViewEntrySetPageContent;
