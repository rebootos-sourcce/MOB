#!/usr/bin/env python3
"""
BUILD thelittlebooksof.com

Reads the volume specs, the scrubbed price table and the site copy, and
writes a static site into site/public. Stripe Checkout is called from the
serverless functions in site/api. Nothing here is hand maintained twice.

  python3 site/build_site.py
"""
import json, pathlib, html, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
OUT  = SITE / "public"
(OUT / "books").mkdir(parents=True, exist_ok=True)

PRICES = json.loads((SITE / "pricing.json").read_text())
COPY   = json.loads((SITE / "copy.json").read_text())

ORDER = ["ANXIETY","SHAME","MONEY","ANGER","BURNOUT","DRIVE",
         "WORTH","GRIEF","VOICE","CONTROL","DUTY"]

BAND_ORDER = ["Root","Sacral","Solar","Heart","Throat","Crown"]

def money(cents):
    return f"${cents // 100}" if cents % 100 == 0 else f"${cents/100:,.2f}"

def load_volumes():
    vols = {}
    for f in sorted((ROOT / "generator/volumes").glob("*.json")):
        v = json.loads(f.read_text())
        vols[v["volume"]] = v
    return vols

def esc(s):
    return html.escape(str(s), quote=True)

# ---------------------------------------------------------------- styles

STYLES = """
:root{
  --cream:#F4EEE2; --ink:#1A1714; --gold:#C9A227; --rule:#D8CFBD;
  --muted:#6C6253; --white:#FFFFFF;
  --serif: "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
  --sans: ui-sans-serif,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0;background:var(--cream);color:var(--ink);
  font-family:var(--serif);font-size:18px;line-height:1.62;
  -webkit-font-smoothing:antialiased;
}
.wrap{max-width:940px;margin:0 auto;padding:0 24px}
a{color:inherit}
h1,h2,h3{font-weight:600;letter-spacing:.01em;line-height:1.2;margin:0}
.caps{text-transform:uppercase;letter-spacing:.22em;font-size:12px;
  font-family:var(--sans);color:var(--muted)}

/* nav */
nav{position:sticky;top:0;z-index:50;background:rgba(244,238,226,.94);
  backdrop-filter:blur(8px);border-bottom:1px solid var(--rule)}
nav .wrap{display:flex;align-items:center;gap:22px;height:60px}
nav .brand{font-size:15px;letter-spacing:.14em;text-transform:uppercase;
  text-decoration:none;white-space:nowrap}
nav .links{margin-left:auto;display:flex;gap:20px;font-family:var(--sans);
  font-size:13px}
nav .links a{text-decoration:none;color:var(--muted);white-space:nowrap}
nav .links a:hover{color:var(--ink)}

/* hero */
header.hero{padding:86px 0 56px;border-bottom:1px solid var(--rule)}
header.hero h1{font-size:clamp(34px,6vw,62px);max-width:16ch}
header.hero .promise{margin-top:22px;font-size:clamp(19px,2.4vw,24px);
  max-width:34ch;color:var(--ink)}
header.hero .strap{margin-top:14px;font-style:italic;color:var(--muted);
  max-width:44ch}
.cta{display:inline-flex;align-items:center;gap:10px;margin-top:30px;
  background:var(--ink);color:var(--cream);text-decoration:none;
  padding:14px 26px;font-family:var(--sans);font-size:14px;
  letter-spacing:.08em;text-transform:uppercase;border:0;cursor:pointer}
.cta:hover{background:#000}
.cta.ghost{background:transparent;color:var(--ink);
  border:1px solid var(--ink)}
.cta.ghost:hover{background:var(--ink);color:var(--cream)}

section{padding:64px 0;border-bottom:1px solid var(--rule)}
section h2{font-size:clamp(24px,3.4vw,34px);margin-bottom:8px}
section p{max-width:62ch}
.lede{font-size:20px}

/* steps */
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;
  margin-top:30px}
.step{border-top:2px solid var(--gold);padding-top:14px}
.step .n{font-family:var(--sans);font-size:12px;letter-spacing:.2em;
  color:var(--gold)}
.step p{margin:8px 0 0;font-size:17px}

/* shelf */
.shelf{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));
  gap:26px;margin-top:34px}
.bookcard{text-decoration:none;display:block}
.cover{aspect-ratio:306/492;display:flex;flex-direction:column;
  align-items:center;justify-content:center;text-align:center;
  padding:18px;color:#F4EEE2;position:relative}
.cover .series{font-size:9px;letter-spacing:.2em;text-transform:uppercase;
  opacity:.85}
.cover .title{color:#fff;font-size:clamp(20px,3vw,30px);margin-top:26%;
  letter-spacing:.04em}
.cover .mark{position:absolute;bottom:16px;color:var(--gold);font-size:20px}
.bookcard .meta{margin-top:12px;font-family:var(--sans);font-size:13px;
  color:var(--muted);display:flex;justify-content:space-between}
.bookcard .hook{margin-top:6px;font-size:16px}

/* price table */
.ladder{width:100%;border-collapse:collapse;margin-top:26px;
  font-size:17px}
.ladder th,.ladder td{text-align:left;padding:14px 10px;
  border-bottom:1px solid var(--rule);vertical-align:top}
.ladder th{font-family:var(--sans);font-size:12px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--muted)}
.ladder td.price{font-size:20px;white-space:nowrap}
.ladder td.act{text-align:right;white-space:nowrap}
.buy{background:var(--ink);color:var(--cream);border:0;cursor:pointer;
  font-family:var(--sans);font-size:12px;letter-spacing:.08em;
  text-transform:uppercase;padding:10px 16px}
.buy:hover{background:#000}
.buy[disabled]{opacity:.45;cursor:progress}

/* two col */
.two{display:grid;grid-template-columns:1fr 1fr;gap:44px;margin-top:24px}
.two p{max-width:none}

/* faq */
details{border-bottom:1px solid var(--rule);padding:16px 0}
details summary{cursor:pointer;font-size:19px;list-style:none}
details summary::-webkit-details-marker{display:none}
details summary::before{content:"+";color:var(--gold);margin-right:12px}
details[open] summary::before{content:"\\2212"}
details p{margin:10px 0 0 26px;color:var(--muted)}

footer{padding:48px 0 70px;font-family:var(--sans);font-size:13px;
  color:var(--muted)}
footer a{color:var(--muted)}

.note{font-family:var(--sans);font-size:13px;color:var(--muted);
  margin-top:14px}

/* picker sheet */
.sheet{position:fixed;inset:0;background:rgba(26,23,20,.72);z-index:99;
  display:flex;align-items:center;justify-content:center;padding:24px}
.sheet-inner{background:var(--cream);max-width:560px;width:100%;padding:32px;
  max-height:88vh;overflow:auto}
.picks{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 22px}
.pick{font-family:var(--sans);font-size:12px;letter-spacing:.1em;
  background:transparent;border:1px solid var(--rule);padding:10px 14px;
  cursor:pointer;color:var(--ink)}
.pick:hover{border-color:var(--ink)}
.pick.on{background:var(--ink);color:var(--cream);border-color:var(--ink)}

/* book page */
.bookhead{display:grid;grid-template-columns:300px 1fr;gap:48px;
  padding:56px 0;align-items:start}
.bookhead .cover{max-width:300px}
.bookhead h1{font-size:clamp(32px,5vw,50px)}
.spread{background:var(--white);border:1px solid var(--rule);padding:28px;
  margin-top:24px}
.spread .side{font-family:var(--sans);font-size:11px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--muted)}
.spread .nm{font-size:22px;margin:6px 0 10px}
.spread .txt{font-size:16px}
.spread .imp{font-family:var(--sans);font-size:13px;color:var(--muted);
  margin-top:10px}
.spread hr{border:0;border-top:1px solid var(--rule);margin:22px 0}
.contents{columns:2;column-gap:36px;margin-top:20px;font-size:17px}
@media (max-width:760px){
  .ladder,.ladder tr,.ladder td{display:block;width:100%}
  .ladder tr:first-child{display:none}
  .ladder tr{border-bottom:1px solid var(--rule);padding:16px 0}
  .ladder td{border:0;padding:2px 0}
  .ladder td.act{text-align:left;margin-top:12px}
  header.hero{padding:56px 0 40px}
  section{padding:44px 0}
  .steps,.two,.bookhead{grid-template-columns:1fr}
  .contents{columns:1}
  nav .links{gap:16px}
  nav .links a:nth-child(n+3){display:none}
  nav .brand{font-size:13px;letter-spacing:.1em}
}
"""

MARK = "&#9670;"

def cover_html(v, big=False):
    return f"""<div class="cover" style="background:{esc(v['field'])}">
      <div class="series">The Somatic Book of Reprogramming</div>
      <div class="title">{esc(v['volume'])}</div>
      <div class="mark">{MARK}</div>
    </div>"""

def nav_html(prefix=""):
    return f"""<nav><div class="wrap">
      <a class="brand" href="{prefix}index.html">The Little Books of</a>
      <div class="links">
        <a href="{prefix}index.html#books">The books</a>
        <a href="{prefix}index.html#what">What they do</a>
        <a href="{prefix}index.html#pricing">Pricing</a>
        <a href="{prefix}index.html#author">The author</a>
        <a href="{prefix}diagnostic.html">Free diagnostic</a>
      </div>
    </div></nav>"""

def page(title, body, prefix="", desc=""):
    return f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc or COPY['promise'])}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc or COPY['promise'])}">
<link rel="stylesheet" href="{prefix}styles.css">
</head><body>
{nav_html(prefix)}
{body}
<footer><div class="wrap">
  <p>{esc(COPY['series'])}. Lance Powell. Tula Unified LLC, Los Angeles.<br>
  These books are an instrument for releasing a stored stress response. They
  do not diagnose or treat, and they do not replace medical or psychological
  care.</p>
  <p><a href="{prefix}index.html#pricing">Pricing</a> &middot;
     <a href="{prefix}terms.html">Terms and refunds</a> &middot;
     <a href="mailto:hello@thelittlebooksof.com">hello@thelittlebooksof.com</a></p>
</div></footer>
<script src="{prefix}checkout.js"></script>
</body></html>
"""

# ---------------------------------------------------------------- index

def build_index(vols):
    b = []
    b.append(f"""<header class="hero"><div class="wrap">
      <div class="caps">{esc(COPY['series'])}</div>
      <h1>{esc(COPY['hero_line'])}</h1>
      <p class="promise">{esc(COPY['promise'])}</p>
      <p class="strap">{esc(COPY['strap'])}</p>
      <a class="cta" href="#books">See the eleven books</a>
      <a class="cta ghost" href="diagnostic.html">Find my address, free</a>
    </div></header>""")

    steps = "".join(
        f'<div class="step"><div class="n">{i+1:02d}</div><p>{esc(t)}</p></div>'
        for i, t in enumerate(COPY["what_they_do"]))
    b.append(f"""<section id="what"><div class="wrap">
      <div class="caps">What they do</div>
      <h2>One spread. One circuit. Ninety seconds.</h2>
      <div class="steps">{steps}</div>
      <p class="note">Every volume is thirty two pages. Nine charges, nine
      installs, each one addressed to a node, a nerve and a plain location in
      the body.</p>
    </div></section>""")

    why = "".join(f"<p>{esc(t)}</p>" for t in COPY["the_why"])
    b.append(f"""<section id="why"><div class="wrap">
      <div class="caps">The why</div>
      <h2>The category names a feeling and stops.</h2>
      {why}
      <div class="two" style="margin-top:34px">
        <div><div class="caps">Mission</div><p>{esc(COPY['mission'])}</p></div>
        <div><div class="caps">Vision</div><p>{esc(COPY['vision'])}</p></div>
      </div>
    </div></section>""")

    cards = []
    for name in ORDER:
        v = vols[name]
        hook = COPY["volume_lines"][name][0]
        cards.append(f"""<a class="bookcard" href="books/{name.lower()}.html">
          {cover_html(v)}
          <div class="meta"><span>{esc(v['band'])} band</span>
          <span>{money(PRICES['digital']['single']['amount'])}</span></div>
          <div class="hook">{esc(hook)}</div>
        </a>""")
    b.append(f"""<section id="books"><div class="wrap">
      <div class="caps">The shelf</div>
      <h2>Eleven volumes. One per charge that runs a life.</h2>
      <p class="lede">Buy the one that matches. If you do not know which one,
      run the free diagnostic and it will name your band.</p>
      <div class="shelf">{''.join(cards)}</div>
    </div></section>""")

    d = PRICES["digital"]
    rows = [
        ("Free", "The Address Diagnostic", "Returns your three addresses and the band they sit in. No card.",
         "free", '<a class="buy" href="diagnostic.html">Run it</a>'),
        (money(d["single"]["amount"]), "One volume",
         "Any single book. Thirty two pages, nine spreads, instant download.",
         "single", '<a class="buy" href="#books">Choose a book</a>'),
        (money(d["cluster"]["amount"]), "Three volume cluster",
         "Any three. The complex your band sits in, not one charge alone.",
         "cluster", '<button class="buy" data-sku="cluster">Buy</button>'),
        (money(d["library"]["amount"]), "The full library",
         "All eleven volumes. Every band, every address, one download.",
         "library", '<button class="buy" data-sku="library">Buy</button>'),
        (money(d["practitioner"]["amount"]), "Practitioner pack",
         "The library, the 112 node table, the release protocol, and use rights with clients. No certification, no gatekeeper.",
         "practitioner", '<button class="buy" data-sku="practitioner">Buy</button>'),
    ]
    trs = "".join(
        f'<tr><td class="price">{p}</td><td><strong>{esc(n)}</strong><br>'
        f'<span style="color:var(--muted);font-size:16px">{esc(desc)}</span></td>'
        f'<td class="act">{act}</td></tr>'
        for p, n, desc, sku, act in rows)
    b.append(f"""<section id="pricing"><div class="wrap">
      <div class="caps">Pricing</div>
      <h2>Pay once. Download immediately.</h2>
      <table class="ladder">
        <tr><th>Price</th><th>What it is</th><th></th></tr>
        {trs}
      </table>
      <p class="note">Checkout is Stripe. The download link is issued the
      moment payment clears and it works on any device. Paperbacks are
      printed on demand and priced from
      {money(PRICES['print']['single']['amount'])} plus shipping quoted by the
      printer.</p>
    </div></section>""")

    au = "".join(f"<p>{esc(t)}</p>" for t in COPY["author_long"])
    ev = "".join(f"<li>{esc(t)}</li>" for t in COPY["evidence"])
    b.append(f"""<section id="author"><div class="wrap">
      <div class="caps">About the author</div>
      <h2>{esc(COPY['author_short'])}</h2>
      <div class="two"><div>{au}</div>
      <div><div class="caps">The evidence</div>
      <ul style="padding-left:18px;color:var(--muted)">{ev}</ul>
      <p class="note">The claim in these books is falsifiable on purpose. Put
      a hand on the address. If nothing moves, the claim failed.</p></div></div>
    </div></section>""")

    faq = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>"
                  for q, a in COPY["faq"])
    b.append(f"""<section id="faq"><div class="wrap">
      <div class="caps">Questions</div><h2>Before you buy.</h2>{faq}
    </div></section>""")

    return page("The Little Books of", "".join(b), "",
                COPY["promise"] + " " + COPY["hero_line"])

# ---------------------------------------------------------------- book page

def build_book(v):
    name = v["volume"]
    hook, blurb = COPY["volume_lines"][name]
    p = v["pairs"][0]
    sample = f"""<div class="spread">
      <div class="side">The charge</div>
      <div class="nm">{esc(p['charge'])}</div>
      <div class="txt">{esc(p['charge_text'])}</div>
      <div class="imp">{esc(p.get('charge_impact',''))}</div>
      <hr>
      <div class="side">The install</div>
      <div class="nm">{esc(p['install'])}</div>
      <div class="txt">{esc(p['install_text'])}</div>
      <div class="imp">{esc(p.get('install_impact',''))}</div>
    </div>"""

    n = len(v["pairs"])
    contents = ""  # charge names are dictation fragments, see SITE_NOTES.md

    single = money(PRICES["digital"]["single"]["amount"])
    prints = money(PRICES["print"]["single"]["amount"])
    body = f"""<div class="wrap"><div class="bookhead">
      <div>{cover_html(v, True)}</div>
      <div>
        <div class="caps">{esc(v['band'])} band &middot; {esc(v['circuit_title'])}</div>
        <h1>{esc(name)}</h1>
        <p class="lede">{esc(hook)}</p>
        <p>{esc(blurb)}</p>
        <p><button class="buy" data-sku="single" data-volume="{esc(name)}"
           style="font-size:13px;padding:14px 22px">Download the PDF, {single}</button>
           <button class="buy" data-sku="print" data-volume="{esc(name)}"
           style="font-size:13px;padding:14px 22px;background:transparent;color:var(--ink);border:1px solid var(--ink)">Paperback, from {prints}</button></p>
        <p class="note">Thirty two pages. Nine charge and install spreads.
        Instant download, any device. Affirmation: {esc(v['affirmation'])}</p>
      </div>
    </div>

    <section style="border-top:1px solid var(--rule)"><div class="caps">A spread from the book</div>
      <h2 style="margin-bottom:6px">Read the left. Turn the page. Read the right.</h2>
      {sample}
    </section>

    <section><div class="caps">What is inside</div>
      <h2>{n} charges. {n} installs. Thirty two pages.</h2>
      <p>Every charge in this volume is addressed. Node, nerve, plain
      location, printed at the foot of the page it sits on. The install faces
      it across the spread, in the same nine channels, in the coherent form.</p>
      <p>Front matter carries the circuit page for the {esc(v['band'].lower())}
      band, the nine step method, and the affirmation. The book is built to be
      read on paper and it prints clean at home.</p>
    </section>

    <section style="border-bottom:0">
      <h2>Not sure this is your band?</h2>
      <p>The free diagnostic returns your three addresses and names the volume
      that matches. It takes two minutes and asks for no card.</p>
      <a class="cta" href="../diagnostic.html">Run the diagnostic</a>
    </section></div>"""
    return page(f"{name} &middot; The Little Books of", body, "../",
                f"{hook} {blurb}")

# ---------------------------------------------------------------- terms

def build_terms():
    body = f"""<div class="wrap"><section style="border-bottom:0">
      <div class="caps">Terms</div>
      <h2>Terms, refunds and what this is not.</h2>
      <h3 style="margin-top:28px">Refunds</h3>
      <p>If a volume does nothing for you, write to
      hello@thelittlebooksof.com within thirty days and the purchase is
      refunded in full. No form, no reason required. The claim in these books
      is falsifiable on purpose, so a refund is a data point and it is welcome.</p>
      <h3 style="margin-top:28px">What you are buying</h3>
      <p>A digital PDF for personal use. You may print it for yourself. You may
      not resell it or distribute it. The practitioner pack adds the right to
      use the material with your own clients. It is not a certification and it
      confers no credential.</p>
      <h3 style="margin-top:28px">What this is not</h3>
      <p>These books are an instrument for releasing a stored stress response.
      They do not diagnose, treat, cure or prevent any condition, and they are
      not a substitute for medical or psychological care. If you are in crisis,
      contact a clinician or your local emergency service.</p>
      <h3 style="margin-top:28px">Print on demand</h3>
      <p>Paperbacks are manufactured and shipped by a print on demand vendor.
      Shipping is quoted at checkout. Printed copies are made to order and are
      not returnable unless the copy arrives damaged or misprinted, in which
      case it is replaced at no cost.</p>
      <h3 style="margin-top:28px">Payment and data</h3>
      <p>Payment is processed by Stripe. Card details never touch this site.
      Your email is used to deliver the download and nothing else unless you
      ask to be on the list.</p>
      <p class="note">Tula Unified LLC, Los Angeles.</p>
    </section></div>"""
    return page("Terms &middot; The Little Books of", body, "",
                "Terms, refunds and scope.")

# ---------------------------------------------------------------- checkout js

CHECKOUT_JS_TMPL = """/* Checkout. Picks volumes where the sku needs them, then hands off to
   Stripe. No price is ever sent from the browser. */
(function () {
  var VOLUMES = __VOLUMES__;
  var NEEDS = { cluster: 3 };
  var busy = false;

  function go(sku, volumes, btn, label) {
    busy = true; if (btn) { btn.disabled = true; btn.textContent = 'One moment'; }
    fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku: sku, volumes: volumes })
    }).then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.url) { window.location = d.url; return; }
        throw new Error((d && d.error) || 'Checkout is not available.');
      })
      .catch(function (e) {
        busy = false;
        if (btn) { btn.disabled = false; btn.textContent = label; }
        alert(e.message + ' Write to hello@thelittlebooksof.com and it will be sorted by hand.');
      });
  }

  function picker(n, then) {
    var chosen = [];
    var back = document.createElement('div');
    back.className = 'sheet';
    back.innerHTML =
      '<div class="sheet-inner"><div class="caps">Choose ' + n + '</div>' +
      '<h2>Which three?</h2>' +
      '<p class="note">Take the band the diagnostic named, plus the two it leans on.</p>' +
      '<div class="picks">' + VOLUMES.map(function (v) {
        return '<button type="button" class="pick" data-v="' + v + '">' + v + '</button>';
      }).join('') + '</div>' +
      '<p><button class="cta" id="pk-go" disabled>Continue</button> ' +
      '<button class="cta ghost" id="pk-no">Cancel</button></p></div>';
    document.body.appendChild(back);
    var go2 = back.querySelector('#pk-go');
    back.addEventListener('click', function (e) {
      if (e.target === back || e.target.id === 'pk-no') { back.remove(); return; }
      var b = e.target.closest('.pick');
      if (!b) return;
      var v = b.getAttribute('data-v'), i = chosen.indexOf(v);
      if (i > -1) { chosen.splice(i, 1); b.classList.remove('on'); }
      else if (chosen.length < n) { chosen.push(v); b.classList.add('on'); }
      go2.disabled = chosen.length !== n;
      go2.textContent = chosen.length === n ? 'Continue' : 'Choose ' + (n - chosen.length) + ' more';
    });
    go2.addEventListener('click', function () { back.remove(); then(chosen); });
  }

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('button.buy');
    if (!b || busy) return;
    var sku = b.getAttribute('data-sku');
    if (!sku) return;
    ev.preventDefault();
    var label = b.textContent;
    var vol = b.getAttribute('data-volume');
    if (vol) { go(sku, [vol], b, label); return; }
    if (NEEDS[sku]) { picker(NEEDS[sku], function (vs) { go(sku, vs, b, label); }); return; }
    go(sku, [], b, label);
  });
})();
"""


SUCCESS = """<div class="wrap"><section style="border-bottom:0">
  <div class="caps">Payment cleared</div>
  <h2>Your download is ready.</h2>
  <p id="state">Preparing the link.</p>
  <div id="files"></div>
  <p class="note">The same link is in your email. It works on any device and
  does not expire for thirty days. If anything is missing, write to
  hello@thelittlebooksof.com and it will be sorted by hand.</p>
  <h3 style="margin-top:36px">Read the left page first.</h3>
  <p>Read it slowly. Do not perform it. When the body drops, turn the page and
  read the right. That is the whole operation. Ninety seconds.</p>
</section></div>
<script>
(function(){
  var q = new URLSearchParams(location.search);
  var id = q.get('session_id'), tok = q.get('t');
  var s = document.getElementById('state'), f = document.getElementById('files');
  if (!id && !tok) { s.textContent = 'No purchase found. Check your email for the link.'; return; }
  var qs = tok ? 't=' + encodeURIComponent(tok)
               : 'session_id=' + encodeURIComponent(id);
  fetch('/api/download?' + qs)
    .then(function(r){ return r.json(); })
    .then(function(d){
      if (d.print) {
        s.textContent = 'Your paperback is with the printer. It ships in three to five days and you will get a tracking email.';
        return;
      }
      if (!d.files || !d.files.length) throw new Error('not ready');
      s.textContent = 'Signed in with your purchase. ' + d.files.length + ' file(s).';
      f.innerHTML = d.files.map(function(x){
        return '<p><a class="cta" href="' + x.url + '">Download ' + x.name + '</a></p>';
      }).join('');
    })
    .catch(function(){
      s.textContent = 'The link is still being issued. Refresh in a few seconds, or check your email.';
    });
})();
</script>"""

CANCEL = """<div class="wrap"><section style="border-bottom:0">
  <div class="caps">Checkout closed</div>
  <h2>Nothing was charged.</h2>
  <p>The cart is still there if you want it. If you were not sure which volume
  to take, run the free diagnostic first. It names the band.</p>
  <a class="cta" href="diagnostic.html">Run the diagnostic</a>
  <a class="cta ghost" href="index.html#books">Back to the shelf</a>
</section></div>"""

def main():
    vols = load_volumes()
    (OUT / "styles.css").write_text(STYLES.strip() + "\n")
    (OUT / "checkout.js").write_text(
        CHECKOUT_JS_TMPL.replace("__VOLUMES__", json.dumps(ORDER)))
    (OUT / "index.html").write_text(build_index(vols))
    (OUT / "terms.html").write_text(build_terms())
    (OUT / "success.html").write_text(
        page("Your download &middot; The Little Books of", SUCCESS))
    (OUT / "cancel.html").write_text(
        page("Checkout closed &middot; The Little Books of", CANCEL))
    for name in ORDER:
        (OUT / "books" / f"{name.lower()}.html").write_text(build_book(vols[name]))
    # the diagnostic ships with the site
    diag = ROOT / "diagnostic.html"
    if diag.exists():
        (OUT / "diagnostic.html").write_text(diag.read_text())
    print(f"site built into {OUT}")
    for f in sorted(OUT.rglob("*")):
        if f.is_file():
            print(f"  {f.relative_to(OUT)}  {f.stat().st_size:,}b")

if __name__ == "__main__":
    main()
