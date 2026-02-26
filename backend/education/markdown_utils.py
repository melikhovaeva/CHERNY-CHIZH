"""Convert Markdown to safe HTML for API responses."""

import markdown
import bleach


ALLOWED_TAGS = {
    "p", "br", "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "a", "strong", "em", "b", "i",
    "code", "pre", "blockquote", "abbr", "acronym",
    "img",
}

ALLOWED_ATTRIBUTES = {
    "*": ["class"],
    "a": ["href", "title"],
    "img": ["src", "alt", "title"],
    "abbr": ["title"],
    "acronym": ["title"],
}


def markdown_to_safe_html(raw_markdown: str) -> str:
    """
    Convert Markdown to HTML and sanitize to prevent XSS.
    Returns safe HTML suitable for embedding in frontend.
    """
    if not raw_markdown or not raw_markdown.strip():
        return ""
    html = markdown.markdown(
        raw_markdown,
        extensions=["extra"],
    )
    return bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        strip=True,
    )
