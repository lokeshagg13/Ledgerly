import { useContext } from "react";

import UploadIcon from "../../../ui/icons/UploadIcon";
import ClearIcon from "../../../ui/icons/ClearIcon";
import TransactionUploadContext from "../../../../store/context/transactionUploadContext";
import { truncateWithEllipsis } from "../../../../utils/formatUtils";

function ExtractTransactionInput() {
  const {
    transactionFile,
    handleOpenFileUploadDialogBox,
    handleClearUploadedFile,
    handleChangeUploadedFile,
  } = useContext(TransactionUploadContext);

  return (
    <div className="extract-transaction-input file-input-section">
      <label>Upload Transaction PDF File</label>
      <div className="file-input-row">
        <div
          className={`input-file-name ${transactionFile && "actual-file"}`}
          onClick={handleOpenFileUploadDialogBox}
          title={transactionFile?.name}
        >
          {transactionFile?.name
            ? truncateWithEllipsis(transactionFile?.name, 25)
            : "No File Selected"}
        </div>
        <div className="input-file-controls">
          <button
            className="upload-btn"
            onClick={handleOpenFileUploadDialogBox}
          >
            <UploadIcon fillColor="green" width="1.1rem" height="1.1rem" />
          </button>
          {transactionFile && (
            <button className="clear-btn" onClick={handleClearUploadedFile}>
              <ClearIcon fillColor="red" width="1.1rem" height="1.1rem" />
            </button>
          )}
        </div>
      </div>
      <input
        id="transactionFileInput"
        type="file"
        accept="application/pdf"
        className="file-input-original hide"
        onChange={handleChangeUploadedFile}
      />
    </div>
  );
}

export default ExtractTransactionInput;
