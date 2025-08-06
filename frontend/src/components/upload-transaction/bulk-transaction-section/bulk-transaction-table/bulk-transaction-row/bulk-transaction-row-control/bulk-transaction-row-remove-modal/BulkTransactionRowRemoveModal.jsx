import { Modal, Button } from "react-bootstrap";

function BulkTransactionRowRemoveModal({
  transactionIdx,
  show,
  onClose,
  onConfirm,
}) {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Remove Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>
            You are about to{" "}
            <strong>remove Transaction {transactionIdx + 1}</strong> from the
            list. This action will temporarily delete the transaction from your
            current upload session.
          </p>
          <div className="warning-message mt-2">
            Note: If you wish to discard all changes and reload the original extracted
            transactions from the PDF, you can use the
            <strong> "Reset Transactions" </strong> button at any time. This will undo
            all removals or edits you've made so far.
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

export default BulkTransactionRowRemoveModal;
