import { useContext } from "react";
import CancelIcon from "../../../ui/icons/CancelIcon";
import FileDownloadIcon from "../../../ui/icons/FileDownloadIcon";
import LeftAngleIcon from "../../../ui/icons/LeftAngleIcon";
import RightAngleIcon from "../../../ui/icons/RightAngleIcon";
import ZoomInIcon from "../../../ui/icons/ZoomInIcon";
import ZoomOutIcon from "../../../ui/icons/ZoomOutIcon";
import TransactionPrintContext from "../../../../store/context/transactionPrintContext";
import SaveTransactionModal from "./save-transaction-modal/SaveTransactionModal";

function PrintPreviewControl() {
  const {
    printPreviewCurrentData,
    printPreviewZoomLevel,
    isSaveTransactionModalVisible,
    isOnFirstPrintPreviewPage,
    isOnLastPrintPreviewPage,
    moveToPrevPrintPreviewPage,
    moveToNextPrintPreviewPage,
    handleZoomInPrintPreviewPage,
    handleZoomOutPrintPreviewPage,
    handleOpenSaveTransactionModal,
    handleClosePrintPreview,
  } = useContext(TransactionPrintContext);

  const { currentPage, totalPages } = printPreviewCurrentData;
  const prevPageButtonDisabled = isOnFirstPrintPreviewPage();
  const nextPageButtonDisabled = isOnLastPrintPreviewPage();
  const zoomInButtonDisabled = printPreviewZoomLevel >= 2;
  const zoomOutButtonDisabled = printPreviewZoomLevel <= 1;

  return (
    <div className="preview-control-container">
      <div className="preview-control-wrapper">
        <div className="preview-control-section">
          <div className="pagination-section">
            <button
              className="tool-btn"
              onClick={moveToPrevPrintPreviewPage}
              disabled={prevPageButtonDisabled}
            >
              <LeftAngleIcon />
            </button>
            <span className="page-info">
              {currentPage} / {totalPages}
            </span>
            <button
              className="tool-btn"
              onClick={moveToNextPrintPreviewPage}
              disabled={nextPageButtonDisabled}
            >
              <RightAngleIcon />
            </button>
          </div>
          <div className="action-buttons">
            <button
              className="tool-btn"
              onClick={handleZoomInPrintPreviewPage}
              disabled={zoomInButtonDisabled}
            >
              <ZoomInIcon />
            </button>
            <button
              className="tool-btn"
              onClick={handleZoomOutPrintPreviewPage}
              disabled={zoomOutButtonDisabled}
            >
              <ZoomOutIcon />
            </button>
            <button
              className="tool-btn"
              onClick={handleOpenSaveTransactionModal}
            >
              <FileDownloadIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="preview-modal-close-wrapper">
        <button
          className="preview-modal-close-button"
          onClick={handleClosePrintPreview}
        >
          <CancelIcon width="0.9rem" height="0.9rem" />
        </button>
      </div>
      {isSaveTransactionModalVisible && <SaveTransactionModal />}
    </div>
  );
}

export default PrintPreviewControl;
