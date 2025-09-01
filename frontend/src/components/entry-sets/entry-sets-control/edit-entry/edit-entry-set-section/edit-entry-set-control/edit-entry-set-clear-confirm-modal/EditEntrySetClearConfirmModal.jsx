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
        <p>
          You are about to clear all the rows of this entry set. This action
          will temporarily clear all your rows in your current edit session.
        </p>
        <div className="warning-message">
          Note: If you wish to discard all changes and reload the last saved
          entry set, you can use the
          <strong> "Reset All" </strong> button at any time. This will undo all
          removals or edits you've made so far.
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
