/* ============================================================
   THE ONBOARDING TABLES. Data only: no function here reads the
   record, and nothing here touches a host. engine/journey.js is
   what reads them.

   PORTED, NOT REBUILT, from 3869d96 on worktree-agent-ad7f4b5294abbc82c,
   and only the two rows the first release's size needs (F5 in
   REVIEW-funnel/FINAL-SPEC.md). The rest of that file, the journey
   record's version, its event list, its ceilings and the ten integrity
   questions, is the journey record (F13) and lands with it: a table
   for a record nothing stores yet is a second answer waiting to drift.
   ============================================================ */

/* THE MINI RELEASE'S SIZE, in addresses and not in lines. Ruled, round PA,
   1 October (PLAN.md, "Ruled by him, round PA"): "The mini release is 12
   lines." One address crossed with the four channels is four lines, the
   smallest run there is (RUN_MIN in plan.js), so twelve lines is three whole
   addresses. The size is one number so one edit moves it, and the twelve is
   read off it times RUN_MIN, never typed a second time. */
const ONB_MINI_ADDRS=3;
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
