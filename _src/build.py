#!/usr/bin/env python3
"""Builds the Utsava site.

Edit pages in _src/pages/ and shared blocks in _src/partials/, then run:

    python3 _src/build.py

This writes the finished .html files to the repository root (which is what
GitHub Pages serves). Change the business details once, in CONFIG below.
"""
import pathlib
import re

CONFIG = {
    "PHONE": "+91 98765 43210",   # shown on the site
    "TEL": "+919876543210",       # used in tel: links
    "WA": "919876543210",         # WhatsApp number: country code, no + or spaces
}

SRC = pathlib.Path(__file__).resolve().parent
ROOT = SRC.parent
PARTIALS = SRC / "partials"
PAGES = SRC / "pages"

PX = re.compile(r"PX\((\d+),(\d+)\)")
INCLUDE = re.compile(r"\{\{> *([\w-]+) *\}\}")
QUOTE = re.compile(r"\{\{Q(\?[^}]*)?\}\}")
META = re.compile(r"\A<!--(.*?)-->\s*", re.S)


def px(m):
    i, w = m[1], m[2]
    return f"https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?auto=compress&amp;cs=tinysrgb&amp;w={w}"


def include(text, depth=0):
    if depth > 5:
        raise RecursionError("partials nested too deeply")
    return INCLUDE.sub(lambda m: include((PARTIALS / f"{m[1]}.html").read_text(), depth + 1), text)


def build(page):
    raw = page.read_text()
    meta_match = META.match(raw)
    meta = {}
    for line in meta_match[1].strip().splitlines():
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip()
    body = raw[meta_match.end():]

    html = (
        "{{> head}}{{> svgdefs}}{{> announce}}{{> header}}"
        '  <main id="top">\n' + body + "  </main>\n\n"
        '{{> footer}}  <script src="assets/js/main.js"></script>\n</body>\n</html>\n'
    )
    html = include(html)

    has_form = 'id="leadForm"' in html
    html = QUOTE.sub(lambda m: ((m[1] or "") + "#contact") if has_form else f"contact.html{m[1] or ''}#contact", html)

    tokens = dict(CONFIG)
    tokens.update({k.upper(): v for k, v in meta.items()})
    tokens["OGIMG"] = f"PX({meta.get('og', '28074925')},1200)"
    tokens["HEROIMG"] = f"PX({meta.get('heroimg', meta.get('og', '28074925'))},1800)"
    for k, v in tokens.items():
        html = html.replace("{{" + k + "}}", v)
    html = PX.sub(px, html)

    leftover = re.findall(r"\{\{[^}]*\}\}", html)
    if leftover:
        raise ValueError(f"{page.name}: unresolved tokens {sorted(set(leftover))}")

    name = meta.get("page", page.stem)
    html = html.replace(f'data-nav="{name}"', f'data-nav="{name}" class="active" aria-current="page"')
    out = ROOT / page.name
    out.write_text(html)
    return out


if __name__ == "__main__":
    for p in sorted(PAGES.glob("*.html")):
        print("built", build(p).relative_to(ROOT))
