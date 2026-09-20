import React, { useState } from "react";
import { X, ShieldCheck, UserCheck, Briefcase, Lock, Mail, Loader2 } from "lucide-react";
import { loginUser } from "../services/api";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (loginEmail, loginPass) => {
    const e = loginEmail || email;
    const p = loginPass || password;

    if (!e || !p) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await loginUser(e, p);
      localStorage.setItem("audittrace_token", data.token);
      localStorage.setItem("audittrace_user", JSON.stringify(data.user));
      if (onLoginSuccess) onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    handleLogin(demoEmail, demoPass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Sign in to AuditTrace</h3>
            <p className="text-xs text-slate-500">Enterprise AI Financial Auditing Platform</p>
          </div>
        </div>

        {/* 1-Click Quick Demo Sign-Ins for Hackathon Judges */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 mb-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-800 mb-2">
            ⚡ Hackathon Evaluation Quick-Login
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => quickDemoLogin("auditor@audittrace.com", "AuditTrace2026!")}
              disabled={loading}
              className="flex items-center justify-center space-x-1.5 text-xs bg-white text-blue-700 font-semibold py-2 px-2.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Lead Auditor</span>
            </button>

            <button
              onClick={() => quickDemoLogin("owner@acme.com", "AuditTrace2026!")}
              disabled={loading}
              className="flex items-center justify-center space-x-1.5 text-xs bg-white text-slate-700 font-semibold py-2 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-600" />
              <span>Business Owner</span>
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-3.5"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="auditor@audittrace.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
