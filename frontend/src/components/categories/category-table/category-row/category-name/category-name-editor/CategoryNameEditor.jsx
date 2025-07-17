import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { axiosPrivate } from "../../../../../../api/axios";
import CancelIcon from "../../../../../ui/icons/CancelIcon";
import SaveIcon from "../../../../../ui/icons/SaveIcon";
import CategoryContext from "../../../../../../store/context/categoryContext";

function CategoryNameEditor({ categoryId, categoryName, onClose }) {
  const { fetchCategoriesFromDB } = useContext(CategoryContext);
  const newCategoryNameRef = useRef();
  const [editedName, setEditedName] = useState(categoryName);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto focus input ref
  useEffect(() => {
    newCategoryNameRef.current?.focus();
  }, []);

  // For hiding error message after 6 seconds
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(""), 6000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (editedName && errorMessage.includes("cannot be empty"))
      setErrorMessage("");
  }, [editedName, errorMessage]);

  // Keyboard support for closing modal and submitting
  const handleKeyDown = (e) => {
    if (isSaving) return;
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  // Handle saving updated category name
  const handleSave = async () => {
    if (isSaving) return;
    const editedNameTrimmed = editedName.trim();
    if (!editedNameTrimmed) {
      setErrorMessage("Category name cannot be empty.");
      return;
    }
    if (editedNameTrimmed.length > 20) {
      setErrorMessage("Category name is too long (max 20 characters).");
      return;
    }
    if (editedNameTrimmed.includes(",")) {
      setErrorMessage("Category name cannnot contain commas.");
      return;
    }

    setIsSaving(true);
    try {
      await axiosPrivate.put(`/user/categories/${categoryId}`, {
        newName: editedNameTrimmed,
      });
      setErrorMessage("");
      onClose();
      fetchCategoriesFromDB();
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("Failed to update category name: No server response.");
      } else {
        setErrorMessage(
          error?.response?.data?.error || "Failed to update category name."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isSaving) return;
    setErrorMessage("");
    setEditedName(categoryName);
    onClose();
  };

  return (
    <div className="category-name-editor-wrapper">
      <div className="category-name-editor">
        <Form.Control
          aria-label="Edit category name"
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={handleKeyDown}
          isInvalid={Boolean(errorMessage)}
          className={`category-name-input ${errorMessage ? "shake" : ""}`}
          ref={newCategoryNameRef}
          maxLength={20}
        />
        <div className="category-editor-actions">
          <Button
            type="button"
            size="sm"
            variant="outline-secondary"
            onClick={handleSave}
            aria-label="Save edited category name"
            disabled={isSaving}
          >
            {isSaving ? (
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <SaveIcon width="1.2em" height="1.2em" />
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline-secondary"
            onClick={handleCancel}
            aria-label="Close category name editor"
          >
            <CancelIcon width="1.2em" height="1.2em" />
          </Button>
        </div>
      </div>
      {errorMessage && (
        <div className="text-danger small mt-1">{errorMessage}</div>
      )}
    </div>
  );
}

export default CategoryNameEditor;
