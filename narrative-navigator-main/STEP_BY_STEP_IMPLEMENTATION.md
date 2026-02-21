# Step-by-Step Implementation — Narrative Navigator

End-to-end process from zero to a working system (custom logic + minimal/no LLM). Do steps in order; each step builds on the previous.

---

## Phase 0: Prerequisites & Decisions

| Step | Action |
|------|--------|
| **0.1** | Install **Python 3.10+** and **Node.js** (you already have the frontend). |
| **0.2** | Decide: backend in same repo → use folder `backend/`. Framework: **FastAPI**. |
| **0.3** | Decide: v1 = **no LLM** (100% custom pipelines + spaCy). Document in `ARCHITECTURE.md` later. |

---

## Phase 1: Backend Skeleton

| Step | Action |
|------|--------|
| **1.1** | Create `backend/` at project root (same level as `src/`, `package.json`). |
| **1.2** | Inside `backend/`: `python -m venv venv`, then activate and install: `fastapi`, `uvicorn`, `pydantic`, `spacy`. Run `python -m spacy download en_core_web_sm`. |
| **1.3** | Add `backend/requirements.txt`: `fastapi`, `uvicorn`, `pydantic`, `spacy`, `en-core-web-sm @ https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.0/en_core_web_sm-3.7.0-py3-none-any.whl` (or use `spacy download` after install). |
| **1.4** | Create `backend/main.py`: FastAPI app, CORS for localhost, one health route `GET /health` returning `{"status": "ok"}`. |
| **1.5** | Run backend: `cd backend && uvicorn main:app --reload --port 8000`. Check `http://localhost:8000/health`. |

---

## Phase 2: API Contract (Request/Response)

| Step | Action |
|------|--------|
| **2.1** | Define Pydantic models in `backend/schemas.py`: e.g. `EnhanceRequest` (text, style, enhancement_level), `EditItem` (original, modified, reason), `EnhanceResponse` (enhanced_text, edit_log, issues). |
| **2.2** | Define `AnalyzeRequest` / `AnalyzeResponse`: e.g. consistency_issues (list of {type, span, message}), readability_score, tense_consistency, etc. |
| **2.3** | Add POST `/api/analyze` and POST `/api/enhance` in `main.py` (stub implementations that return dummy JSON matching the schemas). |

---

## Phase 3: Custom NLP Pipelines (Core Logic)

| Step | Action |
|------|--------|
| **3.1** | Create `backend/nlp/` package: `__init__.py`, load spaCy model once at startup. |
| **3.2** | **Consistency module** (`backend/nlp/consistency.py`): Implement **custom** logic (no LLM): (a) Pronoun–antecedent: track named entities (PERSON) and check following pronouns (he/she/they) per sentence/paragraph. (b) Tense: detect verb tense per sentence (past/present/future) and flag switches. (c) Character name changes: same NER, flag if same entity referred by different names without alias handling. Return list of issues with span indices and messages. |
| **3.3** | **Enhancement module** (`backend/nlp/enhancement.py`): Implement **custom** rules: (a) Repetition: find repeated words/phrases in a window (e.g. "very very", "he was tired... he was tired"), suggest deduplication. (b) Sentence structure: optional use of spaCy dependency parse to suggest reordering (e.g. passive → active). (c) Simple grammar: fragment detection, basic agreement checks. Each suggestion must include: original span, suggested replacement, reason string. |
| **3.4** | **Style module** (`backend/nlp/style.py`): Implement **rule-based** style transformation: (a) Lexicons/mappings for Formal/Casual/Academic/Storytelling/Persuasive (e.g. word substitution tables, phrase patterns). (b) Apply substitutions and structural tweaks (e.g. contractions for casual, remove contractions for formal). (c) Output: transformed text + list of changes with (original, modified, reason). All logic must be **custom code + lexicons**; no LLM calls. |

---

## Phase 4: Explainable Output

| Step | Action |
|------|--------|
| **4.1** | Ensure every pipeline (consistency, enhancement, style) that changes text returns a list of **edit items**: `{ original, modified, reason }`. |
| **4.2** | In the enhance endpoint: merge all edits from consistency fixes, enhancement suggestions, and style changes into one ordered **edit_log**. |
| **4.3** | Enhance response includes: `enhanced_text` (full result) and `edit_log` (array of EditItem). Frontend will show a table: Original | Modified | Reason. |

---

## Phase 5: Wire Backend Endpoints

| Step | Action |
|------|--------|
| **5.1** | Implement `POST /api/analyze`: run consistency checks on request text; return consistency_issues, optional readability/tense summary. No LLM. |
| **5.2** | Implement `POST /api/enhance`: (1) Run consistency module → get fixes and apply. (2) Run enhancement module → get suggestions and apply. (3) Run style module with requested style → get transformations and apply. (4) Build edit_log from all steps. (5) Return enhanced_text + edit_log. |
| **5.3** | Add input validation: max length (e.g. 20_000 chars), allowed styles enum. Return 400 with clear message if invalid. |

---

## Phase 6: Frontend Integration

| Step | Action |
|------|--------|
| **6.1** | Add Vite proxy: in `vite.config.ts`, proxy `/api` to `http://localhost:8000` so the React app calls `/api/analyze` and `/api/enhance` without CORS issues. |
| **6.2** | Create a small API client (e.g. `src/lib/api.ts`): `analyzeText(text: string)` and `enhanceText(text: string, style: string, level?: string)` calling the backend, returning typed responses. |
| **6.3** | Replace mock logic in `Index.tsx`: `handleAnalyze` calls `analyzeText`, then sets state with real consistency issues and any scores; `handleEnhance` calls `enhanceText` with current style from sidebar, then sets `enhancedText` and `editLog` from response. |
| **6.4** | Add **style dropdown** in `WritingSidebar` (or wherever writing mode lives): options = Formal, Casual, Academic, Storytelling, Persuasive. Pass selected style into `enhanceText`. |
| **6.5** | Ensure **AnalysisPanel** (or equivalent) shows the **explanation table**: columns Original | Modified | Reason, using `editLog` from the enhance response. |

---

## Phase 7: Documentation & Cleanup

| Step | Action |
|------|--------|
| **7.1** | Write `ARCHITECTURE.md`: (a) High-level flow: Frontend → API → NLP pipelines. (b) **Custom vs external**: list what is custom (consistency checks, enhancement rules, style lexicons, edit_log construction) vs external (spaCy for NER/tokens/dependency parse, FastAPI, React). Explicitly state: "No ChatGPT or other LLM used in v1." |
| **7.2** | Add a short `backend/README.md`: how to create venv, install deps, download spaCy model, run uvicorn. |
| **7.3** | Optional: add 2–3 example requests (curl or JSON) in `ARCHITECTURE.md` or `backend/README.md` for `/api/analyze` and `/api/enhance`. |

---

## Phase 8: Test End-to-End

| Step | Action |
|------|--------|
| **8.1** | Start backend (port 8000), then frontend (e.g. port 5173). Open app, paste: "Rahul went to school. She was late." Run **Analyze** → expect a consistency issue (e.g. pronoun/gender). |
| **8.2** | Same or new text: select style (e.g. Formal), click **Enhance** → expect enhanced text and an edit log with Original | Modified | Reason. |
| **8.3** | Test style dropdown: switch to Casual, enhance again → output should reflect casual tone. |

---

## Quick Reference: Order of Work

1. **Phase 0** – Prerequisites & decisions  
2. **Phase 1** – Backend skeleton (folder, venv, FastAPI, health check)  
3. **Phase 2** – Request/response schemas and stub endpoints  
4. **Phase 3** – Custom NLP (consistency → enhancement → style)  
5. **Phase 4** – Explainable edit_log in all pipelines  
6. **Phase 5** – Real implementations of `/api/analyze` and `/api/enhance`  
7. **Phase 6** – Frontend: proxy, API client, replace mocks, style dropdown, explanation table  
8. **Phase 7** – ARCHITECTURE.md and backend README  
9. **Phase 8** – Manual E2E tests  

---

## File Structure (Target)

```
narrative-navigator-main/
├── backend/
│   ├── venv/                 # (optional, often gitignored)
│   ├── main.py               # FastAPI app, /health, /api/analyze, /api/enhance
│   ├── requirements.txt
│   ├── schemas.py            # Pydantic request/response models
│   ├── nlp/
│   │   ├── __init__.py       # load spaCy once
│   │   ├── consistency.py    # pronoun, tense, character checks
│   │   ├── enhancement.py    # repetition, structure, grammar
│   │   └── style.py          # rule-based style transformation
│   └── README.md
├── src/
│   ├── lib/
│   │   └── api.ts            # analyzeText(), enhanceText()
│   ├── pages/
│   │   └── Index.tsx         # wire to real API, style in state
│   └── components/
│       ├── WritingSidebar.tsx  # add style dropdown
│       └── AnalysisPanel.tsx   # explanation table (Original | Modified | Reason)
├── ARCHITECTURE.md           # custom vs external, no LLM
├── REQUIREMENTS_TO_PROCEED.md
└── STEP_BY_STEP_IMPLEMENTATION.md  # this file
```

You can start with **Phase 0** and **Phase 1**; once the backend runs and stubs respond, proceed to Phase 2 and 3.
