import { useEffect, useRef, useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

import useAuth from "../../../../store/hooks/useAuth";
import { axiosPrivate } from "../../../../api/axios";
import {
  formatAmountWithCommas,
  formatDateForFancyDisplay,
} from "../../../../utils/formatUtils";
import OpeningBalanceTooltip from "./opening-balance-tooltip/OpeningBalanceTooltip";
import OpeningBalanceChangeModal from "./opening-balance-change-modal/OpeningBalanceChangeModal";
import { toast } from "react-toastify";

function ProfileInfoForm() {
  const { auth, setAuth } = useAuth();

  const originalData = {
    name: auth?.name || "",
    openingBalance: Math.abs(auth?.openingBalance?.amount || 0).toString(),
    balanceType: auth?.openingBalance?.amount >= 0 ? "credit" : "debit",
  };
  const [formData, setFormData] = useState({
    name: originalData.name,
    openingBalance: originalData.openingBalance,
    balanceType: originalData.balanceType,
  });
  const [unsavedFields, setUnsavedFields] = useState({
    name: false,
    openingBalance: false,
    balanceType: false,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isBalanceChangeModalVisible, setIsBalanceChangeModalVisible] =
    useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [inputFieldErrors, setInputFieldErrors] = useState({});
  const [commonErrorMessage, setCommonErrorMessage] = useState("");
  const pendingUpdatePayload = useRef(null);

  // Make the common error disappear after 6 seconds
  useEffect(() => {
    if (commonErrorMessage) {
      const timeout = setTimeout(() => setCommonErrorMessage(""), 6000);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [commonErrorMessage]);

  // Handle changes in the input fields
  const handleChange = (e) => {
    setCommonErrorMessage("");
    const { name, value } = e.target;
    setInputFieldErrors({ ...inputFieldErrors, [name]: null });
    let newFormData = { ...formData };
    let newUnsavedFields = { ...unsavedFields };
    if (name === "name" || name === "balanceType") {
      const valueTrimmed = value.trim();
      newFormData[name] = value;
      newUnsavedFields[name] = valueTrimmed !== originalData[name];
    } else if (name === "openingBalance") {
      const rawValue = value.replace(/,/g, "");
      const isValid = /^(\d+)?(\.\d{0,2})?$/.test(rawValue);
      const numericValue = parseFloat(rawValue);
      if (
        (isValid || rawValue === "") &&
        (rawValue === "" || numericValue <= Number.MAX_SAFE_INTEGER)
      ) {
        newFormData[name] = rawValue;
        newUnsavedFields[name] = rawValue !== originalData[name];
        setFormData(newFormData);
      }
    }

    setFormData(newFormData);
    setUnsavedFields(newUnsavedFields);
    setHasChanges(Object.values(newUnsavedFields).some(Boolean));
  };

  // Name validation function
  const checkNameValidity = (name) => {
    const nameTrimmed = name.trim();
    if (!nameTrimmed) return "User name is required.";
    else if (/[^a-zA-Z ]/.test(nameTrimmed))
      return "User name is invalid. Only alphabets and spaces allowed.";
    else if (nameTrimmed.length > 30)
      return "User name must be max. 30 characters long.";
    return null;
  };

  // Opening balance validation function
  const checkOpeningBalanceValidity = (balance) => {
    if (!balance) return "Opening balance is required.";
    else if (isNaN(balance))
      return "Invalid value entered for opening balance.";
    else if (Number(balance) > Number.MAX_SAFE_INTEGER)
      return "This value of opening balance is too large.";
    return null;
  };

  // Checks if input field valid
  const checkIfInputFieldInvalid = (fieldName) => {
    return !!inputFieldErrors[fieldName];
  };

  // Validate profile form data
  const validateProfileFormData = () => {
    const { name, openingBalance, balanceType } = formData;
    const errors = {};

    // Validate name field
    const nameError = checkNameValidity(name);
    if (nameError) {
      errors.name = nameError;
    }
    // Validate opening balance
    const openingBalanceError = checkOpeningBalanceValidity(openingBalance);
    if (openingBalanceError) {
      errors.openingBalance = openingBalanceError;
    }
    // Validate balance type
    if (!["credit", "debit"].includes(balanceType)) {
      errors.balanceType = "Invalid value for opening balance type.";
    }
    return errors;
  };

  // Handle update of profile (check which fields are changed and show confirmation modal for change in balance)
  const handleUpdate = async () => {
    if (isUpdating) return;
    const errors = validateProfileFormData();
    setInputFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const { name, openingBalance, balanceType } = formData;
    const payload = {};

    if (name.trim() !== originalData.name.trim()) {
      payload.name = name.trim();
    }

    if (
      openingBalance !== originalData.openingBalance ||
      balanceType !== originalData.balanceType
    ) {
      const formattedAmount = `${
        balanceType === "debit" ? "-" : ""
      }${openingBalance}`;
      payload.openingBalance = parseFloat(formattedAmount);
      pendingUpdatePayload.current = payload;
      handleOpenBalanceChangeModal();
      return;
    }

    if (Object.keys(payload).length === 0) {
      setCommonErrorMessage("No changes detected to update.");
      return;
    }

    // If only name changed, proceed directly
    performProfileInfoUpdate(payload);
  };

  // Perform actual profile info update via the api call
  const performProfileInfoUpdate = async (payload) => {
    setIsUpdating(true);
    try {
      const response = await axiosPrivate.put(
        "/user/profile",
        JSON.stringify(payload)
      );

      const { name: updatedName, openingBalance: updatedBalance } =
        response?.data?.updated;

      toast.success("Profile updated successfully.", {
        position: "top-center",
        autoClose: 3000,
      });
      setInputFieldErrors({});
      setCommonErrorMessage("");
      setAuth({ ...auth, name: updatedName, openingBalance: updatedBalance });
      setHasChanges(false);
      handleResetUnsavedFields();
    } catch (error) {
      if (!error?.response) {
        setCommonErrorMessage(
          "Error while updating your profile: No server response."
        );
      } else {
        setCommonErrorMessage(
          error?.response?.data?.error || "Error while updating your profile."
        );
      }
    } finally {
      setIsUpdating(false);
      handleCloseBalanceChangeModal();
    }
  };

  // Reset unsaved fields
  const handleResetUnsavedFields = () => {
    setUnsavedFields({
      name: false,
      openingBalance: false,
      balanceType: false,
    });
  };

  // Reset profile form
  const handleResetProfileForm = () => {
    if (isUpdating) return;
    handleResetUnsavedFields();
    setFormData(originalData);
    setHasChanges(false);
    setInputFieldErrors({});
    setCommonErrorMessage("");
  };

  // Open Balance Change Modal
  const handleOpenBalanceChangeModal = () => {
    setIsBalanceChangeModalVisible(true);
  };

  // Close Balance Change Modal
  const handleCloseBalanceChangeModal = () => {
    setIsBalanceChangeModalVisible(false);
  };

  // Cancelling Balance Change Modal
  const handleCancelBalanceChangeModal = () => {
    handleCloseBalanceChangeModal();
    pendingUpdatePayload.current = null;
  };

  // Confirm Balance Change Modal
  const handleConfirmBalanceChangeModal = () => {
    if (pendingUpdatePayload.current) {
      performProfileInfoUpdate(pendingUpdatePayload.current);
    }
  };

  return (
    <Form className="profile-info-form">
      <h5 className="mb-3">Profile Info</h5>
      <Form.Group className="custom-input-group">
        <Form.Label>Name</Form.Label>
        <div className="custom-input-col">
          <Form.Control
            type="text"
            name="name"
            id="profileName"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            isInvalid={checkIfInputFieldInvalid("name")}
            className={`form-input ${
              checkIfInputFieldInvalid("name") ? "shake" : ""
            } ${unsavedFields.name ? "unsaved" : ""}`}
            required
          />
          {checkIfInputFieldInvalid("name") && (
            <div className="text-danger">{inputFieldErrors.name}</div>
          )}
        </div>
      </Form.Group>
      <Form.Group className="custom-input-group">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          id="profileEmail"
          value={auth.email}
          className="form-input form-fixed"
          readOnly
        />
      </Form.Group>
      <Form.Group className="custom-input-group">
        <Form.Label>Profile Created On</Form.Label>
        <Form.Control
          type="text"
          id="profileCreatedAt"
          value={formatDateForFancyDisplay(auth.createdAt, false, true)}
          className="form-input form-fixed"
          readOnly
        />
      </Form.Group>
      <Form.Group className="custom-input-group">
        <Form.Label>Opening Balance</Form.Label>
        <div className="custom-input-col">
          <InputGroup>
            <InputGroup.Text>₹</InputGroup.Text>
            <div className="opening-balance-input-wrapper">
              <Form.Control
                type="text"
                name="openingBalance"
                id="profileOpeningBalance"
                value={
                  formData.openingBalance !== ""
                    ? formatAmountWithCommas(formData.openingBalance)
                    : ""
                }
                onChange={handleChange}
                placeholder="Opening Balance"
                isInvalid={checkIfInputFieldInvalid("openingBalance")}
                className={`form-input ${
                  checkIfInputFieldInvalid("openingBalance") ? "shake" : ""
                } ${
                  unsavedFields.openingBalance || unsavedFields.balanceType
                    ? "unsaved"
                    : ""
                }
                `}
                inputMode="decimal"
                required
              />
              <OpeningBalanceTooltip />
            </div>
            <Form.Select
              name="balanceType"
              id="profileBalanceType"
              value={formData.balanceType}
              onChange={handleChange}
              isInvalid={checkIfInputFieldInvalid("balanceType")}
              className={`form-input ${
                checkIfInputFieldInvalid("balanceType") ? "shake" : ""
              }`}
              required
            >
              <option value="credit">CR</option>
              <option value="debit">DR</option>
            </Form.Select>
          </InputGroup>
          <Form.Text className="last-updated-text">
            Last updated on:{" "}
            {formatDateForFancyDisplay(
              auth?.openingBalance?.lastUpdated,
              true,
              true
            )}
          </Form.Text>
          {checkIfInputFieldInvalid("openingBalance") && (
            <div className="text-danger">{inputFieldErrors.openingBalance}</div>
          )}
          {checkIfInputFieldInvalid("balanceType") && (
            <div className="text-danger">{inputFieldErrors.balanceType}</div>
          )}
        </div>
      </Form.Group>
      {commonErrorMessage && <p className="error">{commonErrorMessage}</p>}
      <div className="profile-info-form-control">
        <Button
          variant="primary"
          type="button"
          onClick={handleUpdate}
          disabled={isUpdating || !hasChanges}
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
            "Save Changes"
          )}
        </Button>
        <Button
          variant="outline-primary"
          type="button"
          onClick={handleResetProfileForm}
          disabled={isUpdating}
        >
          Reset
        </Button>
      </div>
      <OpeningBalanceChangeModal
        show={isBalanceChangeModalVisible}
        onClose={handleCancelBalanceChangeModal}
        onConfirm={handleConfirmBalanceChangeModal}
      />
    </Form>
  );
}

export default ProfileInfoForm;
