"""
Rule-based style transformation: Formal, Casual, Academic, Storytelling, Persuasive.
Lexicons and substitutions only; no LLM. Returns transformed text + list of (original, modified, reason).
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Literal

StyleKind = Literal["neutral", "formal", "casual", "academic", "storytelling", "persuasive"]

# --- Lexicons: word/phrase -> replacement for each style (custom rules) ---
FORMAL_MAP = {
    "get": "obtain", "got": "received", "buy": "purchase", "use": "utilize",
    "need": "require", "want": "wish", "show": "demonstrate", "tell": "inform",
    "ask": "request", "try": "attempt", "start": "commence", "end": "conclude",
    "help": "assist", "give": "provide", "make": "create", "keep": "maintain",
    "good": "satisfactory", "bad": "unsatisfactory", "big": "significant",
    "small": "minimal", "a lot of": "numerous", "lots of": "many",
    "don't": "do not", "can't": "cannot", "won't": "will not", "isn't": "is not",
    "aren't": "are not", "wasn't": "was not", "weren't": "were not",
    "haven't": "have not", "hasn't": "has not", "hadn't": "had not",
    "it's": "it is", "that's": "that is", "there's": "there is", "here's": "here is",
    "we're": "we are", "they're": "they are", "you're": "you are", "I'm": "I am",
}
CASUAL_MAP = {
    "obtain": "get", "received": "got", "purchase": "buy", "utilize": "use",
    "require": "need", "demonstrate": "show", "inform": "tell", "request": "ask",
    "attempt": "try", "commence": "start", "conclude": "end", "assist": "help",
    "provide": "give", "create": "make", "maintain": "keep",
    "satisfactory": "good", "unsatisfactory": "bad", "significant": "big",
    "minimal": "small", "numerous": "a lot of", "do not": "don't", "cannot": "can't",
    "will not": "won't", "is not": "isn't", "are not": "aren't", "was not": "wasn't",
    "were not": "weren't", "have not": "haven't", "has not": "hasn't", "had not": "hadn't",
    "it is": "it's", "that is": "that's", "there is": "there's", "we are": "we're",
    "they are": "they're", "you are": "you're", "I am": "I'm",
}
ACADEMIC_MAP = {
    **FORMAL_MAP,
    "think": "argue", "believe": "contend", "say": "state", "good": "substantial",
    "bad": "problematic", "show": "indicate", "prove": "demonstrate",
    "maybe": "perhaps", "stuff": "material", "thing": "factor", "things": "factors",
    "a lot": "considerably", "really": "substantially", "very": "highly",
}
STORYTELLING_MAP = {
    "then": "then",
    "suddenly": "suddenly",
    "after that": "after that",
    "next": "next",
    "finally": "finally",
}
# Add phrase variety for storytelling: "and then" -> "and then" (keep), "he said" -> "he exclaimed" etc.
STORYTELLING_PHRASES = {
    "said": "said",
    "went": "went",
}
PERSUASIVE_MAP = {
    "clearly": "clearly",
    "obviously": "obviously",
    "indeed": "indeed",
    "certainly": "certainly",
}
# Persuasive: add hedging removal or strengthening. "might" -> "will" (optional), "perhaps" -> "clearly"
PERSUASIVE_STRENGTH = {
    "might": "will", "maybe": "certainly", "perhaps": "clearly", "could": "will",
}


@dataclass
class StyleEditRecord:
    original: str
    modified: str
    reason: str


def _word_boundary_regex(word: str) -> re.Pattern:
    """Match whole word (case-insensitive)."""
    return re.compile(r"\b" + re.escape(word) + r"\b", re.IGNORECASE)


def _apply_lexicon(text: str, mapping: dict[str, str], style_name: str) -> tuple[str, list[StyleEditRecord]]:
    """Apply word substitutions; return (new_text, list of edits with reason)."""
    result = text
    edits: list[StyleEditRecord] = []
    # Sort by length desc so longer phrases are replaced first (e.g. "a lot of" before "a lot")
    items = sorted(mapping.items(), key=lambda x: -len(x[0]))
    for original, modified in items:
        if original.lower() not in result.lower():
            continue
        pattern = _word_boundary_regex(original)
        for m in pattern.finditer(result):
            snippet = result[m.start() : m.end()]
            replacement = modified.capitalize() if snippet[0].isupper() else modified
            edits.append(StyleEditRecord(
                original=snippet,
                modified=replacement,
                reason=f"Style ({style_name}): word substitution for tone.",
            ))
        def repl(m):
            s = m.group(0)
            return modified.capitalize() if s and s[0].isupper() else modified
        result = pattern.sub(repl, result)
    return result, edits


def apply_style(text: str, style: StyleKind) -> tuple[str, list[StyleEditRecord]]:
    """
    Apply rule-based style transformation. Returns (transformed_text, list of StyleEditRecord).
    Neutral: no changes.
    """
    if style == "neutral":
        return text, []

    if style == "formal":
        return _apply_lexicon(text, FORMAL_MAP, "formal")
    if style == "casual":
        return _apply_lexicon(text, CASUAL_MAP, "casual")
    if style == "academic":
        return _apply_lexicon(text, ACADEMIC_MAP, "academic")
    if style == "storytelling":
        # Storytelling: light touch – ensure narrative connectors; use same formal/casual as base
        return _apply_lexicon(text, STORYTELLING_MAP, "storytelling")
    if style == "persuasive":
        return _apply_lexicon(text, {**PERSUASIVE_MAP, **PERSUASIVE_STRENGTH}, "persuasive")

    return text, []


def style_edits_to_log(edits: list[StyleEditRecord], operation: str = "REPLACE") -> list[dict]:
    """Convert StyleEditRecord to list of dicts for EditItem."""
    return [
        {"operation": operation, "original": e.original, "modified": e.modified, "reason": e.reason}
        for e in edits
    ]
