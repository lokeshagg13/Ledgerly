import { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";

import { axiosPrivate } from "../../../../../api/axios";
import useAuth from "../../../../../store/hooks/useAuth";
import EyeOpenIcon from "../../../../ui/icons/EyeOpenIcon";
import EyeSlashIcon from "../../../../ui/icons/EyeSlashIcon";
import useAppNavigate from "../../../../../store/hooks/useAppNavigate";

function LoginForm({ userType }) {
  const emailRef = useRef();
  const { setAuth } = useAuth();
  const { handleNavigateToPath } = useAppNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Bring email field into focus on entering the login form
  useEffect(() => {
    emailRef.current.focus();
  }, []);

  // Make the error status disappear after 6 seconds
  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(""), 6000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (
      errorMessage.includes("Please enter a valid email address.") &&
      isValidEmail(formData.email)
    )
      setErrorMessage("");
  }, [formData, errorMessage]);

  // Keyboard support for submitting login form
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSubmitting) {
      e.preventDefault();
      handleLogin();
    }
  };

  // Handle changes in the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(""); // Clear error message when input changes
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/gm;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (isSubmitting) return;
    setErrorMessage("");
    // Validate email before submitting
    if (!isValidEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    // Validate password and confirm password
    if (formData.password.length < 8) {
      setErrorMessage(
        "Invalid password. Please ensure you have entered the correct password."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosPrivate.post(
        "/user/login",
        JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          type: userType,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const { email, name, type, accessToken, createdAt, openingBalance } =
        response?.data || {};
      setAuth({ email, name, type, accessToken, createdAt, openingBalance });
      setErrorMessage("");
      handleNavigateToPath("/dashboard", { replace: true });
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("Login failed: No server response.");
      } else if (error.response?.status === 400) {
        setErrorMessage(
          "Invalid password. Please ensure you have entered the correct password."
        );
      } else if (error.response?.status === 401) {
        setErrorMessage(
          "User not found. Please check your email or sign up to create a new account."
        );
      } else if (error.response?.status === 406) {
        setErrorMessage(
          `User is not registered as ${
            userType === "individual" ? "an" : "a"
          } ${userType}. Please check carefully and try again.`
        );
      } else {
        setErrorMessage(`Login Failed.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form className="login-form">
      <Form.Control
        type="email"
        name="email"
        id="loginEmail"
        value={formData.email}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Email Address"
        ref={emailRef}
        required
        className="form-input"
      />
      <div className="password-field">
        <Form.Control
          type={showPassword ? "text" : "password"}
          name="password"
          id="loginPassword"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Password"
          className="form-input"
          required
        />
        <span
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOpenIcon /> : <EyeSlashIcon />}
        </span>
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <Button type="button" className="form-button" onClick={handleLogin}>
        {isSubmitting ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          </>
        ) : (
          "Login"
        )}
      </Button>
      <div className="register-link">
        Not Registered?{" "}
        <button
          type="button"
          className="link-btn"
          onClick={() => handleNavigateToPath("/register")}
        >
          Signup here
        </button>
      </div>
    </Form>
  );
}

export default LoginForm;
