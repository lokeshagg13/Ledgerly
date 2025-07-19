import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

import { axiosPrivate } from "../../../../api/axios";
import EyeOpenIcon from "../../../ui/icons/EyeOpenIcon";
import EyeSlashIcon from "../../../ui/icons/EyeSlashIcon";

function PasswordUpdateForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [inputFieldErrors, setInputFieldErrors] = useState({});
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [commonErrorMessage, setCommonErrorMessage] = useState("");

  // Make the common error disappear after 6 seconds
  useEffect(() => {
    if (commonErrorMessage) {
      const timeout = setTimeout(() => setCommonErrorMessage(""), 6000);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [commonErrorMessage]);

  // Handling password mismatching whenever passwords are changed
  useEffect(() => {
    const { newPassword, confirmPassword } = formData;
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
    // eslint-disable-next-line
  }, [formData.newPassword, formData.confirmPassword]);

  // Toggle show password
  const handleToggleShowPassword = (fieldName) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Handle changes in the input fields
  const handleChange = (e) => {
    setUpdateSuccess(false);
    setCommonErrorMessage("");
    setInputFieldErrors({ ...inputFieldErrors, [e.target.name]: null });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // New Password validation function
  const checkPasswordValidity = (password) => {
    if (!password) {
      return "New password can not be empty.";
    }

    const trimmed = password.trim();
    if (trimmed === "") return "Password cannot be just spaces.";
    if (password.startsWith(" ") || password.endsWith(" "))
      return "Password should not start or end with a space.";

    if (password.length < 8)
      return "Password must be at least 8 characters long.";
    if (password.length > 32) return "Password must not exceed 32 characters.";

    if (!/[a-z]/.test(password))
      return "Include at least one lowercase letter (a–z).";
    if (!/[A-Z]/.test(password))
      return "Include at least one uppercase letter (A–Z).";
    if (!/\d/.test(password)) return "Include at least one number (0–9).";
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
      return "Include at least one special character.";
    return null; // valid
  };

  // Current Password validation function
  const checkCurrentPasswordValidity = (currentPassword) => {
    if (!currentPassword)
      return "You must provide your current password to update password.";
    const currentPasswordError = checkPasswordValidity(currentPassword);
    if (currentPasswordError) return "Current Password is not correct.";
    return null;
  };

  // Confirm password validation function
  const checkConfirmPasswordValidity = (confirmPassword) => {
    if (!confirmPassword) return "Password confirmation is required.";
    // If password is already there, No need to show same password errors again for confirm password
    if (formData.newPassword) return null;
    return checkPasswordValidity(confirmPassword);
  };

  // Checks if input field valid
  const checkIfInputFieldInvalid = (fieldName) => {
    return !!inputFieldErrors[fieldName];
  };

  // Validate password form data
  const validatePasswordFormData = () => {
    const { currentPassword, newPassword, confirmPassword } = formData;
    const errors = {};

    // Validate current password
    const currentPasswordError = checkCurrentPasswordValidity(currentPassword);
    if (currentPasswordError) {
      errors.currentPassword = currentPasswordError;
      return errors;
    }

    // Validate password
    const passwordError = checkPasswordValidity(newPassword);
    if (passwordError) {
      errors.newPassword = passwordError;
    }
    // Validate confirm password
    const confirmPasswordError = checkConfirmPasswordValidity(confirmPassword);
    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError;
    }
    return errors;
  };

  // Handle submission of password updation request
  const handleUpdate = async () => {
    if (isUpdating) return;
    const errors = validatePasswordFormData();
    setInputFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const { currentPassword, newPassword, confirmPassword } = formData;
    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setIsUpdating(true);
    try {
      await axiosPrivate.put(
        "/user/updatePassword",
        JSON.stringify({
          currentPassword,
          newPassword,
        })
      );

      setPasswordMismatch(false);
      setInputFieldErrors({});
      setCommonErrorMessage("");
      setUpdateSuccess(true);
      resetFormData();
    } catch (error) {
      if (!error?.response) {
        setCommonErrorMessage(
          "Error while updating your password: No server response."
        );
      } else {
        setCommonErrorMessage(
          error?.response?.data?.error || "Error while updating your password."
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset password form
  const handleReset = () => {
    if (isUpdating) return;
    setUpdateSuccess(false);
    setPasswordMismatch(false);
    setInputFieldErrors({});
    setCommonErrorMessage("");
    resetFormData();
  };

  return (
    <Form className="password-update-form">
      <h5 className="mb-3">Update Password</h5>
      <Form.Group className="custom-input-group">
        <Form.Label>Current Password</Form.Label>
        <div className="custom-input-col">
          <div className="password-field">
            <Form.Control
              type={showPassword.currentPassword ? "text" : "password"}
              name="currentPassword"
              id="profileCurrentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Current password"
              isInvalid={checkIfInputFieldInvalid("currentPassword")}
              className={`form-input ${
                checkIfInputFieldInvalid("currentPassword") ? "shake" : ""
              }`}
              required
            />
            <span
              className="toggle-password"
              onClick={() => handleToggleShowPassword("currentPassword")}
            >
              {showPassword.currentPassword ? (
                <EyeOpenIcon />
              ) : (
                <EyeSlashIcon />
              )}
            </span>
          </div>
          {checkIfInputFieldInvalid("currentPassword") && (
            <div className="text-danger">
              {inputFieldErrors.currentPassword}
            </div>
          )}
        </div>
      </Form.Group>
      <Form.Group className="custom-input-group">
        <Form.Label>New Password</Form.Label>
        <div className="custom-input-col">
          <div className="password-field">
            <Form.Control
              type={showPassword.newPassword ? "text" : "password"}
              name="newPassword"
              id="profilePassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New password"
              isInvalid={checkIfInputFieldInvalid("newPassword")}
              className={`form-input ${
                checkIfInputFieldInvalid("newPassword") ? "shake" : ""
              }`}
              required
            />
            <span
              className="toggle-password"
              onClick={() => handleToggleShowPassword("newPassword")}
            >
              {showPassword.newPassword ? <EyeOpenIcon /> : <EyeSlashIcon />}
            </span>
          </div>
          {checkIfInputFieldInvalid("newPassword") && (
            <div className="text-danger">{inputFieldErrors.newPassword}</div>
          )}
        </div>
      </Form.Group>
      <Form.Group className="custom-input-group">
        <Form.Label>Confirm Password</Form.Label>
        <div className="custom-input-col">
          <div className="password-field">
            <Form.Control
              type={showPassword.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="profileConfirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              isInvalid={checkIfInputFieldInvalid("confirmPassword")}
              className={`form-input ${
                checkIfInputFieldInvalid("confirmPassword") ? "shake" : ""
              }`}
              required
            />
            <span
              className="toggle-password"
              onClick={() => handleToggleShowPassword("confirmPassword")}
            >
              {showPassword.confirmPassword ? (
                <EyeOpenIcon />
              ) : (
                <EyeSlashIcon />
              )}
            </span>
          </div>
          {checkIfInputFieldInvalid("confirmPassword") && (
            <div className="text-danger">
              {inputFieldErrors.confirmPassword}
            </div>
          )}
        </div>
      </Form.Group>
      {passwordMismatch && <p className="error">Passwords do not match.</p>}
      {commonErrorMessage && <p className="error">{commonErrorMessage}</p>}
      {updateSuccess && (
        <div className="message">
          Password updated successfully. We suggest you to login again with the
          new password.
        </div>
      )}
      <div className="password-update-form-control">
        <Button
          variant="primary"
          type="button"
          onClick={handleUpdate}
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
            "Update Password"
          )}
        </Button>
        <Button
          variant="outline-primary"
          type="button"
          onClick={handleReset}
          disabled={isUpdating}
        >
          Reset
        </Button>
      </div>
    </Form>
  );
}

export default PasswordUpdateForm;
