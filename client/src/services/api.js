import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
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

export default API;
