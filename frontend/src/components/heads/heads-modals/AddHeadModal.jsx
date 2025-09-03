import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../../api/axios";
import HeadsContext from "../../../store/context/headsContext";
import { formatAmountWithCommas } from "../../../utils/formatUtils";

function AddHeadModal() {
  const newHeadNameRef = useRef();
  const { isAddHeadModalVisible, fetchHeadsFromDB, handleCloseAddHeadModal } =
    useContext(HeadsContext);

  const [addHeadFormData, setAddHeadFormData] = useState({
    name: "",
    openingBalance: "",
  });
  const [inputFieldErrors, setInputFieldErrors] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [commonErrorMessage, setCommonErrorMessage] = useState("");

  // Focus input field on mount
  useEffect(() => {
    if (isAddHeadModalVisible) {
      newHeadNameRef.current?.focus();
    }
  }, [isAddHeadModalVisible]);

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

  const handleResetAddHeadFormData = () => {
    setAddHeadFormData({
      name: "",
      openingBalance: "",
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
        setAddHeadFormData({ ...addHeadFormData, [name]: value });
        break;
      case "openingBalance":
        const rawValue = value.replace(/,/g, "");
        const isValid = /^(\d+)?(\.\d{0,2})?$/.test(rawValue);
        const numericValue = parseFloat(rawValue);
        if (
          (isValid || rawValue === "") &&
          (rawValue === "" || numericValue <= Number.MAX_SAFE_INTEGER)
        ) {
          setAddHeadFormData({ ...addHeadFormData, [name]: rawValue });
        }
        break;
      default:
    }
  };

  // Keyboard support for closing modal and submitting
  useEffect(() => {
    if (isAdding) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddHead();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [isAdding]);

  const validateHeadFormData = () => {
    const { name, openingBalance } = addHeadFormData;
    const nameTrimmed = name.trim();

    const errors = {};

    // Validate name field
    if (!nameTrimmed) errors.name = "Head name is required.";
    else if (nameTrimmed.length > 50)
      errors.name = "Head name is too long (max 50 characters).";
    else if (nameTrimmed.includes(","))
      errors.name = "Head name cannot contain commas.";

    // Validate opening balance field
    if (openingBalance !== "") {
      if (isNaN(openingBalance) || Number(openingBalance) < 0)
        errors.openingBalance =
          "Opening balance must be a non-negative number.";
      else if (Number(openingBalance) > Number.MAX_SAFE_INTEGER)
        errors.amount = "Opening balance exceeds the maximum allowed value.";
    }

    return errors;
  };

  // Handle adding a new head by calling the API
  const handleAddHead = async () => {
    if (isAdding) return;
    const errors = validateHeadFormData();
    setInputFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const { name, openingBalance } = addHeadFormData;
    setIsAdding(true);
    try {
      await axiosPrivate.post("/user/heads", {
        name: name,
        openingBalance:
          openingBalance !== "" ? Number(openingBalance) : undefined,
      });
      handleCancel();
      toast.success(`Head "${name}" added successfully.`, {
        position: "top-center",
        autoClose: 3000,
      });
      fetchHeadsFromDB();
    } catch (error) {
      if (!error?.response) {
        setCommonErrorMessage("Failed to add head: No server response.");
      } else {
        setCommonErrorMessage(
          error?.response?.data?.error || "Failed to add head."
        );
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancel = useCallback(() => {
    if (isAdding) return;
    setCommonErrorMessage("");
    handleResetAddHeadFormData();
    handleCloseAddHeadModal();
  }, [isAdding, handleCloseAddHeadModal]);

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
          <Form.Group className="mb-3">
            <Form.Label>Head Name</Form.Label>
            <Form.Control
              aria-label="New head name"
              type="text"
              placeholder="e.g. Company Names, Account Names, etc"
              name="name"
              id="newHeadName"
              value={addHeadFormData.name}
              onChange={handleChange}
              isInvalid={checkIfInputFieldInvalid("name")}
              className={`py-1 ${
                checkIfInputFieldInvalid("name") ? "shake" : ""
              }`}
              ref={newHeadNameRef}
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
                id="newHeadOpeningBalance"
                value={
                  addHeadFormData.openingBalance !== ""
                    ? formatAmountWithCommas(addHeadFormData.openingBalance)
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
