import { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

import { axiosPrivate } from "../../../api/axios";
import CategoryContext from "../../../store/context/categoryContext";
import { formatCategoryError } from "../../../utils/formatUtils";

function DeleteSelectedCategoriesModal() {
  const {
    selectedCategories,
    isDeleteSelectedCategoriesModalVisible,
    fetchCategoriesFromDB,
    closeDeleteSelectedCategoriesModal,
  } = useContext(CategoryContext);
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
  }, [isDeleteSelectedCategoriesModalVisible, selectedCategories, deleting]);

  const handleDeleteSelectedCategories = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await axiosPrivate.delete("/user/categories", {
        data: {
          categoryIds: selectedCategories,
        },
      });
      setErrorMessage("");
      closeDeleteSelectedCategoriesModal();
      fetchCategoriesFromDB();
    } catch (error) {
      if (!error?.response) {
        setErrorMessage(
          "Failed to delete selected categories: No server response."
        );
      } else {
        setErrorMessage(
          error?.response?.data?.error ||
            "Failed to delete selected categories."
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    if (deleting) return;
    setErrorMessage("");
    closeDeleteSelectedCategoriesModal();
  };

  if (
    !selectedCategories ||
    selectedCategories.length === 0 ||
    !isDeleteSelectedCategoriesModalVisible
  ) {
    return null;
  }

  return (
    <>
      <Modal
        id="deleteSelectedCategoriesModal"
        show={isDeleteSelectedCategoriesModalVisible}
        onHide={handleCancel}
        centered
        backdrop={deleting ? "static" : true}
        keyboard={!deleting}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Selected Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            You are about to delete <strong>{selectedCategories.length}</strong>{" "}
            {selectedCategories.length === 1 ? "category" : "categories"}.
          </p>
          <p className="warning-message">
            Note: This action cannot be undone. All associated subcategories
            will also be removed.
          </p>
          {errorMessage && (
            <div className="error-message">
              {formatCategoryError(errorMessage)}
            </div>
          )}
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
            onClick={handleDeleteSelectedCategories}
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
    </>
  );
}

export default DeleteSelectedCategoriesModal;
