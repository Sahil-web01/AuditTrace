import React from "react";
import { LayoutDashboard, FileSpreadsheet, BarChart3, Database, RotateCcw } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, onResetDemo, resettingDemo }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "invoices", label: "All Invoices", icon: FileSpreadsheet },
    { id: "analytics", label: "Risk Analytics", icon: BarChart3 }
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 md:min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer: Reset Demo Data & Cloud Status */}
      <div className="mt-8 pt-4 border-t border-slate-100 space-y-3">
        {/* Reset Demo Data Button for Hackathon Evaluation */}
        <button
          onClick={onResetDemo}
          disabled={resettingDemo}
          className="w-full flex items-center justify-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 py-2.5 px-3 rounded-lg transition-colors border border-slate-200"
          title="Restore original 18 benchmark invoices in MongoDB Atlas"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resettingDemo ? "animate-spin text-blue-600" : "text-slate-500"}`} />
          <span>{resettingDemo ? "Resetting Atlas DB..." : "Reset Demo Ledger"}</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <Database className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div className="truncate">
            <p className="font-semibold text-slate-700">MongoDB Atlas</p>
            <p className="text-[10px] text-emerald-600 font-medium">Cluster0 Connected</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
