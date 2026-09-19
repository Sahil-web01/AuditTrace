from typing import List, Optional
from pydantic import BaseModel

class LineItem(BaseModel):
    description: str
    quantity: Optional[float] = 1.0
    unit_price: Optional[float] = 0.0
    total: Optional[float] = 0.0

class InvoiceData(BaseModel):
    vendor_name: Optional[str] = None
    invoice_number: Optional[str] = None
    date: Optional[str] = None
    total_amount: Optional[float] = 0.0
    tax: Optional[float] = 0.0
    line_items: List[LineItem] = []

class AnalyzeResponse(BaseModel):
    invoice_data: InvoiceData
    is_flagged: bool = False
    risk_score: float = 0.1
    flagged_reasons: List[str] = []
    message: str = "Invoice processed successfully"
