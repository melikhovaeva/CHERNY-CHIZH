from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import uuid4

from django.core.files.base import ContentFile

if TYPE_CHECKING: 
    from .models import User

AVATAR_PALETTE = [
    "#e17055",
    "#00b894",
    "#6c5ce7",
    "#fdcb6e",
    "#0984e3",
    "#e84393",
    "#00cec9",
    "#d63031",
    "#a29bfe",
    "#55efc4",
    "#fd79a8",
    "#74b9ff",
    "#fab1a0",
    "#81ecec",
    "#636e72",
    "#2d3436",
]


def _avatar_palette_index(value: str) -> int:
    hash_val = 0
    for ch in value:
        hash_val = ord(ch) + ((hash_val << 5) - hash_val)
    if not AVATAR_PALETTE:
        return 0
    return abs(hash_val) % len(AVATAR_PALETTE)


def generate_default_avatar(user: "User", *, force: bool = False) -> None:
    """
    Генерирует SVG‑аватарку с инициалами пользователя.
    """
    if user.avatar_image and not force:
        return

    base = (user.first_name or "") + (user.last_name or "") or (user.email or "")
    if not base:
        base = str(user.pk or "user")

    idx = _avatar_palette_index(base)
    bg_color = AVATAR_PALETTE[idx]

    first = (user.first_name or user.email or "").strip()[:1].upper()
    last = (user.last_name or "").strip()[:1].upper()
    initials = (first + last).strip() or first or "U"
    initials = initials[:2]

    size = 256
    font_size = int(size * 0.5)

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">
  <rect width="100%" height="100%" fill="{bg_color}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-size="{font_size}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fill="#ffffff">{initials}</text>
</svg>"""

    filename = f"avatars/user_{user.pk or uuid4().hex}.svg"
    user.avatar_image.save(filename, ContentFile(svg.encode("utf-8")), save=False)