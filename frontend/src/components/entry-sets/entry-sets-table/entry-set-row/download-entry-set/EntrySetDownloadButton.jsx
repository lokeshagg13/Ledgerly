import { useContext } from "react";
import { Button } from "react-bootstrap";
import DownloadEntrySetContext from "../../../../../store/context/downloadEntrySetContext";

function EntrySetDownloadButton() {
  const { isDownloadingEntrySetDetails, handleDownloadEntrySetAsPDF } =
    useContext(DownloadEntrySetContext);
  return (
    <Button
      variant="outline-primary"
      size="sm"
      className="download-button"
      onClick={handleDownloadEntrySetAsPDF}
    >
      {isDownloadingEntrySetDetails ? (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
      ) : (
        "Download"
      )}
    </Button>
  );
}

export default EntrySetDownloadButton;
