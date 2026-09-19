import React, { useState, useRef } from "react";
import { UploadCloud, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadInvoiceFile } from "../services/api";

export default function InvoiceUploader({ onUploadSuccess, onErrorToast }) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
    const isExtensionValid = /\.(pdf|png|jpg|jpeg|webp)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      const msg = "Invalid file type. Please upload a PDF, PNG, JPG, or WEBP file.";
      setError(msg);
      if (onErrorToast) onErrorToast(msg, "error");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      const msg = "File exceeds 15MB limit. Please upload a smaller invoice.";
      setError(msg);
      if (onErrorToast) onErrorToast(msg, "warning");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await uploadInvoiceFile(file);
      const okMsg = `Audited and saved: ${data.vendorName || file.name}`;
      setSuccess(okMsg);
      if (onUploadSuccess) onUploadSuccess(data);
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        "Upload failed. Ensure backend & AI service are active.";
      setError(errMsg);
      if (onErrorToast) onErrorToast(errMsg, "error");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (loading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Upload Invoices for AI Audit</h2>
        <p className="text-sm text-slate-500">
          Upload PDF bills or image invoices. The pipeline extracts line items, scores fraud risk, and cross-references historical ledger records.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!loading) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          loading
            ? "bg-slate-50 border-slate-300 cursor-not-allowed"
            : isDragging
            ? "border-blue-500 bg-blue-50/50"
            : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/50"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={(e) => handleFile(e.target.files?.[0])}
          disabled={loading}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Auditing invoice against historical ledger...</p>
              <p className="text-xs text-slate-500 mt-1">Cross-referencing duplicate numbers, exact amounts, and price spikes</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                <span className="text-blue-600 font-semibold">Click to select invoice</span> or drag and drop here
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG, JPEG (up to 15MB)</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
