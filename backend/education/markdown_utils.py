"""Sanitize HTML; optional Markdown→HTML for seed data."""

import bleach
import markdown


ALLOWED_TAGS = {
    "p",
    "br",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "a",
    "strong",
    "em",
    "b",
    "i",
    "code",
    "pre",
    "blockquote",
    "abbr",
    "acronym",
    "img",
}

ALLOWED_ATTRIBUTES = {
    "*": ["class"],
    "a": ["href", "title"],
    "img": ["src", "alt", "title"],
    "abbr": ["title"],
    "acronym": ["title"],
}


def sanitize_html(html: str) -> str:
    """
    Strip unsafe markup; returns HTML safe to embed on the frontend.
    """
    if not html or not str(html).strip():
        return ""
    return bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        strip=True,
    )


def markdown_to_safe_html(raw_markdown: str) -> str:
    """
    Convert Markdown to HTML and sanitize (for management commands / legacy).
    """
    if not raw_markdown or not raw_markdown.strip():
        return ""
    html = markdown.markdown(
        raw_markdown,
        extensions=["extra"],
    )
    return sanitize_html(html)
