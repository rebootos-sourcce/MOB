# What is left to do · 9 October 2026

Written after five review passes over your audit "Dev 1 to Dev 6". Every line was checked against the real code on main, not against the audit's word.

## Two words, in plain terms

- **The full sniffer aggregate.** The sniffer reads a story in layers: the nine feelings, the 33 saboteur patterns, the 21 laws, the flow, the gates, the depth, and an offer. One function, `sniffStory`, bundles all those layers into one reading with the proof for each. Today the Story tab does not use that bundle. It uses the simpler reader (words to body places). Only the Day One tutorial calls the full bundle, after the story is already saved. "Wiring the aggregate" means the Story tab shows and offers from the full bundle.
- **The Mirror on the Story page.** The Mirror is the step where the app says "here is what I read in your words" and you answer Yes, Not me, or Not quite before anything is released. It exists in the first run. It does not exist on the Story tab. So today, if you write on the Story tab, the release panel offers you places you never confirmed. Adding the Mirror there means you confirm first.

## About your merge worry

- I checked every merge on main since 20 September. None deleted or reverted source. The only deleted file was an old guard script, removed on purpose.
- Nothing from tonight's work was overwritten. Every pull request (35 to 38) is still in main.
- What is NOT on main, and is waiting on a branch:
  - **Worker (the server repo):** three routes live only on branch `claude/app-migration-decision-yx56cj` (5 October): `POST /v1/voice/synthesize` (the ElevenLabs studio voice), `POST /v1/feedback` (the app does not use it; feedback goes through a Pages function), and `GET /v1/auth/whoami`. The app still has a caller for the voice route, so if you ever switch the studio voice on, it fails until that is ported. It is off today. P2.
  - **App repo:** work saved on side branches, all known and queued: left menu and rail redesign (being built tonight), sound map (being built tonight), Field rail bars (being built tonight), sentence-case heads (being built tonight), story-redesign and onboarding mockups (waiting for your pick), identity and login, recipe engine and teachers panel (P2), the crisis detector (beta), and 13 commits on the old line (all read; the useful ones are ported).

## Live right now on atuned.world

- Main at commit `b2b7a03`: privacy words, password reset, guest record kept, the first release screen, Story controls on short laptops, account email header, sniffer fixes (denial, whose charge it is, rough-day words), the first-run journey with reload resume.
- The server (Worker): the funnel checkpoint now works from a browser. It was blocked before. Proven live by the deploy check.
- You have the packed build of `b2b7a03` as `atuned.html`.

## Finishing now (merges when its checks are green)

- CI: 16 more tests run on every change; functional, design and monitor become required to deploy (PR 39).
- Honest saves: the Story tab stops saying "Committed" when the browser refused to save; the half-typed Story draft survives a reload; two confusing lines on Your patterns say which question they mean.
- The golden gate: one test that walks the whole first visit and fails if any link is cut.
- Failing checks that were already red (the Loop screen count and some labels).
- Cosmetic packages (heads, menu, sound, rail), each only if finished and green.

## Added by you, 9 October: P0, the voice

- The browser's own voice is removed. The release is spoken by ElevenLabs or it is not spoken, and the screen says why. No fallback.
- Built and in review. It cannot speak until you add two secrets (steps below).
- No sign in is needed to hear it. The server limits each device, each network address and the whole day, so your ElevenLabs bill has a ceiling.

## Still to do before alpha is clean (P0 and P1, existing features)

1. **First visit, server side (about 2 days).** Three more faults behind the header one: two ids are the wrong type for the database (needs a one-line type change in a new migration), nothing issues the starter gift so attaching a first visit to an account always fails, and the first-visit pass expires after 15 minutes. Default taken: change those two columns to text.
2. **Three small data fixes (about 1 day).** Importing the same record twice makes three profiles with one id. A ritual day dated in the future is accepted and can earn "Ninety days". Deleting a local profile leaves one stored list behind.
3. **CI proof (about 2 days).** Keep the evidence (logs, screenshots, hashes) from each run; make the build stamp stable so tested bytes equal deployed bytes; a live check of atuned.world after every deploy; add the last 6 tests; fix the Loop screen test.
4. **Two wording fixes.** The PR 38 line "36 + 78 = 114" should say 5 sentences have both, so 109. The retired build note.

## Only you can do these (steps as if you were ten)

0. **Give the app its voice (new, P0).** Open elevenlabs.io and sign in. Click your picture (top right), then **API Keys**, create a key, copy it. Then click **Voices**, open the voice you want, copy its **Voice ID**. Now open github.com, repository `rebootos-sourcce/Reboot-OS`, **Settings**, **Secrets and variables**, **Actions**, **New repository secret**. Add one called `ELEVENLABS_API_KEY` (paste the key) and one called `ELEVENLABS_VOICE_ID` (paste the id). Then open the **Actions** tab, pick **server**, and press **Run workflow**.

1. **Turn off the second public copy and require the checks.** Open github.com and sign in. Open the repository `rebootos-sourcce/MOB`. Click **Settings** (top row, far right). In the left list click **Pages**; under "Build and deployment" click the source box and choose **None** (or **Unpublish site**). Then in the left list click **Branches**; click **Add branch ruleset** (or **Add rule**); name it `main`; target `main`; tick **Require a pull request before merging** and **Require status checks to pass**; add the check named `gates-pass`; click **Create**. Why: GitHub Pages published your repo with no checks at all, and nothing stops a red merge today.
2. **Stripe, when you are ready to take money.** Four price ids, the secret key, the webhook secret, and switch on the customer portal. Until then the app says billing is built but paid checkout is off.
3. **Your canon.** The law divisor (E43), where Joy and Surprise sit, Avoider or Innocent, and the four missing canon files. The code reports these as conflict or unread and decides nothing.
4. **Mockup picks.** Left menu options, story redesign, onboarding round 2.

## Before a public launch (after alpha)

- **Crisis check.** Parked on two branches by your word. 2 to 3 days to bring in at the beta.
- **The Story tab Mirror and the full sniffer bundle.** About 13 days in four blocks: per-address answers and a release id (4 to 5 days), the Mirror on the Story tab (4 days), the full bundle with status words (5 days), and what a verified change does to the score (needs your divisor ruling).
- **Delete my account everywhere** (Stripe, then first-visit rows, then the main database), plus an export button and a consent switch in the app (about 5 days, needs Stripe first).
- **Server hardening:** the Google store route accepts anything when its key is unset; unlimited rows are written for bad requests; the health check says OK when it is not; the crash route could carry story text. About 2 days.
- **Sync:** it is off by accident today (a missing function name), which is lucky, because turning it on would upload names and birth data. If you want sync, it needs a designed, consented version with an allow-list. Not before the privacy words and consent exist.
- **Billing launch, push notifications, Apple and Google purchases:** after your steps.
- **Points, behaviour evidence, longer summaries, avatar objects:** need your answers; defaults are written in the full plan.
- **Tense and intensity words** in the sniffer, and an accuracy test with a labelled sample from you.

## What I could not check from here

- Anything on atuned.world or the live Worker directly (this sandbox cannot reach them). I rely on the deploy checks, which read Cloudflare back and run a live preflight.
- Review 3 (privacy and sync, a long browser probe) was still running when I wrote this. Reviews 1, 2, 4 and 5 agree that sync does not run on main.
