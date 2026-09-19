import express from "express";
import { upload } from "../config/multer.js";
import { uploadInvoice, getInvoices } from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadInvoice);
router.get("/", getInvoices);

export default router;
