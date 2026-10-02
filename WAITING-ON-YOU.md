# Everything waiting on your word, front and center. 2 October.

One list, in the order I'd look at it if I were you. Each line says what I sent, and what I need back.

## Read this one first

**J0: no stranger's first story should reach the engine until there's a distress check.** Three separate reviews tonight independently landed on the same gap: the Story screen writes a reading into your field the moment you finish typing, with no chance to confirm, correct or reject it, and no check at all for whether what was typed is a crisis, not a pattern to work on. This is also exactly the thing you said "not yet" to a few hours ago (the clinician and counsel review). I have not built anything here and will not without your word, it's a safety and clinical call, not an engineering one. When you're ready: either green-light a first version so it can be reviewed with real behavior to look at, or say who should design it before any code gets written.

## Look at these first — pictures and files already in your hands

1. **The cover and landing page**: CONFIRMED, round PU. "Let's run with that attuned landing page for now."
2. **The ten-pass visual review is back**, with your standard turned into a probe: one hero, shows first, fills half the first screen, nothing beside it, informs in the Field's style. Before/after pictures sent, all five surfaces, scores attached (Story 30 to 87 projected, Avatar 43 to 90, Summary 3 to 86, Ritual 5 to 88, Accountability 24 to 90). The "after" pictures are proposed layout sketches, not a build. Say go, or say what's wrong with the direction, before anyone builds it. Separately, the archetype intake is also still queued for its own rebuild (symbol, description, question order).
3. **Headers**: sent before/after, waiting on your look. One open question inside it: should the Field, body map, avatar wheel and character page (drawings, not text) also carry a small name label, or stay bare?
4. **The onboarding video** (door, pick a start, feel, body, mirror, release, actually moving). Sent as a real video. Say yes, or what to change.
5. **The MVP gap report**, with a headline number: 25 percent of what blocks a first paying stranger is done. Say if that number or the ten risks under it feel right.
6. **Intake, stacked** (archetypes, nine feelings, six axes). Two direct questions inside it: keep the product's own twelve archetype names, or switch two of them to Hero and Orphan? And is "six action axes" the six gates I used, or something else?
7. **The Flow split** (Ritual and Accountability as two pages). You said "get rid of the left and right menu, actually, sorry" — I read that as drop the left, keep the right. Confirm, or say the right one goes too.
8. **"Patterns are stored in the body, at the nerve register of the seat."** Read it once and confirm it says what you meant.
9. **The yoga seat names need a new word.** "Eastern" is settled as the date system (Chinese), round PW, so the seat names can't use it any more. Needs a replacement word.

## Settled this round, round PW, no longer open

- Referral grant: 25 patterns.
- Tiers five through nine: do not exist. The drafted 149/249/399/699/999 numbers are dropped.
- Practitioner page shows your coherence number: yes.
- Clinician and counsel review of the safety copy: explicitly not now, your words.
- Instagram: still just "maybe," no action taken.

## Business and legal, these are steps only you can do

10. **Stripe**: the four products are made (test mode), the portal, cancel, renewal and the double-bill fix are all built and pushed to the server's own branch. What's left, only you can do: a Stripe test key in this environment's secrets so it can be proven end to end against the real Stripe rather than a fake one, and the decision to actually deploy (push that branch to `main`, which goes live) once you've looked.
11. **Google OAuth**: now a build item per round PW. Client ID and secret, steps in `API-SETUP-NOW.md`, resend if you want it again.
12. **Discord**: you asked for a feedback form that posts to a Discord channel, and a Discord connection so users can reach the community, and asked how to set it up. Short answer: both are buildable. What I need from you to wire the feedback form: a Discord webhook URL (Discord: open the server, Server Settings, Integrations, Webhooks, New Webhook, name it, pick the channel, Copy Webhook URL, paste it to me or set it as a secret, never post it in a public channel since anyone with it can post as that webhook). For the community connection: a standing invite link to your Discord server (right click the server name, Invite People, copy the link; set it to never expire if you want it permanent), which I put on a button in the app. If you don't have a Discord server yet for this, that's step zero, on your side, Discord.com, Add a Server.

## Older, standing, still open

13. Whether the first release should show the whole chain (saboteurs and up); every reviewer recommended yes.
14. The seed decay policy: fades on its own, or only moves when you move it. You said this round you don't know what it means yet; plain version: a reading has a dominant pattern type baked in at intake (the "seed"). Decay asks whether that seed's share of the reading should shrink on its own over time even if you do nothing, or stay fixed until you actually work on it.
15. The cognitive load ceiling: you said you don't know what this means. Plain version: how many choices or pieces of information one screen can show before it's too many to hold in your head at once. Needed before a few screens can be sized correctly.
16. Schema v2, domain weighting, the Matrix wiring, the depth button names: you said you don't know what schema v2 means. Plain version: the saved-data format for a person's record. V2 would add new fields; v1 records still have to load without breaking. Named as yours to call because it changes what a record promises to keep forever.
17. Achievement/points system: no TDD exists yet, you asked directly. There's an audit (`POINTS-AUDIT.md`) and a slice 0 plan (the streak fix, points never going down) but nothing specified end to end the way the Ritual Builder TDD was. Say if you want that written.

Everything else from earlier rounds has either landed or been folded into one of the items above. If something here is already decided and I missed it, name the line and I'll drop it.
