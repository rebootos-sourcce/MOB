/* ============================================================
   THE 7 REAL ICPs, as read directly from Google Drive.

   Source A: 01_IDENTITY_PROFILE.md (Migration File 01 of 08), the "ICP PANEL
   (7 ICPs)" table. Fields: Type, Key Need, Trigger, Kill. This table is the
   ONLY per-ICP content in that document -- no demographics, no
   psychographics, no intake-axis mapping. That is thinner than the task
   description implied ("every real trait/demographic/psychographic field"),
   and is flagged in the results report.

   Source B: MOB_Master_Reference_May2026.md, "ICP GRADES -- CURRENT (May 6
   2026)" section, which is where the only demographic field (age) and an
   independent, LLM-graded completeness score (0.91, 0.89, ...) actually
   live. That grade is a DIFFERENT number from 07_PREPRO_ROADMAP's
   Current%/Target% table (e.g. Marcus 0.91 here vs 55% there) -- two
   different review passes, not a contradiction to resolve, both carried
   here for traceability. This generator uses 07_PREPRO_ROADMAP's
   Current%/Target% as the rubric this simulation reports against, because
   that is the one the task names and the one gating the real sprint
   milestone ("Full ICP panel test: all 7 ICPs at 80%+").

   Source C: 07_PREPRO_ROADMAP.md, "ICP TARGET SCORES FOR MVT ENTRY" table.
   currentPct / targetPct below are read verbatim from it.

   Everything past this point in each entry (mbtiPool, axis bias, journal
   templates) is this generator's OWN grounded-but-invented modeling layer,
   built FROM these real fields, not a guess disconnected from them. Each
   choice is explained inline so it is auditable against the real text it
   is derived from, and never dressed up as something Drive stated. */

const ICPS = [
 {
  id: 'marcus', name: 'Marcus Webb', type: 'Creative Director',
  keyNeed: 'Visible architecture', trigger: 'Bloom animation', kill: 'Mechanism invisible',
  age: 44, currentPct: 55, targetPct: 80,
  /* Creative Director, needs to SEE the mechanism work -- intuitive/visual,
     idea-oriented types over purely linear ones. */
  mbtiPool: ['ENFP', 'INFP', 'ENTP', 'INFJ'],
  /* kill = "mechanism invisible" maps most directly onto the laws of
     perceptual clarity: Truth (seeing it), Awareness, Transparency. Biased
     up modestly, biased down on these specifically to make the kill
     condition a real, checkable pressure point in the synthetic cohort. */
  lawBiasDown: ['Truth', 'Awareness', 'Transparency'],
  lawBiasUp: [],
  /* axisBias: which of the 9 real child-fetter charges (seed.js CHARGES)
     this ICP's Kill condition loads hardest, as MY OWN explicit modeling
     choice grounded in the Drive Kill/Key Need text, stated plainly here
     rather than left as a silent default. Applied on top of the MBTI
     seed, with a per-profile severity draw (generate.js), so the cohort
     carries a real, varied distribution of how hard this lands rather
     than a single uniform bump. Without this, the MBTI seed alone tops
     out around 4-5/10 charge and essentially never crosses the engine's
     own complex/hyper-complex naming thresholds (sq >= 3.7-4), which
     would starve the whole canon-content-gap question of real volume to
     measure against. */
  axisBias: ['Apathy', 'Disgust'],
  journal: [
   'I keep looking for the mechanism under this and I cannot see it move.',
   'The bloom animation is the only part that makes the structure feel real to me.',
   'I built the thing today and could not tell you why the pieces connect.',
   'I was proud of the work and then could not show anyone how it works underneath.',
   'I wanted to see the gears turn and instead I got a result with no visible cause.'
  ]
 },
 {
  id: 'sofia', name: 'Sofia Vasquez', type: 'Somatic Practitioner',
  keyNeed: 'Session-usable tools', trigger: 'Anatomical precision', kill: 'No practitioner mode',
  age: 38, currentPct: 76, targetPct: 85,
  /* Practitioner, structured and other-facing, precision-minded. */
  mbtiPool: ['ISFJ', 'ESFJ', 'INFJ', 'ISTJ'],
  /* kill = "no practitioner mode" reads as Duty/Responsibility (the clinical
     obligation to a client) and Accountability (naming it out loud). */
  lawBiasDown: ['Duty', 'Responsibility', 'Accountability'],
  lawBiasUp: ['Presence', 'Compassion'],
    axisBias: ['Shame', 'Anger'],
  journal: [
   'A client asked where this address actually sits and I had no practitioner view to show her.',
   'The anatomical precision is what my clients trust, and I needed more of it today.',
   'I ran the session from memory because there is no mode built for someone holding the tool.',
   'I want session-usable, not just self-usable, and today it was only the second.',
   'I pointed at my own chest to show her the plexus because the screen would not.'
  ]
 },
 {
  id: 'angela', name: 'Angela Tomás', type: 'Contemplative Seeker',
  keyNeed: 'Contemplative depth', trigger: 'Ancestral language', kill: 'Clinical register',
  age: 51, currentPct: 48, targetPct: 80,
  mbtiPool: ['INFJ', 'INFP', 'ISFP', 'INTJ'],
  /* kill = "clinical register" reads as Reverence and Nature (the two most
     contemplative-register laws) and Beauty. */
  lawBiasDown: ['Reverence', 'Nature', 'Aesthetic Beauty'],
  lawBiasUp: [],
    axisBias: ['Disgust', 'Sad'],
  journal: [
   'The language turned clinical again right when I needed it to stay ancestral.',
   'I wanted depth and the screen gave me a diagnosis instead.',
   'Something in me recognized the pattern before the words did, the old way.',
   'I sat with it the way my grandmother would have, and the app called it a metric.',
   'The contemplative part of this practice keeps getting interrupted by its own vocabulary.'
  ]
 },
 {
  id: 'derek', name: 'Derek Han', type: 'High-Performer',
  keyNeed: 'Single highest-leverage move fast', trigger: 'Speed mode', kill: 'Pacer too slow',
  age: 36, currentPct: 62, targetPct: 80,
  mbtiPool: ['ENTJ', 'ESTJ', 'ENTP', 'ISTJ'],
  /* kill = "pacer too slow" reads as Courage (the gateway law, moving now)
     and Temperance's opposite pull -- biased toward fast, decisive laws. */
  lawBiasDown: ['Courage', 'Patience'],
  lawBiasUp: ['Duty', 'Accountability'],
    axisBias: ['Anger', 'Anticipation'],
  journal: [
   'I wanted the single highest-leverage move and the day gave me a slow walk instead.',
   'Speed mode is the only mode that respects how little time I actually have.',
   'I made the fast call before the app finished composing anything about it.',
   'Today cost me ten minutes I did not have on a pacer built for someone with more of them.',
   'I do not need the full picture, I need the one move that matters right now.'
  ]
 },
 {
  id: 'james', name: 'James Worthington', type: 'C-Suite',
  keyNeed: 'Physical anchor', trigger: '"OVERREACH" lands', kill: 'No somatic instruction',
  age: 57, currentPct: 44, targetPct: 80,
  mbtiPool: ['ESTJ', 'ENTJ', 'ISTJ', 'INTJ'],
  /* kill = "no somatic instruction" reads as Presence (staying in the body)
     and Nature (letting the body be what it is) biased down. */
  lawBiasDown: ['Presence', 'Nature'],
  lawBiasUp: ['Duty'],
    axisBias: ['Fear', 'Shock'],
  journal: [
   'OVERREACH landed exactly where it always does, and I had nothing physical to do about it.',
   'I needed one instruction for the body and the app gave me a paragraph for the mind.',
   'The board meeting ran long and by the end I could not find my own feet.',
   'I want a physical anchor, not another reframe I have to think my way through.',
   'My shoulders have been carrying the same board decision for three days now.'
  ]
 },
 {
  id: 'diane', name: 'Diane', type: 'Founder + Coach',
  keyNeed: 'Win state after release', trigger: 'Bloom', kill: 'No post-release landing',
  age: 43, currentPct: 72, targetPct: 85,
  mbtiPool: ['ENFJ', 'ENTJ', 'ESFJ', 'ENFP'],
  /* kill = "no post-release landing" reads as Equanimity (staying level
     after the work) and Generosity (what she gives without expecting a
     landing back) biased down. */
  lawBiasDown: ['Equanimity', 'Generosity'],
  lawBiasUp: ['Duty', 'Responsibility'],
    axisBias: ['Sad', 'Apathy'],
  journal: [
   'I released it and then there was nowhere for the win to land.',
   'The bloom happened and I just kept scrolling because nothing told me I was done.',
   'I coach other founders through exactly this gap and still hit it myself today.',
   'I want a win state, not just an absence of the thing I released.',
   'Six people I coach asked me today what happens after the release, and I had no good answer.'
  ]
 },
 {
  id: 'the1000', name: 'The 1000', type: 'Disillusioned buyers',
  keyNeed: 'Journal Negotiator detection', trigger: 'Mechanism distinctness', kill: 'Looks like affirmations',
  age: null, currentPct: 60, targetPct: 80,
  /* disillusioned, skeptical, pragmatic -- the pool leans toward the
     thinking/sensing/practical types rather than the feeling/intuitive ones
     the other six cluster around, which is itself a real point of contrast
     with the rest of the panel. */
  mbtiPool: ['ISTP', 'ISTJ', 'INTP', 'ESTP'],
  /* kill = "looks like affirmations" reads as Truth (is this actually true
     of me) and Discernment/Humility's family -- biased down hardest of all
     seven, matching their lowest Key Need confidence. */
  lawBiasDown: ['Truth', 'Humility', 'Awareness'],
  lawBiasUp: [],
    axisBias: ['Disgust', 'Anger'],
  journal: [
   'This read like another affirmation card today and I almost closed the app.',
   'I have bought six of these programs before. I was watching for the negotiator move and I think I just made it again.',
   'If this cannot tell the difference between me and a template I am done paying for it.',
   'The mechanism needs to look like a mechanism, not a mantra with a nicer font.',
   'I caught myself doing the thing it warned me about and did not love that it was right.'
  ]
 }
];

const MBTI_ALL = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
 'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];

module.exports = { ICPS, MBTI_ALL };
