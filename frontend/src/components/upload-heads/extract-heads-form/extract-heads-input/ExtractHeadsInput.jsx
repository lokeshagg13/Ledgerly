import { useContext } from "react";

import UploadIcon from "../../../ui/icons/UploadIcon";
import ClearIcon from "../../../ui/icons/ClearIcon";
import { truncateWithEllipsis } from "../../../../utils/formatUtils";
import HeadsUploadContext from "../../../../store/context/headsUploadContext";

function ExtractHeadsInput() {
  const {
    headsFile,
    isEditHeadSectionVisible,
    handleOpenFileUploadDialogBox,
    handleClearUploadedFile,
    handleChangeUploadedFile,
  } = useContext(HeadsUploadContext);

  return (
    <div className="extract-heads-input file-input-section">
      <label>Upload PDF File for heads</label>
      <div className="file-input-row">
        <div
          className={`input-file-name ${headsFile && "actual-file"} ${
            isEditHeadSectionVisible && "disabled"
          }`}
          onClick={handleOpenFileUploadDialogBox}
          title={headsFile?.name}
        >
          {headsFile?.name
            ? truncateWithEllipsis(headsFile?.name, 25)
            : "No File Selected"}
        </div>
        <div className="input-file-controls">
          <button
            className="upload-btn"
            onClick={handleOpenFileUploadDialogBox}
            disabled={isEditHeadSectionVisible}
          >
            <UploadIcon fillColor="green" width="1.1rem" height="1.1rem" />
          </button>
          {headsFile && (
            <button
              className="clear-btn"
              onClick={handleClearUploadedFile}
              disabled={isEditHeadSectionVisible}
            >
              <ClearIcon fillColor="red" width="1.1rem" height="1.1rem" />
            </button>
          )}
        </div>
      </div>
      <input
        id="headsFileInput"
        type="file"
        accept="application/pdf"
        className="file-input-original hide"
        onChange={handleChangeUploadedFile}
      />
    </div>
  );
}

export default ExtractHeadsInput;
