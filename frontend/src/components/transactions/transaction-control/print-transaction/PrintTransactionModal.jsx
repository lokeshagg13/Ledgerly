import { Button, Modal } from "react-bootstrap";
import FetchTransactionForm from "./fetch-transaction-form/FetchTransactionForm";
import PrintTransactionForm from "./print-transaction-form/PrintTransactionForm";

function PrintTransactionModal({ onClose }) {
  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      size="lg"
      className="print-transaction-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Print Transactions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="print-transaction-modal-body">
          <FetchTransactionForm />
          <PrintTransactionForm />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default PrintTransactionModal;
