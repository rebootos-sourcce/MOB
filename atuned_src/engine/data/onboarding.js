/* ============================================================
   THE ONBOARDING TABLES. Data only: no function here reads the
   record, and nothing here touches a host. engine/journey.js is
   what reads them.

   Source: ATUNED-onboarding-first-experience-TDD.md, read with
   ATUNED-onboarding-REVIEW-2-systems.md (the record) and
   ATUNED-onboarding-REVIEW-3-narrative.md (the ten questions), and
   the owner's rulings of round OX, 1 October.
   ============================================================ */

/* THE FIRST RUN'S STEM, five channels, in his order. His words, round OX,
   ruling 8: "I'm releasing believing thinking feeling. Behaving and acting
   that I am." The shipped stem, C3_STEM in engine/data/cards.js, is six
   channels (believing, perceiving, thinking, behaving, acting, feeling) behind
   "letting go of", and it stays exactly as it is: whether this sentence
   replaces it everywhere is open ruling 10 in PLAN.md section H, and an open
   ruling is not settled by overwriting the shipped line while he has not
   answered. Two constants, one per ruling, so the day he answers one edit
   removes one of them. Nothing may spell this one out except through
   ONB_STEM. */
const ONB_VERB=['believing','thinking','feeling','behaving','acting'];
const ONB_STEM='I am releasing '+ONB_VERB.slice(0,-1).join(', ')+' and '
 +ONB_VERB[ONB_VERB.length-1]+' that I am ';

/* THE MINI RELEASE'S SIZE, in addresses and not in lines. The TDD asked for
   "approximately 10 relevant patterns" and one address crossed with the four
   channels is four lines, the smallest run there is (RUN_MIN in plan.js), so
   ten cannot be a whole number of addresses. Ruled in the brief for this slice
   from the owner's own answer: the mini release is twelve lines, three
   addresses. The size is one number so one edit moves it. */
const ONB_MINI_ADDRS=3;
/* THE FOUR CHANNELS A RUN SAYS AN ADDRESS DOWN, as meter keys: side then track,
   release first and reframe after, the order the release card walks them
   (CHAN in ui/release.js, which is the host's own copy of this list because the
   card needs the words). The engine has to plan without the card, and
   tests/functional.js holds the two lists equal. */
const ONB_CHANS=['Llimit','Rlimit','Ltruth','Rtruth'];

/* THE JOURNEY RECORD'S OWN VERSION, like PRACTICE_SCHEMA_V and TRACE_V. It is
   not SCHEMA_V and moving it does not move that. */
const JOURNEY_V=1;

/* THE EVENTS OF TDD SECTION 46, as a closed set, lower snake case. Review 2
   section d3 recommends the onboarding TDD's own spelling for the local log,
   because that is the contract this slice is built to, and the funnel and
   Practice documents spell theirs in upper case for a different table. The
   list is read off the document by the gate (tests/journey.js), not typed
   twice: a list typed here and again in a test is two lists that drift. An
   event outside it is refused by name at the boundary, so a typo is a
   refusal and never a silent new kind. */
const JOURNEY_EVENTS=[
 'funnel_started','ground_selected','starter_gift_issued','account_created',
 'tutorial_started','story_submitted','story_signal_generated',
 'story_signal_confirmed','story_signal_rejected','story_adjustment_submitted',
 'story_signal_updated','somatic_setup_started','first_release_started',
 'pattern_released','first_release_completed','post_release_observation',
 'integrity_assessment_started','integrity_question_answered',
 'integrity_assessment_completed','archetype_assessment_started',
 'archetype_question_answered','archetype_assessment_completed',
 'tutorial_completed','software_entered','pattern_rerun','free_practice_started',
 'referral_started','new_ground_limit_reached','tier_viewed','tier_selected',
 'payment_completed'];

/* THE LOG'S CEILING. Review 2 gap G11 asks the owner what the cap is and what
   happens at it, and he has been asked enough: it is five hundred, and over it
   is refused by name rather than evicting the oldest, which is obQueue's own
   rule in engine/outbox.js and for the same reason, a log that forgets its
   beginning cannot reconstruct a journey. A repeating event is logged once
   per run and not once per line, so five hundred is years of use, not days.
   One number, so the owner's answer is one edit. */
const JOURNEY_LOG_MAX=500;
/* the runs and the gift's extras have ceilings for the same reason: a list a
   hand edited record can grow without end is a record that cannot be loaded */
const JOURNEY_RUNS_MAX=2000;
const JOURNEY_EXTRAS_MAX=16;
/* HOW A RUN ENDED, which is a fact about the run and not about the person.
   TDD section 40 mixes this with what the person said happened and with
   whether they accepted what was proposed; Review 2 section a5 splits the
   three. Only the first is stored here. completed reached its last line, ended
   was stopped by End or Stop, closed was the card shut before it finished. */
const JOURNEY_END=['completed','ended','closed'];
/* WHERE A CLAIM CAME FROM, and where a gift was issued. The funnel and the app
   are one origin, so a device-local handoff needs no network at all (Review 2,
   question 1). account is the sign up of round OX, ruling 1. */
const JOURNEY_VIA=['local','record','file','account'];
const JOURNEY_SRC=['funnel','app'];

/* THE TEN INTEGRITY QUESTIONS, in the owner's order, round OX: Truth,
   Transparency, Unity, Humility, Compassion, Duty, Accountability, Patience,
   Temperance, Forgiveness. Ten of the twenty one laws (SI in
   engine/data/canon.js), keyed here by a lower case id the record can carry and
   the boundary can check against a closed set, and joined to the law by name.

   THEIR ANSWERS ARE EVIDENCE ONLY. Ruled, round OX, ruling 5: part of the
   starting session, and whether they write to the laws is not ruled. So they
   are recorded in journey.integrity and nothing reads them into p.laws, CQ or
   any band, and the gate asserts the compute is untouched by an answer. The day
   he rules otherwise it is one new function, and nothing stored here has to
   move.

   THE TEXT. Seven rows are Review 3's PROPOSED copy (section B.1, the question
   id in src), word for word: the moment, the ask, and the 0 end and 10 end as
   two concrete behaviours. The scale between them is the same on every
   question, "about half the time" at 5 (JOURNEY_MID). Review 3 chose a
   different ten and these three were not in it: Transparency, Unity and Duty.
   Their text is drafted here in the same shape from the funnel's own items and
   the intake's stems (engine/intake.js), so the law joins the engine and
   nothing is invented, and they carry src 'drafted' so the owner can find the
   three that are mine rather than his. Unity's moment does not use the word,
   which Review 3 holds fails the ten year old test on its own name. Direction
   is the intake's: 10 is the lawful behaviour, and the 0 end is a thing that
   happened in a body. */
const JOURNEY_MID='about half the time';
const JOURNEY_INTEGRITY=[
 {id:'truth', law:'Truth', src:'review3 Q07',
  moment:'Somebody asks for a yes. Your chest tightens, because the true answer is no.',
  ask:'How often do you say the true thing?',
  lo:'I say yes and carry it.', hi:'I say no.'},
 {id:'transparency', law:'Transparency', src:'drafted',
  moment:'Somebody close to you asks how your week really went.',
  ask:'How often do you tell them the real version?',
  lo:'I edit it before I tell it.', hi:'I tell it as it happened.'},
 {id:'unity', law:'Unity', src:'drafted',
  moment:'Somebody you know wins something you wanted.',
  ask:'How often are you glad with them while it happens?',
  lo:'It lands in my body as a loss.', hi:'I am glad with them.'},
 {id:'humility', law:'Humility', src:'review3 Q08',
  moment:'Somebody tells you something true about yourself, and it stings.',
  ask:'How often do you hear it out before you answer?',
  lo:'I go looking for what is wrong with them.', hi:'I hear it out.'},
 {id:'compassion', law:'Compassion', src:'review3 Q05',
  moment:'Somebody close to you tells you their pain.',
  ask:'How often do you feel it with them before you try to fix it?',
  lo:'I start fixing it so I do not have to feel it.', hi:'I feel it with them first.'},
 {id:'duty', law:'Duty', src:'drafted',
  moment:'You promised to do something, and nobody will ever check.',
  ask:'How often do you do it anyway?',
  lo:'I do it only while somebody is watching.', hi:'I do it, and nobody knows.'},
 {id:'accountability', law:'Accountability', src:'review3 Q04',
  moment:'You break something that was yours to look after. Somebody else is about to take the blame.',
  ask:'How often do you say it was you, out loud?',
  lo:'I let them believe it broke itself.', hi:'I say it was me.'},
 {id:'patience', law:'Patience', src:'review3 Q01',
  moment:'You are early and ready. The person you are waiting for is not.',
  ask:'How often do you wait without it leaking onto them?',
  lo:'It leaks onto them almost every time.', hi:'It almost never leaks.'},
 {id:'temperance', law:'Temperance', src:'review3 Q02',
  moment:'It is late. Nobody is watching. You have had enough.',
  ask:'How often do you stop?',
  lo:'I stop when it is gone.', hi:'I stop at enough.'},
 {id:'forgiveness', law:'Forgiveness', src:'review3 Q06',
  moment:'Somebody wronged you years ago. Nobody would know if you kept holding it.',
  ask:'How often do you put it down?',
  lo:'I forgive out loud and take it back in private.', hi:'I put it down, and it stays down.'}];
