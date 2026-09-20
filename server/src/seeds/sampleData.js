export const sampleInvoices = [
  // 1. TechLogix Cloud
  {
    vendorName: "TechLogix Cloud Services",
    invoiceNumber: "INV-TL-101",
    date: "2026-08-01",
    totalAmount: 1250.0,
    tax: 125.0,
    lineItems: [{ description: "Kubernetes Cluster Hosting", quantity: 1, unitPrice: 1125.0, total: 1125.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "techlogix_aug_cluster.pdf"
  },
  {
    vendorName: "TechLogix Cloud Services",
    invoiceNumber: "INV-TL-102",
    date: "2026-08-15",
    totalAmount: 1320.0,
    tax: 132.0,
    lineItems: [{ description: "Object Storage & Bandwidth", quantity: 1, unitPrice: 1188.0, total: 1188.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "techlogix_storage.pdf"
  },
  {
    vendorName: "TechLogix Cloud Services",
    invoiceNumber: "INV-TL-103",
    date: "2026-09-01",
    totalAmount: 1280.0,
    tax: 128.0,
    lineItems: [{ description: "Kubernetes Hosting Renewal", quantity: 1, unitPrice: 1152.0, total: 1152.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "techlogix_sep_cluster.pdf"
  },
  {
    vendorName: "TechLogix Cloud Services",
    invoiceNumber: "INV-TL-104",
    date: "2026-09-10",
    totalAmount: 1300.0,
    tax: 130.0,
    lineItems: [{ description: "SSL Certificates & DNS", quantity: 1, unitPrice: 1170.0, total: 1170.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "techlogix_ssl.pdf"
  },
  // OUTLIER 1: Extreme Price Outlier ($14,950 vs ~$1,280 normal)
  {
    vendorName: "TechLogix Cloud Services",
    invoiceNumber: "INV-TL-105",
    date: "2026-09-17",
    totalAmount: 14950.0,
    tax: 1495.0,
    lineItems: [{ description: "Unverified Premium Compute Overcharges", quantity: 1, unitPrice: 13455.0, total: 13455.0 }],
    isFlagged: true,
    riskScore: 0.92,
    flaggedReasons: [
      "Price Anomaly: Billed $14,950.00 spikes significantly above average $1,287.50 (Z-Score: 3.42 > 2.0)"
    ],
    status: "Rejected",
    originalFileName: "techlogix_emergency_compute.pdf"
  },

  // 2. Prime Logistics Group
  {
    vendorName: "Prime Logistics Group",
    invoiceNumber: "INV-PLG-401",
    date: "2026-08-05",
    totalAmount: 480.0,
    tax: 48.0,
    lineItems: [{ description: "Express Freight Delivery", quantity: 4, unitPrice: 108.0, total: 432.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "plg_dispatch_401.pdf"
  },
  {
    vendorName: "Prime Logistics Group",
    invoiceNumber: "INV-PLG-402",
    date: "2026-08-20",
    totalAmount: 520.0,
    tax: 52.0,
    lineItems: [{ description: "Interstate Courier Consignment", quantity: 5, unitPrice: 93.6, total: 468.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "plg_aug_freight.pdf"
  },
  {
    vendorName: "Prime Logistics Group",
    invoiceNumber: "INV-PLG-403",
    date: "2026-09-02",
    totalAmount: 495.0,
    tax: 49.5,
    lineItems: [{ description: "Pallet Shipping - Metro Area", quantity: 3, unitPrice: 148.5, total: 445.5 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "plg_metro_ship.pdf"
  },
  // OUTLIER 2: Deliberate Duplicate Payment (Exact Amount Match to INV-PLG-402)
  {
    vendorName: "Prime Logistics Group",
    invoiceNumber: "INV-PLG-404",
    date: "2026-09-14",
    totalAmount: 520.0,
    tax: 52.0,
    lineItems: [{ description: "Duplicate Billed Courier Consignment", quantity: 5, unitPrice: 93.6, total: 468.0 }],
    isFlagged: true,
    riskScore: 0.85,
    flaggedReasons: [
      "Potential Duplicate Payment: Identical $520.00 already paid to Prime Logistics Group on 2026-08-20"
    ],
    status: "Rejected",
    originalFileName: "plg_reissued_bill.pdf"
  },

  // 3. Apex Workspace Solutions
  {
    vendorName: "Apex Workspace Solutions",
    invoiceNumber: "INV-AWS-881",
    date: "2026-08-10",
    totalAmount: 340.0,
    tax: 34.0,
    lineItems: [{ description: "Ergonomic Chairs Maintenance", quantity: 2, unitPrice: 153.0, total: 306.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "apex_seating_repairs.pdf"
  },
  {
    vendorName: "Apex Workspace Solutions",
    invoiceNumber: "INV-AWS-882",
    date: "2026-08-28",
    totalAmount: 290.0,
    tax: 29.0,
    lineItems: [{ description: "Printer Toner & Paper Cartons", quantity: 4, unitPrice: 65.25, total: 261.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "apex_printer_supplies.pdf"
  },
  {
    vendorName: "Apex Workspace Solutions",
    invoiceNumber: "INV-AWS-883",
    date: "2026-09-05",
    totalAmount: 315.0,
    tax: 31.5,
    lineItems: [{ description: "Cable Organizers & Desk Mounts", quantity: 6, unitPrice: 47.25, total: 283.5 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "apex_desk_supplies.pdf"
  },
  // OUTLIER 3: Deliberate Duplicate Invoice Number (Identical #INV-AWS-881)
  {
    vendorName: "Apex Workspace Solutions",
    invoiceNumber: "INV-AWS-881",
    date: "2026-09-12",
    totalAmount: 340.0,
    tax: 34.0,
    lineItems: [{ description: "Ergonomic Chairs Maintenance (Double Submission)", quantity: 2, unitPrice: 153.0, total: 306.0 }],
    isFlagged: true,
    riskScore: 0.95,
    flaggedReasons: [
      "Potential Duplicate: Invoice #INV-AWS-881 already recorded in ledger"
    ],
    status: "Rejected",
    originalFileName: "apex_seating_resubmit.pdf"
  },

  // 4. Starlight Digital Media
  {
    vendorName: "Starlight Digital Media",
    invoiceNumber: "INV-SDM-201",
    date: "2026-08-01",
    totalAmount: 2400.0,
    tax: 240.0,
    lineItems: [{ description: "Google Ads Management & Retargeting", quantity: 1, unitPrice: 2160.0, total: 2160.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "starlight_aug_ads.pdf"
  },
  {
    vendorName: "Starlight Digital Media",
    invoiceNumber: "INV-SDM-202",
    date: "2026-08-15",
    totalAmount: 2450.0,
    tax: 245.0,
    lineItems: [{ description: "Technical SEO Audit & Copywriting", quantity: 1, unitPrice: 2205.0, total: 2205.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "starlight_seo.pdf"
  },
  {
    vendorName: "Starlight Digital Media",
    invoiceNumber: "INV-SDM-203",
    date: "2026-09-01",
    totalAmount: 2600.0,
    tax: 260.0,
    lineItems: [{ description: "Monthly Campaign Retainer", quantity: 1, unitPrice: 2340.0, total: 2340.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "starlight_sep_retainer.pdf"
  },

  // 5. Guardian Cybersecurity LLC
  {
    vendorName: "Guardian Cybersecurity LLC",
    invoiceNumber: "INV-GCS-701",
    date: "2026-08-12",
    totalAmount: 3800.0,
    tax: 380.0,
    lineItems: [{ description: "Quarterly Penetration Testing", quantity: 1, unitPrice: 3420.0, total: 3420.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "guardian_q3_pentest.pdf"
  },
  {
    vendorName: "Guardian Cybersecurity LLC",
    invoiceNumber: "INV-GCS-702",
    date: "2026-09-08",
    totalAmount: 3950.0,
    tax: 395.0,
    lineItems: [{ description: "SOC2 Compliance Gap Remediation", quantity: 1, unitPrice: 3555.0, total: 3555.0 }],
    isFlagged: false,
    riskScore: 0.05,
    flaggedReasons: [],
    status: "Approved",
    originalFileName: "guardian_soc2.pdf"
  }
];
