import { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../../api/axios";
import HeadsContext from "../../../store/context/headsContext";

function DeleteSelectedHeadsModal() {
  const {
    selectedHeads,
    isDeleteSelectedHeadsModalVisible,
    fetchHeadsFromDB,
    handleCloseDeleteSelectedHeadsModal,
  } = useContext(HeadsContext);
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
  }, [isDeleteSelectedHeadsModalVisible, selectedHeads, deleting]);

  const handleDeleteSelectedHeads = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await axiosPrivate.delete("/user/heads", {
        data: {
          headIds: selectedHeads,
        },
      });

      toast.success(
        `${selectedHeads.length} ${
          selectedHeads.length === 1 ? "head" : "heads"
        } deleted successfully.`,
        {
          autoClose: 3000,
          position: "top-center",
        }
      );
      setErrorMessage("");
      handleCloseDeleteSelectedHeadsModal();
      fetchHeadsFromDB();
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("Failed to delete selected heads: No server response.");
      } else {
        setErrorMessage(
          error?.response?.data?.error || "Failed to delete selected heads."
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    if (deleting) return;
    setErrorMessage("");
    handleCloseDeleteSelectedHeadsModal();
  };

  if (
    !selectedHeads ||
    selectedHeads.length === 0 ||
    !isDeleteSelectedHeadsModalVisible
  ) {
    return null;
  }

  return (
    <Modal
      id="deleteSelectedHeadsModal"
      show={isDeleteSelectedHeadsModalVisible}
      onHide={handleCancel}
      centered
      backdrop={deleting ? "static" : true}
      keyboard={!deleting}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Selected Heads</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-2">
          You are about to delete <strong>{selectedHeads.length}</strong>{" "}
          {selectedHeads.length === 1 ? "head" : "heads"}.
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
          onClick={handleDeleteSelectedHeads}
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

export default DeleteSelectedHeadsModal;
