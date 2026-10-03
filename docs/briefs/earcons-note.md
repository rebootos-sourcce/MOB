# Can I do sound. Yes, with one limit that matters.

## What I can do

- Build sounds in the page with the Web Audio API: oscillators, noise, filters and gain envelopes. No files, no requests. `earcons.html` is 25 KB and holds five sounds and a breath bed.
- Write every sound as numbers another engineer can rebuild exactly. The bench prints its tables from the same object it plays.
- Measure without hearing. The bench renders each sound offline and reads its true peak and length. At the default level the release peaks at -23.3 dBFS against a designed ceiling of -18. Hover peaks at -44.4 and lasts 13 ms.
- Pair each sound with a vibration pattern. Phones that support it vibrate. Desktops do nothing.

## What I cannot do

- I cannot hear the result. Headless Chromium started the audio engine and reported it running at 44.1 kHz, but this container has no speaker and no listening test, so nothing here confirms a sound came out. A real ear has to grade it: yours and two other people's, on a laptop and a phone, the fortieth time and not the first.
- I cannot record or process real audio here. Anything built from a recording needs someone who can.

## What the product rules mean for sound

- One file, zero requests. All sound is built in the page.
- Opt in, off by default. There is no media query for reduced sound, so reduced motion is the nearest proxy.
- No reward jingles. A sound carries a state the eye would otherwise have to read.
- Only the release gets a long sound. Everything else is under a third of a second.
- Sound is never the only channel. Every sound on the bench also shows as text and a lit panel edge.
- My recommendation is no hover sound.

## What I need from you

1. When a person has not chosen yet, does sound start on or off? My recommendation is off for everyone.
2. Does the release get sound at all? It is the one place sound is part of the mechanism.
3. Should the product ever make sound on a desktop, where the speakers are shared with a room, or on phones and headphones only?
