import { useContext } from "react";
import { Button, Image, Modal } from "react-bootstrap";
import CancelIcon from "../../../ui/icons/CancelIcon";
import TransactionPrintContext from "../../../../store/context/transactionPrintContext";

function PrintPreviewModal({ show, onClose }) {
  const { caPrintPreviewImageData } = useContext(TransactionPrintContext);
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      dialogClassName="preview-a4-sheet-modal"
      backdrop="static"
      contentClassName="preview-a4-sheet-modal-content"
    >
      <div className="preview-a4-sheet-container">
        <div className="preview-a4-sheet-wrapper">
          <div className="preview-a4-sheet-content">
            <Image
              className="preview-a4-sheet-image"
              src={caPrintPreviewImageData}
              alt="Data"
            />
          </div>
          <div className="preview-a4-sheet-control">
            <Button className="preview-a4-sheet-close-button" onClick={onClose}>
              <CancelIcon width="0.9rem" height="0.9rem" />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PrintPreviewModal;
