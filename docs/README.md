# TULA UNIFIED · SOMATIC BOOKS OF REPROGRAMMING

**Start with `HANDSHAKE.md`.** Everything is referenced from there.

## Quick map

| Folder / file | What |
|---|---|
| `HANDSHAKE.md` | **Read first.** State, canon, rules, outstanding work. |
| `SOMATIC_*.pdf` | Eleven built volumes, interiors and covers |
| `generator/` | The build system. Five gates. |
| `plates/` | 45 scans of Lance's handwritten notebooks, with captions |
| `RUNNING_LOG.md` | Fifty outstanding items, marked L or C |
| `ANSWER_SHEET.md` | Everything waiting on Lance |
| `_archive/` | Superseded iterations |

## Build

```bash
python3 generator/build_volume.py generator/volumes/anxiety.json
SKIP_GATE=1 python3 generator/build_volume.py generator/volumes/anxiety.json
```

## Hard rules

- No em dashes, ever
- Node count is 112. 108 in-body, 4 field. Ruled v214.
- Never interpolate a somatic address
- Render and look before claiming it works
- State the MD5 on every delivery
