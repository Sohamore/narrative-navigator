# Narrative Navigator — Backend

FastAPI backend with custom NLP pipelines (spaCy). No LLM in v1.

## Setup

1. **Create and activate virtual environment** (from this `backend/` folder):

   ```bash
   python -m venv venv
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # Windows CMD:
   venv\Scripts\activate.bat
   # macOS/Linux:
   source venv/bin/activate
   ```

2. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Download spaCy model**:

   ```bash
   python -m spacy download en_core_web_sm
   ```

## Run

```bash
uvicorn main:app --reload --port 8001
```

- API: http://localhost:8001  
- Health: http://localhost:8001/health  
- Docs: http://localhost:8001/docs  

If you see **WinError 10013** on port 8000, the port is in use or blocked; use `--port 8001` (or 8080, 3001, etc.). When you add the Vite proxy, point it to the same port (e.g. `target: "http://localhost:8001"`).
