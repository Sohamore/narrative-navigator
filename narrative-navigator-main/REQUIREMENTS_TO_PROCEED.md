# What You Need to Provide — Narrative Navigator

Use this as a checklist. You can reply with numbers/answers (e.g. "1: FastAPI, 2: same repo") or say "use your judgment" where you’re fine with defaults.

---

## 1. Backend setup

| # | Item | Options / What to provide |
|---|------|---------------------------|
| 1.1 | **Backend framework** | **FastAPI** (recommended) or **Flask**? |
| 1.2 | **Backend location** | Same repo as frontend (e.g. `backend/` or `api/`) or separate repo? If same repo: preferred folder name? |
| 1.3 | **Python version** | 3.10, 3.11, or 3.12? (3.10+ recommended for spaCy) |

---

## 2. NLP stack (custom logic, not “just prompts”)

| # | Item | Options / What to provide |
|---|------|---------------------------|
| 2.1 | **Core NLP library** | **spaCy** (recommended for NER, dependency parsing, tokens) or **NLTK** or **both** (spaCy for pipeline, NLTK for specific tools)? |
| 2.2 | **spaCy model** | If spaCy: use **en_core_web_sm** (small, fast) or **en_core_web_md** (more accurate, heavier)? Default: `en_core_web_sm`. |
| 2.3 | **LLM usage** | **No LLM** (100% rules + spaCy/NLTK) or **optional minimal LLM** (e.g. small HuggingFace model) only for style/tone where rules are hard? If minimal LLM: local-only (e.g. HuggingFace `transformers`) or allow one external API? |

---

## 3. Feature scope for first version

Confirm which to implement first (we can do all and mark some as “v1”).

| # | Feature | In v1? (Y/N) |
|---|---------|--------------|
| 3.1 | Narrative/context consistency (pronouns, tense, character names, contradictions) | ? |
| 3.2 | Content enhancement (structure, flow, grammar, repetition, clarity) | ? |
| 3.3 | Style modification (formal / casual / academic / storytelling / persuasive) | ? |
| 3.4 | Explainable output (original → modified + reason per change) | ? |
| 3.5 | Functional UI (input, style dropdown, Enhance, output, explanation section) | ? |

Your UI already has: text input, mode, creativity, enhancement level, Analyze, Enhance, and a panel for results. We’ll wire these to the real backend and add the **style dropdown** and **explanation table** (Original | Modified | Reason) to match your spec.

---

## 4. API and run environment

| # | Item | What to provide |
|---|------|------------------|
| 4.1 | **How you run the app** | e.g. “Frontend on port 5173, backend on 8000” or “single domain with Vite proxy to backend”. If you don’t care: we’ll assume frontend `5173`, backend `8000`, and Vite proxy to `/api`. |
| 4.2 | **CORS** | Backend only (same origin via proxy) or need to allow a different frontend origin? If you don’t know: we’ll allow same origin + localhost. |

---

## 5. Documentation

| # | Item | What to provide |
|---|------|------------------|
| 5.1 | **Where to document “custom vs external”** | Single doc (e.g. `ARCHITECTURE.md` or `CUSTOM_VS_EXTERNAL.md`) or split (e.g. per module)? Default: one `ARCHITECTURE.md` with a “Custom vs external” section. |

---

## 6. Optional but helpful

| # | Item | What to provide |
|---|------|------------------|
| 6.1 | **Sample problematic texts** | e.g. “Rahul went to school. She was late.” for pronoun checks, or a 2–3 paragraph story for consistency. If none: we’ll use your existing sample and the examples from your spec. |
| 6.2 | **Style names** | Exact list for the style dropdown: e.g. **Formal, Casual, Academic, Storytelling, Persuasive** (as in your message) or add/remove any? |
| 6.3 | **Max text length** | Any limit (e.g. 10k characters) for the first version? If not: we’ll pick a reasonable default (e.g. 20k chars) and document it. |

---

## Summary: minimum to proceed

- **Must decide (or say “your choice”)**: backend framework (1.1), backend location (1.2), LLM or not (2.3), and confirm v1 features (3.1–3.5).
- **We can assume if you prefer**: Python 3.10+, spaCy + `en_core_web_sm`, no LLM for v1, FastAPI in `backend/`, Vite proxy to `/api`, one `ARCHITECTURE.md` for custom vs external, style list = Formal / Casual / Academic / Storytelling / Persuasive.

Once you answer (or say “proceed with defaults”), next steps will be:

1. Add Python backend (FastAPI) with custom pipelines for consistency, enhancement, and style.
2. Implement explainable output (per-change reason).
3. Connect the existing React UI to the real API and add style dropdown + explanation table.
4. Write `ARCHITECTURE.md` (and optionally `REQUIREMENTS_TO_PROCEED.md` as the “what you provided” log).

Reply with your choices (or “use defaults”) and we’ll proceed.
