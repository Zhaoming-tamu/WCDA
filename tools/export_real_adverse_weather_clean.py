#!/usr/bin/env python3
"""Export citation-free Camera-ready Table 1 from a rebuilt PDF.

Prepare a *copy* of the Camera-ready source, remove only the ``\\cite{...}``
commands from ``tab:real_low_quality``, compile that copy, then pass its PDF to
this script. The original Camera-ready source is never modified.

Example:
    python tools/export_real_adverse_weather_clean.py \
        --pdf /tmp/daw-clean-table-build/main.pdf
"""

from __future__ import annotations

import argparse
import hashlib
import re
from pathlib import Path

import fitz
from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PNG = PROJECT_ROOT / "assets/results/real-adverse-weather-clean.png"
OUTPUT_WEBP = PROJECT_ROOT / "assets/results/real-adverse-weather-clean.webp"
PAGE_INDEX = 8  # Camera-ready PDF page 9.
CLIP = fitz.Rect(126.0, 109.0, 489.0, 303.0)
OUTPUT_WIDTH = 2400

EXPECTED_METHODS = (
    "DynaDepth",
    "EC-Depth",
    "STEPS",
    "robustdepth",
    "weather-depth",
    "Syn2Real",
    "DepthPro",
    "DepthAnything v1",
    "DepthAnything v2",
    "DepthAnything v3",
    "DepthAnything-AC",
    "MWFormer + DA v2",
    "DarkIR + DA v2",
    "DepthAnything-W",
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", required=True, type=Path)
    args = parser.parse_args()

    with fitz.open(args.pdf) as document:
        if len(document) <= PAGE_INDEX:
            raise RuntimeError(f"PDF contains only {len(document)} pages.")
        page = document[PAGE_INDEX]
        table_text = " ".join(page.get_text("text", clip=CLIP).split())

        missing_methods = [name for name in EXPECTED_METHODS if name not in table_text]
        if missing_methods:
            raise RuntimeError(f"Missing table methods: {missing_methods}")
        if re.search(r"\[\s*\d+(?:\s*,\s*\d+)*\s*\]", table_text):
            raise RuntimeError("The rebuilt table still contains bracketed citations.")

        scale = OUTPUT_WIDTH / CLIP.width
        pixmap = page.get_pixmap(
            matrix=fitz.Matrix(scale, scale),
            clip=CLIP,
            alpha=False,
        )
        image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)

    # MuPDF rounds the transformed clip outward. The chosen clip yields one
    # extra white margin column; remove it without rescaling table content.
    if image.width < OUTPUT_WIDTH:
        raise RuntimeError(f"Rendered width {image.width} is below {OUTPUT_WIDTH}.")
    if image.width > OUTPUT_WIDTH:
        excess = image.width - OUTPUT_WIDTH
        image = image.crop((excess // 2, 0, excess // 2 + OUTPUT_WIDTH, image.height))

    OUTPUT_PNG.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUTPUT_PNG, format="PNG", compress_level=9, optimize=False)
    image.save(
        OUTPUT_WEBP,
        format="WEBP",
        quality=94,
        method=6,
        exact=True,
    )

    print(f"source_pdf={args.pdf}")
    print(f"source_pdf_sha256={sha256(args.pdf)}")
    print(f"output_png={OUTPUT_PNG}")
    print(f"output_png_sha256={sha256(OUTPUT_PNG)}")
    print(f"output_webp={OUTPUT_WEBP}")
    print(f"output_webp_sha256={sha256(OUTPUT_WEBP)}")
    print(f"size={image.width}x{image.height}")
    print("citation_check=passed")


if __name__ == "__main__":
    main()
