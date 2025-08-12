import { useContext, useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../../api/axios";
import CategoryContext from "../../../store/context/categoryContext";

function AddCategoryModal() {
  const newCategoryNameRef = useRef();
  const {
    isAddCategoryModalVisible,
    fetchCategoriesFromDB,
    handleCloseAddCategoryModal,
  } = useContext(CategoryContext);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Focus input field on mount
  useEffect(() => {
    if (isAddCategoryModalVisible) {
      newCategoryNameRef.current?.focus();
    }
  }, [isAddCategoryModalVisible]);

  // For hiding error message after 6 seconds
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(""), 6000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (newCategoryName && errorMessage.includes("cannot be empty"))
      setErrorMessage("");
  }, [newCategoryName, errorMessage]);

  // Keyboard support for closing modal and submitting
  const handleKeyDown = (e) => {
    if (isAdding) return;
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  // Handle adding a new category by calling the API
  const handleAddCategory = async () => {
    if (isAdding) return;
    const newCategoryNameTrimmed = newCategoryName.trim();
    if (!newCategoryNameTrimmed) {
      setErrorMessage("Category name cannot be empty.");
      return;
    }
    if (newCategoryNameTrimmed.length > 20) {
      setErrorMessage("Category name is too long (max 20 characters).");
      return;
    }
    if (newCategoryNameTrimmed.includes(",")) {
      setErrorMessage("Category name cannnot contain commas.");
      return;
    }

    setIsAdding(true);
    try {
      await axiosPrivate.post("/user/categories", {
        name: newCategoryNameTrimmed,
      });
      toast.success(`Category ${newCategoryNameTrimmed} added successfully.`, {
        autoClose: 3000,
        position: "top-center",
      });
      setErrorMessage("");
      setNewCategoryName("");
      handleCloseAddCategoryModal();
      fetchCategoriesFromDB();
    } catch (error) {
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
    handleCloseAddCategoryModal();
  };

  return (
    <Modal
      show={isAddCategoryModalVisible}
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
              onKeyDown={handleKeyDown}
              isInvalid={Boolean(errorMessage)}
              className={`py-1 ${errorMessage ? "shake" : ""}`}
              ref={newCategoryNameRef}
              maxLength={20}
            />
            <Form.Text className="text-muted">
              Enter a unique name to organize your transactions.
            </Form.Text>
          </Form.Group>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
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
