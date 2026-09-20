#!/usr/bin/env python3
"""فحص تباين WCAG موضوعي لتوكنات هوية أم سارة — V10 Audit.
لا انطباعات: نسب تباين محسوبة رياضياً وفق معادلة WCAG 2.1 الرسمية."""

TOKENS = {
    # dark theme
    "dark": {
        "bg": "#080e0b", "fg": "#f4f1e8", "muted": "#8ba297",
        "gold": "#c5a059", "gold_bright": "#e8d48b",
        "primary": "#16a37a", "chart1": "#2ed39a",
        "secondary_fg": "#c4d5cb", "accent_fg": "#a7e8c9",
    },
    "light": {
        "bg": "#f7f4ec", "fg": "#0a231b", "muted": "#5f7168",
        "gold": "#9a7b3f", "gold_bright": "#8a6a2c",
        "primary": "#0c7a57",
        "secondary_fg": "#33504a", "accent_fg": "#0a3d2c",
    },
}

# أزواج (نص، خلفية) فعلية من الواجهة
PAIRS = [
    ("fg", "bg", "النص الأساسي"),
    ("muted", "bg", "النص الثانوي muted"),
    ("gold", "bg", "الذهبي (عناوين/لمسات)"),
    ("gold_bright", "bg", "الذهبي الفاتح"),
    ("primary", "bg", "الزمردي الأساسي"),
    ("secondary_fg", "bg", "نص الأسطح الثانوية"),
    ("accent_fg", "bg", "نص التمييز"),
]


def lum(hex_color: str) -> float:
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i : i + 2], 16) / 255 for i in (0, 2, 4))
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = f(r), f(g), f(b)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a: str, b: str) -> float:
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def verdict(r: float, large: bool = False) -> str:
    aa = 3.0 if large else 4.5
    return f"{'PASS' if r >= aa else 'FAIL'}-AA" + (f" | AAA: {r >= 7 and 'PASS' or 'FAIL'}" if not large else "")


for theme, tk in TOKENS.items():
    print(f"\n=== {theme.upper()} ===")
    for fg, bg, label in PAIRS:
        r = ratio(tk[fg], tk[bg])
        # العناوين الذهبية كبيرة (≥24px bold) → معيار النص الكبير
        large = fg.startswith("gold")
        print(f"  {label:<28} {tk[fg]} على {tk[bg]}: {r:5.2f}:1  [{verdict(r, large)}]")
