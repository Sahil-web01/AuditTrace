import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    vendorName: { type: String, trim: true },
    invoiceNumber: { type: String, trim: true },
    date: { type: String },
    totalAmount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    lineItems: [lineItemSchema],

    // Audit metadata
    isFlagged: { type: Boolean, default: false },
    riskScore: { type: Number, default: 0.1 },
    flaggedReasons: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },
    originalFileName: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
