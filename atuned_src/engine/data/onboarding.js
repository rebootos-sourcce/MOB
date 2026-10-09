/* ============================================================
   THE ONBOARDING TABLES. Data only: no function here reads the
   record, and nothing here touches a host. engine/journey.js is
   what reads them.

   PORTED, NOT REBUILT, from 3869d96 on worktree-agent-ad7f4b5294abbc82c.
   The first two rows came across with F5 (the first release's size).
   The journey record's tables (F13) came across with the record itself,
   at the foot of this file: its version, its event list, its ceiling and
   the stations of the first run. Two parts of that file did not, and the
   reason is said once here so nobody goes looking for them:

     the ten integrity questions   they need screens of their own (slice O7)
                                   and the owner picks the ten laws from the
                                   twenty one (round PA), so a table of ten
                                   would be a second answer to an open
                                   ruling. Kept at 3869d96.
     the five channel stem         the first release's own sentence, round
                                   OX ruling 8, which belongs to the release
                                   screen and its package, not to this one.
   ============================================================ */

/* THE MINI RELEASE'S SIZE, in addresses and not in lines. Ruled, round PA,
   1 October (PLAN.md, "Ruled by him, round PA"): "The mini release is 12
   lines." One address crossed with the four channels is four lines, the
   smallest run there is (RUN_MIN in plan.js), so twelve lines is three whole
   addresses. The size is one number so one edit moves it, and the twelve is
   read off it times RUN_MIN, never typed a second time. */
const ONB_MINI_ADDRS=3;
/* HOW MANY TIMES THE MINI RELEASE SAYS EACH OF THOSE LINES, and it is once.
   F5 capped the plan at twelve lines and handed it to a release screen that
   then said every line at its own default dose of a hundred, so the run the
   card called twelve lines said twelve hundred: 81:28 at three addresses
   (REVIEW-onboarding/pass1/devops-qa.md, "Dose 1 is 12 lines, the ruled mini
   release, but it needs a typed number") and 28:02 at one, where Angela left
   (M28). Twelve lines spoken is the plan said once. ui/release.js opens a run
   handed over by the onboarding or the Day One tutorial at this dose, and
   both cards say it, so the count is this number times ONB_MINI_ADDRS times
   RUN_MIN and is typed nowhere else. */
const ONB_MINI_DOSE=1;
/* THE FOUR CHANNELS A RUN SAYS AN ADDRESS DOWN, as meter keys: side then track,
   release first and reframe after, the order the release card walks them
   (CHAN in ui/release.js, which is the host's own copy of this list because the
   card needs the words). The engine has to plan without the card, and
   tests/onboarding2.js holds the two lists equal in a real browser. */
const ONB_CHANS=['Llimit','Rlimit','Ltruth','Rtruth'];

/* THE ONBOARDING SHEET'S THREE LISTS, MOVED HERE FROM ui/onboard.js IN
   ROUND QB, word for word. obCommit writes each answer onto the story entry
   as a position in one of these lists, and engine/schema.js vEntryOb refuses
   a position that is not in it. A list that only the host could see left the
   boundary with nothing to check against, which is how ob reached the disk
   with no rule for reading it back. ui/onboard.js still draws them. */
/* THE TWELVE STARTING POINTS. REVIEW-onboarding/PROPOSAL.md calls for
   "twelve starting points as ring chips"; mockups/onboarding-v2/src/js/
   01-data.js names the twelve itself, built and reviewed in that round, and
   this is that list, unchanged, because inventing a different twelve here
   would be a second, disagreeing answer to a question that round already
   settled. The shapes of motion the mockup hung off each one are its own
   animator's reading (NOTES.md says so) and are not a claim this file
   carries forward; only the twelve names are. */
var OB_STARTS=[
 {k:'anxiety',n:'Anxiety'},{k:'anger',n:'Anger'},{k:'overwhelm',n:'Overwhelm'},
 {k:'burnout',n:'Burnout'},{k:'grief',n:'Grief'},{k:'fear',n:'Fear'},
 {k:'relationships',n:'Relationships'},{k:'pain',n:'Pain'},
 {k:'selfworth',n:'Self-worth'},{k:'purpose',n:'Purpose'},{k:'money',n:'Money'},
 {k:'other',n:'Something else'}];
/* THE SIX FEELING WORDS, the same six the mockup's FEELS carries. Neither
   set is tinted to a seat: a feeling is not one place in the body, and
   tinting it that way would be a claim this sheet has not earned. */
var OB_FEELS=[{k:'heavy',n:'Heavy'},{k:'tight',n:'Tight'},{k:'numb',n:'Numb'},
 {k:'restless',n:'Restless'},{k:'hollow',n:'Hollow'},{k:'hot',n:'Hot'}];
/* THE SEVEN BODY PLACES, one on each seat, root to crown, the engine's own
   seven bands (obFigure's own col array in ui/onboard.js, in the same order). Each is
   tinted with seatCol, because this one is an engine fact: the place really
   is that seat and nothing here is guessing. */
var OB_PLACES=[{k:'pelvis',n:'Pelvis',b:'Root'},{k:'belly',n:'Belly',b:'Sacral'},
 {k:'stomach',n:'Stomach',b:'Solar'},{k:'chest',n:'Chest',b:'Heart'},
 {k:'throat',n:'Throat',b:'Throat'},{k:'forehead',n:'Forehead',b:'3rd Eye'},
 {k:'head',n:'Head',b:'Crown'}];

/* ---------------- the journey record, F13 ---------------- */
/* THE JOURNEY RECORD'S OWN VERSION, like PRACTICE_SCHEMA_V and TRACE_V. It is
   not SCHEMA_V and moving it does not move that. */
const JOURNEY_V=1;
/* THE EVENTS OF THE ONBOARDING TDD, SECTION 46, as a closed set, lower snake
   case, in the document's order. The gate reads the list off the document
   (tests/journey.js) and holds this one equal to it, so it is never typed twice
   in a way that can drift. An event outside it is refused by name at the
   boundary, so a typo is a refusal and never a silent new kind. Not every
   event has a writer yet: the set is what a record may carry, and which of
   them this build writes is said beside each writer in ui/onboard.js. */
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
/* THE LOG'S CEILING. Over it a line is refused by name rather than evicting the
   oldest, which is obQueue's rule in engine/outbox.js and for the same reason:
   a log that forgets its beginning cannot say what a person did on the way in.
   A first run writes about fifteen lines, so five hundred is not reached by
   anybody walking the product. One number, so a ruling on it is one edit. */
const JOURNEY_LOG_MAX=500;
/* WHERE THE GIFT WAS ISSUED. The app issues it when a starting point is picked
   (TDD section 10, "immediately after selecting the starting point"). The
   funnel is the other origin the TDD names; nothing in this build writes it,
   and a record that carries it is still a good record. */
const JOURNEY_SRC=['funnel','app'];
/* THE STATIONS OF THE FIRST RUN, in order, which is where a reload puts a
   person back. The first eight are the onboarding sheet's own steps, the ones
   its rail draws (OB_NSTEPS in ui/onboard.js is read off this list, never
   typed beside it). release is the hand off to the first release, and end is
   the card after it that shows what the person made. */
const JOURNEY_WALK=['arrive','ask','settle','feel','body','story','mirror','next','release','end'];
/* THE TWO DOORS INTO THE FIRST RELEASE: the onboarding sheet, and the Day One
   tutorial (ui/tutorial.js). The walk says which, because the two plan the
   release from different lists: the sheet from the places the person said yes
   to, the tutorial from what the story read. */
const JOURNEY_DOORS=['onboarding','tutorial'];
