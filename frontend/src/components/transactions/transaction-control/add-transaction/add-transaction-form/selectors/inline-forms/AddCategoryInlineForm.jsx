import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Alert } from "react-bootstrap";

import { axiosPrivate } from "../../../../../../../api/axios";
import CancelIcon from "../../../../../../ui/icons/CancelIcon";
import CategoryContext from "../../../../../../../store/context/categoryContext";
import TransactionContext from "../../../../../../../store/context/transactionContext";

function AddCategoryInlineForm() {
  const newCategoryNameRef = useRef();
  const { isAddCategoryFormVisible, handleCloseAddCategoryForm } =
    useContext(TransactionContext);
  const { fetchCategoriesFromDB } = useContext(CategoryContext);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState(null);

  // Focus input field on mount
  useEffect(() => {
    if (isAddCategoryFormVisible) {
      newCategoryNameRef.current?.focus();
    }
  }, [isAddCategoryFormVisible]);

  // For hiding error message after 6 seconds
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(null), 6000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (newCategoryName && message?.text?.includes("cannot be empty")) {
      setMessage(null);
    }
  }, [newCategoryName, message]);

  const handleAddCategory = async () => {
    if (isAdding) return;
    const newCategoryNameTrimmed = newCategoryName.trim();
    if (!newCategoryNameTrimmed) {
      setMessage({
        variant: "danger",
        text: "Category name cannot be empty.",
      });
      return;
    }
    if (newCategoryNameTrimmed.length > 20) {
      setMessage({
        variant: "danger",
        text: "Category name is too long (max 20 characters).",
      });
      return;
    }

    setIsAdding(true);
    try {
      await axiosPrivate.post("/user/categories", {
        name: newCategoryNameTrimmed,
      });
      setMessage({
        variant: "success",
        text: `Category '${newCategoryNameTrimmed}' added successfully.`,
      });
      setNewCategoryName("");
      fetchCategoriesFromDB();
    } catch (error) {
      if (!error?.response) {
        setMessage({
          variant: "danger",
          text: "Failed to add category: No server response.",
        });
      } else {
        setMessage({
          variant: "danger",
          text: error?.response?.data?.error || "Failed to add category.",
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    if (isAdding) return;
    setMessage(null);
    setNewCategoryName("");
    handleCloseAddCategoryForm();
  };

  if (!isAddCategoryFormVisible) return null;

  return (
    <div className="add-category-inline-form">
      <InputGroup>
        <Form.Control
          aria-label="New category name"
          type="text"
          placeholder="Enter new category name e.g. Shopping, PPF"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          isInvalid={message?.variant === "danger"}
          className={`${message?.variant === "danger" ? "shake" : ""}`}
          ref={newCategoryNameRef}
          maxLength={20}
        />
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
          <CancelIcon />
        </Button>
      </InputGroup>
      {message && (
        <Alert variant={message?.variant} className="alert-message">
          {message?.text}
        </Alert>
      )}
    </div>
  );
}

export default AddCategoryInlineForm;
