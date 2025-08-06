import { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import TransactionUploadContext from "../../../../../store/context/transactionUploadContext";

function BulkTransactionRemoveModal({ show, onClose, onConfirm }) {
  const { editableTransactions, selectedTransactionIds } = useContext(
    TransactionUploadContext
  );
  const isRemovingAll =
    selectedTransactionIds?.size === editableTransactions.length;
  const isPlural = selectedTransactionIds?.size > 1;
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Remove Transactions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>
            You are about to{" "}
            <strong>
              remove{" "}
              {isRemovingAll
                ? "all"
                : `${selectedTransactionIds?.size} selected`}{" "}
              transaction{isPlural ? "s" : ""}{" "}
            </strong>{" "}
            from the list. This action will temporarily delete these
            transactions from your current upload session.
          </p>
          <div className="warning-message mt-2">
            Note: If you wish to discard all changes and reload the original
            extracted transactions from the PDF, you can use the
            <strong> "Reset Transactions" </strong> button at any time. This
            will undo all removals or edits you've made so far.
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BulkTransactionRemoveModal;
