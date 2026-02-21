"""
NLP package: spaCy model loaded once at startup.
All logic here is custom (rules + spaCy for NER/tokens/deps); no LLM.
"""
import spacy

_nlp = None


def get_nlp():
    """Load and cache spaCy model (en_core_web_sm)."""
    global _nlp
    if _nlp is None:
        _nlp = spacy.load("en_core_web_sm")
    return _nlp


__all__ = ["get_nlp"]
