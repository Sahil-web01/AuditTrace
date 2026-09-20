import json
import warnings

# Suppress library deprecation notice from printing to terminal
warnings.filterwarnings("ignore", category=FutureWarning)

import google.generativeai as genai
from app.config import settings
from app.models.schemas import InvoiceData, LineItem

INVOICE_PROMPT = """Extract the following invoice data into JSON format:
{
  "vendor_name": "vendor or company name",
  "invoice_number": "invoice id/number",
  "date": "date in YYYY-MM-DD format if available",
  "total_amount": 0.0,
  "tax": 0.0,
  "line_items": [
    {
      "description": "item name/description",
      "quantity": 1.0,
      "unit_price": 0.0,
      "total": 0.0
    }
  ]
}

Important:
- Return strictly valid JSON only.
- Do NOT wrap the output in markdown code blocks (no ```json or ```).
- Convert currency amounts to pure numbers (strip $ and commas).
"""

CANDIDATE_MODELS = [
    settings.GEMINI_MODEL,
    "gemini-3.6-flash",
    "gemini-flash-latest",
    "gemini-2.5-flash",
]

class GeminiExtractor:
    def __init__(self):
        self._configured_key = None

    def _ensure_configured(self):
        current_key = settings.GEMINI_API_KEY
        if current_key and current_key != self._configured_key:
            genai.configure(api_key=current_key)
            self._configured_key = current_key

    async def extract_invoice(self, file_bytes: bytes, mime_type: str) -> InvoiceData:
        self._ensure_configured()

        # Mock fallback for local testing when API key is not configured
        if not self._configured_key:
            return InvoiceData(
                vendor_name="Acme Supplies Ltd",
                invoice_number="INV-2026-0891",
                date="2026-09-15",
                total_amount=1450.50,
                tax=145.05,
                line_items=[
                    LineItem(description="Cloud Server Hosting", quantity=1.0, unit_price=1000.0, total=1000.0),
                    LineItem(description="Maintenance Support", quantity=1.0, unit_price=305.45, total=305.45),
                ]
            )

        # Map to valid mime type for Gemini API
        if "pdf" in mime_type:
            media_type = "application/pdf"
        elif "png" in mime_type:
            media_type = "image/png"
        elif "webp" in mime_type:
            media_type = "image/webp"
        else:
            media_type = "image/jpeg"

        content = [
            INVOICE_PROMPT,
            {"mime_type": media_type, "data": file_bytes}
        ]

        # Try models in order of priority
        last_error = None
        for model_name in dict.fromkeys(CANDIDATE_MODELS):
            if not model_name:
                continue
            try:
                model = genai.GenerativeModel(
                    model_name=model_name,
                    generation_config={"response_mime_type": "application/json"}
                )
                response = model.generate_content(content)
                raw_text = response.text.strip()

                if raw_text.startswith("```"):
                    raw_text = raw_text.strip("`")
                    if raw_text.startswith("json"):
                        raw_text = raw_text[4:].strip()

                parsed = json.loads(raw_text)
                return InvoiceData(**parsed)
            except Exception as err:
                last_error = err
                continue

        # If all Gemini models fail, raise the last exception
        raise last_error or RuntimeError("Failed to generate content with Gemini API")

gemini_extractor = GeminiExtractor()
