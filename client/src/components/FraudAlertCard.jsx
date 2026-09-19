import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, FileText, Calendar, DollarSign } from "lucide-react";

export default function FraudAlertCard({ invoice }) {
  const [showItems, setShowItems] = useState(false);

  const {
    vendorName,
    invoiceNumber,
    date,
    totalAmount,
    tax,
    lineItems = [],
    isFlagged,
    riskScore = 0.1,
    flaggedReasons = [],
    status = "Approved",
    originalFileName
  } = invoice;

  const isHighRisk = isFlagged || status === "Rejected" || riskScore >= 0.7;

  return (
    <div
      className={`bg-white rounded-xl border transition-shadow shadow-sm hover:shadow-md p-5 ${
        isHighRisk ? "border-red-300 bg-red-50/10" : "border-slate-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left side: Vendor & Invoice ID */}
        <div className="flex items-start space-x-3">
          <div
            className={`p-2.5 rounded-lg mt-0.5 ${
              isHighRisk ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {isHighRisk ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-900">{vendorName || "Unknown Vendor"}</h4>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                {invoiceNumber || "NO-INV-#"}
              </span>
              {date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {date}
                </span>
              )}
              {originalFileName && (
                <span className="flex items-center gap-1 text-slate-400">
                  <FileText className="w-3.5 h-3.5" />
                  {originalFileName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Amount & Status Badge */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-center">
          <div className="text-right">
            <span className="text-lg font-bold text-slate-900">
              ${Number(totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {tax > 0 && <span className="block text-xs text-slate-400">Tax: ${tax.toFixed(2)}</span>}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                status === "Rejected" || isHighRisk
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : status === "Pending"
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
              }`}
            >
              {status}
            </span>
            <span className="text-xs text-slate-400">Risk: {(riskScore * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Prominent Discrepancy / Fraud Badges in Red/Amber */}
      {isHighRisk && (
        <div className="mt-4 pt-3 border-t border-red-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-red-800 uppercase tracking-wider">Discrepancy:</span>
          {flaggedReasons && flaggedReasons.length > 0 ? (
            flaggedReasons.map((reason, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 border border-red-200"
              >
                ⚠️ {reason}
              </span>
            ))
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
              ⚠️ Potential Duplicate / High Anomaly Score
            </span>
          )}
        </div>
      )}

      {/* Expandable Line Items */}
      {lineItems && lineItems.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => setShowItems(!showItems)}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 focus:outline-none"
          >
            {showItems ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showItems ? "Hide line items" : `View ${lineItems.length} line items`}
          </button>

          {showItems && (
            <div className="mt-2.5 overflow-x-auto bg-slate-50 rounded-lg p-3 border border-slate-100">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-200">
                    <th className="pb-1">Description</th>
                    <th className="pb-1 text-center">Qty</th>
                    <th className="pb-1 text-right">Unit Price</th>
                    <th className="pb-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50">
                  {lineItems.map((item, i) => (
                    <tr key={i} className="text-slate-700">
                      <td className="py-1.5">{item.description}</td>
                      <td className="py-1.5 text-center">{item.quantity}</td>
                      <td className="py-1.5 text-right">${Number(item.unitPrice || 0).toFixed(2)}</td>
                      <td className="py-1.5 text-right font-medium">${Number(item.total || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
