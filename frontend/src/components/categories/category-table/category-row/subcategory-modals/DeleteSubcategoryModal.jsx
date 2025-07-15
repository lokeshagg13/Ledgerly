import { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

import { axiosPrivate } from "../../../../../api/axios";
import SubcategoryContext from "../../../../../store/context/subcategoryContext";

function DeleteSubcategoryModal({ subcategoryId, subcategoryName, onClose }) {
  const { fetchSubcategoriesFromDB } = useContext(SubcategoryContext);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Hiding error message after 6 seconds
  useEffect(() => {
    if (errorMessage) {
      const messageTimeout = setTimeout(() => {
        setErrorMessage("");
      }, 6000);
      return () => clearTimeout(messageTimeout);
    }
  }, [errorMessage]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!deleting && e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [deleting]);

  const handleDeleteSubcategory = async () => {
    setDeleting(true);
    try {
      await axiosPrivate.delete(
        `/user/subcategories/${subcategoryId}`
      );
      setErrorMessage("");
      closeModal();
      fetchSubcategoriesFromDB();
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("Failed to delete subcategory: No server response.");
      } else {
        setErrorMessage(
          error?.response?.data?.error || "Failed to delete subcategory."
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  const closeModal = () => {
    if (deleting) return;
    setErrorMessage("");
    onClose();
  };

  return (
    <Modal
      show={true}
      onHide={closeModal}
      centered
      backdrop={deleting ? "static" : true}
      keyboard={!deleting}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Subcategory</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-2">
          You are about to delete the <strong>{subcategoryName}</strong>{" "}
          subcategory.
        </p>
        <p className="warning-message">
          Note: This action cannot be undone.
        </p>
        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={closeModal}
          disabled={deleting}
        >
          Cancel
        </Button>
        <Button
          className="btn-blue"
          onClick={handleDeleteSubcategory}
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

export default DeleteSubcategoryModal;
