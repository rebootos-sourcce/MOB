# Motion brief, onboarding v2

One Field, never cut: a ring of 112 ticks round the body figure, on one canvas. Text, chips and the body morph around it. DOM motion is transform, translate and opacity only. Reduced motion gets each end state, never a faster move.

Curves: out `.22,1,.36,1`. In `.4,0,1,1`. Land `.34,1.56,.64,1`. Arc `.45,0,.55,1`. Field spring: stiffness 90, damping 8.5 (about 20 percent overshoot).

| Principle | Felt most at | Property, curve, duration, stagger |
|---|---|---|
| Squash and stretch | Tap a starting point | Chip scale 1.10 wide by 0.90 tall in 80 ms (in), back to 1 by 1 in 320 ms (land). |
| Anticipation | Before any answer | Ring scale to 0.955 in 120 ms (in), then the wave starts. |
| Staging | The mirror | One line every 900 ms. Only the line being read moves the Field. |
| Straight ahead, pose to pose | Between questions | Pose to pose: the Field's poses, 420 ms arcs (body and side 520). Straight ahead: tide and 28 motes, simulated per frame. |
| Follow through, overlapping action | The Field answering | Ticks start as the wave reaches them (550 ms outward) and overshoot on the spring. Words 70 ms apart, 560 ms at most per line. |
| Slow in, slow out | Settle | Breath 4.2 s: in 1.7, out 2.5, smoothstep, ring plus or minus 3.5 percent. Linear only on the real time dial. |
| Arcs | A pick flies to the Field | Bead 600 ms, path bent 12 percent. Words: x 260 ms arc curve, y 260 ms out. Feeling chips leave the Field the same way, 62 ms apart. |
| Secondary action | After a body tap | Seat colour reaches the ring 300 ms late. Motes leave the ring and gather round the seat as the lean settles. |
| Timing | After an answer | Space before moving on: 1.8 s (feeling), 2.0 s (body), reset by each tap. Cards dwell max(3.0, 1 + words / 2.5) s. |
| Exaggeration | The body tap | Seat ring lands at 1.35 scale. Ripple is 1.6 tick lengths high, more than true. |
| Solid drawing | Everywhere | One geometry: door ring, Field ring and release addresses are the same 112 ticks. Tap targets sit on the seat dots. The outline is drawn on the seat spacing. |
| Appeal | "That is me" | Ring pulls to 0.94 in 160 ms, then springs to about 1.05, one slow breath. The tide never loops (periods 53 to 89 s). Nothing flashes between 3 and 30 Hz. |

## What each motion is for
- Tide and breath: the Field is running, not displaying.
- Wave and ripple: the input landed, and where.
- Lean and motes: where the person said they feel it.
- Word stagger: reading order. Pose arcs: one stage, no new page.

At forty views: arrival cards skip at a tap, and the big moves follow only the person's own input.
