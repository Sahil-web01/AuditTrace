import React, { useState } from "react";
import { DollarSign, ShieldAlert, FileCheck, RefreshCw, Filter, Download } from "lucide-react";
import MetricCard from "../components/MetricCard";
import InvoiceUploader from "../components/InvoiceUploader";
import FraudAlertCard from "../components/FraudAlertCard";
import { formatCurrency, exportInvoicesToCSV } from "../utils/formatters";

export default function Dashboard({
  invoices = [],
  loading = false,
  onRefresh,
  onUploadSuccess,
  onUpdateInvoice,
  onDeleteInvoice,
  onErrorToast
}) {
  const [filter, setFilter] = useState("all");

  // High-impact Metric Calculations
  const totalAmountAudited = invoices.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

  const flaggedInvoices = invoices.filter(
    (inv) => inv.isFlagged || inv.status === "Rejected" || (inv.riskScore && inv.riskScore >= 0.7)
  );

  const flaggedFraudPrevented = flaggedInvoices.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
  const highRiskCount = flaggedInvoices.length;

  const displayedInvoices = invoices.filter((inv) => {
    if (filter === "flagged") return inv.isFlagged || inv.status === "Rejected";
    if (filter === "approved") return !inv.isFlagged && inv.status !== "Rejected";
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Audit & Fraud Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time financial anomaly detection and automated ledger cross-referencing.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => exportInvoicesToCSV(invoices)}
            className="inline-flex items-center space-x-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : "text-slate-500"}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Top 3 High-Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Amount Audited"
          value={formatCurrency(totalAmountAudited)}
          subtext={`${invoices.length} invoices processed`}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Flagged Fraud Prevented"
          value={formatCurrency(flaggedFraudPrevented)}
          subtext={`${highRiskCount} suspicious invoices caught`}
          icon={ShieldAlert}
          color="red"
        />
        <MetricCard
          title="High-Risk Invoices"
          value={highRiskCount}
          subtext={highRiskCount > 0 ? "Requires auditor review" : "All clean"}
          icon={FileCheck}
          color={highRiskCount > 0 ? "amber" : "emerald"}
        />
      </div>

      {/* Ingestion Dropzone */}
      <InvoiceUploader onUploadSuccess={onUploadSuccess} onErrorToast={onErrorToast} />

      {/* Audited Invoices Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            Audited Invoice Feed ({displayedInvoices.length})
          </h3>

          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filter === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              All ({invoices.length})
            </button>
            <button
              onClick={() => setFilter("flagged")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filter === "flagged" ? "bg-red-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              Flagged ({highRiskCount})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filter === "approved" ? "bg-emerald-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              Approved ({invoices.length - highRiskCount})
            </button>
          </div>
        </div>

        {loading && invoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
            Loading audited invoices...
          </div>
        ) : displayedInvoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-slate-500 font-medium">No audited invoices found for this filter.</p>
            <p className="text-xs text-slate-400 mt-1">Upload an invoice above or switch filter tabs.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedInvoices.map((invoice) => (
              <FraudAlertCard
                key={invoice._id || invoice.invoiceNumber}
                invoice={invoice}
                onUpdate={onUpdateInvoice}
                onDelete={onDeleteInvoice}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
