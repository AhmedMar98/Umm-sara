#!/usr/bin/env python3
"""فحص بكسل موضوعي للقطات Baseline V5 — بديل حتمي عن تقييم VLM.
يقيس: متوسط RGB، نسبة البكسلات الداكنة/الفاتحة، نسبة الذهبي والزمردي."""
import os
import sys

from PIL import Image

BASE = "/home/z/my-project/download/baseline-v5"


def analyze(path: str) -> dict:
    img = Image.open(path).convert("RGB")
    img.thumbnail((480, 480))
    pixels = list(img.getdata())
    n = len(pixels)
    avg = tuple(sum(c[i] for c in pixels) // n for i in range(3))
    dark = sum(1 for p in pixels if sum(p) < 150) / n
    light = sum(1 for p in pixels if sum(p) > 600) / n
    gold = sum(1 for r, g, b in pixels if r > 140 and 90 < g < 210 and b < 130 and r > g > b) / n
    emerald = sum(1 for r, g, b in pixels if g > 90 and g > r and g > b) / n
    return {"avg": avg, "dark": dark, "light": light, "gold": gold, "emerald": emerald}


def main() -> int:
    files = sorted(f for f in os.listdir(BASE) if f.endswith(".png"))
    print(f"{'file':<40} {'avg RGB':<16} {'dark':>6} {'light':>6} {'gold':>6} {'emerald':>8}")
    for f in files:
        s = analyze(os.path.join(BASE, f))
        print(
            f"{f:<40} {str(s['avg']):<16} {s['dark']:>6.1%} {s['light']:>6.1%} "
            f"{s['gold']:>6.2%} {s['emerald']:>8.2%}"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
