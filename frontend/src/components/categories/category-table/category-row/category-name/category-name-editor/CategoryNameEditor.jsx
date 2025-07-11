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

  // For hiding error message after 4 seconds
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage("");
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (editedName && errorMessage.includes("cannot be empty"))
      setErrorMessage("");
  }, [editedName, errorMessage]);

  // Keyboard support for closing modal and submitting
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isSaving) {
        e.preventDefault();
        handleCancel();
      } else if (
        e.key === "Enter" &&
        document.activeElement === newCategoryNameRef.current &&
        !isSaving
      ) {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [isSaving]);

  const handleSave = async () => {
    if (!editedName.trim()) {
      setErrorMessage("Category name cannot be empty.");
      return;
    }
    try {
      setIsSaving(true);
      await axiosPrivate.put(`/user/categories/${categoryId}`, {
        newName: editedName.trim(),
      });
      setErrorMessage("");
      onClose();
      fetchCategoriesFromDB();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.error || "Failed to update category name."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setEditedName(categoryName);
    setErrorMessage("");
  };

  return (
    <div className="category-name-editor-wrapper">
      <div className="category-name-editor">
        <Form.Control
          ref={newCategoryNameRef}
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          isInvalid={Boolean(errorMessage)}
          className={`category-name-input ${errorMessage ? "shake" : ""}`}
          aria-label="Input field for new category name"
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
