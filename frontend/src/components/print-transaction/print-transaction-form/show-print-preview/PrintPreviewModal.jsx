import { useContext } from "react";
import { Button, Image, Modal } from "react-bootstrap";
import CancelIcon from "../../../ui/icons/CancelIcon";
import TransactionPrintContext from "../../../../store/context/transactionPrintContext";
import PrintPreviewControl from "./PrintPreviewControl";

function PrintPreviewModal() {
  const {
    isPrintPreviewVisible,
    caPrintPreviewImageData,
    handleClosePrintPreview,
  } = useContext(TransactionPrintContext);
  return (
    <Modal
      show={isPrintPreviewVisible}
      onHide={handleClosePrintPreview}
      centered
      dialogClassName="preview-a4-sheet-modal"
      backdrop="static"
      contentClassName="preview-a4-sheet-modal-content"
    >
      <div className="preview-a4-sheet-container">
        <div className="preview-a4-sheet-wrapper">
          <PrintPreviewControl />
          <div className="preview-a4-sheet-content">
            <Image
              className="preview-a4-sheet-image"
              src={caPrintPreviewImageData}
              alt="Data"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PrintPreviewModal;
