import axios from "axios";

// Member 3 will expose these on the Express server.
// Set VITE_API_URL in a .env file once the backend is running, e.g.:
// VITE_API_URL=http://localhost:5000/api
const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
}/auth`;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export function getAuthToken() {
  return localStorage.getItem("token");
}

// Attach the saved JWT (if any) to every request automatically.
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function registerUser({ name, email, password }) {
  const { data } = await api.post("/register", { name, email, password });
  return data;
}

export async function loginUser({ email, password }) {
  const { data } = await api.post("/login", { email, password });
  if (data?.token) localStorage.setItem("token", data.token);
  return data;
}

export function logoutUser() {
  localStorage.removeItem("token");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}

export async function getUserProfile() {
  const { data } = await api.get("/profile");
  return data;
}

export default api;
