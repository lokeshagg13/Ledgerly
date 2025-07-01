import axios from "axios";

const backend = "http://localhost:9000";
// Axios server handle for simpler requests (login and register)
export default axios.create({
  baseURL: `${backend}`,
});

// Axios server handle for protected requests (protected routes and  logout)
export const axiosPrivate = axios.create({
  baseURL: `${backend}`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});