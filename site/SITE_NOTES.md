# SITE NOTES

Things found while building the site that belong to the books, not the site.

---

## 1 · The charge names are dictation fragments

The site was going to print a contents list on each book page. It could not,
because the charge names in `generator/volumes/*.json` are raw:

| Volume | What the names read |
|---|---|
| GRIEF | *Grieving*, *Grieving* again, *Suppressed and repressed sadne*, *Maximum abandonment* |
| ANXIETY | *Go be exhausted vehicle respon*, *Fear of responsibility and* |
| WORTH | *I;m letting of believing i;m l*, *30 years of training and pract* |
| VOICE | *Somebody go booty I'm insecure*, *Letting go of caring with peop* twice |

They are truncated at thirty characters, duplicated within a volume, and some
carry typos from the dictation. They are also the running heads on the printed
page, so this is not only a site problem.

**The contents list is off the site until the names are fixed.** Nothing was
invented to fill the gap.

**Next:** derive a clean charge name from the first state in each charge list,
deduplicate within the volume, and rebuild. That is a `build_volumes.py`
change, roughly one function.

---

## 2 · The foot line does not always carry an address

GRIEF pair 1 reads `throat chakra, dynamite hits · observed` on a heart band
volume. That is a live read transcript, not `node · nerve · plain location`.

The site claims the address is printed at the foot of the page. That claim is
true for most pairs and not all. **The site does not print any foot line**, so
nothing false is public, but the claim needs the data behind it before the
site goes live.

**Next:** run the foot lines through `gate.py` address check and report the
count that fail. Do not interpolate the misses.

---

## 3 · Still pending in every volume

Preface, circuit page, energy page, back cover. Four dictations per volume,
forty four in total. They print as `[PENDING. Author dictation.]`.

The site does not quote any of them.
