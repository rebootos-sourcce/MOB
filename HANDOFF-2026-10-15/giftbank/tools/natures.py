"""The word sets that decide a sentence's nature, one place, read by the
selector and by the review documents so the two can never disagree.

A sentence belongs to a nature when it names that nature's state in its own
words. Core words name the state outright. Neighbour words name the same state
in other plain words. A sentence that names two natures is held from both, so
no sentence can sit in two banks.

Anxiety is the bank already built on 16 October. Its words are copied here
exactly as select.py has them (core plus fear), so the five new banks are held
apart from it by the same rule that held it apart from them.
"""
import re

NATURES = ('anxiety', 'overwhelm', 'burnout', 'grief', 'sadness', 'depression')

WORDS = {
    'anxiety': {
        'core': r"anxious|anxiety|anxieties|worry|worries|worried|worrying|nervous|nervousness|panic|panicking|panicked|dread|dreading",
        'neighbour': r"afraid|scared|fear|fears|fearing|fearful|terrified|frightened|apprehensive|uneasy",
    },
    'overwhelm': {
        'core': r"overwhelm|overwhelmed|overwhelming|overwhelms",
        'neighbour': r"overloaded|overload|swamped|drowning in|buried under|too many things|spread too thin|can't keep up|cannot keep up",
    },
    'burnout': {
        'core': r"burnout|burn out|burned out|burnt out|burning out|exhausted|exhaustion|exhausting|depleted|depletion|drained|draining",
        'neighbour': r"tired|tiredness|fatigue|fatigued|fatiguing|worn out|run down|rundown|weary|weariness|overworked|overworking",
    },
    'grief': {
        'core': r"grief|grieve|grieves|grieving|grieved|mourn|mourning|mourned|bereaved|bereavement|heartbroken|heartbreak",
        'neighbour': r"loss|losses",
    },
    'sadness': {
        'core': r"sad|sadness|saddened|sorrow|sorrows|sorrowful|unhappy|unhappiness",
        'neighbour': r"cry|crying|cried|tears|tearful|weep|weeping|wept|gloomy|melancholy|heartache|lonely|loneliness",
    },
    'depression': {
        'core': r"depressed|depression|depressing|depressive|hopeless|hopelessness",
        'neighbour': r"despair|despairing|despondent|numb|numbness|empty|emptiness|meaningless|meaninglessness|pointless|pointlessness|unmotivated|apathy|apathetic|lifeless|joyless|giving up|give up|gave up",
    },
}

# Why each neighbour set is what it is. Printed in the review documents.
WHY = {
    'overwhelm': 'They name more coming in than a person can take: overloaded, swamped, drowning in, buried under, spread too thin, cannot keep up. "Too much" alone is left out: in the corpus it is in 6 different sentences and means overwhelm in one ("I\'ve taken on too much"), and something else in the others ("too much in my head", "take up too much space", "drink too much"). "Pressure" is left out, because it names a push from outside, not the state of being flooded by it.',
    'burnout': 'Core words name being used up: exhausted, depleted, drained, burned out. Neighbour words name the long tired kind: tired, fatigued, worn out, run down, weary, overworked. "Energy" alone is left out, because "giving my energy away" names a habit, not the state.',
    'grief': 'Core words name mourning: grief, grieving, mourning, bereaved, heartbroken. The one neighbour word is "loss", because a loss is what grief is about; a loss of power, control, strength, energy or vitality is held as not a loss anyone mourns. "Lost", "miss", "death" and "die" are left out. In all 8 different sentences that say "lost", it means a quality gone ("lost my spark", "lost my mojo", "lost confidence") or being unsure ("feeling lost on how to finish projects"), never a person. None of the 4 that say "miss" or "missed" is about missing someone. Of the 15 that say "death" or "die", 10 are fear of dying, which is anxiety.',
    'sadness': 'Core words name the state: sad, sorrow, unhappy. Neighbour words name what sadness does or how it sits: crying, tears, weeping, gloomy, melancholy, heartache, lonely. "Down", "hurt" and "heavy" are left out: in the corpus "down" is mostly "let people down" or "slow down" (31 different sentences), "hurt" is mostly hurt feelings or a body in pain (40), and "heavy" is used for eyes, weight and life (9). "Blue" appears twice.',
    'depression': 'Core words name the state: depressed, depression, hopeless. Neighbour words name what it is like from inside: despair, numb, empty, meaningless, pointless, unmotivated, apathy, joyless, giving up. "Defeated" and "deflated" are left out: of the 32 different sentences that say either, 27 also name one of the six natures, usually inside a long list beside anxious and ashamed, and on their own they name losing a contest, which can come with any of the six. "Worthless" is left out, because it names shame.',
    'anxiety': 'As in the anxiety bank: core words name the state (anxious, worried, nervous, panic, dread), neighbour words are the fear words (afraid, scared, terrified, frightened).',
}

def rx(words):
    return re.compile(r"(?i)\b(%s)\b" % words)

CORE = {k: rx(v['core']) for k, v in WORDS.items()}
NEAR = {k: rx(v['neighbour']) for k, v in WORDS.items()}


def found(s):
    """Every nature this sentence names, with the tier and the words."""
    s = s.replace('\u2019', "'")
    out = {}
    for k in NATURES:
        c = sorted({m.group(1).lower() for m in CORE[k].finditer(s)})
        n = sorted({m.group(1).lower() for m in NEAR[k].finditer(s)})
        if c or n:
            out[k] = {'tier': 'core' if c else 'neighbour', 'words': c + n}
    return out


def plain(k, tier):
    """The words of one tier as a plain comma list for a document."""
    return ', '.join(w.replace("\\'", "'") for w in WORDS[k][tier].split('|'))


# Held for every nature, whatever its words.
# A line about ending one's life belongs with the crisis button, not in a gift.
CRISIS = re.compile(r"(?i)\b(suicid\w*|kill myself|end my life|want to die|don't want to live|do not want to live|not want to be alive)\b")
# A grief "loss" that is not a loss anyone mourns.
NOT_MOURNED = re.compile(r"(?i)\bloss(es)? of (my |the )?(power|control|strength|energy|vitality|face|time|focus|momentum|nerve|confidence|self|identity|freedom|composure)\b")
# Speaks to one sex, or to sex. The gift goes to anyone, on a first visit.
ONE_SEX = re.compile(r"(?i)\b(a man|manhood|as a man|being a man|masculin\w*|feminin\w*|erect\w*|ejaculat\w*|cum|semen|penis|vagina\w*|sexual\w*|sex drive|orgasm\w*|arous\w*|libido|impoten\w*|womb|testic\w*|prostate)\b")
THIRD = re.compile(r"(?i)\b(she|her|hers|he|him|his|my ex|ex's)\b")
SECOND = re.compile(r"(?i)\b(letting go|let it go|let go|want to go|going to go|wouldn't go)\b")


def negated(k, s):
    """The state turned around: "not tired", "not sad", "never hopeless"."""
    s = s.replace('\u2019', "'")
    w = WORDS[k]['core'] + '|' + WORDS[k]['neighbour']
    return re.search(r"(?i)\b(not|never|no longer)( being| feeling| be| feel)? (%s)\b" % w, s) is not None
