import Invoice from "../models/Invoice.js";
import { callAiExtraction } from "../services/aiService.js";
import { sampleInvoices } from "../seeds/sampleData.js";

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

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const isFlagged = status === "Rejected";
    const updated = await Invoice.findByIdAndUpdate(
      id,
      { status, isFlagged },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update invoice status" });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Invoice.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    return res.json({ message: "Invoice removed successfully", id });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete invoice" });
  }
};

export const resetDemoInvoices = async (req, res) => {
  try {
    await Invoice.deleteMany({});
    const inserted = await Invoice.insertMany(sampleInvoices);
    return res.json({
      message: "Database successfully reset to 18 benchmark invoices",
      count: inserted.length,
      invoices: inserted
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to reset demo invoices: " + err.message });
  }
};
