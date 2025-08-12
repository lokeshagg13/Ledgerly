import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";

import { axiosPrivate } from "../../../../../../../api/axios";
import CategoryContext from "../../../../../../../store/context/categoryContext";
import TransactionContext from "../../../../../../../store/context/transactionContext";
import { toast } from "react-toastify";

function AddSubcategoryInlineForm({ onSubcategoryAdded }) {
  const newSubcategoryNameRef = useRef();
  const {
    addTransactionFormData,
    isAddSubcategoryFormVisible,
    handleCloseAddSubcategoryForm,
  } = useContext(TransactionContext);
  const { categories, fetchSubcategoryMappingFromDB } =
    useContext(CategoryContext);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Focus input field on mount
  useEffect(() => {
    if (isAddSubcategoryFormVisible) {
      newSubcategoryNameRef.current?.focus();
    }
  }, [isAddSubcategoryFormVisible]);

  // For hiding error message after 6 seconds
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(null), 6000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (newSubcategoryName && errorMessage?.includes("cannot be empty")) {
      setErrorMessage(null);
    }
  }, [newSubcategoryName, errorMessage]);

  const handleAddSubcategory = async () => {
    if (isAdding) return;
    const { categoryId } = addTransactionFormData;
    const newSubcategoryNameTrimmed = newSubcategoryName.trim();
    if (!categoryId) {
      setErrorMessage("Select a category first.");
      return;
    }
    if (!newSubcategoryNameTrimmed) {
      setErrorMessage("Subcategory name cannot be empty.");
      return;
    }
    if (newSubcategoryNameTrimmed.length > 20) {
      setErrorMessage("Subcategory name is too long (max 20 characters).");
      return;
    }

    setIsAdding(true);
    try {
      await axiosPrivate.post("/user/subcategories", {
        name: newSubcategoryNameTrimmed,
        categoryId: categoryId,
      });
      toast.success(
        `Subcategory '${newSubcategoryNameTrimmed}' added successfully.`,
        {
          autoClose: 3000,
          position: "top-center",
        }
      );
      setNewSubcategoryName("");
      handleCloseAddSubcategoryForm();
      const updatedSubcategoryMapping = await fetchSubcategoryMappingFromDB();
      const categoryName = Object.keys(updatedSubcategoryMapping).find(
        (key) => key === categories.find((cat) => cat._id === categoryId)?.name
      );
      if (categoryName) {
        const newlyAdded = updatedSubcategoryMapping[categoryName].find(
          (sub) => sub.name === newSubcategoryNameTrimmed
        );
        if (newlyAdded && onSubcategoryAdded) {
          onSubcategoryAdded(newlyAdded._id);
        }
      }
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
    setErrorMessage(null);
    setNewSubcategoryName("");
    handleCloseAddSubcategoryForm();
  };

  if (!isAddSubcategoryFormVisible) return null;

  return (
    <div className="add-subcategory-inline-form">
      <div className="input-row">
        <Form.Control
          aria-label="New subcategory name"
          type="text"
          placeholder="Enter new subcategory name"
          value={newSubcategoryName}
          onChange={(e) => setNewSubcategoryName(e.target.value)}
          isInvalid={Boolean(errorMessage)}
          className={`${errorMessage ? "shake" : ""}`}
          ref={newSubcategoryNameRef}
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
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default AddSubcategoryInlineForm;
