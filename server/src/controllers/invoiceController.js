import Invoice from "../models/Invoice.js";
import { callAiExtraction } from "../services/aiService.js";

export const uploadInvoice = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No invoice file provided" });
    }

    // Fetch existing invoice records for ledger anomaly cross-referencing
    const history = await Invoice.find({}, "vendorName invoiceNumber totalAmount date").lean();

    // Forward file and historical ledger to AI microservice
    const aiResult = await callAiExtraction(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      history
    );

    const { invoice_data, is_flagged, risk_score, flagged_reasons = [] } = aiResult;

    // Map extracted data to MongoDB schema
    const newInvoice = new Invoice({
      vendorName: invoice_data?.vendor_name || "Unknown Vendor",
      invoiceNumber: invoice_data?.invoice_number || null,
      date: invoice_data?.date || new Date().toISOString().split("T")[0],
      totalAmount: invoice_data?.total_amount || 0,
      tax: invoice_data?.tax || 0,
      lineItems: (invoice_data?.line_items || []).map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: item.total
      })),
      isFlagged: Boolean(is_flagged),
      riskScore: risk_score ?? 0.05,
      flaggedReasons: flagged_reasons,
      status: is_flagged ? "Rejected" : "Approved",
      originalFileName: req.file.originalname
    });

    const saved = await newInvoice.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Invoice upload error:", err.message);
    return res.status(500).json({ error: err.message || "Error processing invoice" });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    return res.json(invoices);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching invoices" });
  }
};
