import { Modal } from "react-bootstrap";
import ErrorTriangle from "../../../ui/icons/ErrorTriangle";

function TransactionErrorModal({ message = "Something went wrong.", onClose }) {
  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      backdrop="static"
      className="custom-error-modal"
    >
      <Modal.Header closeButton className="transaction-error-header">
        <Modal.Title className="transaction-error-title">
          <ErrorTriangle fill="#dc3545" width="1rem" height="1rem" />
          <span>Transaction Error</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="transaction-error-body">
        <div className="transaction-error-message">{message}</div>
      </Modal.Body>
    </Modal>
  );
}

export default TransactionErrorModal;
