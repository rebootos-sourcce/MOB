#!/usr/bin/env python3
"""
FORMAT PAIR
Converts raw dictation into the original Little Books pair format.

The pattern, read off the printed COURAGE and POWER volumes:

    Fear
    I'm letting go of believing, perceiving, thinking, behaving, acting,
    and feeling that I am scared, nervous, worried, concerned, anxious,
    tense, restless, unsure, insecure, shy, cautious, hesitant, fearful,
    unsafe, ... afraid of loss, afraid of change, afraid of dying.
    Impact of Fear: tight gut, shallow breath, cold limbs, trembling chest.

    Courage
    I know that I am brave, calm, strong, steady, confident, grounded,
    secure, ... fearless in being, fearless in becoming, fearless in light.
    Impact of Courage: warm chest, full breath, relaxed body, steady gaze.

Rules taken from the printed books and the 3C generator spec:
  - a comma-separated list of states, never prose
  - intensity escalates: subtle, then tension, then flooding, then identity
  - the tail runs longer phrases, not single words
  - impact is exactly four physical observations
  - the install mirrors the charge, same shape, opposite pole
"""
import re

CHARGE_STEM = ("I'm letting go of believing, perceiving, thinking, behaving, "
               "acting, and feeling that I am")
INSTALL_STEM = "I know that I am"

# the escalation curve, verbatim from the 3C generator spec
CURVE = ["uneasy", "tense", "nervous", "bothered", "irritated", "frustrated",
         "stressed", "overwhelmed", "anxious", "afraid", "worried", "threatened",
         "ashamed", "guilty", "troubled", "distressed", "panicked", "angry",
         "furious", "enraged", "collapsing"]
RANK = {w: i for i, w in enumerate(CURVE)}

# states the dictation reaches for, by band, when it needs a tail
TAIL = {
 "Root":   ["disconnected from safety", "unable to settle", "unable to trust the ground",
            "afraid of what comes next", "afraid of being cornered"],
 "Sacral": ["disconnected from wanting", "unable to receive", "afraid of my own appetite",
            "ashamed of desire", "afraid to be full"],
 "Solar Plexus": ["disconnected from my power", "unable to hold my ground",
                  "unable to act without rehearsing", "afraid to be seen failing",
                  "afraid of my own force"],
 "Heart":  ["disconnected from love", "unable to stay open", "unable to take what is offered",
            "afraid of closeness", "afraid of losing again"],
 "Throat": ["disconnected from my voice", "unable to say the true sentence",
            "unable to disagree out loud", "afraid of being heard", "afraid of my own words"],
 "Third Eye": ["disconnected from what is real", "unable to stop scanning",
               "unable to decide", "afraid of what I will see", "afraid of being wrong"],
 "Crown":  ["disconnected from meaning", "disconnected from God", "unable to keep my word",
            "afraid none of it matters", "afraid I am alone in it"],
}

POLE = {
 "Root": ["safe","calm","strong","steady","grounded","secure","protected","supported",
   "resilient","anchored","centered","settled","present","capable","whole","unshaken",
   "rooted in what is actual","steady under pressure","at home in my own weight",
   "breathing all the way down","standing without bracing","held by the ground",
   "safe in this body","safe in this moment","safe in what comes next","safe in the dark"],
 "Sacral": ["open","warm","alive","fluid","receptive","unashamed","easy","willing",
   "generous","playful","soft","full","free in my own appetite","able to receive without a bill",
   "loose in the hips","warm through the belly","awake in the skin",
   "allowed to want","allowed to enjoy","allowed to be filled","allowed to take up room"],
 "Solar Plexus": ["strong","clear","decisive","grounded","capable","composed","steady",
   "direct","certain","sovereign","unhurried","powerful without force",
   "able to act before I rehearse","holding my own ground","soft in the gut under pressure",
   "moving with discernment","choosing without flinching","standing in my own weight",
   "clear in motion","steady in my own authority"],
 "Heart": ["open","warm","connected","tender","whole","trusting","present","generous",
   "steady","unarmoured","able to stay and stay intact","open without bracing",
   "held and holding","breathing into the chest","letting it land",
   "connected to life","connected to love","open in grief","open in joy","open in the ordinary day"],
 "Throat": ["clear","honest","direct","heard","unguarded","true","steady","plain",
   "unhurried","open in the throat","saying the true sentence first",
   "able to disagree out loud","done rehearsing the sentence","letting the jaw go",
   "speaking at the speed of thought","true in what I say","true in what I withhold",
   "true in the room","true when it costs me"],
 "Third Eye": ["clear","focused","discerning","calm","perceptive","certain","quiet",
   "unhurried","awake","seeing what is there","done scanning for threat",
   "quiet behind the eyes","smooth across the brow","deciding and moving",
   "clear in perception","clear in judgment","clear without certainty",
   "clear in the unknown"],
 "Crown": ["aligned","devoted","purposeful","connected","whole","sovereign","steady",
   "certain","quiet","keeping the word I gave","certain it means something",
   "connected to the larger intelligence","light at the crown","quiet in the head",
   "connected to source","connected to purpose","connected in the work",
   "connected when nobody is watching"],
}

IMPACT_CHARGE = {
 "Root":   "tight gut, shallow breath, cold limbs, braced legs",
 "Sacral": "clenched pelvis, held breath, numb skin, closed hips",
 "Solar Plexus": "hard gut, locked jaw, shallow breath, curled shoulders",
 "Heart":  "tight chest, shallow breath, cold hands, heavy shoulders",
 "Throat": "tight throat, clenched jaw, shallow breath, stiff neck",
 "Third Eye": "tense brow, unfocused eyes, held breath, cold temples",
 "Crown":  "pressure at the crown, dull eyes, flat breath, heavy head",
}
IMPACT_INSTALL = {
 "Root":   "soft gut, full breath, warm limbs, loose legs",
 "Sacral": "open pelvis, easy breath, live skin, loose hips",
 "Solar Plexus": "soft gut, loose jaw, deep breath, open shoulders",
 "Heart":  "open chest, full breath, warm hands, light shoulders",
 "Throat": "open throat, loose jaw, full breath, easy neck",
 "Third Eye": "smooth brow, clear eyes, easy breath, warm temples",
 "Crown":  "quiet crown, bright eyes, deep breath, light head",
}

# words in the dictation that are states, not filler
# nouns that survive the -y / -ing suffix test but are not states
NOUNS = set("""family money body work life god love people money business time day
year world home house car job money heart mind head body story memory energy
lance aries horse fire water earth city country friend friends father mother
son daughter wife husband child children baby company team project art music""".split())

DROP = set("""i im am the a an and or but that this then there here to of in on at
for with from my me myself you it its be been being is was are were will would
can could should do does did have has had not no yes so as if when what which
who how why all any some go going let letting believe believing perceiving
thinking behaving acting feeling speaking saying voicing about into out up down
because they them their he she we us our your more most very just like get got
know knew make made take took come came see saw say said feel felt want wanted
need needed thing things people life time way""".split())


TURN = re.compile(r"(?i)\b(because I'?m not|I'?m letting it go because|"
                  r"I know that I am|those are all lessons|now I'?m|instead I|"
                  r"no I \w+ openly|because that'?s what I want)\b")


def charge_half(text):
    """Everything before the reframe. He often turns mid-entry."""
    m = TURN.search(text)
    return text[:m.start()] if m and m.start() > 60 else text


def states_from(text, limit=34):
    """Pull the charge's own state words and short phrases, in the order said."""
    t = re.sub(r"(?i)^.*?that I(?:'m| am)\b", "", text, count=1)
    t = re.sub(r"(?i)\b(i'm|i am|that|and|then)\b", ",", t)
    out, seen = [], set()
    for chunk in t.split(","):
        c = re.sub(r"\s+", " ", chunk).strip(" .,'\"").lower()
        if not c or c in seen:
            continue
        w = c.split()
        if not (1 <= len(w) <= 5):
            continue
        if all(x in DROP for x in w):
            continue
        if len(w) == 1 and c in NOUNS:
            continue
        # phrase forms Lance actually uses
        if len(w) > 1 and not re.match(
                r"(?i)^(afraid|unable|disconnected|ashamed|scared|terrified|"
                r"unwilling|not|never|too|un\w+)\b", c):
            continue
        # singles must look like a state, not a noun
        if len(w) == 1 and not re.search(
                r"(ed|ing|ous|ful|less|ant|ent|ive|ary|able|ible|y)$", c):
            continue
        seen.add(c)
        out.append(c)
        if len(out) >= limit:
            break
    return out


def order_by_intensity(states):
    """Subtle first, collapse last, per the 3C escalation curve."""
    def key(s):
        for w in s.split():
            if w in RANK:
                return RANK[w]
        return len(s.split()) + 8   # phrases sit late, single words early
    return sorted(states, key=key)


LADDER = {
 "Root": ["uneasy","tense","nervous","unsure","insecure","cautious","hesitant","restless",
   "worried","anxious","stressed","overwhelmed","threatened","cornered","trapped",
   "frozen","helpless","powerless"],
 "Sacral": ["uneasy","tense","guarded","withholding","ashamed","guilty","repressed",
   "numb","shut down","undeserving","starved","closed off"],
 "Solar Plexus": ["uneasy","tense","irritated","frustrated","stressed","overwhelmed",
   "pressured","defensive","resentful","angry","furious","depleted","defeated"],
 "Heart": ["uneasy","guarded","withdrawn","lonely","hurt","grieving","abandoned",
   "rejected","unloved","closed","armoured","hollow"],
 "Throat": ["uneasy","tense","hesitant","silenced","unheard","dismissed","misunderstood",
   "swallowed","choked","suppressed","invisible"],
 "Third Eye": ["uneasy","distracted","doubtful","confused","scattered","hypervigilant",
   "suspicious","paralysed","overthinking","blind"],
 "Crown": ["uneasy","disconnected","empty","purposeless","abandoned","forsaken",
   "meaningless","separate","unworthy","lost"],
}


def build_charge(text, band, cap=88, charge_only=None):
    st = order_by_intensity(states_from(charge_half(charge_only or text)))
    ladder = [w for w in LADDER.get(band, LADDER["Root"]) if w not in st]
    tail = TAIL.get(band, TAIL["Root"])
    body, n = [], 0
    for s in st[:10] + ladder + st[10:] + tail:
        if n + len(s.split()) + 1 > cap:
            break
        if s in body:
            continue
        body.append(s); n += len(s.split()) + 1
    return CHARGE_STEM + " " + ", ".join(body) + "."


def build_install(band, cap=88):
    pole = POLE.get(band, POLE["Root"])
    body, n = [], 0
    for s in pole:
        if n + len(s.split()) + 1 > cap:
            break
        body.append(s); n += len(s.split()) + 1
    return INSTALL_STEM + " " + ", ".join(body) + "."


def impacts(band):
    return (IMPACT_CHARGE.get(band, IMPACT_CHARGE["Root"]),
            IMPACT_INSTALL.get(band, IMPACT_INSTALL["Root"]))


if __name__ == "__main__":
    import json, pathlib
    e = json.loads((pathlib.Path(__file__).parent.parent /
                    "corpus/LETGO_ENTRY_INDEX.json").read_text())
    x = [y for y in e if y["entry"].strip().lower() == "grieving"][0]
    c = build_charge(x["text"], "Heart")
    i = build_install("Heart")
    ic, ii = impacts("Heart")
    print("Grieving\n" + c + f"\nImpact of Grieving: {ic}.\n")
    print("Renewal\n" + i + f"\nImpact of Renewal: {ii}.")
    print(f"\ncharge {len(c.split())}w   install {len(i.split())}w")
