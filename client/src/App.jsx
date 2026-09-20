import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Analytics from "./pages/Analytics";
import Toast from "./components/Toast";
import LoginModal from "./components/LoginModal";
import { getInvoices, resetDemoInvoices } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resettingDemo, setResettingDemo] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "error" });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Initialize with stored user or default Lead Auditor demo session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("audittrace_user");
      return saved
        ? JSON.parse(saved)
        : {
            name: "Sarah Jenkins",
            email: "auditor@audittrace.com",
            role: "auditor",
            companyName: "Acme Enterprises Inc"
          };
    } catch {
      return null;
    }
  });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: "", type: "error" });
  };

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await getInvoices();
      setInvoices(data || []);
    } catch (err) {
      console.error("Failed to load invoices:", err);
      showToast("Unable to load invoices. Ensure backend is running.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleUploadSuccess = (newInvoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
    showToast(`Invoice #${newInvoice.invoiceNumber || ""} audited and saved`, "success");
  };

  const handleUpdateInvoice = (updatedInvoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv._id === updatedInvoice._id ? updatedInvoice : inv))
    );
    showToast(`Invoice #${updatedInvoice.invoiceNumber || ""} marked as ${updatedInvoice.status}`, "success");
  };

  const handleDeleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((inv) => inv._id !== id));
    showToast("Invoice removed from ledger", "success");
  };

  const handleResetDemo = async () => {
    if (!window.confirm("Restore database to the 18 benchmark demo invoices?")) return;
    setResettingDemo(true);
    try {
      const res = await resetDemoInvoices();
      setInvoices(res.invoices || []);
      showToast("MongoDB Atlas restored to 18 benchmark invoices!", "success");
    } catch (err) {
      showToast("Failed to reset demo invoices: " + err.message, "error");
    } finally {
      setResettingDemo(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("audittrace_token");
    localStorage.removeItem("audittrace_user");
    setCurrentUser(null);
    showToast("Logged out successfully", "info");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <Navbar
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.name}!`, "success");
        }}
      />

      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onResetDemo={handleResetDemo}
          resettingDemo={resettingDemo}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <Dashboard
              invoices={invoices}
              loading={loading}
              onRefresh={loadInvoices}
              onUploadSuccess={handleUploadSuccess}
              onUpdateInvoice={handleUpdateInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onErrorToast={showToast}
            />
          )}

          {activeTab === "invoices" && (
            <Invoices
              invoices={invoices}
              onUpdateInvoice={handleUpdateInvoice}
              onDeleteInvoice={handleDeleteInvoice}
            />
          )}

          {activeTab === "analytics" && <Analytics invoices={invoices} />}
        </main>
      </div>
    </div>
  );
}
