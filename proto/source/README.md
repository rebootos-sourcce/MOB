# Source AI V5 — Visual Sniffer prototype

**Live prototype source:** [source-ai-signal-v5.html](source-ai-signal-v5.html). This HTML is intentionally a **single-file prototype** and is NOT the deployed `atuned.world` application. It uses the existing ElevenLabs Source voice pilot `agent_8301m6aqwbrje4v8218ty5rz2w2b`.

**Owner goals:** compact voice orb, colored chakra language evidence, exact vocabulary vs fuzzy paraphrases, clause/phrase highlights, seven communication channels, intensity words, child emotion mentions, action/intention gaps, and family-to-self recognition with correction awareness. The graph and CQDQ must be canonical, not invented by a separate UI scanner.

**Verified locally:** inline JavaScript `node --check`; 34/34 headless Chromium language/visual checks; 6/6 simulated voice SDK callbacks; 10/10 simulated canonical engine consent/revocation checks. The tests and reproducible V4->V5 builder are included in the owner-downloadable `SOURCE_AI_V5_EXECUTIVE_HANDSHAKE_2026-11-01.zip` (not hosted in repo yet). The prototype file itself was read back and verified exactly equal to the tested HTML.

**Data boundaries:**
- Exact canonical fetter mentions are solid, with canonical ID only when present in the original 112-address table.
- Six explicit fuzzy phrases are labeled **possible**, dotted underline, and are NOT approved as canonical weights, severity, or an established ancestor/diagnosis. `indignant` → possible Solar Anger and `avoidant` → possible Sacral Withdrawal are preliminary **UI** hypotheses only.
- A single-band coherent clause may receive its band color; mixed-band clauses do not become one-color labels. Negation is dashed and not considered a positive match.
- Chakra bars indicate **language cue activity**, not energy or nerve measurement. Child emotions, intensity and action are linguistic observations, not calibrated CQDQ.
- Same-origin canonical `window.srcVoiceIntelligence` is optional: absent in standalone HTML. Explicit profile graph access requires both `window.ATUNED_SOURCE_VOICE_CONTEXT.allowProfile===true` and `.userConsent===true`, otherwise the canonical Sniffer can read the current text but graph status is CONSENT_REQUIRED.
- No profile persistence or private journal uploads are added. Audio/transcripts continue through ElevenLabs; browser interim recognition may also be external.
- Session opening greeting and voice remain controlled by the existing agent; silence timeout disabled in agent config, but real long-idle test of V5 was not run in this build.

## Canonical integration and next steps

Read [three-stage handoff](../../docs/SOURCE_VOICE_3_BUILD_HANDSHAKE_2026-11-01.md) and [V5 handoff](../../docs/SOURCE_VOICE_SIGNAL_VIEW_V5_HANDOFF_2026-11-01.md). The real draft engine functions are `srcVoiceSniff`, `srcVoiceGraph`, `srcVoiceIntelligence`, and `srcVoiceNarrative`; they read the existing `sniffStory`, `traceFromRecord`, `evLedger`, and canonical records. The optional production-host seam must be implemented and tested in the same-origin app. The draft PR is not merged and CI/generated-asset consistency are not verified.

Never claim that opening the one-file prototype connects all records, that visual cue activity is an actual chakra reading, or that 21 laws passed 10/10. Owner review is required before merging or deploying.
