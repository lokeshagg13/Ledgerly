import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Alert } from "react-bootstrap";

import { axiosPrivate } from "../../../../../../../api/axios";
import TransactionContext from "../../../../../../../store/context/transactionContext";
import CancelIcon from "../../../../../../ui/icons/CancelIcon";

function AddSubcategoryInlineForm() {
  const newSubcategoryNameRef = useRef();
  const {
    addTransactionFormData,
    isAddSubcategoryFormVisible,
    fetchSubcategoriesFromDB,
    closeAddSubcategoryForm,
  } = useContext(TransactionContext);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState(null);

  // Focus input field on mount
  useEffect(() => {
    if (isAddSubcategoryFormVisible) {
      newSubcategoryNameRef.current?.focus();
    }
  }, [isAddSubcategoryFormVisible]);

  // For hiding error message after 4 seconds
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage(null);
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (newSubcategoryName && message?.text?.includes("cannot be empty")) {
      setMessage(null);
    }
  }, [newSubcategoryName, message]);

  // Keyboard support for closing modal and submitting
  useEffect(() => {
    if (!isAddSubcategoryFormVisible) return;
    const handleKeyDown = (e) => {
      if (
        e.key === "Enter" &&
        document.activeElement === newSubcategoryNameRef.current &&
        !isAdding
      ) {
        e.preventDefault();
        handleAddSubcategory();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [isAddSubcategoryFormVisible, isAdding]);

  const handleAddSubcategory = async () => {
    const { categoryId } = addTransactionFormData;
    const newSubcategoryNameTrimmed = newSubcategoryName.trim();
    if (!categoryId) {
      setMessage({
        variant: "danger",
        message: "Select a category first.",
      });
      return;
    }
    if (!newSubcategoryNameTrimmed) {
      setMessage({
        variant: "danger",
        text: "Subcategory name cannot be empty.",
      });
      return;
    }
    if (newSubcategoryNameTrimmed.length > 20) {
      setMessage({
        variant: "danger",
        text: "Subcategory name is too long (max 20 characters).",
      });
      return;
    }

    setIsAdding(true);
    try {
      await axiosPrivate.post("/user/subcategories", {
        name: newSubcategoryNameTrimmed,
        categoryId: categoryId,
      });
      setMessage({
        variant: "success",
        text: `Subcategory '${newSubcategoryNameTrimmed}' added successfully.`,
      });
      setNewSubcategoryName("");
      fetchSubcategoriesFromDB();
    } catch (error) {
      if (!error?.response) {
        setMessage({
          variant: "danger",
          text: "Failed to add subcategory: No server response.",
        });
      } else {
        setMessage({
          variant: "danger",
          text: error?.response?.data?.error || "Failed to add subcategory.",
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    if (isAdding) return;
    setMessage(null);
    setNewSubcategoryName("");
    closeAddSubcategoryForm();
  };

  if (!isAddSubcategoryFormVisible) return null;

  return (
    <div className="add-subcategory-inline-form">
      <InputGroup>
        <Form.Control
          aria-label="New subcategory name"
          type="text"
          placeholder="Enter new subcategory name"
          value={newSubcategoryName}
          onChange={(e) => setNewSubcategoryName(e.target.value)}
          isInvalid={message?.variant === "danger"}
          className={`${message?.variant === "danger" ? "shake" : ""}`}
          ref={newSubcategoryNameRef}
          maxLength={20}
        />
        <Button
          variant="success"
          onClick={handleAddSubcategory}
          title="Add Subcategory"
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

export default AddSubcategoryInlineForm;
