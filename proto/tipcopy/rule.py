# The candidate schema-aloud rule, proposed in DESIGN-tooltip-copy.md section 5.5
# and NOT installed in .claude/skills/atuned-voice/objections.json. Run from the
# repo root. It prints how many of the owner's own objected lines it catches and
# how many known good lines it wrongly flags, so it is checked against a known
# case before anybody believes it.
import re
T=r"(?:held|opposite(?: install(?:ed)?)?|install(?:ed)?|net SQ|SQ|DQ|CQ|susceptibility|affinity|distortion|integrity|intention|pole in|overshoot|weight|load|reads)"
F=r"\s*(?:<[^>]*>\s*)?\d+(?:\.\d+)?(?:\s*(?:<[^>]*>\s*)?of 10)?"
R=[re.compile(r"(?i)\b"+T+F+r"\s*(?:</b>)?\s*,?\s*(?:and\s+)?"+T+F),      # two readouts chained
   re.compile(r"(?i)\b(?:law|layer|pattern|address)\.\s+(?:\w+\s+)?\d+\.\d"),  # a label, a stop, a bare figure
   re.compile(r"\.\s+(?:SQ|DQ|CQ|Weight|Load)\s+\d+\.\d")]                      # a name, a stop, a variable
bad=["Held 5.0, opposite installed 0.0, net SQ 5.0. Distorts as Avoidance.","held 5.0 opposite install 0.0",
     "held 0.3, opposite 8.8","Most shut law. 2.3 of 10","Heaviest pattern. Weight 6.5",
     "Intention 1.9, distortion 10.0.","Heart. SQ 6.2"]
good=open('proto/tipcopy/lines.txt').read().splitlines()+["at a weight of 7.4",
     "This entry put 2.1 at this address, out of 6.3 from 3 entries that landed here.",
     "Outward mean 3.2 against inward mean 2.1.","Release has about 25 patterns to work through.",
     "Built from 23 held addresses across Root, Solar.","4 of 10 counts as loaded","Held","Worth","Depth 5.4",
     "You have committed 1 story and nothing reaches the line yet."]
hit=lambda s:any(r.search(s) for r in R)
print('objected lines caught',sum(map(hit,bad)),'of',len(bad))
fp=[s for s in good if hit(s)]
print('good lines',len(good),'wrongly flagged',len(fp),fp)
