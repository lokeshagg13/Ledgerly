import { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import HeadsUploadContext from "../../../../../store/context/headsUploadContext";

function BulkHeadRemoveModal({ show, onClose, onConfirm }) {
  const { editableHeads, selectedHeadIds } = useContext(HeadsUploadContext);
  const isRemovingAll = selectedHeadIds?.size === editableHeads.length;
  const isPlural = selectedHeadIds?.size > 1;

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Remove Heads</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>
            You are about to{" "}
            <strong>
              remove{" "}
              {isRemovingAll
                ? "all"
                : `${selectedHeadIds?.size} selected`}{" "}
              head{isPlural ? "s" : ""}{" "}
            </strong>{" "}
            from the list. This action will temporarily delete these heads from
            your current upload session.
          </p>
          <div className="warning-message mt-2">
            Note: If you wish to discard all changes and reload the original
            extracted heads from the PDF, you can use the
            <strong> "Reset Heads" </strong> button at any time. This will undo
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

export default BulkHeadRemoveModal;
