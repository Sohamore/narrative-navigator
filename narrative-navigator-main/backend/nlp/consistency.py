"""
Custom consistency checks: pronoun–antecedent, tense, character.
Uses spaCy for NER and tokens only; all rules are custom. No LLM.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

# Common first names -> typical grammatical gender for pronoun check (incomplete; extend as needed).
# Used only to flag likely mismatches (e.g. "Rahul ... She").
NAME_TO_GENDER: dict[str, str] = {
    "rahul": "male", "arjun": "male", "raj": "male", "amit": "male",
    "john": "male", "james": "male", "michael": "male", "david": "male",
    "priya": "female", "anita": "female", "meera": "female", "sita": "female",
    "mary": "female", "jane": "female", "emma": "female", "sarah": "female",
}

MALE_PRONOUNS = {"he", "him", "his", "himself"}
FEMALE_PRONOUNS = {"she", "her", "hers", "herself"}
NEUTRAL_PRONOUNS = {"they", "them", "their", "themselves", "it", "its"}


@dataclass
class ConsistencyIssueResult:
    type: str
    start: int
    end: int
    message: str
    original: str | None = None
    suggestion: str | None = None


def _get_tense(sent) -> str | None:
    """Infer sentence tense from first verb with Tense morph. Returns 'past', 'present', 'future' or None."""
    for token in sent:
        if token.pos_ != "VERB":
            continue
        tense = token.morph.get("Tense")
        if tense:
            return list(tense)[0]  # 'Past' or 'Pres'
        # Check lemma + context for future (will, going to)
        if token.lower_ in ("will", "shall", "'ll") or (token.lower_ == "going" and token.head.lower_ == "to"):
            return "Fut"
    return None


def _normalize_tense(t: str | None) -> str | None:
    if t in ("Past", "past"): return "past"
    if t in ("Pres", "present"): return "present"
    if t in ("Fut", "future"): return "future"
    return t


def check_consistency(text: str, nlp) -> list[ConsistencyIssueResult]:
    """Run all consistency checks; return list of issues with character spans."""
    doc = nlp(text)
    issues: list[ConsistencyIssueResult] = []
    seen_names_in_doc: dict[str, str] = {}  # name -> gender once we've seen it

    # --- Pronoun–antecedent (custom logic) ---
    sentences = list(doc.sents)
    for i, sent in enumerate(sentences):
        # Collect PERSON names in this sentence (NER + fallback: capitalized single tokens)
        persons_in_sent: list[tuple[str, int, int]] = []
        for ent in sent.ents:
            if ent.label_ == "PERSON":
                name_lower = ent.text.strip().lower()
                if name_lower:
                    persons_in_sent.append((name_lower, ent.start_char, ent.end_char))
        # Fallback: treat capitalized words (likely names) as potential PERSON for pronoun check
        if not persons_in_sent:
            for token in sent:
                if token.pos_ == "PROPN" and token.text[0].isupper() and len(token.text) > 1:
                    name_lower = token.text.lower()
                    persons_in_sent.append((name_lower, token.idx, token.idx + len(token)))
                    break

        # Update global name->gender from known list (first occurrence)
        for name_lower, _s, _e in persons_in_sent:
            if name_lower not in seen_names_in_doc and name_lower in NAME_TO_GENDER:
                seen_names_in_doc[name_lower] = NAME_TO_GENDER[name_lower]

        # In this sentence, check pronouns
        for token in sent:
            low = token.lower_
            if low in MALE_PRONOUNS or low in FEMALE_PRONOUNS:
                # Prefer antecedent from same sentence, then previous sentence
                antecedent_gender: str | None = None
                for name_lower, _s, _e in persons_in_sent:
                    antecedent_gender = seen_names_in_doc.get(name_lower) or NAME_TO_GENDER.get(name_lower)
                    break
                if antecedent_gender is None and i > 0:
                    # Use last PERSON / PROPN from previous sentence
                    prev = sentences[i - 1]
                    for ent in prev.ents:
                        if ent.label_ == "PERSON":
                            name_lower = ent.text.strip().lower()
                            antecedent_gender = seen_names_in_doc.get(name_lower) or NAME_TO_GENDER.get(name_lower)
                            break
                    if antecedent_gender is None:
                        for t in prev:
                            if t.pos_ == "PROPN" and t.text and t.text[0].isupper():
                                name_lower = t.text.lower()
                                antecedent_gender = NAME_TO_GENDER.get(name_lower)
                                break
                if antecedent_gender:
                    expect_male = antecedent_gender == "male"
                    if expect_male and low in FEMALE_PRONOUNS:
                        issues.append(ConsistencyIssueResult(
                            type="pronoun",
                            start=token.idx,
                            end=token.idx + len(token),
                            message="Pronoun 'she/her' may not match antecedent (expected male).",
                            original=token.text,
                            suggestion="he" if low == "she" else "him" if low == "her" else "his",
                        ))
                    elif not expect_male and low in MALE_PRONOUNS:
                        issues.append(ConsistencyIssueResult(
                            type="pronoun",
                            start=token.idx,
                            end=token.idx + len(token),
                            message="Pronoun 'he/him' may not match antecedent (expected female).",
                            original=token.text,
                            suggestion="she" if low == "he" else "her" if low == "him" else "her",
                        ))

    # --- Tense consistency (custom logic) ---
    prev_tense: str | None = None
    for sent in doc.sents:
        t = _normalize_tense(_get_tense(sent))
        if t and prev_tense is not None and t != prev_tense:
            # Flag first token of sentence as start of "switch"
            first = sent[0]
            issues.append(ConsistencyIssueResult(
                type="tense",
                start=first.idx,
                end=first.idx + len(first),
                message=f"Tense switch: previous sentence was {prev_tense}, this one appears {t}.",
                original=sent.text[:60].strip() + ("..." if len(sent.text) > 60 else ""),
                suggestion=None,
            ))
        if t:
            prev_tense = t

    # --- Character name consistency: flag if same PERSON appears with different surface forms (e.g. nickname)
    # Simple check: multiple PERSON spans with different text in same doc (could be same entity)
    person_texts: set[str] = set()
    for ent in doc.ents:
        if ent.label_ != "PERSON":
            continue
        name = ent.text.strip()
        if not name:
            continue
        name_lower = name.lower()
        # If we already saw a different casing/variant, we don't track variants; just pass.
        person_texts.add(name_lower)
    # No per-entity coreference in small model; skip complex character-name logic for v1.

    return issues


def consistency_issues_to_dicts(issues: list[ConsistencyIssueResult]) -> list[dict[str, Any]]:
    """Convert to list of dicts for Pydantic ConsistencyIssue."""
    return [
        {
            "type": r.type,
            "start": r.start,
            "end": r.end,
            "message": r.message,
            "original": r.original,
            "suggestion": r.suggestion,
        }
        for r in issues
    ]
