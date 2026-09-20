import express from "express";
import cors from "cors";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
