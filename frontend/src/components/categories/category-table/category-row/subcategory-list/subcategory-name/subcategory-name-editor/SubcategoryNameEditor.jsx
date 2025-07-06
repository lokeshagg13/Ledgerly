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
        document.activeElement === newSubcategoryNameRef.current &&
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
      setErrorMessage("Subcategory name cannot be empty.");
      return;
    }
    try {
      setIsSaving(true);
      await axiosPrivate.put(
        `/user/transactions/subcategories/${subcategoryId}`,
        {
          newName: editedName.trim(),
        }
      );
      setErrorMessage("");
      onClose();
      fetchSubcategoriesFromDB();
    } catch (error) {
      console.log("Error while updating subcategory name:", error);
      setErrorMessage(
        error?.response?.data?.error || "Failed to update subcategory name."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setEditedName(subcategoryName);
    setErrorMessage("");
  };

  return (
    <div className="subcategory-name-editor-wrapper">
      <div className="subcategory-name-editor">
        <Form.Control
          ref={newSubcategoryNameRef}
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          isInvalid={Boolean(errorMessage)}
          className={`subcategory-name-input ${errorMessage ? "shake" : ""}`}
          aria-label="Edit subcategory name"
          maxLength={20}
        />
        <div className="subcategory-editor-actions">
          <Button
            type="button"
            size="sm"
            variant="outline-secondary"
            onClick={handleSave}
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
