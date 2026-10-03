#!/usr/bin/env python3
"""Renders PRIVACY-POLICY.md, TERMS.md and CONSUMER-HEALTH-DATA.md into three static funnel pages.

    python3 funnel/legal/render.py            writes privacy.html, terms.html and consumer-health-data.html in funnel/legal/
    python3 funnel/legal/render.py --wired    writes the same three in funnel/

THE PAGES LIVE IN funnel/legal/ AND NOT IN funnel/, ON PURPOSE. Two things read
every .html file at the top of funnel/ by directory listing and not by a list:
funnel/BUILD-single.sh, which stops with "no dist name for ['privacy.html']: add
it to OUT" on any page it does not know, and tests/funnel.js, which gates every
page it finds. A page dropped into funnel/ before it is wired breaks the deploy
build. Measured on 1 October 2026 against a copy of the script. The subfolder is
outside both listings, so nothing changes until somebody wires the pages.

--wired is the wiring. It writes the same pages one folder up, with sibling links
written the way every other funnel page writes them (index.html, buy.html) and
with the one line BUILD-single.sh asserts every page carries, the link to
tokens.css. LEGAL-IA.md lists the rest of the wiring.

The markdown is the source. Edit PRIVACY-POLICY.md, TERMS.md or
CONSUMER-HEALTH-DATA.md, run this, and commit both. A page edited by hand drifts from the document counsel reviewed.

No network, no external font, no script in the output.
"""
import html
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
WIRED = '--wired' in sys.argv
OUTDIR = ROOT / 'funnel' if WIRED else ROOT / 'funnel' / 'legal'
UP = '' if WIRED else '../'   # where the sibling funnel pages are, from the page

PAGES = [
    ('PRIVACY-POLICY.md', 'privacy.html', 'Privacy policy', 'Privacy',
     'What Atüned keeps on your device, what leaves it and when, who sees it, and how to delete it.'),
    ('TERMS.md', 'terms.html', 'Terms', 'Terms',
     'The terms for using Atüned: what it is and is not, accounts, plans and billing, and what you own.'),
    ('CONSUMER-HEALTH-DATA.md', 'consumer-health-data.html', 'Consumer health data privacy policy', 'Consumer health data',
     'What consumer health data Atüned collects from people in Washington and Nevada, why, who handles it, and the rights you have over it.'),
]
LEGAL_PAGES = ('privacy.html', 'terms.html', 'consumer-health-data.html')

CSS = r"""
/* THE TOKENS ARE THE FUNNEL'S OWN, copied from about.html's fallback block, and
   tokens.css overrides every one of them when it is linked or inlined by
   BUILD-single.sh. This block holds exactly the tokens this page reads. */
:root{
 --bg:#0C0D12; --panel:#1A1D26;
 --edge:rgba(255,255,255,.09); --edge-2:rgba(255,255,255,.14);
 --ink:#EFEDE8; --mid:#B4B0A8; --dim:#94908A;
 --root:#CF5953; --solar:#D4BC70;
 --accent:#7EB8D4; --on-accent:#0B1418;
 --au:#C2A063; --um:#FFFFFF;
 --sans:'Inter','Inter Tight',system-ui,-apple-system,'Segoe UI',sans-serif;
 --num:'Inter','Inter Tight',system-ui,-apple-system,sans-serif;
 --r-s:11px; --tap:44px;
 --ease-out:cubic-bezier(.22,1,.36,1); --t-micro:120ms;
 --g2:10px; --g3:16px;
 --measure:44rem;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--bg);color:var(--ink);
 font-family:var(--sans);-webkit-text-size-adjust:100%;color-scheme:dark}
body{font-size:17px;line-height:1.62}
.wrap{max-width:1120px;margin:0 auto;padding:40px var(--g3) 64px}

/* the mark, as every funnel page draws it. The dots are CSS and the name in the
   title is the character, because a title has no CSS. */
a.mark{display:grid;gap:4px;justify-items:center;text-align:center;
 text-decoration:none;color:var(--ink)}
.wm{font-size:44px;line-height:1;letter-spacing:-.025em;font-weight:600}
.wm .um{position:relative;display:inline-block}
.wm .um::before,.wm .um::after{content:'';position:absolute;top:-.44em;
 width:.13em;height:.13em;border-radius:50%;background:var(--um)}
.wm .um::before{left:.05em}
.wm .um::after{left:.34em}
.os{font-family:var(--num);font-size:12.5px;letter-spacing:.34em;
 color:var(--au);font-weight:500}

.nav{margin:26px 0 0;display:flex;gap:var(--g3);flex-wrap:wrap;
 font-size:13px;letter-spacing:.06em}
.nav a{color:var(--dim);text-decoration:underline;
 text-decoration-color:var(--edge-2);text-underline-offset:5px;
 text-decoration-thickness:1px;
 transition:color var(--t-micro) var(--ease-out),
            text-decoration-color var(--t-micro) var(--ease-out)}
.nav a:hover,.nav a:focus-visible{color:var(--ink);text-decoration-color:var(--ink)}
.nav b{color:var(--ink);font-weight:600;text-decoration:underline;
 text-decoration-color:var(--accent);text-underline-offset:5px;
 text-decoration-thickness:1px}
.nav a,.nav b{display:inline-flex;align-items:center;justify-content:center;
 min-height:var(--tap);min-width:var(--tap);line-height:1.2}
.foot-nav{margin-top:40px;padding-top:22px;border-top:1px solid var(--edge)}
@media(max-width:700px){ .nav{gap:var(--g3) 18px} }

h1.doc{font-size:34px;line-height:1.12;margin:34px 0 0;letter-spacing:-.02em;font-weight:600}
h2{font-size:22px;line-height:1.2;margin:44px 0 0;padding-top:26px;
 border-top:1px solid var(--edge);letter-spacing:-.012em;font-weight:600;
 max-width:var(--measure)}
p,ul,ol{max-width:var(--measure)}
p{margin:14px 0 0}
ul,ol{margin:14px 0 0;padding-left:22px}
li{margin-top:6px}
li::marker{color:var(--dim)}
strong{font-weight:600}
a{color:var(--accent);text-underline-offset:3px}
a:focus-visible{outline:2px solid var(--ink);outline-offset:3px}
/* a link in a sentence is prose and is held to a 24 pixel floor by tests/funnel.js */
p a,li a{padding:2px 0}
.stamp{color:var(--dim);font-size:15px}

/* THE DRAFT WARNING. One element, one id, so it can be deleted in one edit when
   counsel has signed the text off. It is loud on purpose: nobody should have to
   look for it. */
.draft{margin:26px 0 0;padding:16px 18px 18px;border:1px solid var(--root);
 border-radius:var(--r-s);background:var(--panel);max-width:var(--measure)}
.draft p{margin:0;color:var(--ink)}

/* A fact only the owner can supply, and a statement still to be tested against
   the build. Both are marked so neither can go live unseen. */
mark.ph,mark.ck,mark.pr{background:transparent;color:var(--solar);
 border-bottom:1px dashed var(--solar);padding:0 1px}
mark.ck{color:var(--mid);border-bottom-color:var(--edge-2)}
mark.pr{color:var(--accent);border-bottom-color:var(--accent)}

/* tables. Wide, they read as a table. Narrow, each row becomes its own block
   with its labels, because a four column table at 390 wide is a horizontal
   scrollbar and the page must not scroll sideways. */
.tw{margin:20px 0 0}
table{width:100%;border-collapse:separate;border-spacing:0;font-size:15.5px;
 line-height:1.5;border:1px solid var(--edge);border-radius:var(--r-s);overflow:hidden}
th,td{text-align:left;vertical-align:top;padding:11px 14px;background:var(--panel);
 border-bottom:1px solid var(--edge)}
tr:last-child td{border-bottom:0}
th{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);
 font-weight:600}
td{color:var(--mid)}
td:first-child{color:var(--ink);font-weight:600}
@media(max-width:700px){
 table,thead,tbody,tr,td,th{display:block}
 thead{position:absolute;left:-9999px}
 tr{padding:12px 14px;background:var(--panel);border-bottom:1px solid var(--edge)}
 tr:last-child{border-bottom:0}
 td{padding:4px 0;border:0;background:transparent}
 td::before{content:attr(data-l);display:block;font-size:11.5px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--dim);font-weight:600}
 td:first-child::before{display:none}
}

.foot{margin-top:18px;font-size:13px;color:var(--dim);max-width:var(--measure)}

@media print{
 html,body{background:#fff;color:#000}
 .nav,.foot-nav,a.mark{display:none}
 a,td,td:first-child,th,.stamp,.foot{color:#000}
 .draft{border-color:#000;background:#fff}
 td,th,table,tr{background:#fff}
}
"""


def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)

    def link(m):
        href = m.group(2)
        if href.endswith('.html') and '://' not in href:
            href = UP + href if href not in LEGAL_PAGES else href
        return '<a href="%s">%s</a>' % (href, m.group(1))
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, s)
    s = re.sub(r'\[PLACEHOLDER:([^\]]*)\]', r'<mark class="ph">[PLACEHOLDER:\1]</mark>', s)
    s = re.sub(r'\[PROPOSED:([^\]]*)\]', r'<mark class="pr">[PROPOSED:\1]</mark>', s)
    s = re.sub(r'\[CHECK:([^\]]*)\]', r'<mark class="ck">[CHECK:\1]</mark>', s)
    return s


def render_body(md):
    lines = md.splitlines()
    out, i, title = [], 0, ''
    seen_h2 = False
    while i < len(lines):
        ln = lines[i]
        if not ln.strip():
            i += 1
            continue
        if ln.startswith('# '):
            title = ln[2:].strip()
            i += 1
            continue
        if ln.startswith('## '):
            h = ln[3:].strip()
            m = re.match(r'(\d+)\.\s', h)
            hid = ' id="s%s"' % m.group(1) if m else ''
            out.append('<h2%s>%s</h2>' % (hid, inline(h)))
            seen_h2 = True
            i += 1
            continue
        if ln.startswith('>'):
            buf = []
            while i < len(lines) and lines[i].startswith('>'):
                buf.append(lines[i].lstrip('> ').rstrip())
                i += 1
            out.append('<aside class="draft" id="draft-warning" role="note">'
                       '<p>%s</p></aside>' % inline(' '.join(buf)))
            continue
        if re.match(r'\d+\.\s', ln):
            items = []
            while i < len(lines) and re.match(r'\d+\.\s', lines[i]):
                items.append('<li>%s</li>' % inline(re.sub(r'^\d+\.\s+', '', lines[i]).strip()))
                i += 1
            out.append('<ol>%s</ol>' % ''.join(items))
            continue
        if ln.startswith('- '):
            items = []
            while i < len(lines) and lines[i].startswith('- '):
                items.append('<li>%s</li>' % inline(lines[i][2:].strip()))
                i += 1
            out.append('<ul>%s</ul>' % ''.join(items))
            continue
        if ln.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')])
                i += 1
            head, body = rows[0], [r for r in rows[2:]]
            t = '<div class="tw"><table><thead><tr>%s</tr></thead><tbody>' % ''.join(
                '<th scope="col">%s</th>' % inline(c) for c in head)
            for r in body:
                t += '<tr>%s</tr>' % ''.join(
                    '<td data-l="%s">%s</td>' % (html.escape(head[k], quote=True), inline(c))
                    for k, c in enumerate(r))
            out.append(t + '</tbody></table></div>')
            continue
        buf = []
        while i < len(lines) and lines[i].strip() and not re.match(r'(#|>|- |\||\d+\.\s)', lines[i]):
            buf.append(lines[i].rstrip())
            i += 1
        cls = ' class="stamp"' if (not seen_h2 and buf[0].startswith('Draft of')) else ''
        out.append('<p%s>%s</p>' % (cls, '<br>'.join(inline(b) for b in buf)))
    return title, '\n'.join(out)


def page(title, short, desc, body, fname):
    others = [('index.html', 'What it reads'), ('about.html', 'About'),
              ('faq.html', 'Questions'), ('buy.html', 'Tiers'), ('quiz.html', 'Start')]
    legal = [('privacy.html', 'Privacy'), ('terms.html', 'Terms'), ('consumer-health-data.html', 'Consumer health data')]

    def nav(cur):
        parts = []
        for h, t in others:
            parts.append('<a href="%s%s">%s</a>' % (UP, h, t))
        for h, t in legal:
            parts.append('<b>%s</b>' % t if h == cur else '<a href="%s">%s</a>' % (h, t))
        return ' '.join(parts)

    # THE ICON IS READ OFF about.html AT RENDER TIME, so the tab mark is the one
    # the funnel carries and cannot drift from it. tests/funnel.js fails any page
    # without a favicon.
    m = re.search(r'<link rel="icon"[^>]*>', (ROOT / 'funnel' / 'about.html').read_text(encoding='utf-8'))
    assert m, 'funnel/about.html carries no icon link to copy'
    icon = m.group(0) + '\n'
    # the line BUILD-single.sh asserts every page carries. Present only when wired.
    tok = '<link rel="stylesheet" href="tokens.css">\n' if WIRED else ''
    return """<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<!-- DRAFT. Generated by funnel/legal/render.py from the markdown document of
     the same name. Do not edit this file: edit the markdown and render again.
     The noindex line below is for the draft. Take it out, and the draft warning
     with it, only when counsel has reviewed the text and every [PLACEHOLDER] is
     filled, every [CHECK] resolved and every [PROPOSED] confirmed. See
     LEGAL-IA.md, "Before the pages go live". -->
<meta name="robots" content="noindex">
<title>Atüned, %(short)s</title>
<meta name="description" content="%(desc)s">
%(icon)s<style>%(css)s</style>
%(tok)s</head><body>
<div class="wrap">

<a class="mark" href="%(up)sindex.html" aria-label="Atüned, home">
 <span class="wm">At<span class="um">u</span>ned</span>
 <span class="os">Source OS</span></a>

<nav class="nav" aria-label="Pages">%(nav)s</nav>

<h1 class="doc">%(title)s</h1>
%(body)s

<nav class="nav foot-nav" aria-label="Pages, again">%(nav)s</nav>
<p class="foot">This page makes no request of any kind. &copy; 2026 Tula Unified LLC</p>

</div></body></html>
""" % dict(short=short, desc=html.escape(desc, quote=True), css=CSS, tok=tok, icon=icon,
           up=UP, nav=nav(fname), title=html.escape(title), body=body)


def main():
    OUTDIR.mkdir(parents=True, exist_ok=True)
    for md, fname, _title, short, desc in PAGES:
        src = (ROOT / md).read_text(encoding='utf-8')
        title, body = render_body(src)
        out = page(title, short, desc, body, fname)
        (OUTDIR / fname).write_text(out, encoding='utf-8')
        print('  %-28s %7d bytes  from %s' % ((OUTDIR / fname).relative_to(ROOT), len(out.encode('utf-8')), md))


main()
