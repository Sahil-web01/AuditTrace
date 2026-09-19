import axios from "axios";
import FormData from "form-data";

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export const callAiExtraction = async (fileBuffer, originalname, mimetype, history = []) => {
  const form = new FormData();
  form.append("file", fileBuffer, {
    filename: originalname,
    contentType: mimetype
  });

  if (history && history.length > 0) {
    form.append("history", JSON.stringify(history));
  }

  const res = await axios.post(`${AI_URL}/analyze`, form, {
    headers: form.getHeaders(),
    timeout: 30000
  });

  return res.data;
};
