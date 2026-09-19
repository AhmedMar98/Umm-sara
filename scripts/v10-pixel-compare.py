#!/usr/bin/env python3
"""مقارنة بكسلية موضوعية: V10 مقابل خط الصفر baseline-v5.
نفس منهجية baseline-color-check.py — لا انطباعات."""
import sys

from PIL import Image

BASE = "/home/z/my-project/download/baseline-v5"
V10 = "/home/z/my-project/download/v10-wave1"

PAIRS = [
    ("02-home-force3d-1920.png", "01-home-force3d-1920.png"),
    ("01-home-dark-1920.png", "02-home-dark-1920.png"),
    ("07-home-mobile-390.png", "03-home-mobile-390.png"),
    ("08-home-light-1920.png", "04-home-light-1920.png"),
]


def analyze(path: str):
    img = Image.open(path).convert("RGB")
    img.thumbnail((480, 480))
    px = list(img.getdata())
    n = len(px)
    avg = tuple(sum(c[i] for c in px) // n for i in range(3))
    dark = sum(1 for p in px if sum(p) < 150) / n
    light = sum(1 for p in px if sum(p) > 600) / n
    gold = sum(1 for r, g, b in px if r > 140 and 90 < g < 210 and b < 130 and r > g > b) / n
    emerald = sum(1 for r, g, b in px if g > 90 and g > r and g > b) / n
    return avg, dark, light, gold, emerald


def main() -> int:
    for base_f, v10_f in PAIRS:
        b = analyze(f"{BASE}/{base_f}")
        v = analyze(f"{V10}/{v10_f}")
        print(f"[{base_f} -> {v10_f}]")
        print(f"  avg {b[0]} -> {v[0]}")
        print(f"  dark {b[1]:.1%} -> {v[1]:.1%} | light {b[2]:.1%} -> {v[2]:.1%}")
        print(f"  gold {b[3]:.2%} -> {v[3]:.2%} | emerald {b[4]:.2%} -> {v[4]:.2%}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
