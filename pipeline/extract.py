#!/usr/bin/env python3
"""
CONTENT EXTRACTOR
Builds atomic units from material that already exists. Writes nothing new.
Every unit cites the source it came from.

Usage: python3 pipeline/extract.py > pipeline/units.json
"""
import json, re, sys, pathlib

HERE = pathlib.Path(__file__).parent
NODES = json.loads((HERE / "nodes.json").read_text())
MOB = (HERE.parent / "index.html")

BAND_PLAIN = {
 "Root":"the low back and pelvis","Sacral":"below the navel, front and back",
 "Solar Plexus":"just under the ribs, centre","Heart":"the centre chest and upper back",
 "Throat":"the throat and back of the neck","Third Eye":"the brow and behind the eyes",
 "Crown":"the top and back of the head","Anchor":"the crown and deep spinal axis"}

def mob_text():
    import html as H
    h = MOB.read_text(encoding="utf-8")
    for pat in (r"<style.*?</style>", r"<script.*?</script>", r"<svg.*?</svg>"):
        h = re.sub(pat, "", h, flags=re.S)
    h = re.sub(r"</?(p|div|h[1-6]|li|tr|br|section|article|td|th|table|ul|ol)[^>]*>", "\n", h, flags=re.I)
    h = H.unescape(re.sub(r"<[^>]+>", "", h))
    return re.sub(r"\n\s*\n+", "\n", re.sub(r"[ \t]+", " ", h))

units = []

# ---- 1. ADDRESS POSTS. One per in-body node with a confirmed address.
# Field nodes have no somatic address. Nodes 99 and 108 were struck 2026-09-08
# and print ADDRESS PENDING. Neither becomes a post. Never interpolate.
for n in [x for x in NODES if not x.get("field") and not x.get("pending")]:
    plain = BAND_PLAIN[n["band"]]
    text = (f"{n['charge']} has an address.\n\n"
            f"Node {n['n']}. The {n['nerve']}. {plain.capitalize()}.\n\n"
            f"It governs {n['domain'].lower()}.\n\n"
            f"Put a hand on {plain}. Bring {n['charge'].lower()} to mind and hold it "
            f"for ninety seconds. If the area warms, tightens, goes cold or starts to hum, "
            f"that is the node answering.\n\n"
            f"Ninety seconds. You do not have to believe anything to run it.")
    units.append({"type":"address","band":n["band"],"node":n["n"],
                  "title":f"{n['charge']} · node {n['n']}",
                  "text":text,"source":"MOB v214 ch.36, The 112 Nodes",
                  "channels":["instagram","tiktok","threads"]})

# ---- 2. MECHANISM POSTS. Pulled from the nine emotional architectures.
t = mob_text()
axes = re.findall(r"Axis (\d+)\s*\n([A-Za-z]+)→([A-Za-z]+)\s*\n([^\n]+)\n\"([^\"]+)\"\s*\n([^\n]+)", t)
for num, dys, coh, addr, quote, body in axes:
    sents = [s.strip() for s in re.split(r"(?<=[.])\s+", body) if 25 < len(s.strip()) < 220][:4]
    if len(sents) < 2: continue
    text = (f"{dys} releases to {coh}.\n\n" + "\n\n".join(sents[:3]) +
            f"\n\nAddress: {addr}.")
    units.append({"type":"mechanism","band":addr,"node":None,
                  "title":f"Axis {num} · {dys} to {coh}",
                  "text":text,"source":f"MOB ch.15, Axis {num}",
                  "channels":["linkedin","threads","substack"]})

# ---- 3. CORRECTION POSTS. Category assumptions the manuscript overturns.
CORRECTIONS = [
 ("The iceberg model is wrong",
  "The familiar iceberg says what is above the water is known and what is below is hidden. "
  "That model has two zones.\n\nThe accurate model has four.\n\n"
  "Known Knowns, above the water. Unknown Knowns, past the clouds, which cannot be "
  "conceptualised and have to be experienced. Known Unknowns, just below the surface, "
  "the shadow. Unknown Unknowns, in the depths, running in a nervous system you inherited.\n\n"
  "The lens is the thing you cannot see, because you are looking through it and not at it.",
  "MOB ch.1"),
 ("Anger is not the problem",
  "Anger is power. The solar plexus is where power lives.\n\n"
  "When it fires at the celiac plexus it is not a negative emotion misfiring. It is the "
  "system identifying a violation of the field and mobilising force to address it.\n\n"
  "The problem is not that anger exists. The problem is that it runs on a trigger the "
  "person never chose.\n\nCleared, it becomes discernment rather than dominance.",
  "MOB ch.15, Axis 02"),
 ("Every charge has a rise and a fall",
  "The ascending side builds the primary node. The descending side produces the shame "
  "cluster. Humiliated, embarrassed, guilty, sad, deflated.\n\n"
  "Those are not separate emotions. They are the same charge at different phases of one "
  "cycle.\n\nWhich is why the anger node cannot clear without the shame cluster that formed "
  "on the way down. Work the ascending nodes first. The rest releases with them.",
  "MOB ch.15"),
 ("Shame is the fastest one",
  "It is the only emotion that removes volume from the system at once. Not gradually. "
  "At once.\n\nGoes cold. Feels small. The impulse is to hide.\n\n"
  "You can watch it in a dog. Head drops, ears droop, tail goes between the legs, it limps "
  "away. Humans do the same thing with better emotional control.\n\n"
  "Nobody comes in for shame. They come in for anger, anxiety, creative block. "
  "Shame is almost always underneath.",
  "MOB ch.15, Axis 03"),
 ("A loaded nerve feels different",
  "A clear nerve feels like an individual fibre. Free and smooth.\n\n"
  "A loaded nerve feels trapped in volume. Like the nerve is buried in dense dirt.\n\n"
  "The work is unearthing it. Not forcing it. Unearthing.",
  "MOB ch.15, Axis 01"),
 ("The plexus is hardware, the chakra is the field",
  "A nerve plexus is physical. Actual tissue. A place along the spine where fibres "
  "converge and branch.\n\nWhen a plexus branches into three fibres it creates a field. "
  "That field is the chakra.\n\nThe plexus is the hardware. The chakra is what the hardware "
  "generates. Block the plexus and the field it generates gets disrupted.",
  "MOB Appendix C"),
 ("A grudge is a poison pill",
  "Resentment is recycled anger running on a loop.\n\n"
  "When you hold a grudge you take a poison pill. It fires the stress response every time "
  "you see the person, or think about them, or hear their name.\n\n"
  "The grudge costs you. It does not cost them.\n\n"
  "Address: suprarenal plexus, just above the kidney, back of the body.",
  "MOB ch.15, Axis 02"),
 ("Eight words down, one word up",
  "Count the emotion words you have for the shadow range. Sad, angry, scared, ashamed, "
  "disgusted, guilty, lonely, numb.\n\nNow count the ones for the upward range. Happy.\n\n"
  "Eight compression channels. One expansion channel. That asymmetry is itself diagnostic.\n\n"
  "The work restores access to the expansion channel. Not by suppressing the eight, "
  "but by clearing the charge that keeps compression dominant.",
  "MOB ch.15"),
]
for title, text, src in CORRECTIONS:
    units.append({"type":"correction","band":None,"node":None,"title":title,
                  "text":text,"source":src,
                  "channels":["linkedin","threads","substack","instagram"]})

# ---- 4. CASE POSTS. Real sessions, already anonymous in the manuscript.
CASES = [
 ("A stranger at a party",
  "He looked puzzled a few feet away. I asked what was up.\n\n"
  "His father. Health issues on top of old life issues. The man had been abusive, an "
  "alcoholic, and it had cut a rift going back to childhood. He had decided he did not "
  "want to help him. And at the same time it was his father and he wanted to help.\n\n"
  "Weeks of wrestling with it.\n\nThe wound was not the anger. It was the toggle. His mind "
  "was flipping between two committed positions and the flipping itself was the freeze.\n\n"
  "So I went at the resentment and told him the mechanic plainly. A grudge fires the stress "
  "response every time you see the person. It costs you, not him.\n\n"
  "His spine straightened. He said he had been circling that for weeks and felt free.\n\n"
  "A few minutes. The node cleared and the toggle stopped.",
  "MOB ch.15, Case Arc"),
 ("Thirty minutes in an underground bar",
  "Los Angeles. A courtyard. Someone I had never met, early thirties.\n\n"
  "Within a few minutes he said he had always had this issue with his father, that it was "
  "the worst pain of his life, and he did not know how to solve it.\n\n"
  "I asked him to describe it. He did. I saw the wound in real time.\n\n"
  "I told him: you are angry at him, but what you are holding is shame. The anger is the "
  "surface. The shame is underneath. And I described the dynamic, where it was born, how it "
  "had been running in both directions for years without either of them seeing it.\n\n"
  "He started laughing. He said I had just rocked his world.\n\n"
  "That is the mechanic. Not the pattern. The identification with the pattern. "
  "The second the spell breaks, the energy sustaining it dissolves with it.",
  "MOB ch.15, Field Case"),
 ("You look ten years younger",
  "After a two-hour session where rage, fear and anger released, two friends at dinner "
  "within the month said the same thing independently.\n\n"
  "Not metaphor. The stress response ages everything. It deprives cells, tissues, organs. "
  "It constricts flow. You can see it from outside as grey hair, balding, poor vision, "
  "nerve function loss.\n\n"
  "When it releases: tension gone, pressure gone, the thoughts around it gone, the "
  "darkness that compressed it gone.",
  "MOB ch.15, Axis 01"),
]
for title, text, src in CASES:
    units.append({"type":"case","band":None,"node":None,"title":title,
                  "text":text,"source":src,"channels":["linkedin","instagram","substack"]})

# ---- 5. EVIDENCE POSTS. Rare. Never overclaimed.
units.append({"type":"evidence","band":None,"node":None,
  "title":"What is proven and what is not",
  "text":("Stated plainly, because this category usually does not.\n\n"
    "Proven and public. Co-authored peer-reviewed work with a gastroenterologist in "
    "Endoscopy, Thieme. DOI 10.1055/a-2013-1820.\n\n"
    "Documented in the literature. The body emits ultraweak photon radiation, measurable "
    "with photomultiplier tubes, documented since the 1920s.\n\n"
    "Observed, not formally studied. Most of the specific mechanisms here. Fifteen thousand "
    "releases run on myself over five years, six thousand recorded.\n\n"
    "Does not exist yet. Controlled trials. Three credentialed physicians have reviewed "
    "this work and recommended them. Nobody has run them.\n\n"
    "I would rather you knew the shape of that."),
  "source":"EVIDENCE_AUDIT.md","channels":["linkedin","substack"]})

json.dump(units, sys.stdout, indent=1)
