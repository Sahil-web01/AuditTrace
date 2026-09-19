import numpy as np
from typing import List, Dict, Any, Tuple
from app.models.schemas import InvoiceData

class AnomalyDetector:
    def detect(self, invoice: InvoiceData, history: List[Dict[str, Any]] = None) -> Tuple[bool, float, List[str]]:
        reasons = []
        risk = 0.05

        current_inv_num = (invoice.invoice_number or "").strip().lower()
        current_vendor = (invoice.vendor_name or "").strip().lower()
        current_amount = float(invoice.total_amount or 0.0)

        if not history:
            return False, risk, []

        vendor_amounts = []

        for record in history:
            rec_inv_num = str(record.get("invoiceNumber") or record.get("invoice_number") or "").strip().lower()
            rec_vendor = str(record.get("vendorName") or record.get("vendor_name") or "").strip().lower()
            rec_amount = float(record.get("totalAmount") or record.get("total_amount") or 0.0)

            # Check 1: Duplicate invoice number
            if current_inv_num and rec_inv_num == current_inv_num:
                reasons.append(f"Potential Duplicate: Invoice #{invoice.invoice_number} already recorded in ledger")
                risk = max(risk, 0.95)

            # Check 2: Exact amount match for same vendor
            if current_vendor and rec_vendor == current_vendor:
                vendor_amounts.append(rec_amount)
                if abs(rec_amount - current_amount) < 0.01 and current_amount > 0:
                    reasons.append(f"Potential Duplicate Payment: Identical ${current_amount:.2f} already paid to {invoice.vendor_name}")
                    risk = max(risk, 0.85)

        # Check 3: Statistical price spike (Z-score > 2.0 against vendor average)
        if len(vendor_amounts) >= 3 and current_amount > 0:
            mean = np.mean(vendor_amounts)
            std = np.std(vendor_amounts)

            if std > 0:
                z_score = (current_amount - mean) / std
                if z_score > 2.0:
                    reasons.append(f"Price Anomaly: Billed ${current_amount:.2f} spikes significantly above average ${mean:.2f} (Z-Score: {z_score:.2f})")
                    risk = max(risk, 0.90)

        unique_reasons = list(dict.fromkeys(reasons))
        is_flagged = len(unique_reasons) > 0 or risk >= 0.7

        return is_flagged, round(risk, 2), unique_reasons

anomaly_detector = AnomalyDetector()
