import express from "express";
import cors from "cors";
import invoiceRoutes from "./routes/invoiceRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/invoices", invoiceRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
