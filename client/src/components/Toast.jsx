import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, X } from "lucide-react";

export default function Toast({ message, type = "error", onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    error: {
      bg: "bg-red-50 border-red-200 text-red-800",
      icon: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
    },
    warning: {
      bg: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
    },
    success: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
    }
  };

  const current = styles[type] || styles.error;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-bounce-short">
      <div className={`p-4 rounded-xl border shadow-lg flex items-start justify-between space-x-3 ${current.bg}`}>
        <div className="flex items-start space-x-3">
          {current.icon}
          <div>
            <p className="text-sm font-semibold">{type === "error" ? "Upload Error" : "Notification"}</p>
            <p className="text-xs mt-0.5 opacity-90">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
