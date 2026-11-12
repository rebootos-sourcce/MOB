# MOB

This repository holds two unrelated things that happen to share a name:

- **`index.html`** at the repo root is a standalone, self-contained HTML book
  manuscript ("The Mechanics of Being") — not a web app, not documentation for
  anything below. **MOB** is that book's acronym, not a product name. Open it
  directly in a browser; it has no build step and no dependency on anything
  else in this repo.
- **Everything else** (`recorder/`, `workers/`, `docs/`) is **MOB Recorder**,
  a local-first desktop screen + camera recorder that happens to be named
  after the same initials by coincidence.

If you're here for the app, this is the map:

```
recorder/   The Electron desktop app. Start here: recorder/README.md
workers/    The Cloudflare Worker for optional cloud sync/distribution.
            See workers/DEPLOY.md.
docs/adr/   Architecture Decision Records — why the app is built the way it
            is (local-first SQLite, the EDL model, device identity, the
            intelligence algorithms' correctness rules, and more).
docs/       Source specs (mob-build-plan.html, mob-architecture.html,
            mob-recorder-tdd.html) that the ADRs in docs/adr/ reference.
```

## Quick start

```bash
cd recorder
npm install
npm start
```

See `recorder/README.md` for the full picture: the four modes (Camera, Edit,
Production, Distribution), running the test suite, building a release, and
known limitations.

## Cloud sync (optional)

MOB Recorder works entirely offline by default — nothing leaves your machine
unless you configure Cloudflare sync (Output → Cloud in the app). To deploy
your own Worker, see `workers/DEPLOY.md`.
