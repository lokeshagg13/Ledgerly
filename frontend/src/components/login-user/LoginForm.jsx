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
  const [error, setError] = useState("");

  // Bring email field into focus on entering the login form
  useEffect(() => {
    emailRef.current.focus();
  }, []);

  // Make the error status disappear after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle changes in the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error message when input changes
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/gm;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email before submitting
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password and confirm password
    if (formData.password.length < 8) {
      setError("Invalid password. Please ensure you have entered the correct password.");
      return;
    }

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
      console.log(error);
      if (!error?.response) {
        setError("No server response.");
      } else if (error.response?.status === 400) {
        setError(
          "Invalid password. Please ensure you have entered the correct password."
        );
      } else if (error.response?.status === 401) {
        setError(
          "User not found. Please check your email or sign up to create a new account."
        );
      } else {
        setError("Login error.");
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="form">
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        ref={emailRef}
        value={formData.email}
        onChange={handleChange}
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
        Login
      </button>
      <div className="login-link">
        Not Registered? <Link to="/register">Signup here</Link>
      </div>
    </form>
  );
}

export default LoginForm;
