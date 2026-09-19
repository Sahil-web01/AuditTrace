import React from "react";

export default function MetricCard({ title, value, subtext, icon: Icon, color = "blue" }) {
  const styles = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-600" },
    red: { bg: "bg-red-50", text: "text-red-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600" }
  };

  const activeStyle = styles[color] || styles.blue;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-lg ${activeStyle.bg} ${activeStyle.text}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
