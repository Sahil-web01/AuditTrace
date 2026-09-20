import express from "express";
import cors from "cors";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

app.get("/", (req, res) => {
  res.json({
    name: "AuditTrace API",
    status: "active",
    version: "1.0.0",
    message: "AuditTrace Backend Orchestrator is running",
    endpoints: {
      health: "/health",
      invoices: "/api/invoices",
      auth: "/api/auth"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
