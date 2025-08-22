import { useContext } from "react";
import { Button } from "react-bootstrap";
import HeadsUploadContext from "../../../../store/context/headsUploadContext";

function BulkHeadFooterControl() {
  const {
    isUploadingBulkHeads,
    handleResetAllHeads,
    handleUploadBulkHeads,
  } = useContext(HeadsUploadContext);

  return (
    <div className="bulk-heads-footer-control">
      <Button
        className="btn-outline"
        onClick={handleResetAllHeads}
        disabled={isUploadingBulkHeads}
      >
        Reset Heads
      </Button>
      <Button
        className="btn-blue"
        onClick={handleUploadBulkHeads}
        disabled={isUploadingBulkHeads}
      >
        {isUploadingBulkHeads ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Uploading...
          </>
        ) : (
          "Upload All"
        )}
      </Button>
    </div>
  );
}

export default BulkHeadFooterControl;
