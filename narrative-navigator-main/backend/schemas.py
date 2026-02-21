from pydantic import BaseModel, Field
from typing import Literal

# --- Analyze ---

StyleKind = Literal["neutral", "formal", "casual", "academic", "storytelling", "persuasive"]
EnhancementLevelKind = Literal["light", "moderate", "heavy"]


class AnalyzeRequest(BaseModel):
    """Request body for POST /api/analyze."""
    text: str = Field(..., min_length=1, max_length=50_000, description="Raw text to analyze")


class ConsistencyIssue(BaseModel):
    """A single consistency or quality issue found in the text."""
    type: str = Field(..., description="e.g. pronoun, tense, character, repetition")
    start: int = Field(..., ge=0, description="Start character index in original text")
    end: int = Field(..., ge=0, description="End character index in original text")
    message: str = Field(..., description="Human-readable description of the issue")
    original: str | None = Field(None, description="Snippet that has the issue")
    suggestion: str | None = Field(None, description="Suggested replacement if applicable")


class AnalyzeResponse(BaseModel):
    """Response from POST /api/analyze."""
    overall_score: int = Field(..., ge=0, le=100, description="Overall narrative/quality score 0-100")
    consistency_issues: list[ConsistencyIssue] = Field(default_factory=list)
    tense_consistency: bool | None = Field(None, description="True if tense is consistent")
    readability_score: float | None = Field(None, ge=0, le=100)

# --- Enhance ---


class EnhanceRequest(BaseModel):
    """Request body for POST /api/enhance."""
    text: str = Field(..., min_length=1, max_length=50_000)
    style: StyleKind = Field("neutral", description="Target style for transformation")
    enhancement_level: EnhancementLevelKind = Field("moderate", description="How aggressive to apply enhancements")


class EditItem(BaseModel):
    """One explainable edit: original → modified with reason."""
    operation: str = Field(..., description="REPLACE | INSERT | DELETE | RESTRUCTURE")
    original: str = Field(..., description="Original span (empty for INSERT)")
    modified: str = Field(..., description="Replacement text (empty for DELETE)")
    reason: str = Field(..., description="Why this change was made")


class EnhanceResponse(BaseModel):
    """Response from POST /api/enhance."""
    enhanced_text: str = Field(..., description="Full text after all enhancements and style transform")
    edit_log: list[EditItem] = Field(default_factory=list, description="Ordered list of edits with reasons")
    overall_score: int | None = Field(None, ge=0, le=100, description="Score of enhanced text if computed")
