import { useContext, useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { axiosPrivate } from "../../../api/axios";
import CategoryContext from "../../../store/context/categoryContext";

function AddCategoryModal() {
  const newCategoryNameRef = useRef();
  const { showAddCategoryModal, fetchCategoriesFromDB, closeAddCategoryModal } =
    useContext(CategoryContext);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Focus input field on mount
  useEffect(() => {
    if (showAddCategoryModal) {
      newCategoryNameRef.current?.focus();
    }
  }, [showAddCategoryModal]);

  // For hiding error message after 4 seconds
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (newCategoryName && errorMessage.includes("cannot be empty"))
      setErrorMessage("");
  }, [newCategoryName, errorMessage]);

  // Keyboard support for closing modal and submitting
  useEffect(() => {
    if (!showAddCategoryModal) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isAdding) {
        e.preventDefault();
        handleCancel();
      } else if (
        e.key === "Enter" &&
        document.activeElement === newCategoryNameRef.current &&
        !isAdding
      ) {
        e.preventDefault();
        handleAddCategory();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [showAddCategoryModal, isAdding]);

  const handleAddCategory = async () => {
    const newCategoryNameTrimmed = newCategoryName.trim();
    if (!newCategoryNameTrimmed) {
      setErrorMessage("Category name cannot be empty.");
      return;
    }
    if (newCategoryNameTrimmed.length > 20) {
      setErrorMessage("Category name is too long (max 20 characters).");
      return;
    }

    setIsAdding(true);
    try {
      await axiosPrivate.post("/user/transactions/categories", {
        name: newCategoryNameTrimmed,
      });
      setErrorMessage("");
      setNewCategoryName("");
      closeAddCategoryModal();
      fetchCategoriesFromDB();
    } catch (error) {
      console.log("Error while adding category:", error);
      if (!error?.response) {
        setErrorMessage("Failed to add category: No server response.");
      } else {
        setErrorMessage(
          error?.response?.data?.error || "Failed to add category."
        );
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    if (isAdding) return;
    setErrorMessage("");
    setNewCategoryName("");
    closeAddCategoryModal();
  };

  return (
    <Modal
      show={showAddCategoryModal}
      onHide={handleCancel}
      centered
      backdrop={isAdding ? "static" : true}
      keyboard={!isAdding}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="categoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              aria-label="New category name"
              type="text"
              placeholder="e.g. Shopping, PPF, LIC"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              isInvalid={Boolean(errorMessage)}
              className={`py-1 ${errorMessage ? "shake" : ""}`}
              ref={newCategoryNameRef}
              maxLength={20}
            />
            <Form.Text className="text-muted">
              Enter a unique name to organize your transactions.
            </Form.Text>
          </Form.Group>
          {errorMessage && (
            <div className="text-danger small mt-1">{errorMessage}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={handleCancel}
          disabled={isAdding}
        >
          Cancel
        </Button>
        <Button
          className="btn-blue"
          onClick={handleAddCategory}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Adding...
            </>
          ) : (
            "Add Category"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddCategoryModal;
