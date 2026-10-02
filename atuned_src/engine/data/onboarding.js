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
