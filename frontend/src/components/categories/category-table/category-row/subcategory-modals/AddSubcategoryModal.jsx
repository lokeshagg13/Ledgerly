import { useContext, useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../../../../api/axios";
import SubcategoryContext from "../../../../../store/context/subcategoryContext";

function AddSubcategoryModal({ categoryId }) {
  const newSubcategoryNameRef = useRef();
  const {
    isAddSubcategoryModalVisible,
    fetchSubcategoriesFromDB,
    handleCloseAddSubcategoryModal,
  } = useContext(SubcategoryContext);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Focus input field on mount
  useEffect(() => {
    if (isAddSubcategoryModalVisible) {
      newSubcategoryNameRef.current?.focus();
    }
  }, [isAddSubcategoryModalVisible]);

  // For hiding error message after 6 seconds
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(""), 6000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (newSubcategoryName && errorMessage.includes("cannot be empty"))
      setErrorMessage("");
  }, [newSubcategoryName, errorMessage]);

  // Keyboard support for closing modal and submitting
  const handleKeyDown = (e) => {
    if (isAdding) return;
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubcategory();
    }
  };

  // Handle adding a new subcategory by calling the API
  const handleAddSubcategory = async () => {
    if (isAdding) return;
    const newSubcategoryNameTrimmed = newSubcategoryName.trim();
    if (!newSubcategoryNameTrimmed) {
      setErrorMessage("Subcategory name cannot be empty.");
      return;
    }
    if (newSubcategoryNameTrimmed.length > 20) {
      setErrorMessage("Subcategory name is too long (max 20 characters).");
      return;
    }
    if (newSubcategoryNameTrimmed.includes(",")) {
      setErrorMessage("Subcategory name cannnot contain commas.");
      return;
    }

    setIsAdding(true);
    try {
      await axiosPrivate.post("/user/subcategories", {
        categoryId: categoryId,
        name: newSubcategoryNameTrimmed,
      });
      toast.success(
        `Subcategory ${newSubcategoryNameTrimmed} added successfully.`,
        {
          autoClose: 3000,
          position: "top-center",
        }
      );
      setErrorMessage("");
      setNewSubcategoryName("");
      handleCloseAddSubcategoryModal();
      fetchSubcategoriesFromDB();
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("Failed to add subcategory: No server response.");
      } else {
        setErrorMessage(
          error?.response?.data?.error || "Failed to add subcategory."
        );
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    if (isAdding) return;
    setErrorMessage("");
    setNewSubcategoryName("");
    handleCloseAddSubcategoryModal();
  };

  return (
    <Modal
      show={isAddSubcategoryModalVisible}
      onHide={handleCancel}
      centered
      backdrop={isAdding ? "static" : true}
      keyboard={!isAdding}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Subcategory</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="subcategoryName">
            <Form.Label>Subcategory Name</Form.Label>
            <Form.Control
              aria-label="New category name"
              type="text"
              placeholder="e.g. Mobile Recharge, SIP, Insurance"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              onKeyDown={handleKeyDown}
              isInvalid={Boolean(errorMessage)}
              className={`py-1 ${errorMessage ? "shake" : ""}`}
              ref={newSubcategoryNameRef}
              maxLength={20}
            />
            <Form.Text className="text-muted">
              Provide a short, clear name to group related transactions under
              this category.
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
          onClick={handleAddSubcategory}
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
            "Add Subcategory"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddSubcategoryModal;
