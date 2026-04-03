"""Sanitize HTML; optional Markdown→HTML for seed data."""

import bleach
import markdown
from bleach.css_sanitizer import CSSSanitizer


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
    "u",
    "s",
    "strike",
    "span",
    "code",
    "pre",
    "blockquote",
    "abbr",
    "acronym",
    "img",
    "figure",
    "figcaption",
    "video",
    "source",
    "div",
    "font",
}

ALLOWED_ATTRIBUTES = {
    "*": ["class", "style"],
    "a": ["href", "title", "download"],
    "img": ["src", "alt", "title"],
    "abbr": ["title"],
    "acronym": ["title"],
    "video": ["src", "controls", "preload", "width", "height"],
    "source": ["src", "type"],
    "figure": ["data-block-type"],
    "div": ["data-block-type"],
    "font": ["color", "face", "size"],
}

# Разрешённые inline-стили из contenteditable (document.execCommand).
_HTML_CSS_SANITIZER = CSSSanitizer(
    allowed_css_properties=[
        "color",
        "text-align",
        "text-decoration",
        "font-size",
        "font-weight",
        "background-color",
    ],
)


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
        css_sanitizer=_HTML_CSS_SANITIZER,
        strip=True,
    )


def blocks_to_html(blocks: list) -> str:
    """Convert content_blocks JSON list to sanitized HTML for public display."""
    parts = []
    for block in blocks:
        btype = block.get("type")
        if btype == "text":
            html = sanitize_html(block.get("html", ""))
            if html:
                parts.append(html)
        elif btype == "image":
            url = block.get("url", "")
            if url:
                alt = block.get("alt", "")
                caption = block.get("caption", "")
                if caption:
                    parts.append(
                        f'<figure>'
                        f'<img src="{url}" alt="{alt}">'
                        f'<figcaption>{caption}</figcaption>'
                        f'</figure>'
                    )
                else:
                    parts.append(f'<figure><img src="{url}" alt="{alt}"></figure>')
        elif btype == "video":
            url = block.get("url", "")
            if url:
                title = block.get("title", "")
                caption_html = f"<figcaption>{title}</figcaption>" if title else ""
                parts.append(
                    f'<figure data-block-type="video">'
                    f'<video src="{url}" controls preload="metadata"></video>'
                    f'{caption_html}'
                    f'</figure>'
                )
        elif btype == "file":
            url = block.get("url", "")
            name = block.get("name", "Файл")
            if url:
                parts.append(f'<p><a href="{url}" download="{name}">{name}</a></p>')
    return sanitize_html("\n".join(parts))


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
