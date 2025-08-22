import { useContext } from "react";
import { Button } from "react-bootstrap";
import HeadsUploadContext from "../../../../store/context/headsUploadContext";

function ExtractHeadsControl() {
  const {
    isExtractingHeads,
    isEditHeadSectionVisible,
    handleResetAll,
    handleExtractHeadsFromFile,
  } = useContext(HeadsUploadContext);

  return (
    <div className="extract-heads-control">
      <Button
        className="extract-heads-button"
        onClick={handleExtractHeadsFromFile}
        disabled={isExtractingHeads || isEditHeadSectionVisible}
      >
        {isExtractingHeads ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Extracting...
          </>
        ) : (
          "Extract"
        )}
      </Button>
      <Button
        className="reset-button"
        onClick={handleResetAll}
        disabled={isExtractingHeads}
      >
        {isEditHeadSectionVisible ? "Upload New" : "Reset"}
      </Button>
    </div>
  );
}

export default ExtractHeadsControl;
