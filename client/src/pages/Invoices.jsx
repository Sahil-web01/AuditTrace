import React, { useState } from "react";
import { Search, Filter, Download, Check, X, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatCurrency, exportInvoicesToCSV } from "../utils/formatters";
import { updateInvoiceStatus, deleteInvoice } from "../services/api";

export default function Invoices({ invoices, onUpdateInvoice, onDeleteInvoice }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = (invoices || []).filter((inv) => {
    const matchesSearch =
      (inv.invoiceNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.vendorName || "").toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "approved") return matchesSearch && inv.status === "Approved";
    if (statusFilter === "rejected") return matchesSearch && inv.status === "Rejected";
    if (statusFilter === "pending") return matchesSearch && inv.status === "Pending";
    return matchesSearch;
  });

  const handleStatus = async (id, status) => {
    try {
      const updated = await updateInvoiceStatus(id, status);
      if (onUpdateInvoice) onUpdateInvoice(updated);
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invoice record?")) return;
    try {
      await deleteInvoice(id);
      if (onDeleteInvoice) onDeleteInvoice(id);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">All Invoices Ledger</h2>
          <p className="text-sm text-slate-500 mt-1">
            Comprehensive audit table of historical and scanned invoices ({filtered.length} records)
          </p>
        </div>

        <button
          onClick={() => exportInvoicesToCSV(filtered)}
          className="inline-flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search vendor or invoice #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {["all", "approved", "rejected", "pending"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Vendor</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Risk</th>
                <th className="py-3.5 px-4">Flagged Discrepancy</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-sm">
                    No invoices matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const isHighRisk = inv.isFlagged || inv.status === "Rejected";
                  return (
                    <tr
                      key={inv._id || inv.invoiceNumber}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isHighRisk ? "bg-red-50/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-800">
                        {inv.invoiceNumber || "—"}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">{inv.vendorName}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">{inv.date || "—"}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {formatCurrency(inv.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            inv.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : inv.status === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-xs font-medium">
                        {((inv.riskScore || 0) * 100).toFixed(0)}%
                      </td>
                      <td className="py-3.5 px-4">
                        {inv.flaggedReasons && inv.flaggedReasons.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {inv.flaggedReasons.map((r, i) => (
                              <span
                                key={i}
                                className="text-[11px] px-2 py-0.5 rounded bg-red-100 text-red-800 font-medium"
                              >
                                ⚠️ {r}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Clean
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {inv.status !== "Approved" && (
                            <button
                              onClick={() => handleStatus(inv._id, "Approved")}
                              className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {inv.status !== "Rejected" && (
                            <button
                              onClick={() => handleStatus(inv._id, "Rejected")}
                              className="p-1 rounded text-red-600 hover:bg-red-50"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(inv._id)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
