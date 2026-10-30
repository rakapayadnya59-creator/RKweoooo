#!/usr/bin/env python3
"""
Scalable Branding Asset Pipeline — Micro Ledger & AI Workout PWA
Usage:
  1. Place the user's final canonical icon at: assets/branding/app-icon-source.png
  2. Run: python3 scripts/generate_icons.py
  3. All required PWA & OS icon derivatives are automatically generated without distortion:
     - icons/app-192.png (192x192)
     - icons/app-512.png (512x512)
     - icons/app-512-maskable.png (512x512 with 80% safe-zone padding so OS masks never crop key artwork)
     - icons/apple-touch-icon.png (180x180)
     - icons/favicon.png (64x64)
"""

import os
import sys
from PIL import Image

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SOURCE_ICON = os.path.join(ROOT_DIR, "assets", "branding", "app-icon-source.png")
ICONS_DIR = os.path.join(ROOT_DIR, "icons")

def build_derivatives(src_path):
    if not os.path.exists(src_path):
        print(f"ERROR: Source icon not found at {src_path}")
        sys.exit(1)

    os.makedirs(ICONS_DIR, exist_ok=True)
    im = Image.open(src_path).convert("RGBA")

    # Preserve aspect ratio by centering on a square canvas if non-square
    w, h = im.size
    side = max(w, h)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 255))
    square.paste(im, ((side - w) // 2, (side - h) // 2), im)

    # Standard sizes
    for filename, sz in [
        ("app-192.png", 192),
        ("app-512.png", 512),
        ("apple-touch-icon.png", 180),
        ("favicon.png", 64),
    ]:
        out_im = square.resize((sz, sz), Image.Resampling.LANCZOS)
        out_im.save(os.path.join(ICONS_DIR, filename), "PNG")
        print(f"Generated: icons/{filename} ({sz}x{sz})")

    # Maskable 512x512 with 80% safe zone (10% margin on all sides)
    mask_size = 512
    inner_size = int(mask_size * 0.78)
    mask_canvas = Image.new("RGBA", (mask_size, mask_size), (0, 0, 0, 255))
    inner_im = square.resize((inner_size, inner_size), Image.Resampling.LANCZOS)
    offset = (mask_size - inner_size) // 2
    mask_canvas.paste(inner_im, (offset, offset), inner_im)
    mask_canvas.save(os.path.join(ICONS_DIR, "app-512-maskable.png"), "PNG")
    print("Generated: icons/app-512-maskable.png (512x512 with 78% safe-zone)")

if __name__ == "__main__":
    build_derivatives(SOURCE_ICON)
