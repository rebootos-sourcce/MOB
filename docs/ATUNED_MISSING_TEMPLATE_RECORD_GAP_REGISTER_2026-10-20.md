# ATÜNED — Missing Template / Record Gap Register

**Audit date:** 2026-10-20  
**Repository:** `rebootos-sourcce/MOB`, default branch `main`  
**Scope:** Concrete record/template attachment checks against the currently inspected implementation and generated knowledge-base records.  
**Status:** GAP REGISTER — not a closure declaration.

## Findings that require action

1. **Node template assignment is not represented in the inspected node registry.** `atuned_src/engine/data/nodes.js` contains 108 parsed somatic node records; the record shape has `i,k,b,n,a,d,c` and no template identifier/reference field. Therefore, from this registry alone, no node's narrative/inference template attachment can be verified. This is a concrete integration gap to resolve by adding or connecting the authoritative assignment registry—not by adding arbitrary prose to the node rows.
2. **The generated knowledge-base entries do not carry a template assignment field.** `proto/knowledge/src/data.js` contains 266 entries across these kinds: `seat`: 7, `axis`: 9, `node`: 112, `sab`: 39, `hcx`: 6, `mask`: 6, `arch`: 12, `dom`: 19, `term`: 56. Zero entries have a key whose name includes `template`. Because this file is generated, the correct fix is in the source registry/generator or a connected template-assignment registry, not a hand edit to generated output.
3. **One node has an unresolved category link:** `node:8 / Root_08_Unnamed` has `c: null`. It needs a source-backed category assignment or an explicit unresolved/not-applicable disposition.
4. **The inspected records cannot prove that the historical inference-template backlog is resolved.** The prior report of 338 assignments needing adjudication remains a historical baseline, not a current verified count; it must be reconciled by stable IDs against the actual assignment source.
5. **Template catalog not found by exact repository code searches in this pass.** Searches for `templateId`, `template_id`, inference-template and the previously cited `TPL-NODE` identifiers returned no code-search matches. This does not prove the catalog does not exist elsewhere; it does prove it was not located in the inspected files/search results.

## Explicit record-by-record node gaps

Every row below is missing a verifiable template reference in the inspected node registry. This is a registry-assignment gap, not a claim that its descriptive text is empty.

| Record ID | Node | Current category | Template assignment status |
|---|---|---|---|
| node:1 | \\|F\\|e\\|a\\|r\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:2 | \\|S\\|h\\|a\\|m\\|e\\| | Shame | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:3 | \\|G\\|u\\|i\\|l\\|t\\| | Shame | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:4 | \\|C\\|o\\|n\\|t\\|r\\|o\\|l\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:5 | \\|I\\|n\\|s\\|e\\|c\\|u\\|r\\|i\\|t\\|y\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:6 | \\|V\\|i\\|c\\|t\\|i\\|m\\|h\\|o\\|o\\|d\\| | Sadness | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:7 | \\|S\\|c\\|a\\|r\\|c\\|i\\|t\\|y\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:8 | \\|R\\|o\\|o\\|t\\|_\\|0\\|8\\|_\\|U\\|n\\|n\\|a\\|m\\|e\\|d\\| | NULL | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:9 | \\|P\\|o\\|s\\|s\\|e\\|s\\|s\\|i\\|o\\|n\\| | Shock | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:10 | \\|L\\|e\\|t\\|h\\|a\\|r\\|g\\|y\\| | Sadness | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:11 | \\|R\\|e\\|s\\|i\\|s\\|t\\|a\\|n\\|c\\|e\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:12 | \\|C\\|o\\|m\\|p\\|u\\|l\\|s\\|i\\|o\\|n\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:13 | \\|D\\|i\\|s\\|c\\|o\\|n\\|n\\|e\\|c\\|t\\|i\\|o\\|n\\| | Sadness | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:14 | \\|E\\|s\\|c\\|a\\|p\\|i\\|s\\|m\\| | Joy | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:15 | \\|P\\|a\\|n\\|i\\|c\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:16 | \\|C\\|o\\|l\\|l\\|a\\|p\\|s\\|e\\| | Sadness | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:17 | \\|A\\|d\\|d\\|i\\|c\\|t\\|i\\|o\\|n\\| | Joy | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:18 | \\|L\\|u\\|s\\|t\\| | Joy | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:19 | \\|E\\|n\\|v\\|y\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:20 | \\|J\\|e\\|a\\|l\\|o\\|u\\|s\\|y\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:21 | \\|C\\|o\\|-\\|D\\|e\\|p\\|e\\|n\\|d\\|e\\|n\\|c\\|y\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:22 | \\|S\\|h\\|a\\|m\\|e\\| \\|O\\|f\\| \\|D\\|e\\|s\\|i\\|r\\|e\\| | Joy | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:23 | \\|H\\|y\\|p\\|e\\|r\\|s\\|e\\|x\\|u\\|a\\|l\\|i\\|t\\|y\\| | Joy | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:24 | \\|A\\|v\\|o\\|i\\|d\\|a\\|n\\|c\\|e\\| \\|O\\|f\\| \\|P\\|l\\|e\\|a\\|s\\|u\\|r\\|e\\| | Joy | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:25 | \\|M\\|a\\|n\\|i\\|p\\|u\\|l\\|a\\|t\\|i\\|o\\|n\\| \\|T\\|h\\|r\\|o\\|u\\|g\\|h\\| \\|E\\|m\\|o\\|t\\|i\\|o\\|n\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:26 | \\|O\\|v\\|e\\|r\\|s\\|e\\|n\\|s\\|i\\|t\\|i\\|v\\|i\\|t\\|y\\| | Shock | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:27 | \\|F\\|a\\|n\\|t\\|a\\|s\\|y\\| | Joy | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:28 | \\|I\\|n\\|f\\|a\\|t\\|u\\|a\\|t\\|i\\|o\\|n\\| | Joy | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:29 | \\|O\\|b\\|s\\|e\\|s\\|s\\|i\\|o\\|n\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:30 | \\|G\\|u\\|i\\|l\\|t\\| \\|O\\|f\\| \\|P\\|l\\|e\\|a\\|s\\|u\\|r\\|e\\| | Joy | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:31 | \\|N\\|e\\|e\\|d\\| \\|F\\|o\\|r\\| \\|A\\|p\\|p\\|r\\|o\\|v\\|a\\|l\\| | Shame | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:32 | \\|E\\|x\\|c\\|e\\|s\\|s\\| \\|E\\|m\\|o\\|t\\|i\\|o\\|n\\| | Shock | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:33 | \\|P\\|r\\|i\\|d\\|e\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:34 | \\|A\\|r\\|r\\|o\\|g\\|a\\|n\\|c\\|e\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:35 | \\|C\\|o\\|m\\|p\\|e\\|t\\|i\\|t\\|i\\|o\\|n\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:36 | \\|A\\|n\\|g\\|e\\|r\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:37 | \\|J\\|u\\|d\\|g\\|m\\|e\\|n\\|t\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:38 | \\|E\\|n\\|t\\|i\\|t\\|l\\|e\\|m\\|e\\|n\\|t\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:39 | \\|R\\|e\\|b\\|e\\|l\\|l\\|i\\|o\\|n\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:40 | \\|P\\|e\\|r\\|f\\|e\\|c\\|t\\|i\\|o\\|n\\|i\\|s\\|m\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:41 | \\|F\\|o\\|r\\|c\\|e\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:42 | \\|R\\|i\\|g\\|i\\|d\\|i\\|t\\|y\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:43 | \\|R\\|e\\|s\\|e\\|n\\|t\\|m\\|e\\|n\\|t\\| \\|(\\|S\\|o\\|l\\|a\\|r\\|)\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:44 | \\|U\\|n\\|w\\|o\\|r\\|t\\|h\\|i\\|n\\|e\\|s\\|s\\| | Shame | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:45 | \\|A\\|n\\|x\\|i\\|e\\|t\\|y\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:46 | \\|S\\|e\\|l\\|f\\|-\\|J\\|u\\|d\\|g\\|m\\|e\\|n\\|t\\| \\|(\\|S\\|o\\|l\\|a\\|r\\|)\\| | Shame | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:47 | \\|N\\|e\\|e\\|d\\| \\|T\\|o\\| \\|W\\|i\\|n\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:48 | \\|S\\|u\\|p\\|e\\|r\\|i\\|o\\|r\\|i\\|t\\|y\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:49 | \\|H\\|a\\|t\\|r\\|e\\|d\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:50 | \\|R\\|e\\|s\\|e\\|n\\|t\\|m\\|e\\|n\\|t\\| \\|(\\|H\\|e\\|a\\|r\\|t\\|)\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:51 | \\|S\\|e\\|l\\|f\\|-\\|J\\|u\\|d\\|g\\|m\\|e\\|n\\|t\\| \\|(\\|H\\|e\\|a\\|r\\|t\\|)\\| | Shame | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:52 | \\|B\\|e\\|t\\|r\\|a\\|y\\|a\\|l\\| | Shock | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:53 | \\|S\\|e\\|p\\|a\\|r\\|a\\|t\\|i\\|o\\|n\\| | Sadness | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:54 | \\|M\\|a\\|r\\|t\\|y\\|r\\|d\\|o\\|m\\| | Sadness | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:55 | \\|L\\|o\\|n\\|g\\|i\\|n\\|g\\| | Sadness | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:56 | \\|C\\|l\\|o\\|s\\|e\\|d\\| \\|H\\|e\\|a\\|r\\|t\\| | Sadness | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:57 | \\|M\\|a\\|n\\|i\\|p\\|u\\|l\\|a\\|t\\|i\\|v\\|e\\| \\|K\\|i\\|n\\|d\\|n\\|e\\|s\\|s\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:58 | \\|E\\|x\\|p\\|e\\|c\\|t\\|a\\|t\\|i\\|o\\|n\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:59 | \\|B\\|l\\|a\\|m\\|e\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:60 | \\|F\\|a\\|l\\|s\\|e\\| \\|L\\|o\\|v\\|e\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:61 | \\|R\\|e\\|j\\|e\\|c\\|t\\|i\\|o\\|n\\| | Sadness | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:62 | \\|A\\|v\\|o\\|i\\|d\\|a\\|n\\|c\\|e\\| \\|O\\|f\\| \\|G\\|r\\|i\\|e\\|f\\| | Joy | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:63 | \\|N\\|e\\|e\\|d\\| \\|T\\|o\\| \\|B\\|e\\| \\|N\\|e\\|e\\|d\\|e\\|d\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:64 | \\|D\\|e\\|c\\|e\\|i\\|t\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:65 | \\|S\\|e\\|l\\|f\\|-\\|S\\|i\\|l\\|e\\|n\\|c\\|i\\|n\\|g\\| | Shame | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:66 | \\|P\\|e\\|o\\|p\\|l\\|e\\| \\|P\\|l\\|e\\|a\\|s\\|i\\|n\\|g\\| | Shame | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:67 | \\|L\\|y\\|i\\|n\\|g\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:68 | \\|I\\|n\\|t\\|e\\|r\\|r\\|u\\|p\\|t\\|i\\|n\\|g\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:69 | \\|C\\|o\\|m\\|p\\|a\\|r\\|i\\|s\\|o\\|n\\| | Shame | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:70 | \\|E\\|x\\|c\\|u\\|s\\|e\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:71 | \\|S\\|t\\|a\\|g\\|e\\| \\|P\\|e\\|r\\|f\\|o\\|r\\|m\\|i\\|n\\|g\\| | Shock | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:72 | \\|S\\|p\\|e\\|a\\|k\\|i\\|n\\|g\\| \\|T\\|o\\| \\|B\\|e\\| \\|R\\|i\\|g\\|h\\|t\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:73 | \\|M\\|a\\|n\\|i\\|c\\| \\|E\\|x\\|p\\|r\\|e\\|s\\|s\\|i\\|o\\|n\\| | Shock | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:74 | \\|T\\|a\\|l\\|k\\|i\\|n\\|g\\| \\|T\\|o\\| \\|A\\|v\\|o\\|i\\|d\\| \\|F\\|e\\|e\\|l\\|i\\|n\\|g\\| | Shock | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:75 | \\|S\\|p\\|i\\|r\\|i\\|t\\|u\\|a\\|l\\| \\|L\\|a\\|n\\|g\\|u\\|a\\|g\\|e\\| \\|T\\|o\\| \\|M\\|a\\|n\\|i\\|p\\|u\\|l\\|a\\|t\\|e\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:76 | \\|D\\|e\\|l\\|u\\|s\\|i\\|o\\|n\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:77 | \\|C\\|y\\|n\\|i\\|c\\|i\\|s\\|m\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:78 | \\|D\\|i\\|s\\|t\\|r\\|u\\|s\\|t\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:79 | \\|H\\|y\\|p\\|e\\|r\\|v\\|i\\|g\\|i\\|l\\|a\\|n\\|c\\|e\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:80 | \\|D\\|o\\|g\\|m\\|a\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:81 | \\|O\\|v\\|e\\|r\\|a\\|n\\|a\\|l\\|y\\|s\\|i\\|s\\| | Shock | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:82 | \\|P\\|r\\|o\\|j\\|e\\|c\\|t\\|i\\|o\\|n\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:83 | \\|P\\|a\\|r\\|a\\|n\\|o\\|i\\|a\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:84 | \\|D\\|i\\|s\\|t\\|o\\|r\\|t\\|i\\|o\\|n\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:85 | \\|D\\|o\\|u\\|b\\|t\\| | Fear | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:86 | \\|I\\|d\\|e\\|a\\|l\\|i\\|s\\|m\\| | Joy | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:87 | \\|L\\|a\\|c\\|k\\| \\|O\\|f\\| \\|D\\|i\\|s\\|c\\|e\\|r\\|n\\|m\\|e\\|n\\|t\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:88 | \\|D\\|o\\|u\\|b\\|t\\| \\|O\\|f\\| \\|G\\|o\\|d\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:89 | \\|H\\|u\\|b\\|r\\|i\\|s\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:90 | \\|S\\|p\\|i\\|r\\|i\\|t\\|u\\|a\\|l\\| \\|P\\|r\\|i\\|d\\|e\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:91 | \\|N\\|i\\|h\\|i\\|l\\|i\\|s\\|m\\| | Sadness | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:92 | \\|S\\|p\\|i\\|r\\|i\\|t\\|u\\|a\\|l\\| \\|E\\|s\\|c\\|a\\|p\\|i\\|s\\|m\\| | Joy | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:93 | \\|F\\|a\\|l\\|s\\|e\\| \\|H\\|u\\|m\\|i\\|l\\|i\\|t\\|y\\| | Shame | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:94 | \\|S\\|e\\|e\\|k\\|i\\|n\\|g\\| \\|V\\|a\\|l\\|i\\|d\\|a\\|t\\|i\\|o\\|n\\| | Shame | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:95 | \\|S\\|a\\|v\\|i\\|o\\|r\\| \\|C\\|o\\|m\\|p\\|l\\|e\\|x\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:96 | \\|C\\|o\\|n\\|d\\|e\\|m\\|n\\|a\\|t\\|i\\|o\\|n\\| | Anger | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:97 | \\|N\\|e\\|e\\|d\\| \\|T\\|o\\| \\|B\\|e\\| \\|S\\|p\\|e\\|c\\|i\\|a\\|l\\| | Disgust | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:98 | \\|U\\|n\\|w\\|o\\|r\\|t\\|h\\|y\\| \\|O\\|f\\| \\|G\\|o\\|d\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:99 | \\|K\\|n\\|o\\|w\\|i\\|n\\|g\\| \\|B\\|e\\|t\\|t\\|e\\|r\\| \\|T\\|h\\|a\\|n\\| \\|G\\|o\\|d\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:100 | \\|D\\|e\\|n\\|i\\|a\\|l\\| \\|O\\|f\\| \\|T\\|r\\|u\\|t\\|h\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:101 | \\|R\\|e\\|j\\|e\\|c\\|t\\|i\\|o\\|n\\| \\|O\\|f\\| \\|S\\|p\\|i\\|r\\|i\\|t\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:102 | \\|F\\|e\\|a\\|r\\| \\|O\\|f\\| \\|G\\|o\\|d\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:103 | \\|A\\|n\\|g\\|e\\|r\\| \\|A\\|t\\| \\|G\\|o\\|d\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:104 | \\|F\\|o\\|r\\|g\\|e\\|t\\|f\\|u\\|l\\|n\\|e\\|s\\|s\\| | Sadness | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:105 | \\|D\\|e\\|n\\|i\\|a\\|l\\| \\|O\\|f\\| \\|L\\|i\\|g\\|h\\|t\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:106 | \\|R\\|e\\|j\\|e\\|c\\|t\\|i\\|o\\|n\\| \\|O\\|f\\| \\|U\\|n\\|i\\|t\\|y\\| | Resentment | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:107 | \\|S\\|e\\|l\\|f\\|-\\|E\\|x\\|c\\|l\\|u\\|s\\|i\\|o\\|n\\| | Shame | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |
| node:108 | \\|E\\|n\\|d\\|l\\|e\\|s\\|s\\| \\|S\\|e\\|e\\|k\\|i\\|n\\|g\\| | Sadness | NOT REPRESENTED IN nodes.js; locate/attach authoritative template mapping |

## Generated knowledge-base entry assignment gaps

Every generated entry below lacks a template-named field in the inspected generated record. Confirm whether the record type requires a template; if yes, attach the appropriate mapping in its source/generator. If not applicable, record that disposition in the authoritative assignment registry.

| Entry ID | Kind | Name | Required next disposition |
|---|---|---|---|
| \\|s\\|e\\|a\\|t\\|:\\|R\\|o\\|o\\|t\\| | seat | \\|R\\|o\\|o\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|e\\|a\\|t\\|:\\|S\\|a\\|c\\|r\\|a\\|l\\| | seat | \\|S\\|a\\|c\\|r\\|a\\|l\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|e\\|a\\|t\\|:\\|S\\|o\\|l\\|a\\|r\\| | seat | \\|S\\|o\\|l\\|a\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|e\\|a\\|t\\|:\\|H\\|e\\|a\\|r\\|t\\| | seat | \\|H\\|e\\|a\\|r\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|e\\|a\\|t\\|:\\|T\\|h\\|r\\|o\\|a\\|t\\| | seat | \\|T\\|h\\|r\\|o\\|a\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|e\\|a\\|t\\|:\\|3\\|r\\|d\\| \\|E\\|y\\|e\\| | seat | \\|3\\|r\\|d\\| \\|E\\|y\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|e\\|a\\|t\\|:\\|C\\|r\\|o\\|w\\|n\\| | seat | \\|C\\|r\\|o\\|w\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|x\\|i\\|s\\|:\\|F\\|e\\|a\\|r\\| | axis | \\|F\\|e\\|a\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|x\\|i\\|s\\|:\\|A\\|n\\|g\\|e\\|r\\| | axis | \\|A\\|n\\|g\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|x\\|i\\|s\\|:\\|S\\|h\\|a\\|m\\|e\\| | axis | \\|S\\|h\\|a\\|m\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|x\\|i\\|s\\|:\\|D\\|i\\|s\\|g\\|u\\|s\\|t\\| | axis | \\|D\\|i\\|s\\|g\\|u\\|s\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|x\\|i\\|s\\|:\\|A\\|p\\|a\\|t\\|h\\|y\\| | axis | \\|A\\|p\\|a\\|t\\|h\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|x\\|i\\|s\\|:\\|S\\|h\\|o\\|c\\|k\\| | axis | \\|S\\|h\\|o\\|c\\|k\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|x\\|i\\|s\\|:\\|S\\|a\\|d\\| | axis | \\|S\\|a\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|x\\|i\\|s\\|:\\|S\\|u\\|r\\|p\\|r\\|i\\|s\\|e\\| | axis | \\|S\\|u\\|r\\|p\\|r\\|i\\|s\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|x\\|i\\|s\\|:\\|A\\|n\\|t\\|i\\|c\\|i\\|p\\|a\\|t\\|i\\|o\\|n\\| | axis | \\|A\\|n\\|t\\|i\\|c\\|i\\|p\\|a\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\| | node | \\|F\\|e\\|a\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|2\\| | node | \\|S\\|h\\|a\\|m\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|3\\| | node | \\|G\\|u\\|i\\|l\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|4\\| | node | \\|C\\|o\\|n\\|t\\|r\\|o\\|l\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|5\\| | node | \\|I\\|n\\|s\\|e\\|c\\|u\\|r\\|i\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|6\\| | node | \\|V\\|i\\|c\\|t\\|i\\|m\\|h\\|o\\|o\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|7\\| | node | \\|S\\|c\\|a\\|r\\|c\\|i\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|8\\| | node | \\|R\\|o\\|o\\|t\\|_\\|0\\|8\\|_\\|U\\|n\\|n\\|a\\|m\\|e\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|9\\| | node | \\|P\\|o\\|s\\|s\\|e\\|s\\|s\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|0\\| | node | \\|L\\|e\\|t\\|h\\|a\\|r\\|g\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|1\\| | node | \\|R\\|e\\|s\\|i\\|s\\|t\\|a\\|n\\|c\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|2\\| | node | \\|C\\|o\\|m\\|p\\|u\\|l\\|s\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|3\\| | node | \\|D\\|i\\|s\\|c\\|o\\|n\\|n\\|e\\|c\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|4\\| | node | \\|E\\|s\\|c\\|a\\|p\\|i\\|s\\|m\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|5\\| | node | \\|P\\|a\\|n\\|i\\|c\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|6\\| | node | \\|C\\|o\\|l\\|l\\|a\\|p\\|s\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|7\\| | node | \\|A\\|d\\|d\\|i\\|c\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|8\\| | node | \\|L\\|u\\|s\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|9\\| | node | \\|E\\|n\\|v\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|2\\|0\\| | node | \\|J\\|e\\|a\\|l\\|o\\|u\\|s\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|2\\|1\\| | node | \\|C\\|o\\|-\\|D\\|e\\|p\\|e\\|n\\|d\\|e\\|n\\|c\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|2\\|2\\| | node | \\|S\\|h\\|a\\|m\\|e\\| \\|O\\|f\\| \\|D\\|e\\|s\\|i\\|r\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|2\\|3\\| | node | \\|H\\|y\\|p\\|e\\|r\\|s\\|e\\|x\\|u\\|a\\|l\\|i\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|2\\|4\\| | node | \\|A\\|v\\|o\\|i\\|d\\|a\\|n\\|c\\|e\\| \\|O\\|f\\| \\|P\\|l\\|e\\|a\\|s\\|u\\|r\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|2\\|5\\| | node | \\|M\\|a\\|n\\|i\\|p\\|u\\|l\\|a\\|t\\|i\\|o\\|n\\| \\|T\\|h\\|r\\|o\\|u\\|g\\|h\\| \\|E\\|m\\|o\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|2\\|6\\| | node | \\|O\\|v\\|e\\|r\\|s\\|e\\|n\\|s\\|i\\|t\\|i\\|v\\|i\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|2\\|7\\| | node | \\|F\\|a\\|n\\|t\\|a\\|s\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|2\\|8\\| | node | \\|I\\|n\\|f\\|a\\|t\\|u\\|a\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|2\\|9\\| | node | \\|O\\|b\\|s\\|e\\|s\\|s\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|3\\|0\\| | node | \\|G\\|u\\|i\\|l\\|t\\| \\|O\\|f\\| \\|P\\|l\\|e\\|a\\|s\\|u\\|r\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|3\\|1\\| | node | \\|N\\|e\\|e\\|d\\| \\|F\\|o\\|r\\| \\|A\\|p\\|p\\|r\\|o\\|v\\|a\\|l\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|3\\|2\\| | node | \\|E\\|x\\|c\\|e\\|s\\|s\\| \\|E\\|m\\|o\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|3\\|3\\| | node | \\|P\\|r\\|i\\|d\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|3\\|4\\| | node | \\|A\\|r\\|r\\|o\\|g\\|a\\|n\\|c\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|3\\|5\\| | node | \\|C\\|o\\|m\\|p\\|e\\|t\\|i\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|3\\|6\\| | node | \\|A\\|n\\|g\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|3\\|7\\| | node | \\|J\\|u\\|d\\|g\\|m\\|e\\|n\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|3\\|8\\| | node | \\|E\\|n\\|t\\|i\\|t\\|l\\|e\\|m\\|e\\|n\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|3\\|9\\| | node | \\|R\\|e\\|b\\|e\\|l\\|l\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|4\\|0\\| | node | \\|P\\|e\\|r\\|f\\|e\\|c\\|t\\|i\\|o\\|n\\|i\\|s\\|m\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|4\\|1\\| | node | \\|F\\|o\\|r\\|c\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|4\\|2\\| | node | \\|R\\|i\\|g\\|i\\|d\\|i\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|4\\|3\\| | node | \\|R\\|e\\|s\\|e\\|n\\|t\\|m\\|e\\|n\\|t\\| \\|(\\|S\\|o\\|l\\|a\\|r\\|)\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|4\\|4\\| | node | \\|U\\|n\\|w\\|o\\|r\\|t\\|h\\|i\\|n\\|e\\|s\\|s\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|4\\|5\\| | node | \\|A\\|n\\|x\\|i\\|e\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|4\\|6\\| | node | \\|S\\|e\\|l\\|f\\|-\\|J\\|u\\|d\\|g\\|m\\|e\\|n\\|t\\| \\|(\\|S\\|o\\|l\\|a\\|r\\|)\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|4\\|7\\| | node | \\|N\\|e\\|e\\|d\\| \\|T\\|o\\| \\|W\\|i\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|4\\|8\\| | node | \\|S\\|u\\|p\\|e\\|r\\|i\\|o\\|r\\|i\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|4\\|9\\| | node | \\|H\\|a\\|t\\|r\\|e\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|5\\|0\\| | node | \\|R\\|e\\|s\\|e\\|n\\|t\\|m\\|e\\|n\\|t\\| \\|(\\|H\\|e\\|a\\|r\\|t\\|)\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|5\\|1\\| | node | \\|S\\|e\\|l\\|f\\|-\\|J\\|u\\|d\\|g\\|m\\|e\\|n\\|t\\| \\|(\\|H\\|e\\|a\\|r\\|t\\|)\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|5\\|2\\| | node | \\|B\\|e\\|t\\|r\\|a\\|y\\|a\\|l\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|5\\|3\\| | node | \\|S\\|e\\|p\\|a\\|r\\|a\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|5\\|4\\| | node | \\|M\\|a\\|r\\|t\\|y\\|r\\|d\\|o\\|m\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|5\\|5\\| | node | \\|L\\|o\\|n\\|g\\|i\\|n\\|g\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|5\\|6\\| | node | \\|C\\|l\\|o\\|s\\|e\\|d\\| \\|H\\|e\\|a\\|r\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|5\\|7\\| | node | \\|M\\|a\\|n\\|i\\|p\\|u\\|l\\|a\\|t\\|i\\|v\\|e\\| \\|K\\|i\\|n\\|d\\|n\\|e\\|s\\|s\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|5\\|8\\| | node | \\|E\\|x\\|p\\|e\\|c\\|t\\|a\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|5\\|9\\| | node | \\|B\\|l\\|a\\|m\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|6\\|0\\| | node | \\|F\\|a\\|l\\|s\\|e\\| \\|L\\|o\\|v\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|6\\|1\\| | node | \\|R\\|e\\|j\\|e\\|c\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|6\\|2\\| | node | \\|A\\|v\\|o\\|i\\|d\\|a\\|n\\|c\\|e\\| \\|O\\|f\\| \\|G\\|r\\|i\\|e\\|f\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|6\\|3\\| | node | \\|N\\|e\\|e\\|d\\| \\|T\\|o\\| \\|B\\|e\\| \\|N\\|e\\|e\\|d\\|e\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|6\\|4\\| | node | \\|D\\|e\\|c\\|e\\|i\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|6\\|5\\| | node | \\|S\\|e\\|l\\|f\\|-\\|S\\|i\\|l\\|e\\|n\\|c\\|i\\|n\\|g\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|6\\|6\\| | node | \\|P\\|e\\|o\\|p\\|l\\|e\\| \\|P\\|l\\|e\\|a\\|s\\|i\\|n\\|g\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|6\\|7\\| | node | \\|L\\|y\\|i\\|n\\|g\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|6\\|8\\| | node | \\|I\\|n\\|t\\|e\\|r\\|r\\|u\\|p\\|t\\|i\\|n\\|g\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|6\\|9\\| | node | \\|C\\|o\\|m\\|p\\|a\\|r\\|i\\|s\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|7\\|0\\| | node | \\|E\\|x\\|c\\|u\\|s\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|7\\|1\\| | node | \\|S\\|t\\|a\\|g\\|e\\| \\|P\\|e\\|r\\|f\\|o\\|r\\|m\\|i\\|n\\|g\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|7\\|2\\| | node | \\|S\\|p\\|e\\|a\\|k\\|i\\|n\\|g\\| \\|T\\|o\\| \\|B\\|e\\| \\|R\\|i\\|g\\|h\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|7\\|3\\| | node | \\|M\\|a\\|n\\|i\\|c\\| \\|E\\|x\\|p\\|r\\|e\\|s\\|s\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|7\\|4\\| | node | \\|T\\|a\\|l\\|k\\|i\\|n\\|g\\| \\|T\\|o\\| \\|A\\|v\\|o\\|i\\|d\\| \\|F\\|e\\|e\\|l\\|i\\|n\\|g\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|7\\|5\\| | node | \\|S\\|p\\|i\\|r\\|i\\|t\\|u\\|a\\|l\\| \\|L\\|a\\|n\\|g\\|u\\|a\\|g\\|e\\| \\|T\\|o\\| \\|M\\|a\\|n\\|i\\|p\\|u\\|l\\|a\\|t\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|7\\|6\\| | node | \\|D\\|e\\|l\\|u\\|s\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|7\\|7\\| | node | \\|C\\|y\\|n\\|i\\|c\\|i\\|s\\|m\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|7\\|8\\| | node | \\|D\\|i\\|s\\|t\\|r\\|u\\|s\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|7\\|9\\| | node | \\|H\\|y\\|p\\|e\\|r\\|v\\|i\\|g\\|i\\|l\\|a\\|n\\|c\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|8\\|0\\| | node | \\|D\\|o\\|g\\|m\\|a\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|8\\|1\\| | node | \\|O\\|v\\|e\\|r\\|a\\|n\\|a\\|l\\|y\\|s\\|i\\|s\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|8\\|2\\| | node | \\|P\\|r\\|o\\|j\\|e\\|c\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|8\\|3\\| | node | \\|P\\|a\\|r\\|a\\|n\\|o\\|i\\|a\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|8\\|4\\| | node | \\|D\\|i\\|s\\|t\\|o\\|r\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|8\\|5\\| | node | \\|D\\|o\\|u\\|b\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|8\\|6\\| | node | \\|I\\|d\\|e\\|a\\|l\\|i\\|s\\|m\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|8\\|7\\| | node | \\|L\\|a\\|c\\|k\\| \\|O\\|f\\| \\|D\\|i\\|s\\|c\\|e\\|r\\|n\\|m\\|e\\|n\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|8\\|8\\| | node | \\|D\\|o\\|u\\|b\\|t\\| \\|O\\|f\\| \\|G\\|o\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|8\\|9\\| | node | \\|H\\|u\\|b\\|r\\|i\\|s\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|9\\|0\\| | node | \\|S\\|p\\|i\\|r\\|i\\|t\\|u\\|a\\|l\\| \\|P\\|r\\|i\\|d\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|9\\|1\\| | node | \\|N\\|i\\|h\\|i\\|l\\|i\\|s\\|m\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|9\\|2\\| | node | \\|S\\|p\\|i\\|r\\|i\\|t\\|u\\|a\\|l\\| \\|E\\|s\\|c\\|a\\|p\\|i\\|s\\|m\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|9\\|3\\| | node | \\|F\\|a\\|l\\|s\\|e\\| \\|H\\|u\\|m\\|i\\|l\\|i\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|9\\|4\\| | node | \\|S\\|e\\|e\\|k\\|i\\|n\\|g\\| \\|V\\|a\\|l\\|i\\|d\\|a\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|9\\|5\\| | node | \\|S\\|a\\|v\\|i\\|o\\|r\\| \\|C\\|o\\|m\\|p\\|l\\|e\\|x\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|9\\|6\\| | node | \\|C\\|o\\|n\\|d\\|e\\|m\\|n\\|a\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|9\\|7\\| | node | \\|N\\|e\\|e\\|d\\| \\|T\\|o\\| \\|B\\|e\\| \\|S\\|p\\|e\\|c\\|i\\|a\\|l\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|9\\|8\\| | node | \\|U\\|n\\|w\\|o\\|r\\|t\\|h\\|y\\| \\|O\\|f\\| \\|G\\|o\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|9\\|9\\| | node | \\|K\\|n\\|o\\|w\\|i\\|n\\|g\\| \\|B\\|e\\|t\\|t\\|e\\|r\\| \\|T\\|h\\|a\\|n\\| \\|G\\|o\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|0\\|0\\| | node | \\|D\\|e\\|n\\|i\\|a\\|l\\| \\|O\\|f\\| \\|T\\|r\\|u\\|t\\|h\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|0\\|1\\| | node | \\|R\\|e\\|j\\|e\\|c\\|t\\|i\\|o\\|n\\| \\|O\\|f\\| \\|S\\|p\\|i\\|r\\|i\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|0\\|2\\| | node | \\|F\\|e\\|a\\|r\\| \\|O\\|f\\| \\|G\\|o\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|0\\|3\\| | node | \\|A\\|n\\|g\\|e\\|r\\| \\|A\\|t\\| \\|G\\|o\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|0\\|4\\| | node | \\|F\\|o\\|r\\|g\\|e\\|t\\|f\\|u\\|l\\|n\\|e\\|s\\|s\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|0\\|5\\| | node | \\|D\\|e\\|n\\|i\\|a\\|l\\| \\|O\\|f\\| \\|L\\|i\\|g\\|h\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|0\\|6\\| | node | \\|R\\|e\\|j\\|e\\|c\\|t\\|i\\|o\\|n\\| \\|O\\|f\\| \\|U\\|n\\|i\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|0\\|7\\| | node | \\|S\\|e\\|l\\|f\\|-\\|E\\|x\\|c\\|l\\|u\\|s\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|0\\|8\\| | node | \\|E\\|n\\|d\\|l\\|e\\|s\\|s\\| \\|S\\|e\\|e\\|k\\|i\\|n\\|g\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|0\\|9\\| | node | \\|S\\|o\\|l\\| \\|S\\|t\\|a\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|1\\|0\\| | node | \\|S\\|t\\|e\\|l\\|l\\|a\\|r\\| \\|G\\|a\\|t\\|e\\|w\\|a\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|1\\|1\\| | node | \\|E\\|a\\|r\\|t\\|h\\| \\|S\\|t\\|a\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|n\\|o\\|d\\|e\\|:\\|1\\|1\\|2\\| | node | \\|G\\|a\\|i\\|a\\| \\|G\\|a\\|t\\|e\\|w\\|a\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|C\\|o\\|n\\|t\\|r\\|o\\|l\\|l\\|e\\|r\\| | sab | \\|C\\|o\\|n\\|t\\|r\\|o\\|l\\|l\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|V\\|i\\|c\\|t\\|i\\|m\\| | sab | \\|V\\|i\\|c\\|t\\|i\\|m\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|P\\|e\\|r\\|f\\|e\\|c\\|t\\|i\\|o\\|n\\|i\\|s\\|t\\| | sab | \\|P\\|e\\|r\\|f\\|e\\|c\\|t\\|i\\|o\\|n\\|i\\|s\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|P\\|l\\|e\\|a\\|s\\|e\\|r\\| | sab | \\|P\\|l\\|e\\|a\\|s\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|H\\|y\\|p\\|e\\|r\\|-\\|A\\|c\\|h\\|i\\|e\\|v\\|e\\|r\\| | sab | \\|H\\|y\\|p\\|e\\|r\\|-\\|A\\|c\\|h\\|i\\|e\\|v\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|H\\|y\\|p\\|e\\|r\\|-\\|V\\|i\\|g\\|i\\|l\\|a\\|n\\|t\\| | sab | \\|H\\|y\\|p\\|e\\|r\\|-\\|V\\|i\\|g\\|i\\|l\\|a\\|n\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|J\\|u\\|d\\|g\\|e\\| | sab | \\|J\\|u\\|d\\|g\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|A\\|v\\|o\\|i\\|d\\|e\\|r\\| | sab | \\|A\\|v\\|o\\|i\\|d\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|W\\|o\\|r\\|r\\|y\\|w\\|a\\|r\\|t\\| | sab | \\|W\\|o\\|r\\|r\\|y\\|w\\|a\\|r\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|L\\|o\\|n\\|e\\|r\\| | sab | \\|L\\|o\\|n\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|N\\|i\\|h\\|i\\|l\\|i\\|s\\|t\\| | sab | \\|N\\|i\\|h\\|i\\|l\\|i\\|s\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|A\\|g\\|g\\|r\\|e\\|s\\|s\\|o\\|r\\| | sab | \\|A\\|g\\|g\\|r\\|e\\|s\\|s\\|o\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|I\\|m\\|p\\|o\\|s\\|t\\|e\\|r\\| | sab | \\|I\\|m\\|p\\|o\\|s\\|t\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|S\\|u\\|p\\|e\\|r\\|i\\|o\\|r\\| | sab | \\|S\\|u\\|p\\|e\\|r\\|i\\|o\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|R\\|o\\|o\\|t\\| \\|F\\|l\\|i\\|n\\|c\\|h\\|e\\|r\\| | sab | \\|R\\|o\\|o\\|t\\| \\|F\\|l\\|i\\|n\\|c\\|h\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|R\\|o\\|o\\|t\\| \\|M\\|o\\|u\\|r\\|n\\|e\\|r\\| | sab | \\|R\\|o\\|o\\|t\\| \\|M\\|o\\|u\\|r\\|n\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|S\\|a\\|c\\|r\\|a\\|l\\| \\|D\\|r\\|i\\|f\\|t\\|e\\|r\\| | sab | \\|S\\|a\\|c\\|r\\|a\\|l\\| \\|D\\|r\\|i\\|f\\|t\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|S\\|a\\|c\\|r\\|a\\|l\\| \\|S\\|t\\|r\\|i\\|k\\|e\\|r\\| | sab | \\|S\\|a\\|c\\|r\\|a\\|l\\| \\|S\\|t\\|r\\|i\\|k\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|S\\|o\\|l\\|a\\|r\\| \\|S\\|t\\|r\\|i\\|k\\|e\\|r\\| | sab | \\|S\\|o\\|l\\|a\\|r\\| \\|S\\|t\\|r\\|i\\|k\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|S\\|o\\|l\\|a\\|r\\| \\|F\\|l\\|i\\|n\\|c\\|h\\|e\\|r\\| | sab | \\|S\\|o\\|l\\|a\\|r\\| \\|F\\|l\\|i\\|n\\|c\\|h\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|H\\|e\\|a\\|r\\|t\\| \\|M\\|o\\|u\\|r\\|n\\|e\\|r\\| | sab | \\|H\\|e\\|a\\|r\\|t\\| \\|M\\|o\\|u\\|r\\|n\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|H\\|e\\|a\\|r\\|t\\| \\|S\\|t\\|r\\|i\\|k\\|e\\|r\\| | sab | \\|H\\|e\\|a\\|r\\|t\\| \\|S\\|t\\|r\\|i\\|k\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|H\\|e\\|a\\|r\\|t\\| \\|R\\|e\\|c\\|o\\|i\\|l\\|e\\|r\\| | sab | \\|H\\|e\\|a\\|r\\|t\\| \\|R\\|e\\|c\\|o\\|i\\|l\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|T\\|h\\|r\\|o\\|a\\|t\\| \\|R\\|e\\|c\\|o\\|i\\|l\\|e\\|r\\| | sab | \\|T\\|h\\|r\\|o\\|a\\|t\\| \\|R\\|e\\|c\\|o\\|i\\|l\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|T\\|h\\|r\\|o\\|a\\|t\\| \\|S\\|t\\|r\\|i\\|k\\|e\\|r\\| | sab | \\|T\\|h\\|r\\|o\\|a\\|t\\| \\|S\\|t\\|r\\|i\\|k\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|T\\|h\\|r\\|o\\|a\\|t\\| \\|F\\|r\\|e\\|e\\|z\\|e\\|r\\| | sab | \\|T\\|h\\|r\\|o\\|a\\|t\\| \\|F\\|r\\|e\\|e\\|z\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|3\\|r\\|d\\| \\|E\\|y\\|e\\| \\|R\\|e\\|c\\|o\\|i\\|l\\|e\\|r\\| | sab | \\|3\\|r\\|d\\| \\|E\\|y\\|e\\| \\|R\\|e\\|c\\|o\\|i\\|l\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|3\\|r\\|d\\| \\|E\\|y\\|e\\| \\|F\\|l\\|i\\|n\\|c\\|h\\|e\\|r\\| | sab | \\|3\\|r\\|d\\| \\|E\\|y\\|e\\| \\|F\\|l\\|i\\|n\\|c\\|h\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|C\\|r\\|o\\|w\\|n\\| \\|H\\|i\\|d\\|e\\|r\\| | sab | \\|C\\|r\\|o\\|w\\|n\\| \\|H\\|i\\|d\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|C\\|r\\|o\\|w\\|n\\| \\|R\\|e\\|c\\|o\\|i\\|l\\|e\\|r\\| | sab | \\|C\\|r\\|o\\|w\\|n\\| \\|R\\|e\\|c\\|o\\|i\\|l\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|C\\|r\\|o\\|w\\|n\\| \\|S\\|t\\|r\\|i\\|k\\|e\\|r\\| | sab | \\|C\\|r\\|o\\|w\\|n\\| \\|S\\|t\\|r\\|i\\|k\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|C\\|r\\|o\\|w\\|n\\| \\|M\\|o\\|u\\|r\\|n\\|e\\|r\\| | sab | \\|C\\|r\\|o\\|w\\|n\\| \\|M\\|o\\|u\\|r\\|n\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|F\\|r\\|e\\|e\\|z\\|e\\|r\\| | sab | \\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|F\\|r\\|e\\|e\\|z\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|B\\|r\\|a\\|c\\|e\\|r\\| | sab | \\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|B\\|r\\|a\\|c\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|S\\|t\\|a\\|r\\|t\\|l\\|e\\|r\\| | sab | \\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|S\\|t\\|a\\|r\\|t\\|l\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|R\\|e\\|c\\|o\\|i\\|l\\|e\\|r\\| | sab | \\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|R\\|e\\|c\\|o\\|i\\|l\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|H\\|i\\|d\\|e\\|r\\| | sab | \\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|H\\|i\\|d\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|M\\|o\\|u\\|r\\|n\\|e\\|r\\| | sab | \\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|M\\|o\\|u\\|r\\|n\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|s\\|a\\|b\\|:\\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|D\\|r\\|i\\|f\\|t\\|e\\|r\\| | sab | \\|D\\|i\\|f\\|f\\|u\\|s\\|e\\| \\|D\\|r\\|i\\|f\\|t\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|h\\|c\\|x\\|:\\|G\\|r\\|a\\|n\\|d\\|i\\|o\\|s\\|i\\|t\\|y\\| | hcx | \\|G\\|r\\|a\\|n\\|d\\|i\\|o\\|s\\|i\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|h\\|c\\|x\\|:\\|P\\|r\\|e\\|d\\|a\\|t\\|o\\|r\\|y\\| | hcx | \\|P\\|r\\|e\\|d\\|a\\|t\\|o\\|r\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|h\\|c\\|x\\|:\\|C\\|o\\|l\\|l\\|a\\|p\\|s\\|e\\| | hcx | \\|C\\|o\\|l\\|l\\|a\\|p\\|s\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|h\\|c\\|x\\|:\\|R\\|i\\|g\\|i\\|d\\|i\\|t\\|y\\| | hcx | \\|R\\|i\\|g\\|i\\|d\\|i\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|h\\|c\\|x\\|:\\|D\\|y\\|s\\|r\\|e\\|g\\|u\\|l\\|a\\|t\\|i\\|o\\|n\\| | hcx | \\|D\\|y\\|s\\|r\\|e\\|g\\|u\\|l\\|a\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|h\\|c\\|x\\|:\\|D\\|i\\|s\\|s\\|o\\|c\\|i\\|a\\|t\\|i\\|o\\|n\\| | hcx | \\|D\\|i\\|s\\|s\\|o\\|c\\|i\\|a\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|m\\|a\\|s\\|k\\|:\\|C\\|h\\|i\\|l\\|d\\| | mask | \\|C\\|h\\|i\\|l\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|m\\|a\\|s\\|k\\|:\\|P\\|r\\|e\\|t\\|e\\|e\\|n\\| | mask | \\|P\\|r\\|e\\|t\\|e\\|e\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|m\\|a\\|s\\|k\\|:\\|T\\|e\\|e\\|n\\| | mask | \\|T\\|e\\|e\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|m\\|a\\|s\\|k\\|:\\|A\\|d\\|u\\|l\\|t\\| | mask | \\|A\\|d\\|u\\|l\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|m\\|a\\|s\\|k\\|:\\|P\\|r\\|o\\|f\\|e\\|s\\|s\\|i\\|o\\|n\\|a\\|l\\| | mask | \\|P\\|r\\|o\\|f\\|e\\|s\\|s\\|i\\|o\\|n\\|a\\|l\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|m\\|a\\|s\\|k\\|:\\|I\\|d\\|e\\|o\\|l\\|o\\|g\\|i\\|c\\|a\\|l\\| | mask | \\|I\\|d\\|e\\|o\\|l\\|o\\|g\\|i\\|c\\|a\\|l\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|r\\|c\\|h\\|:\\|W\\|a\\|r\\|r\\|i\\|o\\|r\\| | arch | \\|W\\|a\\|r\\|r\\|i\\|o\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|r\\|c\\|h\\|:\\|S\\|a\\|g\\|e\\| | arch | \\|S\\|a\\|g\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|r\\|c\\|h\\|:\\|R\\|e\\|b\\|e\\|l\\| | arch | \\|R\\|e\\|b\\|e\\|l\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|r\\|c\\|h\\|:\\|C\\|a\\|r\\|e\\|g\\|i\\|v\\|e\\|r\\| | arch | \\|C\\|a\\|r\\|e\\|g\\|i\\|v\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|r\\|c\\|h\\|:\\|C\\|r\\|e\\|a\\|t\\|o\\|r\\| | arch | \\|C\\|r\\|e\\|a\\|t\\|o\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|r\\|c\\|h\\|:\\|M\\|a\\|g\\|i\\|c\\|i\\|a\\|n\\| | arch | \\|M\\|a\\|g\\|i\\|c\\|i\\|a\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|r\\|c\\|h\\|:\\|R\\|u\\|l\\|e\\|r\\| | arch | \\|R\\|u\\|l\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|r\\|c\\|h\\|:\\|E\\|x\\|p\\|l\\|o\\|r\\|e\\|r\\| | arch | \\|E\\|x\\|p\\|l\\|o\\|r\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|r\\|c\\|h\\|:\\|L\\|o\\|v\\|e\\|r\\| | arch | \\|L\\|o\\|v\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|r\\|c\\|h\\|:\\|J\\|e\\|s\\|t\\|e\\|r\\| | arch | \\|J\\|e\\|s\\|t\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|r\\|c\\|h\\|:\\|E\\|v\\|e\\|r\\|y\\|m\\|a\\|n\\| | arch | \\|E\\|v\\|e\\|r\\|y\\|m\\|a\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|a\\|r\\|c\\|h\\|:\\|I\\|n\\|n\\|o\\|c\\|e\\|n\\|t\\| | arch | \\|I\\|n\\|n\\|o\\|c\\|e\\|n\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|K\\|n\\|o\\|w\\|l\\|e\\|d\\|g\\|e\\| | dom | \\|K\\|n\\|o\\|w\\|l\\|e\\|d\\|g\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|J\\|u\\|s\\|t\\|i\\|c\\|e\\| | dom | \\|J\\|u\\|s\\|t\\|i\\|c\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|I\\|m\\|p\\|e\\|r\\|i\\|u\\|m\\| | dom | \\|I\\|m\\|p\\|e\\|r\\|i\\|u\\|m\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|D\\|u\\|t\\|y\\| | dom | \\|D\\|u\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|F\\|a\\|t\\|e\\| | dom | \\|F\\|a\\|t\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|P\\|o\\|w\\|e\\|r\\| | dom | \\|P\\|o\\|w\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|C\\|r\\|e\\|a\\|t\\|i\\|o\\|n\\| | dom | \\|C\\|r\\|e\\|a\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|D\\|i\\|s\\|s\\|o\\|l\\|u\\|t\\|i\\|o\\|n\\| | dom | \\|D\\|i\\|s\\|s\\|o\\|l\\|u\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|D\\|e\\|s\\|c\\|e\\|n\\|t\\| | dom | \\|D\\|e\\|s\\|c\\|e\\|n\\|t\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|D\\|e\\|a\\|t\\|h\\| | dom | \\|D\\|e\\|a\\|t\\|h\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|C\\|o\\|n\\|n\\|e\\|c\\|t\\|i\\|o\\|n\\| | dom | \\|C\\|o\\|n\\|n\\|e\\|c\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|E\\|x\\|c\\|h\\|a\\|n\\|g\\|e\\| | dom | \\|E\\|x\\|c\\|h\\|a\\|n\\|g\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|R\\|e\\|s\\|t\\|o\\|r\\|a\\|t\\|i\\|o\\|n\\| | dom | \\|R\\|e\\|s\\|t\\|o\\|r\\|a\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|P\\|r\\|o\\|v\\|i\\|s\\|i\\|o\\|n\\| | dom | \\|P\\|r\\|o\\|v\\|i\\|s\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|P\\|l\\|a\\|y\\| | dom | \\|P\\|l\\|a\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|N\\|a\\|t\\|u\\|r\\|e\\| | dom | \\|N\\|a\\|t\\|u\\|r\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|T\\|r\\|i\\|c\\|k\\|s\\|t\\|e\\|r\\| | dom | \\|T\\|r\\|i\\|c\\|k\\|s\\|t\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|M\\|y\\|s\\|t\\|e\\|r\\|y\\| | dom | \\|M\\|y\\|s\\|t\\|e\\|r\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|d\\|o\\|m\\|:\\|G\\|u\\|a\\|r\\|d\\|i\\|a\\|n\\| | dom | \\|G\\|u\\|a\\|r\\|d\\|i\\|a\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|A\\|d\\|d\\|r\\|e\\|s\\|s\\| | term | \\|A\\|d\\|d\\|r\\|e\\|s\\|s\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|A\\|l\\|l\\|o\\|s\\|t\\|a\\|t\\|i\\|c\\| \\|l\\|o\\|a\\|d\\| | term | \\|A\\|l\\|l\\|o\\|s\\|t\\|a\\|t\\|i\\|c\\| \\|l\\|o\\|a\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|A\\|r\\|c\\|h\\|e\\|t\\|y\\|p\\|e\\| | term | \\|A\\|r\\|c\\|h\\|e\\|t\\|y\\|p\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|A\\|s\\|c\\|e\\|n\\|s\\|i\\|o\\|n\\| | term | \\|A\\|s\\|c\\|e\\|n\\|s\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|A\\|t\\|t\\|e\\|n\\|t\\|i\\|o\\|n\\| | term | \\|A\\|t\\|t\\|e\\|n\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|A\\|u\\|r\\|a\\| | term | \\|A\\|u\\|r\\|a\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|A\\|w\\|a\\|r\\|e\\|n\\|e\\|s\\|s\\| | term | \\|A\\|w\\|a\\|r\\|e\\|n\\|e\\|s\\|s\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|B\\|i\\|o\\|p\\|h\\|o\\|t\\|o\\|n\\| \\|f\\|i\\|e\\|l\\|d\\| | term | \\|B\\|i\\|o\\|p\\|h\\|o\\|t\\|o\\|n\\| \\|f\\|i\\|e\\|l\\|d\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|C\\|h\\|a\\|k\\|r\\|a\\| | term | \\|C\\|h\\|a\\|k\\|r\\|a\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|C\\|h\\|a\\|r\\|g\\|e\\| | term | \\|C\\|h\\|a\\|r\\|g\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|C\\|l\\|a\\|i\\|r\\| | term | \\|C\\|l\\|a\\|i\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|C\\|o\\|h\\|e\\|r\\|e\\|n\\|c\\|e\\| | term | \\|C\\|o\\|h\\|e\\|r\\|e\\|n\\|c\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|R\\|e\\|p\\|l\\|a\\|c\\|e\\|m\\|e\\|n\\|t\\| \\|s\\|t\\|a\\|t\\|e\\| | term | \\|R\\|e\\|p\\|l\\|a\\|c\\|e\\|m\\|e\\|n\\|t\\| \\|s\\|t\\|a\\|t\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|C\\|o\\|n\\|s\\|c\\|i\\|o\\|u\\|s\\|n\\|e\\|s\\|s\\| | term | \\|C\\|o\\|n\\|s\\|c\\|i\\|o\\|u\\|s\\|n\\|e\\|s\\|s\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|C\\|Q\\| | term | \\|C\\|Q\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|D\\|i\\|s\\|t\\|o\\|r\\|t\\|i\\|o\\|n\\| | term | \\|D\\|i\\|s\\|t\\|o\\|r\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|D\\|Q\\| | term | \\|D\\|Q\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|D\\|r\\|a\\|g\\| | term | \\|D\\|r\\|a\\|g\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|E\\|a\\|r\\|t\\|h\\| \\|S\\|t\\|a\\|r\\| | term | \\|E\\|a\\|r\\|t\\|h\\| \\|S\\|t\\|a\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|E\\|g\\|o\\| | term | \\|E\\|g\\|o\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|F\\|e\\|t\\|t\\|e\\|r\\| | term | \\|F\\|e\\|t\\|t\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|F\\|i\\|v\\|e\\| \\|p\\|a\\|t\\|h\\|s\\| | term | \\|F\\|i\\|v\\|e\\| \\|p\\|a\\|t\\|h\\|s\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|H\\|a\\|r\\|d\\|e\\|n\\|e\\|d\\| \\|m\\|a\\|s\\|k\\| | term | \\|H\\|a\\|r\\|d\\|e\\|n\\|e\\|d\\| \\|m\\|a\\|s\\|k\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|H\\|y\\|p\\|e\\|r\\|-\\|c\\|o\\|m\\|p\\|l\\|e\\|x\\| | term | \\|H\\|y\\|p\\|e\\|r\\|-\\|c\\|o\\|m\\|p\\|l\\|e\\|x\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|I\\|n\\|t\\|e\\|g\\|r\\|i\\|t\\|y\\| | term | \\|I\\|n\\|t\\|e\\|g\\|r\\|i\\|t\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|I\\|n\\|t\\|e\\|n\\|t\\|i\\|o\\|n\\| | term | \\|I\\|n\\|t\\|e\\|n\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|J\\|u\\|s\\|t\\|i\\|f\\|i\\|c\\|a\\|t\\|i\\|o\\|n\\| \\|m\\|e\\|c\\|h\\|a\\|n\\|i\\|c\\| | term | \\|J\\|u\\|s\\|t\\|i\\|f\\|i\\|c\\|a\\|t\\|i\\|o\\|n\\| \\|m\\|e\\|c\\|h\\|a\\|n\\|i\\|c\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|K\\|a\\|r\\|m\\|a\\| | term | \\|K\\|a\\|r\\|m\\|a\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|K\\|o\\|s\\|h\\|a\\| | term | \\|K\\|o\\|s\\|h\\|a\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|K\\|u\\|n\\|d\\|a\\|l\\|i\\|n\\|i\\| | term | \\|K\\|u\\|n\\|d\\|a\\|l\\|i\\|n\\|i\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|L\\|e\\|t\\|t\\|i\\|n\\|g\\| \\|g\\|o\\| | term | \\|L\\|e\\|t\\|t\\|i\\|n\\|g\\| \\|g\\|o\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|L\\|i\\|m\\|i\\|t\\|i\\|n\\|g\\| \\|b\\|e\\|l\\|i\\|e\\|f\\| | term | \\|L\\|i\\|m\\|i\\|t\\|i\\|n\\|g\\| \\|b\\|e\\|l\\|i\\|e\\|f\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|M\\|a\\|s\\|k\\| | term | \\|M\\|a\\|s\\|k\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|M\\|e\\|m\\|o\\|r\\|y\\| | term | \\|M\\|e\\|m\\|o\\|r\\|y\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|M\\|e\\|r\\|k\\|a\\|b\\|a\\| | term | \\|M\\|e\\|r\\|k\\|a\\|b\\|a\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|N\\|o\\|d\\|e\\| | term | \\|N\\|o\\|d\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|O\\|J\\|A\\|S\\| | term | \\|O\\|J\\|A\\|S\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|P\\|e\\|r\\|c\\|e\\|p\\|t\\|i\\|o\\|n\\| | term | \\|P\\|e\\|r\\|c\\|e\\|p\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|P\\|l\\|e\\|x\\|u\\|s\\| | term | \\|P\\|l\\|e\\|x\\|u\\|s\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|P\\|r\\|e\\|s\\|e\\|n\\|c\\|e\\| | term | \\|P\\|r\\|e\\|s\\|e\\|n\\|c\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|P\\|r\\|i\\|m\\|a\\|r\\|y\\| \\|n\\|o\\|d\\|e\\| | term | \\|P\\|r\\|i\\|m\\|a\\|r\\|y\\| \\|n\\|o\\|d\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|P\\|u\\|r\\|e\\| \\|p\\|e\\|r\\|c\\|e\\|p\\|t\\|i\\|o\\|n\\| | term | \\|P\\|u\\|r\\|e\\| \\|p\\|e\\|r\\|c\\|e\\|p\\|t\\|i\\|o\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|R\\|e\\|a\\|d\\|i\\|n\\|g\\|-\\|a\\|s\\|-\\|r\\|e\\|l\\|e\\|a\\|s\\|e\\| | term | \\|R\\|e\\|a\\|d\\|i\\|n\\|g\\|-\\|a\\|s\\|-\\|r\\|e\\|l\\|e\\|a\\|s\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|R\\|e\\|l\\|e\\|a\\|s\\|e\\| | term | \\|R\\|e\\|l\\|e\\|a\\|s\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|R\\|e\\|s\\|i\\|s\\|t\\|a\\|n\\|c\\|e\\| | term | \\|R\\|e\\|s\\|i\\|s\\|t\\|a\\|n\\|c\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|S\\|a\\|b\\|o\\|t\\|e\\|u\\|r\\| | term | \\|S\\|a\\|b\\|o\\|t\\|e\\|u\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|S\\|e\\|l\\|f\\|-\\|u\\|n\\|r\\|a\\|v\\|e\\|l\\|i\\|n\\|g\\| \\|s\\|t\\|a\\|t\\|e\\| | term | \\|S\\|e\\|l\\|f\\|-\\|u\\|n\\|r\\|a\\|v\\|e\\|l\\|i\\|n\\|g\\| \\|s\\|t\\|a\\|t\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|S\\|i\\|g\\|n\\|a\\|l\\| \\|c\\|h\\|a\\|i\\|n\\| | term | \\|S\\|i\\|g\\|n\\|a\\|l\\| \\|c\\|h\\|a\\|i\\|n\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|S\\|o\\|m\\|a\\| | term | \\|S\\|o\\|m\\|a\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|S\\|o\\|l\\| \\|S\\|t\\|a\\|r\\| | term | \\|S\\|o\\|l\\| \\|S\\|t\\|a\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|S\\|o\\|u\\|r\\|c\\|e\\| | term | \\|S\\|o\\|u\\|r\\|c\\|e\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|S\\|u\\|p\\|e\\|r\\|e\\|g\\|o\\| | term | \\|S\\|u\\|p\\|e\\|r\\|e\\|g\\|o\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|T\\|a\\|g\\| | term | \\|T\\|a\\|g\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|T\\|w\\|o\\| \\|m\\|e\\|c\\|h\\|a\\|n\\|i\\|c\\|s\\| | term | \\|T\\|w\\|o\\| \\|m\\|e\\|c\\|h\\|a\\|n\\|i\\|c\\|s\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|V\\|r\\|i\\|t\\|t\\|i\\| | term | \\|V\\|r\\|i\\|t\\|t\\|i\\| | Assign valid template or document NOT_APPLICABLE with rationale |
| \\|t\\|e\\|r\\|m\\|:\\|W\\|i\\|l\\|l\\|p\\|o\\|w\\|e\\|r\\| | term | \\|W\\|i\\|l\\|l\\|p\\|o\\|w\\|e\\|r\\| | Assign valid template or document NOT_APPLICABLE with rationale |

## Required correction sequence

1. Recover or establish the authoritative template catalog and assignment registry, using existing examples and rules; preserve canonical wording and provenance.
2. Join the complete concept/relationship inventory to template assignments by stable ID. Do not use display names as the primary key.
3. For each missing assignment, assign the correct narrative template and, where applicable, inference template; use a reasoned `NOT_APPLICABLE` only where the rules allow it.
4. Validate template required fields for substantive content, source locator, provenance, canonical/inferred status, counterevidence/limits, and explicit unresolved states.
5. Fix `node:8` category only from an authoritative source; otherwise keep it unresolved with a reason.
6. Regenerate generated knowledge-base outputs through their generator after source changes.
7. Rerun coverage checks and emit only remaining exceptions. Closure requires 100% disposition coverage and zero unexplained exceptions.

## Measurements

- Node records parsed: 108
- Node records with template reference in inspected `nodes.js`: 0 (field absent from the record shape)
- Generated knowledge-base entries inspected: 266
- Generated entries with a template-named field: 0
- Node records with null category: 1
- Empty `def` fields in generated entries: 0
- Empty `body` fields in generated entries: 246
- Template catalog / authoritative assignment registry: NOT LOCATED in this pass
- Framework closure: OPEN
