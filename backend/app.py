from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    input_type: str
    content: str = None

@app.post("/api/analyze")
async def analyze(input_type: str = Form(...), content: str = Form(None), file: UploadFile = File(None)):
    # Placeholder implementation for analysis
    # In real implementation, add URL checks, OCR, ML model inference, etc.
    if input_type == "url":
        risk_score = 65
        risk_level = "Suspeito"
        details = f"Análise simulada para URL: {content}"
    elif input_type == "text":
        risk_score = 45
        risk_level = "Baixo Risco"
        details = "Análise simulada para texto fornecido."
    elif input_type == "image":
        risk_score = 80
        risk_level = "Alto Risco"
        details = "Análise simulada para imagem enviada."
    else:
        risk_score = 0
        risk_level = "Desconhecido"
        details = "Tipo de entrada inválido."

    return {
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "details": details
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
