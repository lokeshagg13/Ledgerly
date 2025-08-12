import { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../../api/axios";
import CategoryContext from "../../../store/context/categoryContext";

function DeleteCategoryModal({ categoryId, categoryName, onClose }) {
  const { fetchCategoriesFromDB } = useContext(CategoryContext);
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
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [deleting]);

  const handleDeleteCategory = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await axiosPrivate.delete(`/user/categories/${categoryId}`);
      toast.success(`Category ${categoryName} deleted successfully.`, {
        autoClose: 3000,
        position: "top-center",
      });
      setErrorMessage("");
      closeModal();
      fetchCategoriesFromDB();
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("Failed to delete category: No server response.");
      } else {
        setErrorMessage(
          error?.response?.data?.error || "Failed to delete category."
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
      id="deleteCategoryModal"
      show={true}
      onHide={closeModal}
      centered
      backdrop={deleting ? "static" : true}
      keyboard={!deleting}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-2">
          You are about to delete the <strong>{categoryName}</strong> category.
        </p>
        <p className="warning-message">
          Note: This action cannot be undone. All associated subcategories will
          also be removed.
        </p>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
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
          onClick={handleDeleteCategory}
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

export default DeleteCategoryModal;
