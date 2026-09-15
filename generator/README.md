# GENERATOR · REBUILD STATE
**2026-09-15**

## Runs

```bash
python3 build_volume.py volumes/anxiety.json
SKIP_GATE=1 python3 build_volume.py volumes/anxiety.json
```

Outputs to `out/`. Chromium path is auto-detected, override with `CHROME_EXE`.
Output dir overrides with `OUT_DIR`.

## Recovered

| File | State |
|---|---|
| `build_volume.py` | **Recovered and fixed.** Paths made portable, four defects fixed. |
| `bodymap.py` | **Rebuilt.** 99 nerves, 13 regions, 3 axes, from v214 ch.36. |
| `volumes/anxiety.json` | **Structure valid, prose pending.** |
| `assets/` | Empty. Crown PNGs not recovered. Generator degrades cleanly without them. |
| `compose/` | Not rebuilt. Only needed to regenerate Claude-composed text. |

## The schema, derived from the parser

Not guessed. Read out of `build_volume.py` by what it actually indexes.

**Volume, required:** `volume` `year` `band` `field` `section` `circuit_title`
`energy_title` `energy` `affirmation` `author` `front` `pairs`

**Volume, optional:** `back_cover` `evidence` `forgiveness` `time_half` `isbn`

**front, required:** `preface` `circuit` `howto_intro` `howto_steps[]`

**pairs[9], required:** `runhead` `charge` `install` `charge_text` `install_text`
`charge_impact` `install_impact` `foot`

**pairs, optional:** `saboteur_line` `_source`

`foot` must be `node N · Nerve · plain location`. The generator splits on
` · ` and passes element [1] to `foot_reading`.

## Corrections to the handoff brief

The brief was written from memory. The parser disagrees in six places.

| Brief said | Parser says |
|---|---|
| `front.howto`, `preface_claude`, `_front_matter`, `charge_text_full`, `_claude_fills` | Never read. Provenance only, harmless to keep. |
| 7 howto steps | No fixed count. The nine-step page is canon elsewhere. |
| 31 pages | **32 pages built and verified.** |
| Keys not listed | `affirmation` `author` `evidence` `section` `year` `energy_title` `charge` `install` `charge_impact` `install_impact` `foot` are all required and were missing from the brief. |
| CONTROL band Crown `4A4C5E` | Generator has CONTROL Solar `6E4A0A`, DUTY Crown `4A4C5E`. **Conflict, needs a ruling.** |
| DUTY field `3E4257` | Generator has `4A4C5E`. **Conflict.** |

## bodymap interface

```python
foot_reading(nerve_name) -> str    # "" if unknown, build does not stop
region_of(nerve_name)   -> str
axes_of(nerve_name)     -> (lateral, sagittal, depth)
```

Three axes as ruled: left inward and receptive, right outward and active;
front conscious and in view, back subconscious and unseen; surface or deep.

Spec said 103 nerves. v214 carries 99 distinct in-body addresses after the
two struck ones are excluded. The difference is v214, not a gap.

## Four defects fixed in build_volume.py

1. `CHARGE_STEM` was six channels. Now nine, per canon. This is the bug the
   handoff brief flags, found independently in review as finding 1.2.
2. Em dash in the copyright page ISBN fallback, which reached all eleven
   volumes because canon rules no ISBN. Now a single dash.
3. The cascade gate reported `pairs*2` while testing charges only.
4. `DICTATED_EXEMPT` was defined and never read.

## What is still missing, and only Lance has it

**The prose.** Every cascade, preface, circuit page, energy page and back
cover. `volumes/anxiety.json` proves the structure but its text reads
`PENDING RECOVERY`.

Source named in the handoff brief: the original thread transcript, where the
dictations were written into JSON inside bash heredocs.

Without that text there are eleven valid, empty books.
