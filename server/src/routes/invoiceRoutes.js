import express from "express";
import { upload } from "../config/multer.js";
import {
  uploadInvoice,
  getInvoices,
  updateInvoiceStatus,
  deleteInvoice,
  resetDemoInvoices
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadInvoice);
router.get("/", getInvoices);
router.patch("/:id/status", updateInvoiceStatus);
router.delete("/:id", deleteInvoice);
router.post("/reset-demo", resetDemoInvoices);

export default router;
