from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from nlp import get_nlp
from nlp.consistency import check_consistency, consistency_issues_to_dicts
from nlp.enhancement import get_enhancement_edits, apply_edits, edit_records_to_log
from nlp.style import apply_style, style_edits_to_log

from schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    ConsistencyIssue,
    EnhanceRequest,
    EnhanceResponse,
    EditItem,
)

app = FastAPI(
    title="Narrative Navigator API",
    description="Custom NLP pipelines for writing enhancement and consistency",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:8080", "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


# --- Wired endpoints (Phase 5): real NLP pipelines ---

_MAX_TEXT_LENGTH = 20_000


def _compute_overall_score(issue_count: int, tense_ok: bool) -> int:
    """Compute 0–100 score from consistency issues and tense consistency."""
    base = 100
    base -= issue_count * 12
    if not tense_ok:
        base -= 10
    return max(0, min(100, base))


def _consistency_fixes_to_edit_records(issues) -> list:
    """Build enhancement edits from consistency issues that have suggestions."""
    from nlp.enhancement import EditRecord
    records = []
    for i in issues:
        if i.suggestion is not None and i.original:
            records.append(EditRecord(start=i.start, end=i.end, new_text=i.suggestion, reason=i.message))
    return records


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    """Analyze text for consistency and quality. Custom NLP; no LLM."""
    if len(request.text) > _MAX_TEXT_LENGTH:
        raise HTTPException(400, f"Text exceeds maximum length ({_MAX_TEXT_LENGTH} characters).")

    nlp = get_nlp()
    issues = check_consistency(request.text, nlp)
    issue_dicts = consistency_issues_to_dicts(issues)

    tense_issues = [i for i in issues if i.type == "tense"]
    tense_consistency = len(tense_issues) == 0

    overall_score = _compute_overall_score(len(issues), tense_consistency)
    readability_score = max(50.0, 100.0 - len(request.text.split()) * 0.5) if request.text.strip() else None

    return AnalyzeResponse(
        overall_score=overall_score,
        consistency_issues=[ConsistencyIssue(**d) for d in issue_dicts],
        tense_consistency=tense_consistency,
        readability_score=round(readability_score, 1) if readability_score else None,
    )


@app.post("/api/enhance", response_model=EnhanceResponse)
def enhance(request: EnhanceRequest):
    """Enhance text (consistency fixes + repetition + style) with explainable edit log. No LLM."""
    if len(request.text) > _MAX_TEXT_LENGTH:
        raise HTTPException(400, f"Text exceeds maximum length ({_MAX_TEXT_LENGTH} characters).")

    nlp = get_nlp()
    text = request.text
    edit_log: list[dict] = []

    # 1. Consistency fixes (pronoun suggestions, etc.)
    issues = check_consistency(text, nlp)
    fix_records = _consistency_fixes_to_edit_records(issues)
    if fix_records:
        edit_log.extend(edit_records_to_log(text, fix_records, "REPLACE"))
        text = apply_edits(text, fix_records)

    # 2. Enhancement (repetition, etc.)
    enh_records = get_enhancement_edits(text, nlp, request.enhancement_level)
    if enh_records:
        edit_log.extend(edit_records_to_log(text, enh_records, "REPLACE"))
        text = apply_edits(text, enh_records)

    # 3. Style transformation
    if request.style != "neutral":
        text, style_edits = apply_style(text, request.style)
        if style_edits:
            edit_log.extend(style_edits_to_log(style_edits, "REPLACE"))

    overall_score = _compute_overall_score(0, True)
    return EnhanceResponse(
        enhanced_text=text,
        edit_log=[EditItem(**e) for e in edit_log],
        overall_score=overall_score,
    )
