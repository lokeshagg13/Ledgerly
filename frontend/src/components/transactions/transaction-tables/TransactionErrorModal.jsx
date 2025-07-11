import { Button, Modal } from "react-bootstrap";
import ErrorTriangle from "../../ui/icons/ErrorTriangle";

function TransactionErrorModal({
  message = "Something went wrong.",
  onTryAgain,
}) {
  return (
    <Modal
      show={true}
      centered
      backdrop="static"
      className="custom-error-modal"
    >
      <Modal.Header className="transaction-error-header">
        <Modal.Title className="transaction-error-title">
          <ErrorTriangle fill="#dc3545" width="1rem" height="1rem" />
          <span>Transaction Error</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="transaction-error-body">
        <p className="transaction-error-message">{message}</p>
      </Modal.Body>
      <Modal.Footer className="transaction-error-footer">
        <Button
          variant="outline-primary"
          className="transaction-error-button"
          onClick={onTryAgain}
        >
          Try Again
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TransactionErrorModal;
