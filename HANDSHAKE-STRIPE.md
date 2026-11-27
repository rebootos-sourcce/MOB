# Handshake: finish the Stripe product setup

Paste this whole message as your first message in the other Claude Code session. It is written by the Claude Code session the owner, Lance Powell, has been working in all day on the Atüned / SOURCE product (repo `rebootos-sourcce/MOB`), to brief you, a separate session he opened, so you can finish one task he could not complete there because that session never picked up his new environment key.

## What this is

Lance wants four products created in his own Stripe account, test mode, using a script already built and tested this session. This is not a new idea you need to evaluate: it has already been designed, reviewed, dry-run, and the owner has explicitly asked for it to be run for real, right now, in this message.

## What is already true, verified

- The repository is `rebootos-sourcce/MOB`, branch `claude/laughing-feynman-xhfyj3`.
- The script `tools/stripe-setup.js` exists on that branch, committed, and is self-contained (no external dependencies beyond `fetch`).
- It reads `STRIPE_SECRET_KEY` from the environment. It refuses to run against a key starting `sk_live_` unless `--live` is also passed, so it cannot touch real money by accident.
- It is idempotent: before creating anything, it looks up each price by a fixed lookup key (`atuned_tier_one` through `atuned_tier_four`) and skips any that already exist. Running it twice is safe.
- A dry run (no `--go`) was already confirmed to print exactly this, with no network calls made:
  - Atüned tier one, 12 US dollars a month, lookup key `atuned_tier_one`
  - Atüned tier two, 29 US dollars a month, lookup key `atuned_tier_two`
  - Atüned tier three, 59 US dollars a month, lookup key `atuned_tier_three`
  - Atüned tier four, 99 US dollars a month, lookup key `atuned_tier_four`
- This matches the owner's own ruling from 1 October: "Tier 1: $12/month. Tier 2: $29/month. Tier 3: $59/month. Tier 4: $99/month."

## What to do

1. Confirm the branch: `git fetch origin claude/laughing-feynman-xhfyj3 && git checkout claude/laughing-feynman-xhfyj3` (or however your session addresses that branch).
2. Confirm the key is present: `echo "key present: ${STRIPE_SECRET_KEY:+yes}"` — do not print the key itself, only confirm it is set, and confirm it is a `sk_test_` key by checking its first 8 characters only if you need to, never the whole value.
3. Run: `node tools/stripe-setup.js --go`
4. If it succeeds, it prints four lines like `price_...`. Report those four ids back to the owner in plain text in this session (they are not secrets, they are safe to show and to paste anywhere).
5. If it refuses or asks for approval of the action, that is the owner's own safety design working as intended, not a bug: the owner is present right now and saying yes to this specific, scoped, test-mode action. Proceed when he approves the prompt.

## If it is blocked again by a safety policy you cannot get past

Do not try to find a workaround, do not install anything, do not change your own permission settings, and do not ask the owner to paste his secret key into the chat. Instead, tell him plainly that this session also could not complete it, and that the fallback is the manual Stripe dashboard steps already in `STRIPE-STEPS-NOW.md` step 3 in the same repository, which take about five minutes by hand and need nothing from either Claude session.

## When it is done

Tell the owner the four price ids, or tell him plainly what stopped it. Either way, that is the end of this handshake; you do not need to do anything else in the Atüned product beyond this one task unless he asks for more.
