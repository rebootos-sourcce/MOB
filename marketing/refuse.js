/* ============================================================
   refuse.js

   THE LINE, AS A GATE.

   TASKS.md MS4: a psychological string pulled well and a string pulled badly
   look the same in a conversion number, and this product refuses loss
   framing on an argued basis, so the refusal has to survive the marketing
   system or the system will quietly find its way back to it.

   A refusal written as a closing paragraph is a preference. This file is the
   refusal as something that returns a verdict on a string, so a line either
   passes or it does not and something other than an opinion says which.
   tests.js runs every hook in hooks.js through it and asserts zero
   violations, and asserts that removing any one rule lets a deliberately
   written violation through.

   THE UNCOMFORTABLE PART, STATED FIRST.

   The published evidence does not say these patterns fail. Tannenbaum 2015
   in Psychological Bulletin, 127 papers and 248 samples at 27,372
   participants, finds fear appeals move attitudes, intentions and behaviour
   at a composite d of 0.27 and reports no identified circumstance in which
   they backfire. Patel 2016's loss framed arm hit 0.45 of participant days
   against 0.30 in control. These things work. So the refusal is not a claim
   that manipulation is ineffective, and anybody who argues it that way has
   picked the weaker case and will lose it.

   The refusal rests on two things instead, and both are this repository's
   own measurements.

   1. On this product, with the deduction modelled rather than only the
      uplift, the loss mechanic breaks even at a sting of 0.07 and costs
      retention above it: minus 1.9 points of the thousand person panel at a
      sting a person would actually feel, robust across five seeds. TASKS.md
      0y records it. Two earlier documents had priced the refusal as a three
      point sacrifice and had priced the wrong arm.
   2. Where it does buy something, it buys less as the honest design gets
      better. DESIGN-gamification.md section 6 measures the loss framing
      refusal at 3.0 points on a base of 19.9, against an earlier estimate of
      half again. A sixth, not a half.

   And the standing ruling underneath both, which is not a measurement and
   does not need to be: a person must be able to stop and be glad they used
   it. An instrument that reads somebody's nervous system and then uses what
   it read to make leaving expensive is a different product.

   HOST FREE. No document, no window, no fetch.
   ============================================================ */

/* ------------------------------------------------------------
   THE RULES. Each one carries what it is for and where it comes from, and
   each is a named entry so a test can remove exactly one.

   Patterns match on a lowercased, punctuation stripped copy of the line, so
   a rule cannot be evaded by a comma. They are deliberately narrow: a wide
   pattern that fires on ordinary writing gets switched off, and a gate that
   gets switched off is worth less than no gate. Where a rule cannot be
   written narrowly it is marked judgement and is checked by a person, and
   that is said here rather than implied by its absence.
   ------------------------------------------------------------ */
const RULES = [
  {
    id: 'countdown',
    why: 'Nothing in this product expires, including unaccrued allowance. A countdown on a page for an instrument that never expires is a fabrication about the product itself.',
    src: 'PANEL-ritual-1000.md section 5, refused list.',
    re: [
      /\b(offer|price|discount|access|enrol\w*|enroll\w*|doors?|spots?|places?)\s+(closes?|closing|ends?|ending|expires?|expiring)\b/,
      /\b(closes?|ends?|expires?)\s+(in|at)\s+\d/,
      /\b(\d+\s*(hours?|days?|minutes?)\s+(left|remaining|to go))\b/,
      /\bcountdown\b/, /\bdeadline\b/, /\blast chance\b/, /\bfinal call\b/,
      /\bbefore (it|this|they)('?s| is| are)? (gone|too late)\b/
    ]
  },
  {
    id: 'scarcity',
    why: 'There is no inventory. A single HTML file with no backend cannot run out, so any quantity claim is false on its face.',
    src: 'CLAUDE.md, one file with no dependencies and no network.',
    re: [
      /\bonly \d+\s+(left|remaining|spots?|places?|seats?|copies|licen[cs]es)\b/,
      /\blimited (spots?|places?|seats?|availability|edition|time)\b/,
      /\b(spots?|places?|seats?) (are )?(filling|nearly full|almost gone)\b/,
      /\bwhile (stocks?|supplies) last\b/, /\bfirst \d+ (people|to sign up)\b/
    ]
  },
  {
    id: 'testimonial',
    why: 'There are no users yet, so any user voice or user statistic is invented. A fabricated proof point is the one defect that cannot be walked back once it ships.',
    src: 'Standing. No shipped product, no user base, no data.',
    re: [
      /* THE COMMA IS STRIPPED BEFORE THIS RUNS, AND THE FIRST CUT FORGOT.

         norm() replaces punctuation with a space, so "join 40,000 people"
         arrives as "join 40 000 people" and \d[\d,]* stopped at the space.
         The deliberate breakage in hooksim.js validate() group 5 caught it on
         the first run, which is the whole reason that group exists. Digits may
         now carry the spaces the stripping left behind. */
      /\bjoin \d[\d, ]{0,12}\+? ?(people|users|members|practitioners|readers)\b/,
      /\b\d[\d, ]{0,12}\+? ?(people|users|members) (have|already)\b/,
      /\b(\d+|nine|eight|seven|six|five|four|three|two) (out of|in) (ten|10|five|5) (users|people|members)\b/,
      /\b(rated|loved|trusted) by (thousands|millions|\d)/,
      /\baverage (user|member) (sees|reports|gains)\b/
    ]
  },
  {
    id: 'medical',
    why: 'The instrument reads self report and is not qualified to diagnose or treat. The engine already holds the clinical correspondences internally and refuses to print them at the person they are about, and marketing may not undo that from outside.',
    src: 'engine/data/nodes.js, the note on HCX_LIB sub.',
    re: [
      /\b(cures?|curing|cured|treats?|treating|treatment for|heals?|healing)\s+(your\s+)?(anxiety|depression|ptsd|trauma|adhd|bipolar|burnout|insomnia|addiction)\b/,
      /\b(diagnos\w+)\b/,
      /\b(clinically proven|medically proven|fda|evidence based therapy)\b/,
      /\b(you (have|may have)|signs? (that )?you have)\s+(anxiety|depression|ptsd|adhd|bipolar|c?ptsd)\b/,
      /\b(replaces?|instead of) (therapy|medication|your doctor)\b/
    ]
  },
  {
    id: 'lossframe',
    why: 'The measured one. With the deduction modelled rather than only the uplift it costs 1.9 points of the thousand person panel at a sting a person would feel, and the deduction lands hardest on the 465 of 1000 who cannot run a release yet. A ladder that takes from somebody who cannot earn is a fine, not a game.',
    src: 'TASKS.md 0y RB1 to RB3, and DESIGN-gamification.md section 6.',
    re: [
      /\b(lose|losing|lost|forfeit\w*)\s+(your|their|the)\s+(progress|streak|points?|karma|place|reading|work|standing)\b/,
      /\bdo(n'?t| not) (lose|waste|throw away)\b/,
      /\b(fall|falling|fell) behind\b/, /\bback to (zero|square one)\b/,
      /\b(streak|progress) (resets?|resetting|will reset)\b/,
      /\bbefore it gets worse\b/, /\bit will only get worse\b/,
      /\b(what|how much) (this|it) is costing you (every|each) (day|week|year)\b/
    ]
  },
  {
    id: 'urgency',
    why: 'Restraint on urgency is not squeamishness in this category, it is counter signalling. The position is instruments. An instrument that shouts is a toy.',
    src: 'Standing position, instruments not wellness.',
    re: [
      /\b(act|sign up|start|buy|claim) (now|today|fast|immediately)\b/,
      /\b(hurry|don'?t wait|do not wait|no time to (lose|waste))\b/,
      /\b(today|this week) only\b/, /\bright now, before\b/
    ]
  },
  {
    id: 'verdict',
    why: 'The reading names an address and a load, never a character. A line that hands somebody a verdict about themselves is doing the thing the engine was specifically built not to do, and on this audience it also recruits the charge it is trying to reach.',
    src: 'engine/data/nodes.js on d against sub. lit, Dillard and Shen 2005.',
    re: [
      /\byou('?re| are) (broken|damaged|a mess|failing|the problem|your own worst)\b/,
      /\bwhat'?s wrong with you\b/,
      /\bstop (being|making excuses)\b/,
      /\byou('?ve| have) been lying to yourself\b/,
      /\bthe real reason you\b/
    ]
  },
  {
    id: 'reassurance',
    why: 'Never write a reassurance against a fear nobody has raised. It plants the fear and then answers it, which leaves the fear and spends the line.',
    src: 'Standing voice ruling.',
    re: [
      /\bdon'?t worry\b/, /\bno judg\w+\b/, /\bsafe space\b/,
      /\bthere'?s nothing to (fear|be afraid of|be ashamed of)\b/,
      /\byou'?re not alone in this\b/
    ]
  },
  {
    id: 'voice',
    why: 'The standing voice rulings, and they are rulings rather than preferences. No em dashes anywhere. The count stated to users is 112 and never 108. Sentence case, so no all caps copy. No soft wellness vocabulary.',
    src: 'CLAUDE.md, the Voice section.',
    re: [
      /—/, /–\s/, /\b108\b/,
      /\b(journey|unlock your|highest self|abundance|manifest\w*|vibrat\w+ high\w*|sacred container|hold space|divine feminine|energy healing)\b/,
      /\b[A-Z]{4,}\b/
    ],
    caseSensitive: ['/\\b[A-Z]{4,}\\b/']
  }
];

/* the two rules that cannot be written as a pattern, said rather than
   omitted. A gate that pretends to cover these is worse than one that names
   them as a person's job.

   1. A true statement arranged to imply a false one. "Every table the
      reading runs on is readable inside the product" is true. Put beside a
      claim of accuracy it has not earned, it becomes a proof of the wrong
      thing.
   2. Whether a line is addressed to a charge the person is actually
      carrying. That is what match.js and hooksim.js measure, and a line can
      pass every rule here and still be aimed at somebody it does not fit. */
const JUDGEMENT = [
  'A true statement arranged to imply an untrue one.',
  'A line aimed at a charge the person is not carrying. Measured in hooksim.js, not here.'
];

function norm(s) {
  return String(s).toLowerCase().replace(/[‘’]/g, "'").replace(/[.,;:!?()"]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

/* THE NEGATION GUARD, AND IT IS A DEFECT THIS GATE SHIPPED FOR ONE RUN.

   Five of the first fourteen findings were the gate's own bug, all of one
   kind. "It makes no claim about tissue, no diagnosis and no treatment"
   was refused by the medical rule. "The product has no streak that resets, no
   countdown and nothing that expires" was refused by the countdown rule. Both
   lines are the product refusing the thing, and the gate read the word and
   not the sentence.

   That is the same failure mode the voice gate records against its own first
   cut of the naked number check: seven findings, five of them wrong, on lines
   that were the model of the rule rather than breaches of it. A tool that
   lies is worse than no tool.

   So a match is discarded when a negator sits in the forty characters before
   it. Forty is a clause, measured against the real lines: the longest gap in
   the five false findings was "makes no claim about tissue, no diagnosis", at
   thirty one characters.

   The guard is deliberately not applied to every rule. verdict and
   reassurance are exempt, because a negation does not rescue either of them:
   "you are not broken" plants the verdict it denies and "there is nothing to
   be ashamed of" is the reassurance rule's own example. The exemption is
   named here rather than left as an absence.

   Group 5 in hooksim.js asserts that the nine deliberate breakages are still
   caught with the guard in place, so the guard cannot have quietly opened the
   gate. */
const NEGATORS = /\b(no|not|never|nothing|none|without|neither|nor|cannot|refus\w*|declin\w*|free of|absent|does not|do not|is not|are not|has no|have no|makes no|will not|won't|hides? no)\b[^.?!]{0,40}$/;
const NOGUARD = ['verdict', 'reassurance'];

function guarded(subject, re, ruleId) {
  if (NOGUARD.indexOf(ruleId) >= 0) return false;
  const m = re.exec(subject);
  if (!m) return false;
  const before = subject.slice(Math.max(0, m.index - 40), m.index);
  return NEGATORS.test(before);
}

/* check one string. returns the violations, each naming the rule and the
   pattern that fired, because a gate that says no without saying which rule
   is a gate nobody can act on. */
function check(text, opt) {
  opt = opt || {};
  const skip = opt.without ? [].concat(opt.without) : [];
  const n = norm(text), raw = String(text);
  const out = [];
  RULES.forEach(r => {
    if (skip.indexOf(r.id) >= 0) return;
    r.re.forEach(re => {
      const cs = r.caseSensitive && r.caseSensitive.indexOf(String(re)) >= 0;
      const subject = cs ? raw : n;
      if (!re.test(subject)) return;
      if (guarded(subject, new RegExp(re.source, re.flags.replace('g', '')), r.id)) return;
      out.push({ rule: r.id, pattern: String(re), why: r.why });
    });
  });
  return out;
}

/* the positive requirements. A hook that breaks no rule and does not do its
   job is not a passing hook, it is an empty one. His ruled form is the
   pain, then a what if question, so the form is checked rather than trusted.

   The physical requirement is checked against the engine's own vocabulary of
   body words rather than a list of nice nouns, so a line passes by naming
   somewhere in a body and not by sounding embodied. */
const BODYWORDS = ['back', 'gut', 'chest', 'abdomen', 'pelvi', 'pelvis', 'hip', 'hips',
  'jaw', 'throat', 'neck', 'shoulder', 'nerve', 'plexus', 'spine', 'body', 'skin',
  'mouth', 'breath', 'stomach', 'sternum', 'rib', 'head', 'face', 'hand', 'taste',
  'floor', 'chiasm', 'vagus', 'lumbar', 'sacral', 'thoracic'];

/* ONE NAMED EXEMPTION, AND IT IS NAMED RATHER THAN SKIPPED QUIETLY.

   H18 is the entry served to a person whose field reads clear. It has no pain
   to speak to and nothing held anywhere in a body, which is the reading
   itself. A physical location added to it would be an invented sensation on
   the one line in the system whose entire job is to not invent one.

   It is exempt from the physical requirement only. It still has to be in his
   form and still has to pass all nine refusal rules. */
const NOBODY = { H18: 'the clear entry. Nothing is held, so there is no place to name.' };

function form(h) {
  const miss = [];
  const line = String(h.hook || '');
  if (!/what if /i.test(line)) miss.push('no what if question');
  if (!/\?/.test(line)) miss.push('no question mark');
  const n = norm(line);
  if (!NOBODY[h.id] && !BODYWORDS.some(w => n.indexOf(w) >= 0)) {
    miss.push('no physical location or sensation named');
  }
  const sentences = line.split(/(?<=[.?])\s+/).filter(s => s.trim());
  const longest = Math.max.apply(null, sentences.map(s => s.split(/\s+/).length));
  if (longest > 26) miss.push('a sentence of ' + longest + ' words, over the 26 word ceiling');
  return miss;
}

module.exports = { RULES, JUDGEMENT, check, form, norm, BODYWORDS, NOBODY, NEGATORS, NOGUARD };

if (require.main === module) {
  const arg = process.argv.slice(2).join(' ');
  if (!arg) { console.log('usage: node marketing/refuse.js "a line to check"'); process.exit(0); }
  const v = check(arg);
  if (!v.length) console.log('passes all ' + RULES.length + ' rules.');
  else v.forEach(x => console.log('REFUSED by ' + x.rule + ': ' + x.pattern));
}
