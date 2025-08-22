import { useContext } from "react";

import HeadsUploadContext from "../../../store/context/headsUploadContext";
import ExtractHeadsInput from "./extract-heads-input/ExtractHeadsInput";
import ExtractHeadsControl from "./extract-heads-control/ExtractHeadsControl";
import ExtractHeadsStatus from "./extract-heads-status/ExtractHeadsStatus";

function ExtractHeadsForm() {
  const { extractHeadsError } = useContext(HeadsUploadContext);

  return (
    <div className="extract-heads-form">
      <ExtractHeadsInput />
      {extractHeadsError && (
        <div className="error-message">{extractHeadsError}</div>
      )}
      <ExtractHeadsControl />
      <ExtractHeadsStatus />
    </div>
  );
}

export default ExtractHeadsForm;
