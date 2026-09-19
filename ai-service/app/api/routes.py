import json
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.models.schemas import AnalyzeResponse
from app.core.gemini_extractor import gemini_extractor
from app.core.anomaly_detector import anomaly_detector

router = APIRouter()

VALID_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".webp"}

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_invoice(
    file: UploadFile = File(...),
    history: Optional[str] = Form(None)
):
    name = (file.filename or "").lower()
    if not any(name.endswith(ext) for ext in VALID_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF, PNG, or JPEG.")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    try:
        mime = file.content_type or "image/jpeg"
        invoice_data = await gemini_extractor.extract_invoice(file_bytes, mime)

        # Parse historical records if passed
        historical_list = []
        if history:
            try:
                historical_list = json.loads(history)
            except Exception:
                historical_list = []

        # Run concrete anomaly detection (duplicate invoice number, exact amount, Z-score > 2)
        is_flagged, risk_score, flagged_reasons = anomaly_detector.detect(invoice_data, historical_list)

        return AnalyzeResponse(
            invoice_data=invoice_data,
            is_flagged=is_flagged,
            risk_score=risk_score,
            flagged_reasons=flagged_reasons,
            message="Invoice processed successfully"
        )
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Extraction error: {str(err)}")
