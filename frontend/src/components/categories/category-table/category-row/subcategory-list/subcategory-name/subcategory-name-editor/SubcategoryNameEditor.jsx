import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { axiosPrivate } from "../../../../../../../api/axios";
import CancelIcon from "../../../../../../ui/icons/CancelIcon";
import SaveIcon from "../../../../../../ui/icons/SaveIcon";
import SubcategoryContext from "../../../../../../../store/context/subcategoryContext";

function SubcategoryNameEditor({ subcategoryId, subcategoryName, onClose }) {
  const { fetchSubcategoriesFromDB } = useContext(SubcategoryContext);
  const newSubcategoryNameRef = useRef();
  const [editedName, setEditedName] = useState(subcategoryName);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto focus input ref
  useEffect(() => {
    newSubcategoryNameRef.current?.focus();
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

  // Handle saving updated subcategory name
  const handleSave = async () => {
    if (isSaving) return;
    const editedNameTrimmed = editedName.trim();
    if (!editedNameTrimmed) {
      setErrorMessage("Subcategory name cannot be empty.");
      return;
    }
    if (editedNameTrimmed.length > 20) {
      setErrorMessage("Subcategory name is too long (max 20 characters).");
      return;
    }
    if (editedNameTrimmed.includes(",")) {
      setErrorMessage("Subcategory name cannnot contain commas.");
      return;
    }

    setIsSaving(true);
    try {
      await axiosPrivate.put(`/user/subcategories/${subcategoryId}`, {
        newName: editedNameTrimmed,
      });
      setErrorMessage("");
      onClose();
      fetchSubcategoriesFromDB();
    } catch (error) {
      if (!error?.response) {
        setErrorMessage(
          "Failed to update subcategory name: No server response."
        );
      } else {
        setErrorMessage(
          error?.response?.data?.error || "Failed to update subcategory name."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isSaving) return;
    setErrorMessage("");
    setEditedName(subcategoryName);
    onClose();
  };

  return (
    <div className="subcategory-name-editor-wrapper">
      <div className="subcategory-name-editor">
        <Form.Control
          aria-label="Edit subcategory name"
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={handleKeyDown}
          isInvalid={Boolean(errorMessage)}
          className={`subcategory-name-input ${errorMessage ? "shake" : ""}`}
          ref={newSubcategoryNameRef}
          maxLength={20}
        />
        <div className="subcategory-editor-actions">
          <Button
            type="button"
            size="sm"
            variant="outline-secondary"
            onClick={handleSave}
            aria-label="Save edited subcategory name"
            disabled={isSaving}
          >
            {isSaving ? (
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <SaveIcon width="0.9em" height="0.9em" />
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline-secondary"
            onClick={handleCancel}
            aria-label="Close subcategory name editor"
          >
            <CancelIcon width="0.9em" height="0.9em" />
          </Button>
        </div>
      </div>
      {errorMessage && (
        <div className="text-danger small mt-1">{errorMessage}</div>
      )}
    </div>
  );
}

export default SubcategoryNameEditor;
