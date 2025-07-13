import { Button, Modal } from "react-bootstrap";
import CancelIcon from "../../../ui/icons/CancelIcon";
import { useContext } from "react";
import TransactionPrintContext from "../../../../store/context/transactionPrintContext";
import CAStylePrintPreview from "./ca-style-print-preview/CAStylePrintPreview";

function PrintPreviewModal({ show, onClose }) {
  const { printStyle, transactions } = useContext(TransactionPrintContext);
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
          <div className="preview-a4-sheet-control">
            <Button className="preview-a4-sheet-close-button" onClick={onClose}>
              <CancelIcon width="1.1rem" height="1.1rem" />
            </Button>
          </div>
          <div className="preview-a4-sheet-content">
            <CAStylePrintPreview />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PrintPreviewModal;
