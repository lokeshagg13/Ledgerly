import { Modal, Button } from "react-bootstrap";

function EditEntrySetClearConfirmModal({ show, onClose, onConfirm }) {
  return (
    <Modal
      className="new-entry-set-clear-confirm-modal"
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Clear All Rows</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You are about to clear all the rows of this new entry set.</p>
        <div className="warning-message">
          This action can not be undone and all your unsaved data for this new
          entry set will be removed.
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

export default EditEntrySetClearConfirmModal;
