import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";

import { axiosPrivate } from "../../../../../../../api/axios";
import CategoryContext from "../../../../../../../store/context/categoryContext";
import TransactionContext from "../../../../../../../store/context/transactionContext";
import { toast } from "react-toastify";

function AddCategoryInlineForm() {
  const newCategoryNameRef = useRef();
  const { isAddCategoryFormVisible, handleCloseAddCategoryForm } =
    useContext(TransactionContext);
  const { fetchCategoriesFromDB } = useContext(CategoryContext);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Focus input field on mount
  useEffect(() => {
    if (isAddCategoryFormVisible) {
      newCategoryNameRef.current?.focus();
    }
  }, [isAddCategoryFormVisible]);

  // For hiding error message after 6 seconds
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(null), 6000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (newCategoryName && errorMessage?.includes("cannot be empty")) {
      setErrorMessage(null);
    }
  }, [newCategoryName, errorMessage]);

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

    setIsAdding(true);
    try {
      await axiosPrivate.post("/user/categories", {
        name: newCategoryNameTrimmed,
      });
      toast.success(
        `Category '${newCategoryNameTrimmed}' added successfully.`,
        {
          autoClose: 3000,
          position: "top-center",
        }
      );
      setNewCategoryName("");
      handleCloseAddCategoryForm();
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
    setErrorMessage(null);
    setNewCategoryName("");
    handleCloseAddCategoryForm();
  };

  if (!isAddCategoryFormVisible) return null;

  return (
    <div className="add-category-inline-form">
      <div className="input-row">
        <Form.Control
          aria-label="New category name"
          type="text"
          placeholder="Enter new category name e.g. Shopping, PPF"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          isInvalid={errorMessage !== null}
          className={`${errorMessage ? "shake" : ""}`}
          ref={newCategoryNameRef}
          maxLength={20}
        />
      </div>
      {errorMessage && (
        <Alert variant="danger" className="alert-message">
          {errorMessage}
        </Alert>
      )}
      <div className="control-row">
        <Button
          variant="success"
          onClick={handleAddCategory}
          title="Add Category"
          disabled={isAdding}
          className="add-button"
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
            "Add"
          )}
        </Button>
        <Button
          variant="outline-danger"
          onClick={handleCancel}
          title="Cancel"
          className="cancel-button"
          disabled={isAdding}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default AddCategoryInlineForm;
