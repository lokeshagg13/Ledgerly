import { useContext } from "react";
import { Spinner } from "react-bootstrap";
import HeadsUploadContext from "../../../../store/context/headsUploadContext";

function ExtractHeadsStatus() {
  const {
    isExtractingHeads,
    extractedHeads,
    isEditHeadSectionVisible,
  } = useContext(HeadsUploadContext);

  if (isExtractingHeads) {
    return (
      <div className="heads-extracting">
        <Spinner animation="border" size="lg" />
      </div>
    );
  }

  if (!isEditHeadSectionVisible) return <></>;

  if (extractedHeads?.length === 0)
    return (
      <div className="heads-empty warning-message">
        No heads found
      </div>
    );

  return (
    <div className="heads-extract-message">
      {extractedHeads.length} heads extracted successfully.
    </div>
  );
}

export default ExtractHeadsStatus;
