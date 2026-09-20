import re
from typing import List, Optional, Any
from pydantic import BaseModel, field_validator

def clean_number(v: Any) -> float:
    if v is None:
        return 0.0
    if isinstance(v, (int, float)):
        return float(v)
    if isinstance(v, str):
        cleaned = re.sub(r"[^\d.-]", "", v.strip())
        try:
            return float(cleaned) if cleaned else 0.0
        except ValueError:
            return 0.0
    return 0.0

class LineItem(BaseModel):
    description: str
    quantity: Optional[float] = 1.0
    unit_price: Optional[float] = 0.0
    total: Optional[float] = 0.0

    @field_validator("quantity", "unit_price", "total", mode="before")
    @classmethod
    def parse_numeric(cls, v: Any) -> float:
        return clean_number(v)

class InvoiceData(BaseModel):
    vendor_name: Optional[str] = None
    invoice_number: Optional[str] = None
    date: Optional[str] = None
    total_amount: Optional[float] = 0.0
    tax: Optional[float] = 0.0
    line_items: List[LineItem] = []

    @field_validator("total_amount", "tax", mode="before")
    @classmethod
    def parse_numeric(cls, v: Any) -> float:
        return clean_number(v)

class AnalyzeResponse(BaseModel):
    invoice_data: InvoiceData
    is_flagged: bool = False
    risk_score: float = 0.1
    flagged_reasons: List[str] = []
    message: str = "Invoice processed successfully"
