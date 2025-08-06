import { Modal, Button } from "react-bootstrap";

function OpeningBalanceChangeModal({ show, onClose, onConfirm }) {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Opening Balance Change</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          You are about to update your opening balance.
          <div className="warning-message mt-2">
            Going forward, all balances will be recalculated based on the new
            opening balance you provide.
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

export default OpeningBalanceChangeModal;
