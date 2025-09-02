import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../../api/axios";
import HeadsContext from "../../../store/context/headsContext";
import { formatAmountWithCommas } from "../../../utils/formatUtils";

function EditHeadModal({ show, headData, onClose }) {
  const editHeadNameRef = useRef();
  const { fetchHeadsFromDB } = useContext(HeadsContext);

  const [editHeadFormData, setEditHeadFormData] = useState({
    name: headData.name,
    openingBalance: headData.openingBalance?.amount ?? "",
  });
  const [inputFieldErrors, setInputFieldErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [commonErrorMessage, setCommonErrorMessage] = useState("");

  // Focus input field on mount
  useEffect(() => {
    if (show) {
      editHeadNameRef.current?.focus();
    }
  }, [show]);

  // For hiding error messages after 6 seconds
  useEffect(() => {
    if (commonErrorMessage) {
      const timeout = setTimeout(() => setCommonErrorMessage(""), 6000);
      return () => clearTimeout(timeout);
    }
  }, [commonErrorMessage, setCommonErrorMessage]);

  const checkIfInputFieldInvalid = (fieldName) => {
    return Object.keys(inputFieldErrors).includes(fieldName);
  };

  const handleResetEditHeadFormData = () => {
    setEditHeadFormData({
      name: headData.name,
      openingBalance: headData.openingBalance,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputFieldErrors((prevErrors) => {
      const { [name]: removed, ...rest } = prevErrors;
      return rest;
    });
    switch (name) {
      case "name":
        setEditHeadFormData({ ...editHeadFormData, [name]: value });
        break;
      case "openingBalance":
        const rawValue = value.replace(/,/g, "");
        const isValid = /^(\d+)?(\.\d{0,2})?$/.test(rawValue);
        const numericValue = parseFloat(rawValue);
        if (
          (isValid || rawValue === "") &&
          (rawValue === "" || numericValue <= Number.MAX_SAFE_INTEGER)
        ) {
          setEditHeadFormData({ ...editHeadFormData, [name]: rawValue });
        }
        break;
      default:
    }
  };

  // Keyboard support for closing modal
  useEffect(() => {
    if (isUpdating) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [isUpdating]);

  const validateHeadFormData = () => {
    const { name, openingBalance } = editHeadFormData;
    const nameTrimmed = name.trim();
    const errors = {};

    if (!nameTrimmed) errors.name = "Head name is required.";
    else if (nameTrimmed.length > 50)
      errors.name = "Head name is too long (max 50 characters).";
    else if (nameTrimmed.includes(","))
      errors.name = "Head name cannot contain commas.";

    if (openingBalance !== "") {
      if (isNaN(openingBalance) || Number(openingBalance) < 0)
        errors.openingBalance =
          "Opening balance must be a non-negative number.";
      else if (Number(openingBalance) > Number.MAX_SAFE_INTEGER)
        errors.openingBalance =
          "Opening balance exceeds the maximum allowed value.";
    }

    return errors;
  };

  // Handle adding a new head by calling the API
  const handleUpdateHead = async () => {
    if (isUpdating) return;
    const errors = validateHeadFormData();
    setInputFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const { name, openingBalance } = editHeadFormData;
    setIsUpdating(true);
    try {
      await axiosPrivate.put(`/user/heads/${headData._id}`, {
        name: name,
        openingBalance:
          openingBalance !== "" ? Number(openingBalance) : undefined,
      });
      handleCancel();
      toast.success(`Head "${name}" updated successfully.`, {
        position: "top-center",
        autoClose: 3000,
      });
      fetchHeadsFromDB();
    } catch (error) {
      if (!error?.response) {
        setCommonErrorMessage("Failed to update head: No server response.");
      } else {
        setCommonErrorMessage(
          error?.response?.data?.error || "Failed to update head."
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = useCallback(() => {
    if (isUpdating) return;
    setCommonErrorMessage("");
    handleResetEditHeadFormData();
    onClose();
  }, [isUpdating, onClose]);

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      centered
      backdrop={isUpdating ? "static" : true}
      keyboard={!isUpdating}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Head</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Head Name */}
          <Form.Group className="mb-3">
            <Form.Label>Head Name</Form.Label>
            <Form.Control
              aria-label="Edit head name"
              type="text"
              placeholder="e.g. Company Names, Account Names, etc"
              name="name"
              id="editHeadName"
              value={editHeadFormData.name}
              onChange={handleChange}
              isInvalid={checkIfInputFieldInvalid("name")}
              className={`py-1 ${
                checkIfInputFieldInvalid("name") ? "shake" : ""
              }`}
              ref={editHeadNameRef}
              maxLength={50}
            />
            {checkIfInputFieldInvalid("name") && (
              <div className="text-danger">{inputFieldErrors.name}</div>
            )}
          </Form.Group>

          {/* Opening Balance */}
          <Form.Group className="mb-3">
            <Form.Label>Opening Balance</Form.Label>
            <InputGroup>
              <InputGroup.Text>₹</InputGroup.Text>
              <Form.Control
                type="text"
                name="openingBalance"
                id="editHeadOpeningBalance"
                value={
                  editHeadFormData.openingBalance !== ""
                    ? formatAmountWithCommas(editHeadFormData.openingBalance)
                    : ""
                }
                autoComplete="off"
                onChange={handleChange}
                placeholder="Enter amount"
                isInvalid={checkIfInputFieldInvalid("openingBalance")}
                className={
                  checkIfInputFieldInvalid("openingBalance") ? "shake" : ""
                }
              />
            </InputGroup>
            {checkIfInputFieldInvalid("openingBalance") && (
              <div className="text-danger">
                {inputFieldErrors.openingBalance}
              </div>
            )}
          </Form.Group>
        </Form>
        {commonErrorMessage && (
          <div className="error-message" aria-live="assertive">
            {commonErrorMessage}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={handleCancel}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button
          className="btn-blue"
          onClick={handleUpdateHead}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Updating...
            </>
          ) : (
            "Update Head"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditHeadModal;
