import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

import axios from "../../../../api/axios";
import EyeOpenIcon from "../../../ui/icons/EyeOpenIcon";
import EyeSlashIcon from "../../../ui/icons/EyeSlashIcon";

function RegisterForm() {
  const nameRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputFieldErrors, setInputFieldErrors] = useState({});
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [commonErrorMessage, setCommonErrorMessage] = useState("");

  // Bring name field into focus on entering the register form
  useEffect(() => {
    nameRef.current.focus();
  }, []);

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
    const { password, confirmPassword } = formData;
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
    // eslint-disable-next-line
  }, [formData.password, formData.confirmPassword]);

  // Keyboard support for submitting register form
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSubmitting) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Handle changes in the input fields
  const handleChange = (e) => {
    setRegisterSuccess(false);
    setCommonErrorMessage("");
    setInputFieldErrors({ ...inputFieldErrors, [e.target.name]: null });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Name validation function
  const checkNameValidity = (name) => {
    const nameTrimmed = name.trim();
    if (!nameTrimmed) return "User name is required.";
    else if (/[^a-zA-Z ]/.test(nameTrimmed)) return "User name is invalid. Only alphabets and spaces allowed.";
    else if (nameTrimmed.length > 30)
      return "User name must be max. 30 characters long.";
    return null;
  };

  // Email validation function
  const checkEmailValidity = (email) => {
    const emailTrimmed = email.trim();
    const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailTrimmed) return "Email is required.";
    else if (!emailRegex.test(emailTrimmed))
      return "Please enter a valid email address.";
    return null;
  };

  // Password validation function
  const checkPasswordValidity = (password) => {
    if (!password) {
      return "Password is required.";
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

  // Confirm password validation function
  const checkConfirmPasswordValidity = (confirmPassword) => {
    if (!confirmPassword) return "Password confirmation is required.";
    // If password is already there, No need to show same password errors again for confirm password
    if (formData.password) return null;
    return checkPasswordValidity(confirmPassword);
  };

  // Checks if input field valid
  const checkIfInputFieldInvalid = (fieldName) => {
    return !!inputFieldErrors[fieldName];
  };

  // Validate register form data
  const validateRegisterFormData = () => {
    const { name, email, password, confirmPassword } = formData;
    const errors = {};

    // Validate name field
    const nameError = checkNameValidity(name);
    if (nameError) {
      errors.name = nameError;
    }
    // Validate email
    const emailError = checkEmailValidity(email);
    if (emailError) {
      errors.email = emailError;
    }
    // Validate password
    const passwordError = checkPasswordValidity(password);
    if (passwordError) {
      errors.password = passwordError;
    }
    // Validate confirm password
    const confirmPasswordError = checkConfirmPasswordValidity(confirmPassword);
    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError;
    }
    return errors;
  };

  // Handle submission of register form
  const handleSubmit = async () => {
    if (isSubmitting) return;
    const errors = validateRegisterFormData();
    setInputFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(
        "/user/register",
        JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
      );
      setRegisterSuccess(true);
      setPasswordMismatch(false);
      setInputFieldErrors({});
      setCommonErrorMessage("");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      setRegisterSuccess(false);
      if (!error?.response) {
        setCommonErrorMessage(
          "Error while registering user: No server response."
        );
      } else {
        setCommonErrorMessage(
          error?.response?.data?.error || "Error while registering user."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form className="register-form">
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          name="name"
          id="userName"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          ref={nameRef}
          isInvalid={checkIfInputFieldInvalid("name")}
          className={`form-input ${
            checkIfInputFieldInvalid("name") ? "shake" : ""
          }`}
          required
        />
        {checkIfInputFieldInvalid("name") && (
          <div className="text-danger">{inputFieldErrors.name}</div>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control
          type="email"
          name="email"
          id="registerEmail"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          isInvalid={checkIfInputFieldInvalid("email")}
          className={`form-input ${
            checkIfInputFieldInvalid("email") ? "shake" : ""
          }`}
          required
        />
        {checkIfInputFieldInvalid("email") && (
          <div className="text-danger">{inputFieldErrors.email}</div>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control
          type="password"
          name="password"
          id="registerPassword"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Password"
          isInvalid={checkIfInputFieldInvalid("password")}
          className={`form-input ${
            checkIfInputFieldInvalid("password") ? "shake" : ""
          }`}
          required
        />
        {checkIfInputFieldInvalid("password") && (
          <div className="text-danger">{inputFieldErrors.password}</div>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <div className="password-field">
          <Form.Control
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            id="registerConfirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Confirm Password"
            isInvalid={checkIfInputFieldInvalid("confirmPassword")}
            className={`form-input ${
              checkIfInputFieldInvalid("confirmPassword") ? "shake" : ""
            }`}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOpenIcon /> : <EyeSlashIcon />}
          </span>
        </div>
        {checkIfInputFieldInvalid("confirmPassword") && (
          <div className="text-danger">{inputFieldErrors.confirmPassword}</div>
        )}
      </Form.Group>
      {passwordMismatch && <p className="error">Passwords do not match.</p>}
      {commonErrorMessage && <p className="error">{commonErrorMessage}</p>}
      <Button
        type="button"
        className="form-button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          </>
        ) : (
          "Register"
        )}
      </Button>
      <div className="login-link">
        Already Registered? <Link to="/login">Login here</Link>
      </div>
      {registerSuccess && (
        <div className="message">
          Registration completed. Kindly proceed to login.
        </div>
      )}
    </Form>
  );
}

export default RegisterForm;
