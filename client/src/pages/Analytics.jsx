import React from "react";
import { formatCurrency } from "../utils/formatters";
import { BarChart3, ShieldAlert, TrendingUp, AlertTriangle } from "lucide-react";

export default function Analytics({ invoices }) {
  const list = invoices || [];

  // 1. Group total spending by vendor
  const vendorMap = {};
  list.forEach((inv) => {
    const v = inv.vendorName || "Unknown";
    if (!vendorMap[v]) {
      vendorMap[v] = { total: 0, count: 0, flaggedCount: 0, flaggedAmount: 0 };
    }
    const amt = Number(inv.totalAmount || 0);
    vendorMap[v].total += amt;
    vendorMap[v].count += 1;
    if (inv.isFlagged || inv.status === "Rejected") {
      vendorMap[v].flaggedCount += 1;
      vendorMap[v].flaggedAmount += amt;
    }
  });

  const vendorStats = Object.entries(vendorMap)
    .map(([vendor, data]) => ({ vendor, ...data }))
    .sort((a, b) => b.total - a.total);

  const totalSpend = list.reduce((acc, i) => acc + (Number(i.totalAmount) || 0), 0);
  const flaggedSpend = list
    .filter((i) => i.isFlagged || i.status === "Rejected")
    .reduce((acc, i) => acc + (Number(i.totalAmount) || 0), 0);

  const fraudRate = totalSpend > 0 ? ((flaggedSpend / totalSpend) * 100).toFixed(1) : 0;
  const maxVendorSpend = Math.max(...vendorStats.map((v) => v.total), 1);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Fraud & Spend Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">
          Historical spending distributions, statistical anomaly detection, and risk profiling.
        </p>
      </div>

      {/* Top Insight Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Total Billed Volume
          </p>
          <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(totalSpend)}</h3>
          <p className="text-xs text-slate-400 mt-1">Across {list.length} invoices</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Discrepancy Exposure
          </p>
          <h3 className="text-2xl font-bold text-red-600">{formatCurrency(flaggedSpend)}</h3>
          <p className="text-xs text-red-500 mt-1">{fraudRate}% of total billed amount flagged</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Active Monitored Vendors
          </p>
          <h3 className="text-2xl font-bold text-slate-900">{vendorStats.length}</h3>
          <p className="text-xs text-slate-400 mt-1">Statistical baselines computed</p>
        </div>
      </div>

      {/* Spend & Risk by Vendor */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Spend Distribution & Outliers by Vendor
        </h3>

        <div className="space-y-4">
          {vendorStats.map((item) => {
            const percentage = Math.round((item.total / maxVendorSpend) * 100);
            const hasFlags = item.flaggedCount > 0;

            return (
              <div key={item.vendor} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    {item.vendor}
                    {hasFlags && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-700">
                        {item.flaggedCount} Anomaly Flagged
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-slate-900">{formatCurrency(item.total)}</span>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      hasFlags ? "bg-red-500" : "bg-blue-600"
                    }`}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-slate-400">
                  <span>{item.count} total invoices</span>
                  {hasFlags && (
                    <span className="text-red-600 font-medium">
                      Flagged Amount: {formatCurrency(item.flaggedAmount)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
