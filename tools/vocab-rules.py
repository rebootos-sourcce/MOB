# THE CLASSIFIED REPLACEMENTS, read by tools/vocab-sweep.py.
#
# Ruled 18 November, his words: "Change seat and chakra to just point. It's
# an assemblage point. You can call it AP, or assemblage point for short, or
# point. We're going to use charge instead of tension. And neither becoming
# or complete, we're going to use the word whole. Instead of clear conduction
# against sabotage, just use clarity. Grace against false light, just change
# that to grace. Oh, I see. Grace against shadow. So use the word shadow."
#
# Order matters: the first rule whose match covers a word wins, so every
# specific rule and every exception sits above the general one it narrows.
# A rule is rule(files, pattern, replacement, why); an exception is
# keep(files, pattern, why). files is a glob against the path under
# atuned_src/, or '*'. Patterns are matched only against text a person reads
# (see the sweep's header), so none of them can reach a key or a class.

# ---------------------------------------------------------------- exceptions

keep('engine/data/kb.js', r'\b[Cc]hakras?\b',
     'the Wisdom school glossary is ported from the codex, and its Chakra '
     'entry is the one that says a chakra is an assemblage point; the book '
     'and canon source documents are not swept')
keep('engine/daily.js', r'^Chakra$',
     "the title of the Wisdom school glossary entry the word maps to, a key "
     "into KB, not a word on a screen")
keep('*', r'^(seat tone|from the seat)$',
     'a key of the meaning table (engine/data/gloss.js), which is identity; '
     'the label a person reads is passed beside it')

# tension where it is a sensation a person says or picks, or an idiom
keep('engine/data/practice.js', r'\b(tension headache|rib tension|pelvic floor tension)\b',
     'a symptom a person reports, said in their words')
keep('engine/data/registers.js', r'\b(lower back|mid-back) tension\b',
     'a symptom a person reports, said in their words')
keep('engine/data/cards.js', r'\bjaw tension\b', 'an example of a physical sensation word')
keep('engine/data/cards.js', r'\bTension accumulation\b',
     'the name of a band on the cards\' escalation curve, a felt rise in '
     'pressure across statements, not charge held at a place in the body')
keep('*', r'\bbreaks? the tension\b', 'the Jester\'s idiom, a room\'s mood, not charge')
keep('ui/sound.js', r'\ba tension line\b',
     'the sound map\'s note for a drawn line\'s tautness, a physical metaphor '
     'for the line, not charge at a place')

# the codex line for the Shadow pole, quoted, which the unpack table holds
# phrase by phrase to its meaning (POLE_MEANS)
keep('engine/data/compass.js', r'\bPride as false light\b',
     "the codex's own line for the pole, quoted; the pole's name is Shadow")

# ---------------------------------------------------------------- the pairs

rule('engine/data/*.js', r"^False Light$", 'Shadow',
     'Grace against Shadow, his words: the pole in MIRROR, its recipe row, and '
     'the same figure in the decoherent blueprint, one word per concept')
rule('engine/data/compass.js', r"^Clear Conduction$", 'Clarity',
     '"Instead of clear conduction against sabotage, just use clarity"')

# ---------------------------------------------------------------- whole

rule('ui/avatarui.js', r"<small>Complete</small>", '<small>Whole</small>',
     'the Avatar percent reads how far you have come, and its word is whole')
rule('ui/avatarui.js', r"^ complete\.$", ' whole.', 'the Avatar percent, as above')
rule('ui/ritstage.js', r"^Complete\|$", 'Whole|', 'the Ritual page\'s Avatar ring, as above')
rule('ui/ritstage.js', r'(?<=rv-avlab">)Complete', 'Whole', 'the Ritual page\'s Avatar ring label')
rule('ui/ritstage.js', r"\bpercent complete\b", 'percent whole', 'the same percent, said in a sentence')

# ---------------------------------------------------------------- charge

rule('ui/storyui.js', r'\bholding the most tension\b', 'holding the most charge',
     'the stuck energy at a place in the body is charge, the product\'s one word')

# ---------------------------------------------------------------- seat, the verb

rule('ui/drills.js', r'\bThis domain seats\b', 'This domain holds', 'seat as a verb, to place')
rule('ui/drills.js', r'\bdoes not seat the\b', 'does not reach the', 'seat as a verb, to place')
rule('engine/lexicon.js', r'\brefuses to seat\b', 'refuses to place', 'seat as a verb')
rule('engine/lexicon.js', r'\bcould seat\b', 'could place', 'seat as a verb')
rule('engine/lexicon.js', r'\bthe table seats at\b', 'the table places at', 'seat as a verb')
rule('engine/sniff.js', r'\bthe lexicon seats it\b', 'the lexicon places it', 'seat as a verb')

# ---------------------------------------------------------------- first use
# The sentence a hover opens says what a point is, so a person meets the
# full name with its meaning beside it. The headings that introduce the
# seven say assemblage points; later uses say point.

rule('engine/data/gloss.js',
     r"^A seat is one of seven places along the middle of your body, from",
     'An assemblage point, or point, is one of seven places along your body, from',
     'the meaning, unpacked, where the word is first met; "the middle of" is '
     'cut to hold the table to its thirty four word ceiling')
rule('engine/data/gloss.js', r"^An assemblage point is a seat: one of seven places",
     'An assemblage point, or point, is one of seven places',
     'the same sentence for the full name')
rule('engine/daily.js', r"^seat$", 'point',
     'DLY_CANON w is the word as a daily sentence prints it, so it follows the screen',
     force=True)
rule('*', r'\b([Ss]even) seats\b', r'\1 assemblage points',
     'the heading that introduces all seven gives the full name')
rule('*', r'\b([Ss]even) chakras\b', r'\1 assemblage points', 'as above')

# ---------------------------------------------------------------- the general rule


def _point(m):
    w, s = m.group(1), m.group(2)
    out = 'point' + s
    if w.isupper():
        return out.upper()
    return out[:1].upper() + out[1:] if w[:1].isupper() else out


rule('*', r'\b(seat|Seat|SEAT|chakra|Chakra|CHAKRA)(s?|S?)\b', _point,
     'seat and chakra are a point, his words')
