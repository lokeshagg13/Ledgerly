import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import axios from "../../api/axios";
import EyeOpenIcon from "../ui/icons/EyeOpenIcon";
import EyeSlashIcon from "../ui/icons/EyeSlashIcon";

function RegisterUserForm() {
  const nameRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [error, setError] = useState("");

  // Bring name field into focus on entering the register user form
  useEffect(() => {
    nameRef.current.focus();
  }, []);

  // Make the error status disappear after 5 seconds
  useEffect(() => {
    if (error && !error.includes("Passwords do not match")) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handling to continuously check for password matching
  useEffect(() => {
    if (formData.password === "" || formData.confirmPassword === "") {
      setError("");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
    } else if (error.includes("Passwords do not match")) {
      setError("");
    }
  }, [error, formData.password, formData.confirmPassword]);

  // Handle changes in the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setRegisterSuccess(false);
    setError(""); // Clear error message when input changes
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/gm; // Basic email regex pattern
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email before submitting
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password and confirm password
    if (formData.password.length < 8) {
      setError("Password must be atleast 8 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        "/api/user/register",
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
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.error || "Error creating user";
      setRegisterSuccess(false);
      setError(`${errorMsg}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        ref={nameRef}
        value={formData.name}
        onChange={handleChange}
        autoComplete="off"
        required
        className="form-input"
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        autoComplete="off"
        required
        className="form-input"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="off"
        required
        className="form-input"
      />
      <div className="password-field">
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
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
      {error && <p className="error">{error}</p>}
      <button type="submit" className="form-button">
        Register
      </button>
      <div className="login-link">
        Already Registered? <Link to="/login">Login here</Link>
      </div>
      {registerSuccess && (
        <div className="message">
          Registration completed. Kindly proceed to login.
        </div>
      )}
    </form>
  );
}

export default RegisterUserForm;
