import { Button } from "react-bootstrap";

import LeftArrowIcon from "../ui/icons/LeftArrowIcon";
import useAppNavigate from "../../store/hooks/useAppNavigate";
import ExtractHeadsForm from "./extract-heads-form/ExtractHeadsForm";
import BulkHeadsSection from "./bulk-heads-section/BulkHeadsSection";
import { HeadsUploadContextProvider } from "../../store/context/headsUploadContext";

function UploadHeadsPageContent() {
  const { handleNavigateBack } = useAppNavigate();

  return (
    <HeadsUploadContextProvider>
      <div className="upload-heads-page-header">
        <Button
          variant="outline-light"
          className="page-back-button"
          onClick={handleNavigateBack}
        >
          <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
        </Button>
        <h2>Upload Heads</h2>
      </div>

      <div className="upload-heads-page-body-wrapper">
        <div className="upload-heads-page-body">
          <ExtractHeadsForm />
          <BulkHeadsSection />
        </div>
      </div>
    </HeadsUploadContextProvider>
  );
}

export default UploadHeadsPageContent;
