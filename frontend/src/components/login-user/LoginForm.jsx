import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { axiosPrivate } from "../../api/axios";
import useAuth from "../../store/hooks/useAuth";
import EyeOpenIcon from "../ui/icons/EyeOpenIcon";
import EyeSlashIcon from "../ui/icons/EyeSlashIcon";

function LoginForm() {
  const emailRef = useRef();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

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
      const timer = setTimeout(() => setErrorMessage(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // For hiding empty input error message on user writes something
  useEffect(() => {
    if (
      errorMessage.includes(
        "Please enter a valid email address." && isValidEmail(formData.email)
      )
    )
      setErrorMessage("");
  }, [formData, errorMessage]);

  // Keyboard support for submitting modal
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

      const accessToken = response?.data?.accessToken;
      setAuth({
        email: formData.email,
        accessToken,
      });
      setFormData({ email: "", password: "" });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("No server response.");
      } else if (error.response?.status === 400) {
        setErrorMessage(
          "Invalid password. Please ensure you have entered the correct password."
        );
      } else if (error.response?.status === 401) {
        setErrorMessage(
          "User not found. Please check your email or sign up to create a new account."
        );
      } else {
        setErrorMessage("Login error.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form">
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        ref={emailRef}
        value={formData.email}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        required
        className="form-input"
      />
      <div className="password-field">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          required
          className="form-input"
        />
        <span
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOpenIcon /> : <EyeSlashIcon />}
        </span>
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <button type="button" className="form-button" onClick={handleLogin}>
        Login
      </button>
      <div className="login-link">
        Not Registered? <Link to="/register">Signup here</Link>
      </div>
    </form>
  );
}

export default LoginForm;
