# Everything waiting on your word, front and center. 2 October.

One list, in the order I'd look at it if I were you. Each line says what I sent, and what I need back.

## Read this one before anything else. This may still be live right now.

Short version: a real public web link, with no password on it, has been sitting open for hours tonight, and it leads to the exact unsafe thing named below (J0). I found it, I stopped it from getting any worse, but I cannot make the already-open link close. Only you can do that part.

**What happened.** This project auto publishes every push to a website address whenever the code changes, a normal thing to have turned on. What I didn't realize until I checked the actual logs by hand, not just the green checkmark, is that it was really doing it: real keys, a real upload, a real working web address handed back by Cloudflare (the company hosting it) every single time, including the exact push hours ago that turned on the "onboarding" flow, the guided first-time walkthrough a brand new person goes through. That walkthrough ends by writing whatever a person typed straight into the product's memory, with nobody checking first whether what they typed was someone in real crisis. That check (I've been calling it J0) does not exist yet anywhere in this product, which is the single thing every review tonight flagged as the most important thing not to skip.

**What I did about it.** I turned off the auto publish for this branch, so nothing more gets pushed out from tonight's work. I cannot undo the ones that already went out; taking those down needs your Cloudflare login, not mine. I do not think this is your main public website (atuned.world) itself, because of a detail in Cloudflare's own response, but I can't fully prove that from in here; my own internet access inside this session is restricted and refused to load either address directly to double check.

**What I need from you, as soon as you see this, whatever time it is.** Open dash.cloudflare.com, sign in, go to Workers and Pages, open the project named "atuned", open its Deployments tab, and either delete the recent preview deployments from tonight or (safer and faster) turn on "Cloudflare Access" for the project so nobody can open any link to it without signing in first. If you want to just confirm first rather than act blind: tell me and I'll walk you through checking exactly what's live from your own browser, since I can't check it from mine.

This is separate from, and does not replace, the J0 decision itself below. Fixing the leak stops a stranger from reaching the unsafe flow through this one link. It does not build the safety check that flow still needs.

## Then read this one

**J0: no stranger's first story should reach the engine until there's a distress check.** Three separate reviews tonight independently landed on the same gap: the Story screen writes a reading into your field the moment you finish typing, with no chance to confirm, correct or reject it, and no check at all for whether what was typed is a crisis, not a pattern to work on. This is also exactly the thing you said "not yet" to a few hours ago (the clinician and counsel review).

The third review (the final funnel spec) split this into two pieces, and that split matters: the detector itself (does this story read as a crisis, yes or no) shows nothing to anybody and changes nothing anybody sees, so I'm treating that half as ordinary engineering and building it now, same as anything else tonight. What it does when it fires, meaning the actual words shown to someone in crisis and whether that's safe without a clinician checking it first, is the part I will not build without your word. Three ways to go, costs attached to each:

- **A. Ship a plain first version of the response now,** that stops before the reading is saved, says plainly it may have misread, and shows a card with a person to call. You'd be reviewing real working behavior rather than a plan. Cost: the words go out before anyone with clinical training has checked them.
- **B. Tell me who should write those words first,** you, a clinician you pick, or someone else. Cost: the response, and the public link going live for real strangers, both wait for that person.
- **C. Keep the public link dark until a clinician has reviewed the words,** no matter how long that takes. Cost: same wait as B, but open-ended rather than tied to one person.

One more real data point, found trying to act on that plan tonight: the agent I sent to build the invisible detector was stopped mid-task by an automated content filter, specifically while writing test cases out of real crisis language (lines like "I do not want to be here anymore"). Even the harmless, shows-nothing-to-anyone half of this could not get all the way through automated building. I did not force it through. That is itself a reason to lean toward B or C rather than A: if a model cannot safely write test sentences for this, writing the real words a distressed stranger would actually see should be a person's job, not an agent's, whichever option you pick.

I will not point the public domain at this branch again until you've picked one of the three above.

## Listen to this one when you're near a speaker

**The tension-line sound, built tonight, is unheard by anyone.** A crackle on the Field's threads and the Body's cables once zoomed in, exactly what you asked for in shape (static or electricity), measured inside the product's own loudness and length caps. But a gate can measure a sound, not hear it. Whether it actually reads as static rather than a tap or a glitch is yours to judge, first thing once you're at a machine with sound.

## Look at these first — pictures and files already in your hands

1. **The cover and landing page**: CONFIRMED, round PU. "Let's run with that attuned landing page for now."
2. **The ten-pass visual review is back**, with your standard turned into a probe: one hero, shows first, fills half the first screen, nothing beside it, informs in the Field's style. Before/after pictures sent, all five surfaces, scores attached (Story 30 to 87 projected, Avatar 43 to 90, Summary 3 to 86, Ritual 5 to 88, Accountability 24 to 90). The "after" pictures are proposed layout sketches, not a build. Say go, or say what's wrong with the direction, before anyone builds it.
3. **Archetype intake, rebuilt and merged** (mark, description, question, mirrored). Pictures sent. One real tradeoff inside it: showing the mark now means the page runs three times longer than before (all 18 questions, stacked). The actual fix is showing one question at a time, a bigger change I haven't started. Say if the length is fine as is or if it's worth the bigger rebuild.
4. **Headers**: sent before/after, waiting on your look. One open question inside it: should the Field, body map, avatar wheel and character page (drawings, not text) also carry a small name label, or stay bare?
5. **The onboarding video** (door, pick a start, feel, body, mirror, release, actually moving). Sent as a real video. Say yes, or what to change.
6. **The MVP gap report**, with a headline number: 25 percent of what blocks a first paying stranger is done. Say if that number or the ten risks under it feel right.
7. **Intake, stacked** (archetypes, nine feelings, six axes). Two direct questions inside it: keep the product's own twelve archetype names, or switch two of them to Hero and Orphan? And is "six action axes" the six gates I used, or something else?
9. **"Patterns are stored in the body, at the nerve register of the seat."** Read it once and confirm it says what you meant.
10. **The yoga seat names need a new word.** "Eastern" is settled as the date system (Chinese), round PW, so the seat names can't use it any more. Needs a replacement word.
11. **Flow's three columns, built and pushed, not merged.** Ritual and Accountability are one page now (left: New, centre: Ritual, right: Accountability), per your own round QF: "Left menu will be for inputting new. Right side of the menu is for the accountability tracker." Item 8 above is answered by that and dropped. What's still open: your round QF message named the knowledge base too ("we're re-merging the knowledge base and the accountability tracker"), but the three columns you then listed only have room for two of those three things. The Knowledge page (laws, archetypes, masks, gates) was left where it is rather than guessed into one of the three slots. Pick one: (A) Knowledge stays its own page in Embody, untouched, and "re-merging" only meant Ritual and Accountability; (B) Knowledge becomes a fourth column or a tab inside Flow; (C) something else, say what. Pictures sent of the build as it stands.

## Settled this round, round PW, no longer open

- Referral grant: 25 patterns.
- Tiers five through nine: do not exist. The drafted 149/249/399/699/999 numbers are dropped.
- Practitioner page shows your coherence number: yes.
- Clinician and counsel review of the safety copy: explicitly not now, your words.
- Instagram: still just "maybe," no action taken.

## Business and legal, these are steps only you can do

11. **Stripe**: the four products are made (test mode), the portal, cancel, renewal and the double-bill fix are all built and pushed to the server's own branch. What's left, only you can do: a Stripe test key in this environment's secrets so it can be proven end to end against the real Stripe rather than a fake one, and the decision to actually deploy (push that branch to `main`, which goes live) once you've looked.
12. **Google OAuth**: now a build item per round PW. Client ID and secret, steps in `API-SETUP-NOW.md`, resend if you want it again.
13. **Discord**: you asked for a feedback form that posts to a Discord channel, and a Discord connection so users can reach the community, and asked how to set it up. Short answer: both are buildable. What I need from you to wire the feedback form: a Discord webhook URL (Discord: open the server, Server Settings, Integrations, Webhooks, New Webhook, name it, pick the channel, Copy Webhook URL, paste it to me or set it as a secret, never post it in a public channel since anyone with it can post as that webhook). For the community connection: a standing invite link to your Discord server (right click the server name, Invite People, copy the link; set it to never expire if you want it permanent), which I put on a button in the app. If you don't have a Discord server yet for this, that's step zero, on your side, Discord.com, Add a Server.

## Older, standing, still open

14. Whether the first release should show the whole chain (saboteurs and up); every reviewer recommended yes.
15. The seed decay policy: fades on its own, or only moves when you move it. You said this round you don't know what it means yet; plain version: a reading has a dominant pattern type baked in at intake (the "seed"). Decay asks whether that seed's share of the reading should shrink on its own over time even if you do nothing, or stay fixed until you actually work on it.
16. The cognitive load ceiling: you said you don't know what this means. Plain version: how many choices or pieces of information one screen can show before it's too many to hold in your head at once. Needed before a few screens can be sized correctly.
17. Schema v2, domain weighting, the Matrix wiring, the depth button names: you said you don't know what schema v2 means. Plain version: the saved-data format for a person's record. V2 would add new fields; v1 records still have to load without breaking. Named as yours to call because it changes what a record promises to keep forever.
18. Achievement/points system: done, nothing needed from you. This line used to say no TDD existed, and that was wrong: your own `ATUNED-points-achievements-unlocks-TDD-v2.md` existed and had been reviewed in `POINTS-AUDIT.md`. Round QA asked for the review, and the result is `ATUNED-points-achievements-unlocks-TDD-v3.md`: your v2 turned into a build plan against the real code and your later rulings (points only go up, sight by tier). It ends with its own check against the house rules. It asks you nothing new.

Everything else from earlier rounds has either landed or been folded into one of the items above. If something here is already decided and I missed it, name the line and I'll drop it.
