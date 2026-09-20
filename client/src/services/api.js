import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
});

// Automatically inject JWT bearer token if user is signed in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("audittrace_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getInvoices = async () => {
  const res = await API.get("/invoices");
  return res.data;
};

export const uploadInvoiceFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/invoices/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};

export const updateInvoiceStatus = async (id, status) => {
  const res = await API.patch(`/invoices/${id}/status`, { status });
  return res.data;
};

export const deleteInvoice = async (id) => {
  const res = await API.delete(`/invoices/${id}`);
  return res.data;
};

export const resetDemoInvoices = async () => {
  const res = await API.post("/invoices/reset-demo");
  return res.data;
};

// Auth methods
export const loginUser = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await API.post("/auth/register", userData);
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

export default API;
