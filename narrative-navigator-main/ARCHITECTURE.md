# Narrative Navigator — Architecture

## Overview

Narrative Navigator is a writing enhancement system that improves clarity, consistency, and tone using **custom NLP pipelines**. It does **not** use ChatGPT or any other LLM. All logic is rule-based or uses spaCy for low-level NLP (NER, tokens, dependency parse).

---

## High-Level Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React UI      │────▶│   FastAPI       │────▶│   NLP Pipelines │
│   (Vite 8080)   │     │   (port 8001)   │     │   (spaCy +      │
│                 │◀────│   /api/analyze  │◀────│    custom)      │
│   SmartEditor   │     │   /api/enhance  │     │                 │
│   AnalysisPanel │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **Frontend** (React + Vite): text input, style dropdown, Analyze / Enhance buttons, Diff view, Edit Log.
- **Backend** (FastAPI): `/api/analyze` and `/api/enhance` endpoints.
- **NLP** (`backend/nlp/`): consistency, enhancement, style modules.

---

## Custom vs External

### Custom (our own logic)

| Component | Location | Description |
|-----------|----------|-------------|
| Pronoun–antecedent rules | `nlp/consistency.py` | Name→gender map, pronoun matching, PROPN fallback for names not in spaCy NER. |
| Tense consistency logic | `nlp/consistency.py` | Verb morph inspection, sentence-level tense detection, switch flagging. |
| Repetition detection | `nlp/enhancement.py` | Regex for consecutive duplicate words, filler allowlist (`very`, `really`, etc.). |
| Style lexicons | `nlp/style.py` | Formal/Casual/Academic/Storytelling/Persuasive word/phrase substitution maps. |
| Edit application | `nlp/enhancement.py`, `nlp/style.py` | Apply edits from end to start, preserve spans, build explainable edit log. |
| Score calculation | `main.py` | Overall score from issue count and tense consistency. |
| API schemas | `schemas.py` | Pydantic models for requests and responses. |

### External (third-party libraries)

| Component | Purpose | Used for |
|-----------|---------|----------|
| **spaCy** `en_core_web_sm` | NLP | NER (PERSON), tokenization, POS, morph, dependency parse. No LLM, no API calls. |
| **FastAPI** | Backend | HTTP API, CORS, validation. |
| **Pydantic** | Validation | Request/response models. |
| **React** + **Vite** | Frontend | UI, routing, dev server. |
| **shadcn/ui** | UI components | Buttons, selects, toasts, etc. |

---

## No LLM in v1

This project does **not** use:

- ChatGPT / OpenAI API
- Any other LLM API
- Hugging Face transformers or similar models

All behavior is driven by:

1. **spaCy** for tokens, NER, morph, dependency parse.
2. **Custom rules** for consistency, enhancement, and style.
3. **Lexicon-based** substitutions for style changes.

---

## File Layout

```
narrative-navigator-main/
├── backend/
│   ├── main.py              # FastAPI app, /health, /api/analyze, /api/enhance
│   ├── schemas.py           # Request/response models
│   ├── requirements.txt
│   ├── README.md
│   └── nlp/
│       ├── __init__.py      # spaCy model loader
│       ├── consistency.py   # pronoun, tense checks
│       ├── enhancement.py   # repetition removal
│       └── style.py         # style transformation
├── src/
│   ├── lib/api.ts           # analyzeText(), enhanceText()
│   ├── pages/Index.tsx      # Editor page, handlers
│   └── components/
│       ├── WritingSidebar.tsx
│       ├── SmartEditor.tsx
│       └── AnalysisPanel.tsx
├── ARCHITECTURE.md          # this file
├── REQUIREMENTS_TO_PROCEED.md
└── STEP_BY_STEP_IMPLEMENTATION.md
```

---

## Run

- **Backend:** `cd backend && uvicorn main:app --reload --port 8001`
- **Frontend:** `npm run dev` (Vite on 8080, proxies `/api` to 8001)
