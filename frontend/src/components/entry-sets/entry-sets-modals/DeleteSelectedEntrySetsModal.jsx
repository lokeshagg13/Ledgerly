import { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../../api/axios";
import EntrySetContext from "../../../store/context/entrySetContext";

function DeleteSelectedEntrySetsModal() {
  const {
    selectedEntrySets,
    isDeleteSelectedEntrySetsModalVisible,
    fetchEntrySets,
    handleCloseDeleteSelectedEntrySetsModal,
  } = useContext(EntrySetContext);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Hiding error message after 6 seconds
  useEffect(() => {
    if (errorMessage) {
      const messageTimeout = setTimeout(() => setErrorMessage(""), 6000);
      return () => clearTimeout(messageTimeout);
    }
  }, [errorMessage]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!deleting && e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [isDeleteSelectedEntrySetsModalVisible, selectedEntrySets, deleting]);

  const handleDeleteSelectedEntrySets = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await axiosPrivate.delete("/user/entrySet", {
        data: {
          entrySetIds: selectedEntrySets,
        },
      });

      toast.success(
        `${selectedEntrySets.length} entry ${
          selectedEntrySets.length === 1 ? "set" : "sets"
        } deleted successfully.`,
        {
          autoClose: 3000,
          position: "top-center",
        }
      );
      setErrorMessage("");
      handleCloseDeleteSelectedEntrySetsModal();
      fetchEntrySets();
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("Failed to delete selected entry sets: No server response.");
      } else {
        setErrorMessage(
          error?.response?.data?.error || "Failed to delete selected entry sets."
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    if (deleting) return;
    setErrorMessage("");
    handleCloseDeleteSelectedEntrySetsModal();
  };

  if (
    !selectedEntrySets ||
    selectedEntrySets.length === 0 ||
    !isDeleteSelectedEntrySetsModalVisible
  ) {
    return null;
  }

  return (
    <Modal
      id="deleteSelectedEntrySetsModal"
      show={isDeleteSelectedEntrySetsModalVisible}
      onHide={handleCancel}
      centered
      backdrop={deleting ? "static" : true}
      keyboard={!deleting}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Selected Entry Sets</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-2">
          You are about to delete <strong>{selectedEntrySets.length}</strong> entry{" "}
          {selectedEntrySets.length === 1 ? "set" : "sets"}.
        </p>
        <p className="warning-message">Note: This action cannot be undone.</p>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={handleCancel}
          disabled={deleting}
        >
          Cancel
        </Button>
        <Button
          className="btn-blue"
          onClick={handleDeleteSelectedEntrySets}
          disabled={deleting}
        >
          {deleting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteSelectedEntrySetsModal;
