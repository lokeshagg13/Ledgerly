import { useContext, useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../../api/axios";
import HeadsContext from "../../../store/context/headsContext";

function AddHeadModal() {
  const newHeadNameRef = useRef();
  const {
    isAddHeadModalVisible,
    fetchHeadsFromDB,
    handleCloseAddHeadModal,
  } = useContext(HeadsContext);

  const [newHeadName, setNewHeadName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Focus input field on mount
  useEffect(() => {
    if (isAddHeadModalVisible) {
      newHeadNameRef.current?.focus();
    }
  }, [isAddHeadModalVisible]);

  // Hide error after 6 seconds
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(""), 6000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (newHeadName && errorMessage.includes("cannot be empty")) {
      setErrorMessage("");
    }
  }, [newHeadName, errorMessage]);

  // Keyboard support for closing modal and submitting
  const handleKeyDown = (e) => {
    if (isAdding) return;
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleAddHead();
    }
  };

  // Handle adding a new head by calling the API
  const handleAddHead = async () => {
    if (isAdding) return;
    const newHeadNameTrimmed = newHeadName.trim();

    if (!newHeadNameTrimmed) {
      setErrorMessage("Head name cannot be empty.");
      return;
    }
    if (newHeadNameTrimmed.length > 50) {
      setErrorMessage("Head name is too long (max 50 characters).");
      return;
    }
    if (newHeadNameTrimmed.includes(",")) {
      setErrorMessage("Head name cannot contain commas.");
      return;
    }

    setIsAdding(true);
    try {
      await axiosPrivate.post("/user/heads", {
        name: newHeadNameTrimmed,
      });

      toast.success(`Head "${newHeadNameTrimmed}" added successfully.`, {
        autoClose: 3000,
        position: "top-center",
      });

      setErrorMessage("");
      setNewHeadName("");
      handleCloseAddHeadModal();
      fetchHeadsFromDB();
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("Failed to add head: No server response.");
      } else {
        setErrorMessage(error?.response?.data?.error || "Failed to add head.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    if (isAdding) return;
    setErrorMessage("");
    setNewHeadName("");
    handleCloseAddHeadModal();
  };

  return (
    <Modal
      show={isAddHeadModalVisible}
      onHide={handleCancel}
      centered
      backdrop={isAdding ? "static" : true}
      keyboard={!isAdding}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Head</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="headName">
            <Form.Label>Head Name</Form.Label>
            <Form.Control
              aria-label="New head name"
              type="text"
              placeholder="e.g. Company Names, Account Names, etc"
              value={newHeadName}
              onChange={(e) => setNewHeadName(e.target.value)}
              onKeyDown={handleKeyDown}
              isInvalid={Boolean(errorMessage)}
              className={`py-1 ${errorMessage ? "shake" : ""}`}
              ref={newHeadNameRef}
              maxLength={50}
            />
            <Form.Text className="text-muted">
              Enter a unique name involved in transactions within your firm.
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
          onClick={handleAddHead}
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
            "Add Head"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddHeadModal;
