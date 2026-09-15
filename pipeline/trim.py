#!/usr/bin/env python3
"""
TRIM
88 words per page is the ceiling. Ruled by Lance.

Cuts at a clause boundary, never mid-phrase, and always keeps the close.
The stem is furniture and is not counted, matching cascade_words().
"""
import re

STEM_WORDS = 16   # the nine-channel stem


def trim_charge(text, cap=88):
    """Keep the stem, then as many whole clauses as fit under the cap."""
    m = re.match(r"(?i)^(.*?that I(?:'m| am)\b)(.*)$", text, re.S)
    if not m:
        head, rest = "", text
    else:
        head, rest = m.group(1), m.group(2)
    parts = re.split(r"(?i)(?=\bthat I(?:'m| am)?\b|\band I(?:'m| am)?\b|\bthen\b)", rest)
    out, n = [], 0
    for p in parts:
        w = len(p.split())
        if n + w > cap:
            break
        out.append(p); n += w
    if not out and parts:
        out = [" ".join(parts[0].split()[:cap])]
    body = "".join(out).strip(" ,")
    result = re.sub(r"\s+", " ", (head + " " + body).strip())

    # hard fallback: some dictation has no clause markers at all
    w = result.split()
    if len(w) > cap + STEM_WORDS:
        w = w[: cap + STEM_WORDS]
        # back off to the last clean break so it never ends mid-phrase
        for i in range(len(w) - 1, max(len(w) - 22, 0), -1):
            if w[i].lower() in ("that", "and", "then", "because", "with", "to", "of", "or", "but"):
                w = w[:i]
                break
        result = " ".join(w).rstrip(" ,.") + "."
    return result


def trim_install(text, cap=53):
    """Installs run about 60 percent of the page ceiling. Keep the close."""
    sents = [s.strip() for s in re.split(r"(?<=[.])\s+", text) if s.strip()]
    if not sents:
        return text
    close = sents[-1] if sents[-1].lower().startswith(("i'm letting it go", "because")) else None
    body = sents[:-1] if close else sents
    out, n = [], len(close.split()) if close else 0
    for s in body:
        if n + len(s.split()) > cap:
            break
        out.append(s); n += len(s.split())
    if not out:
        out = [body[0]] if body else []
    return " ".join(out + ([close] if close else []))


if __name__ == "__main__":
    import json, pathlib as P
    e = json.loads((P.Path(__file__).parent.parent / "corpus/LETGO_ENTRY_INDEX.json").read_text())
    x = [y for y in e if y["entry"].strip().lower() == "numb"][0]
    t = trim_charge(x["text"])
    print(f"{len(x['text'].split())}w -> {len(t.split())}w")
    print(t[:300])
