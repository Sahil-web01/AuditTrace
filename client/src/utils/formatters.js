export const formatCurrency = (amount) => {
  return `$${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const exportInvoicesToCSV = (invoices) => {
  if (!invoices || invoices.length === 0) return;

  const headers = [
    "Invoice Number",
    "Vendor Name",
    "Invoice Date",
    "Total Amount",
    "Tax Amount",
    "Audit Status",
    "Risk Score",
    "Flagged Reasons",
    "Original File Name"
  ];

  const rows = invoices.map((inv) => [
    `"${inv.invoiceNumber || ""}"`,
    `"${(inv.vendorName || "").replace(/"/g, '""')}"`,
    `"${inv.date || ""}"`,
    inv.totalAmount || 0,
    inv.tax || 0,
    `"${inv.status || "Pending"}"`,
    `${((inv.riskScore || 0) * 100).toFixed(0)}%`,
    `"${(inv.flaggedReasons || []).join("; ").replace(/"/g, '""')}"`,
    `"${inv.originalFileName || ""}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `AuditTrace_Report_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
