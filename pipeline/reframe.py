#!/usr/bin/env python3
"""
REFRAME
Generates the install from the charge. The install is the charge inverted.

Grammar measured from Lance's own reframes in the corpus:

  "I'm letting it go because I listen I'm open and receptive and I'm accountable"
  "because I'm not grieving those are all lessons ... I'm energized and motivated"
  "no I love openly and freely because that's what I want for myself"

Three openings, all his. Then negation of the charge's own clauses. Then
"because" and two to four concrete present-tense capacities.
Install runs about 60 percent of the charge, per CASCADE_GRAMMAR_v1.
"""
import re

STEM = ("I'm letting go of believing, perceiving, thinking, behaving, acting, "
        "feeling, speaking, saying, voicing that I am")

# charge word -> its coherent opposite, from the 9 axes and the node table
OPPOSITE = {
 "afraid":"steady","scared":"steady","fear":"safety","fearful":"grounded",
 "anxious":"settled","worried":"clear","nervous":"calm","panicked":"steady",
 "angry":"calm","rage":"steady","furious":"level","resentful":"free",
 "ashamed":"worthy","guilty":"clean","embarrassed":"open","humiliated":"upright",
 "unworthy":"worthy","small":"full size","worthless":"valuable",
 "grieving":"moving","sad":"present","lost":"located","empty":"filled",
 "stuck":"moving","trapped":"free","frozen":"warm","paralyzed":"moving",
 "exhausted":"restored","depleted":"full","drained":"replenished","tired":"rested",
 "lazy":"in motion","stalling":"moving","avoiding":"facing","procrastinating":"starting",
 "controlling":"trusting","rigid":"flexible","forcing":"allowing",
 "silent":"speaking","voiceless":"heard","lying":"truthful",
 "alone":"connected","abandoned":"held","rejected":"included",
 "broke":"provided for","poor":"resourced","lacking":"supplied",
}

CAPACITY = {
 "Root":["I sleep through the night","my weight drops into the floor","my breath reaches the bottom"],
 "Sacral":["I want things without apologising","pleasure arrives without a bill","my hips are loose"],
 "Solar":["my gut stays soft under pressure","I act before I rehearse","I hold my own ground"],
 "Solar Plexus":["my gut stays soft under pressure","I act before I rehearse","I hold my own ground"],
 "Heart":["my chest opens on the inhale","I stay when it matters","I take what is offered"],
 "Throat":["I say the true sentence first","my jaw unclenches","my throat stays open"],
 "Crown":["the work means something again","I keep the word I gave","my head is quiet"],
 "Third Eye":["my brow softens","I see what is there","my mind signs off"],
}

def clauses(charge_text):
    """Pull the charge's own clauses. These are what the install negates."""
    t = re.sub(r"^.*?that I(?:'m| am)\b", "", charge_text, flags=re.I | re.S)
    parts = re.split(r"\bthat I(?:'m| am)?\b|\band I(?:'m| am)?\b|\bthen\b", t, flags=re.I)
    out = []
    for p in parts:
        p = re.sub(r"\s+", " ", p).strip(" ,.")
        p = re.sub(r"\s+(and|then|the|that|or|but|so|because|with|I|I'm)$", "", p, flags=re.I)
        p = re.sub(r"^(and|then|the|that|or|but|so)\s+", "", p, flags=re.I).strip(" ,.")
        w = p.split()
        # a capital mid-clause means the dictation ran two entries together
        if any(x[:1].isupper() and x.lower() not in ("i",) for x in w[1:]):
            continue
        if 3 < len(w) < 11 and not re.search(r"\bletting go\b", p, re.I):
            out.append(p)
    return out

# the replacement state, in adjective form so "I know that I am ___" reads
ADJ = {
 "steadiness":"steady","worth":"worthy","flow":"flowing","calm":"calm",
 "restoration":"restored","momentum":"moving","value":"valuable",
 "renewal":"renewing","expression":"expressed","trust":"trusting",
 "devotion":"devoted","safety":"safe","acceptance":"accepting","joy":"alive",
 "happy":"glad","presence":"present","awareness":"aware",
}

def adj(state):
    return ADJ.get(str(state).lower().strip(), str(state).lower().strip())

def opposite_of(word):
    w = word.lower().strip()
    for k, v in OPPOSITE.items():
        if k in w:
            return v
    return None

def negate(c):
    """Turn one charge clause into its install line, matching the clause type."""
    c = c.strip(" ,.")
    low = c.lower()
    if low.startswith(("cannot", "can not", "can't")):
        return "I know I can " + re.sub(r"^(cannot|can not|can't)\s+", "", c, flags=re.I) + "."
    if low.startswith(("need to", "have to", "must")):
        return "I know I do not " + c + "."
    if low.startswith(("unable to",)):
        return "I know I am able to " + re.sub(r"^unable to\s+", "", c, flags=re.I) + "."
    if low.startswith(("afraid", "scared", "terrified", "frightened")):
        return "I know I am not " + c + "."
    if re.match(r"^(the|a|an)\s", low):
        return "I know I am not holding " + c + "."
    return "I know I am not " + c + "."


def reframe(charge_text, charge_name, band, state):
    cl = clauses(charge_text)[:6]
    opp = opposite_of(charge_name) or adj(state)
    caps = CAPACITY.get(band, CAPACITY["Root"])[:3]

    close = "I'm letting it go because " + ", ".join(caps[:2]) + f", and {caps[2]}."
    opening = f"I know that I am {opp}."
    target = max(28, int(len(charge_text.split()) * 0.6))

    body, used = [], len(opening.split()) + len(close.split())
    for c in cl:
        line = negate(c)
        if used + len(line.split()) > target:
            break
        body.append(line); used += len(line.split())
    if not body and cl:
        body = [negate(cl[0])]
    return " ".join([opening] + body + [close])

if __name__ == "__main__":
    demo = (STEM + " grieving, that I'm grieving the loss of missed opportunities, "
            "that I'm grieving the loss of fatherhood, that I'm grieving the loss of "
            "broken relationships, and I'm holding regret for the choices.")
    print(reframe(demo, "Grieving", "Heart", "Renewal"))
