import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { axiosPrivate } from "../../../../../../api/axios";
import CancelIcon from "../../../../../ui/icons/CancelIcon";
import SaveIcon from "../../../../../ui/icons/SaveIcon";
import HeadsContext from "../../../../../../store/context/headsContext";

function HeadNameEditor({ headId, headName, onClose }) {
  const { fetchHeadsFromDB } = useContext(HeadsContext);
  const newHeadNameRef = useRef();
  const [editedName, setEditedName] = useState(headName);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto focus input ref
  useEffect(() => {
    newHeadNameRef.current?.focus();
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

  // Handle saving updated head name
  const handleSave = async () => {
    if (isSaving) return;
    const editedNameTrimmed = editedName.trim();
    if (!editedNameTrimmed) {
      setErrorMessage("Head name cannot be empty.");
      return;
    }
    if (editedNameTrimmed.length > 50) {
      setErrorMessage("Head name is too long (max 50 characters).");
      return;
    }
    if (editedNameTrimmed.includes(",")) {
      setErrorMessage("Head name cannot contain commas.");
      return;
    }

    setIsSaving(true);
    try {
      await axiosPrivate.put(`/user/heads/${headId}`, {
        newName: editedNameTrimmed,
      });
      setErrorMessage("");
      onClose();
      fetchHeadsFromDB();
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("Failed to update head name: No server response.");
      } else {
        setErrorMessage(
          error?.response?.data?.error || "Failed to update head name."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isSaving) return;
    setErrorMessage("");
    setEditedName(headName);
    onClose();
  };

  return (
    <div className="head-name-editor-wrapper">
      <div className="head-name-editor">
        <Form.Control
          aria-label="Edit head name"
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={handleKeyDown}
          isInvalid={Boolean(errorMessage)}
          className={`head-name-input ${errorMessage ? "shake" : ""}`}
          ref={newHeadNameRef}
          maxLength={50}
        />
        <div className="head-editor-actions">
          <Button
            type="button"
            size="sm"
            variant="outline-secondary"
            onClick={handleSave}
            aria-label="Save edited head name"
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
            aria-label="Close head name editor"
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

export default HeadNameEditor;
