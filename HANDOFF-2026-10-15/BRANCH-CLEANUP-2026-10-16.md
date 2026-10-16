# Branch cleanup, 16 October 2026

Written by the DevOps and QA seat before any branch was deleted. Every row below
was produced by a script reading git and GitHub, not typed. The scripts and their
probe runs are described at the end.

## What the words mean

- **Branch**: a named line of work on GitHub. Deleting a branch deletes the name, not
  the commits; the commits stay as long as something else still points at them.
- **main**: the branch the live site is built from. Never touched.
- **PROTECTED**: main, or a branch that an open pull request (a proposed change still
  waiting for review) uses as its head or its base. Never touched. Deleting a base
  would close the pull request on GitHub.
- **SAFE**: `git merge-base --is-ancestor <tip> origin/main` is true. Every commit on
  the branch is already inside main, so main keeps them all. No tag needed.
- **EQUIVALENT**: the branch has commits that are not literally in main, but their
  content is. Proven one of three ways, named per row: (1) `git cherry` marks every
  commit as already applied, (2) the files the branch touched are byte identical
  between the branch tip and main today, or (3) merge point: the pull request was
  squash merged (squashed means its commits were folded into one new commit on main),
  nothing was pushed after, and at that squash commit every file the branch touched is
  byte identical to the branch tip. Each gets an archive tag (a permanent named
  pointer, `archive/<branch name>`) so its original commits stay reachable.
- **KEEP**: anything not proven. Kept, with the commits main does not have listed.
- **Recreate**: the command that puts a deleted branch back exactly as it was.

## rebootos-sourcce/MOB

main at the time of writing: `920d7ed2b38492826d1a578feaac0646160f0804`. Branches on the server: 147.

- PROTECTED: 20
- SAFE: 88
- EQUIVALENT: 9
- KEEP: 30

Deleted in this pass: 88 (SAFE only). Held: 9 EQUIVALENT, see "Why the equivalent branches were held".

### Safe, fully inside main (deleted): 88

| Branch | Tip | Last commit | Merged PR | Evidence | Recreate |
|---|---|---|---|---|---|
| `archetype-chakra-style` | `eef38c157a13` | 2026-10-02 |  | ancestor of main; 703 commits behind | `git push origin eef38c157a13078e5d75ffb11716a0474aafa1ef:refs/heads/archetype-chakra-style` |
| `ax8-vritti-fix` | `e544c287ed3c` | 2026-10-02 |  | ancestor of main; 651 commits behind | `git push origin e544c287ed3c5c919260393f5106101c15b77ebf:refs/heads/ax8-vritti-fix` |
| `char-torus-merge2` | `93352f09d496` | 2026-10-02 |  | ancestor of main; 708 commits behind | `git push origin 93352f09d496c42717b9ceb601f6d7a64995237e:refs/heads/char-torus-merge2` |
| `char-torus-tests` | `cf8aae09622f` | 2026-10-02 |  | ancestor of main; 935 commits behind | `git push origin cf8aae09622fb1fc548566353e5161c3cf733603:refs/heads/char-torus-tests` |
| `claims-gate-real` | `7302e1d4f63d` | 2026-10-02 |  | ancestor of main; 615 commits behind | `git push origin 7302e1d4f63df065ed6692869ea9ca823899361d:refs/heads/claims-gate-real` |
| `claude/analytics-drilldown-rb` | `1f32a75bb54f` | 2026-10-04 |  | ancestor of main; 444 commits behind | `git push origin 1f32a75bb54f0a20cca024e86eabc30c5ca52efa:refs/heads/claude/analytics-drilldown-rb` |
| `claude/block0-baseline` | `bee8bb864ea4` | 2026-10-08 |  | ancestor of main; 206 commits behind | `git push origin bee8bb864ea4bece2727e0c3202edf3c973bcf1a:refs/heads/claude/block0-baseline` |
| `claude/block1` | `843adea3a6ae` | 2026-10-09 |  | ancestor of main; 176 commits behind | `git push origin 843adea3a6ae797a63b08d0a19745c3950f6a2e2:refs/heads/claude/block1` |
| `claude/block2a-lean` | `617a929cc8d9` | 2026-10-09 |  | ancestor of main; 163 commits behind | `git push origin 617a929cc8d9f4694df0cf09f543d80d1fdc71c6:refs/heads/claude/block2a-lean` |
| `claude/cloudflare-inspect` | `662c71906728` | 2026-10-15 |  | ancestor of main; 42 commits behind | `git push origin 662c71906728c564044afdfd231dc2857b28cadb:refs/heads/claude/cloudflare-inspect` |
| `claude/compass-thirteen-rb` | `2b1e7cfd42ac` | 2026-10-04 |  | ancestor of main; 445 commits behind | `git push origin 2b1e7cfd42ac64f774891f559fc32adea10eef12:refs/heads/claude/compass-thirteen-rb` |
| `claude/copy-delivery-fixes` | `cf20a9d81913` | 2026-10-04 |  | ancestor of main; 440 commits behind | `git push origin cf20a9d8191344b3625ffff323fe82f13cd61b35:refs/heads/claude/copy-delivery-fixes` |
| `claude/copy-unpack-sweep` | `d9c27ba5fe01` | 2026-10-04 |  | ancestor of main; 445 commits behind | `git push origin d9c27ba5fe01fdd4ad8b1adbfc1bbb5b0d9b12db:refs/heads/claude/copy-unpack-sweep` |
| `claude/decisions-16-oct` | `74a867b869b6` | 2026-10-16 |  | ancestor of main; 23 commits behind | `git push origin 74a867b869b6de08c4c132b9284658d8eb9a0495:refs/heads/claude/decisions-16-oct` |
| `claude/discord-feedback` | `16200cbb2330` | 2026-10-03 |  | ancestor of main; 458 commits behind | `git push origin 16200cbb2330edc0d6216d7db006e3490698ab7f:refs/heads/claude/discord-feedback` |
| `claude/engine-honest-readings` | `40dc1298105d` | 2026-10-16 |  | ancestor of main; 13 commits behind | `git push origin 40dc1298105d7236a4025d7d151ee78da98d568c:refs/heads/claude/engine-honest-readings` |
| `claude/field-rail-sweep-rz` | `93bfb18dc376` | 2026-10-04 |  | ancestor of main; 439 commits behind | `git push origin 93bfb18dc376b63834b121da7d447ba94fea1efd:refs/heads/claude/field-rail-sweep-rz` |
| `claude/field-stage-390-overlap` | `d7e885803f84` | 2026-10-04 |  | ancestor of main; 444 commits behind | `git push origin d7e885803f8442883825ed0f83c2cb602c5d9a8f:refs/heads/claude/field-stage-390-overlap` |
| `claude/first-visit-guard` | `85aeb807ad29` | 2026-10-16 |  | ancestor of main; 34 commits behind | `git push origin 85aeb807ad299356ab2778adf597e8d89eef464b:refs/heads/claude/first-visit-guard` |
| `claude/funnel-continuity-1` | `ed2475472b7e` | 2026-10-08 |  | ancestor of main; 210 commits behind | `git push origin ed2475472b7eef21e5b7f1bfc5a60174b848513b:refs/heads/claude/funnel-continuity-1` |
| `claude/funnel-copy-round-rv` | `9eafde42285b` | 2026-10-04 |  | ancestor of main; 438 commits behind | `git push origin 9eafde42285b5fdcaf0d1da34d6083a6e624075d:refs/heads/claude/funnel-copy-round-rv` |
| `claude/funnel-creative-direction-rd` | `80cefe5ae8f7` | 2026-10-04 |  | ancestor of main; 445 commits behind | `git push origin 80cefe5ae8f739847dee07de8ddd2a1ca7893c6d:refs/heads/claude/funnel-creative-direction-rd` |
| `claude/funnel-header-round-sa` | `ae51cec3f246` | 2026-10-04 |  | ancestor of main; 433 commits behind | `git push origin ae51cec3f2468c3354092e78473f4320fb119b85:refs/heads/claude/funnel-header-round-sa` |
| `claude/funnel-signal-test` | `5114930565a0` | 2026-10-03 |  | ancestor of main; 466 commits behind | `git push origin 5114930565a069fd6a59272a442d72247073d4c6:refs/heads/claude/funnel-signal-test` |
| `claude/funnel-tdd-build` | `0c24409e7324` | 2026-10-04 |  | ancestor of main; 442 commits behind | `git push origin 0c24409e73249a3ecb4db82b0b7e69bb6991a275:refs/heads/claude/funnel-tdd-build` |
| `claude/gift-bank-anxiety` | `3a2a077a8645` | 2026-10-16 |  | ancestor of main; 33 commits behind | `git push origin 3a2a077a8645a0f0333f5fc2b5f14b3bcddfab93:refs/heads/claude/gift-bank-anxiety` |
| `claude/golden-g0` | `b74e8993cfd5` | 2026-10-09 |  | ancestor of main; 66 commits behind | `git push origin b74e8993cfd5fb26e2e47657f8b0bd105c4638fa:refs/heads/claude/golden-g0` |
| `claude/handoff-2026-10-15` | `121895979c57` | 2026-10-15 |  | ancestor of main; 48 commits behind | `git push origin 121895979c5774b3a359d591b45f721b8420d56d:refs/heads/claude/handoff-2026-10-15` |
| `claude/handoff-close` | `3f3ace6a8ad0` | 2026-10-15 |  | ancestor of main; 37 commits behind | `git push origin 3f3ace6a8ad0beaeda8b47f96f3a2e309872c95d:refs/heads/claude/handoff-close` |
| `claude/handoff-docs` | `36280ddc088b` | 2026-10-09 |  | ancestor of main; 116 commits behind | `git push origin 36280ddc088bd98cd0de9fc06bbe98cc15678c65:refs/heads/claude/handoff-docs` |
| `claude/intake-archetype-nest` | `d37fd2310efc` | 2026-10-04 |  | ancestor of main; 445 commits behind | `git push origin d37fd2310efc6f595fb00e0db7936070586b0283:refs/heads/claude/intake-archetype-nest` |
| `claude/land-summary` | `b7ffde93d861` | 2026-10-09 |  | ancestor of main; 74 commits behind | `git push origin b7ffde93d861dea64d1fba7ff39860e49787511c:refs/heads/claude/land-summary` |
| `claude/move-energetic-summary-left` | `aaa7069b886c` | 2026-10-04 |  | ancestor of main; 444 commits behind | `git push origin aaa7069b886cde97fb9aa4fd8663311f9bc2ed76:refs/heads/claude/move-energetic-summary-left` |
| `claude/onboard-copy-arrive-fix` | `1122e9dde1c0` | 2026-10-04 |  | ancestor of main; 446 commits behind | `git push origin 1122e9dde1c04fe71db40c3adf0363a353940dc3:refs/heads/claude/onboard-copy-arrive-fix` |
| `claude/onboard-skip-on-import` | `5caf50f136c6` | 2026-10-04 |  | ancestor of main; 446 commits behind | `git push origin 5caf50f136c640948b4d3d35e79f8da83dd5afd5:refs/heads/claude/onboard-skip-on-import` |
| `claude/p0-team-items` | `95765bd0f4c5` | 2026-10-15 |  | ancestor of main; 45 commits behind | `git push origin 95765bd0f4c50cce3f52bb93b4847de87eb21e8d:refs/heads/claude/p0-team-items` |
| `claude/p1-batch1` | `dc58a76ef87b` | 2026-10-08 |  | ancestor of main; 148 commits behind | `git push origin dc58a76ef87ba330ca4f556a357c5ccf0cc22069:refs/heads/claude/p1-batch1` |
| `claude/p1-batch2` | `0029d5e8b7aa` | 2026-10-09 |  | ancestor of main; 123 commits behind | `git push origin 0029d5e8b7aa140d461afc72865e8d7eedeebe21:refs/heads/claude/p1-batch2` |
| `claude/p1-ci-gates` | `96048f1c3712` | 2026-10-09 |  | ancestor of main; 119 commits behind | `git push origin 96048f1c37127033b36ea0d2b482361b74ec1b87:refs/heads/claude/p1-ci-gates` |
| `claude/p1-int` | `08b5c93a9f06` | 2026-10-09 |  | ancestor of main; 101 commits behind | `git push origin 08b5c93a9f069bd27b4dd14ffd00f51c0ae58090:refs/heads/claude/p1-int` |
| `claude/p1-no-raw-decimals` | `f46f50313fd4` | 2026-10-16 |  | ancestor of main; 27 commits behind | `git push origin f46f50313fd48de0ac54aeb80192c1b58cc7480e:refs/heads/claude/p1-no-raw-decimals` |
| `claude/p1a-sniffer` | `2bf5cc5a6a15` | 2026-10-09 |  | ancestor of main; 174 commits behind | `git push origin 2bf5cc5a6a1525997d9c1bd6cc786b2e5c4cacaa:refs/heads/claude/p1a-sniffer` |
| `claude/p1d-fixes` | `acbfd105f42f` | 2026-10-08 |  | ancestor of main; 159 commits behind | `git push origin acbfd105f42f6f97ef17978875013fd73c947598:refs/heads/claude/p1d-fixes` |
| `claude/p1g-red` | `918990d5dc9d` | 2026-10-09 |  | ancestor of main; 116 commits behind | `git push origin 918990d5dc9d908edea3d3320fb4f15ffac32902:refs/heads/claude/p1g-red` |
| `claude/p3-heads` | `425f6c464bf7` | 2026-10-09 |  | ancestor of main; 120 commits behind | `git push origin 425f6c464bf7daac65c75530161aa2a1c9915e67:refs/heads/claude/p3-heads` |
| `claude/p3-int` | `c32cd846c44c` | 2026-10-09 |  | ancestor of main; 83 commits behind | `git push origin c32cd846c44ccc72add830f1ee871b65fa15aa11:refs/heads/claude/p3-int` |
| `claude/p3-menu` | `53e9e2e1d31c` | 2026-10-09 |  | ancestor of main; 120 commits behind | `git push origin 53e9e2e1d31cd55e93828d17398e58ef1a7bfac1:refs/heads/claude/p3-menu` |
| `claude/p3-rail` | `43af7b5feeec` | 2026-10-09 |  | ancestor of main; 121 commits behind | `git push origin 43af7b5feeec653a013f8ee885cba81a016995e5:refs/heads/claude/p3-rail` |
| `claude/p3-sound` | `f0899e055009` | 2026-10-09 |  | ancestor of main; 119 commits behind | `git push origin f0899e0550093e75fbd1a6181eedf1176dd930cd:refs/heads/claude/p3-sound` |
| `claude/paywall-fix-rb` | `1ca99ba657f9` | 2026-10-04 |  | ancestor of main; 445 commits behind | `git push origin 1ca99ba657f9065d077526b8bf8a89c4551d1f61:refs/heads/claude/paywall-fix-rb` |
| `claude/paywall-journey` | `2523ef8d3a6d` | 2026-10-09 |  | ancestor of main; 67 commits behind | `git push origin 2523ef8d3a6da163366c381715d553a1581b30a9:refs/heads/claude/paywall-journey` |
| `claude/pin-ubuntu-24` | `c2694f765b04` | 2026-10-16 |  | ancestor of main; 25 commits behind | `git push origin c2694f765b045e5bab05469d7885e7ee0b4c32c4:refs/heads/claude/pin-ubuntu-24` |
| `claude/practitioner-mode-rb` | `aa4bd2b78c55` | 2026-10-04 |  | ancestor of main; 445 commits behind | `git push origin aa4bd2b78c55df475478387bdfaefdd5693b526a:refs/heads/claude/practitioner-mode-rb` |
| `claude/rb-character-aura` | `6bc5e540176e` | 2026-10-04 |  | ancestor of main; 445 commits behind | `git push origin 6bc5e540176e1f4c5b73659284cf086c88ba40db:refs/heads/claude/rb-character-aura` |
| `claude/round-rb-avatar-summary-knowledge` | `dd060f0a2b2b` | 2026-10-04 |  | ancestor of main; 444 commits behind | `git push origin dd060f0a2b2b96ae6a6d863020f019e14176fce2:refs/heads/claude/round-rb-avatar-summary-knowledge` |
| `claude/round-rf-summary-flow` | `3edcd0712cbb` | 2026-10-04 |  | ancestor of main; 440 commits behind | `git push origin 3edcd0712cbb86c3bc0b5fd90a4c46b128db3158:refs/heads/claude/round-rf-summary-flow` |
| `claude/saboteur-cards-round-sb` | `aad6f75f3035` | 2026-10-04 |  | ancestor of main; 430 commits behind | `git push origin aad6f75f303521baa188e20b56af896065aad020:refs/heads/claude/saboteur-cards-round-sb` |
| `claude/tdd-funnel-audit-tomas` | `45860b5a01d1` | 2026-10-04 |  | ancestor of main; 445 commits behind | `git push origin 45860b5a01d13d4ce935eb01a2378dd3d16f9e49:refs/heads/claude/tdd-funnel-audit-tomas` |
| `claude/voice-only` | `e990e89f3425` | 2026-10-09 |  | ancestor of main; 76 commits behind | `git push origin e990e89f342587a14c2c9ca4d4e5d14d880c0c77:refs/heads/claude/voice-only` |
| `claude/wire-law-sniffer-story` | `8c904e36942e` | 2026-10-04 |  | ancestor of main; 446 commits behind | `git push origin 8c904e36942e9f91402dce014b24c47607e04d1b:refs/heads/claude/wire-law-sniffer-story` |
| `daily-summary-ui` | `91afce762eff` | 2026-10-02 |  | ancestor of main; 710 commits behind | `git push origin 91afce762eff43aad2c88ccf8a89bf17250b1b3f:refs/heads/daily-summary-ui` |
| `f5-onto-f4` | `7acd9f2ea4cb` | 2026-10-02 |  | ancestor of main; 716 commits behind | `git push origin 7acd9f2ea4cbca1294f3d9ca9b51a64d99201718:refs/heads/f5-onto-f4` |
| `feedback-tracker` | `53ad9ffa194d` | 2026-10-02 |  | ancestor of main; 709 commits behind | `git push origin 53ad9ffa194d4367d5b1bc004db14bea1e37ebf1:refs/heads/feedback-tracker` |
| `flow-three-column` | `14e6b643eaf4` | 2026-10-02 |  | ancestor of main; 626 commits behind | `git push origin 14e6b643eaf4db5d9287270ba27c0416f16b27d2:refs/heads/flow-three-column` |
| `flow3-qn` | `9c0364ebacf4` | 2026-10-03 |  | ancestor of main; 624 commits behind | `git push origin 9c0364ebacf40cb44b3f8843850a679be1099430:refs/heads/flow3-qn` |
| `funnel-aspirational` | `f6cea298675a` | 2026-10-03 |  | ancestor of main; 582 commits behind | `git push origin f6cea298675aeab3b2a7e5e853b1a8cf90adaee0:refs/heads/funnel-aspirational` |
| `funnel-tightened` | `aac5579d6f1b` | 2026-10-03 |  | ancestor of main; 581 commits behind | `git push origin aac5579d6f1b2d723935f50c27a36837281c7b84:refs/heads/funnel-tightened` |
| `journal-branding` | `7d0452999257` | 2026-10-02 |  | ancestor of main; 703 commits behind | `git push origin 7d0452999257c1d2f2d63b00b212d272451056b7:refs/heads/journal-branding` |
| `onboarding-cinematic` | `c99a7f32387d` | 2026-10-03 |  | ancestor of main; 616 commits behind | `git push origin c99a7f32387d7bd8457b83c3dbcbc1b12664006d:refs/heads/onboarding-cinematic` |
| `onboarding-ob-boundary-fix` | `f0bf894a4511` | 2026-10-02 |  | ancestor of main; 669 commits behind | `git push origin f0bf894a4511539cce7e5b8506e92fff64700698:refs/heads/onboarding-ob-boundary-fix` |
| `onboarding-real-skin` | `dbdc9017f549` | 2026-10-02 |  | ancestor of main; 618 commits behind | `git push origin dbdc9017f54902c20830989606bd62b630ac40c4:refs/heads/onboarding-real-skin` |
| `personas-tier-four` | `b975640826b9` | 2026-10-02 |  | ancestor of main; 712 commits behind | `git push origin b975640826b942c338d11139c50e146cabd940c5:refs/heads/personas-tier-four` |
| `practitioner-analytics` | `7279f3937b43` | 2026-10-02 |  | ancestor of main; 698 commits behind | `git push origin 7279f3937b4372e20b43d311d06c9015b283f7e5:refs/heads/practitioner-analytics` |
| `profiles-twelve` | `a053d787088e` | 2026-10-02 |  | ancestor of main; 638 commits behind | `git push origin a053d787088e36cc3ec5dd10fd47e90268b5f12b:refs/heads/profiles-twelve` |
| `rb-login-profile-lighting` | `2ea6c312742b` | 2026-10-04 |  | ancestor of main; 445 commits behind | `git push origin 2ea6c312742b34bf3010df10f84e7601d023f122:refs/heads/rb-login-profile-lighting` |
| `release-carousel` | `0634a16315d1` | 2026-10-03 |  | ancestor of main; 622 commits behind | `git push origin 0634a16315d1e9c6f35142cc4178fd8d52906f32:refs/heads/release-carousel` |
| `release-simplify` | `9fa2bebcba61` | 2026-10-03 |  | ancestor of main; 620 commits behind | `git push origin 9fa2bebcba61267cb49fbbf53925ce5a6c7d0c5e:refs/heads/release-simplify` |
| `release-verification` | `6870d577de64` | 2026-10-02 |  | ancestor of main; 661 commits behind | `git push origin 6870d577de64a2ac2ad8156aa762192b96cea361:refs/heads/release-verification` |
| `release-verification-merge` | `2a5f3cd40062` | 2026-10-02 |  | ancestor of main; 644 commits behind | `git push origin 2a5f3cd40062f350e7bca7c91045168fe2c2cdfc:refs/heads/release-verification-merge` |
| `ritual-calendar` | `fc33b5baf16a` | 2026-10-03 |  | ancestor of main; 556 commits behind | `git push origin fc33b5baf16a7402c32e670a4778fbe63cd51376:refs/heads/ritual-calendar` |
| `ritual-symbolic` | `5579696a83d2` | 2026-10-03 |  | ancestor of main; 622 commits behind | `git push origin 5579696a83d299c1f2f6d6f745bc476911246d98:refs/heads/ritual-symbolic` |
| `round-rb-ritual-page` | `08956ab75f3a` | 2026-10-04 |  | ancestor of main; 445 commits behind | `git push origin 08956ab75f3a1b19f3bdc711c6233a5c5f8240fa:refs/heads/round-rb-ritual-page` |
| `sniffer-mask-fix` | `4f4bd326525e` | 2026-10-03 |  | ancestor of main; 593 commits behind | `git push origin 4f4bd326525e228c526248972632235aa7033225:refs/heads/sniffer-mask-fix` |
| `source-ai-chat` | `6677a7e47b77` | 2026-10-04 |  | ancestor of main; 444 commits behind | `git push origin 6677a7e47b77061634e7bfa60b7999c984ef7084:refs/heads/source-ai-chat` |
| `storyboard-faq-nav` | `cdc4984f5b30` | 2026-10-03 |  | ancestor of main; 597 commits behind | `git push origin cdc4984f5b3079736b97e3e5731be1ad8f154a92:refs/heads/storyboard-faq-nav` |
| `trace-graph-ui` | `f32d442b7e96` | 2026-10-02 |  | ancestor of main; 710 commits behind | `git push origin f32d442b7e96be8474ceac1b126afd93a8893947:refs/heads/trace-graph-ui` |
| `tutorial-cinematic` | `8bb370a59c5b` | 2026-10-03 |  | ancestor of main; 614 commits behind | `git push origin 8bb370a59c5b58372d199c7178e1bd562246f515:refs/heads/tutorial-cinematic` |
| `worktree-agent-ad6238b7878d6984f` | `5dcb45d86632` | 2026-10-02 |  | ancestor of main; 936 commits behind | `git push origin 5dcb45d86632f5994b561d5d4dfc899d983096fc:refs/heads/worktree-agent-ad6238b7878d6984f` |

### Equivalent, content inside main (HELD, not deleted): 9

| Branch | Tip | Last commit | Merged PR | Evidence | Recreate |
|---|---|---|---|---|---|
| `claude/archetype-expression` | `3de490cacb40` | 2026-10-16 | #90 | merge point: PR #90, squash f7188cba on main: 11 touched files identical to tip; cherry +3/-0 | `git push origin 3de490cacb406f4f4b002eaa8d8ba541b91cb301:refs/heads/claude/archetype-expression` |
| `claude/emmy-context-rule` | `6238a7c4a38d` | 2026-10-16 | #93 | cherry: all 1 commits already applied; cherry +0/-1 | `git push origin 6238a7c4a38d031de257b9b317a416281a566f73:refs/heads/claude/emmy-context-rule` |
| `claude/emmy-install` | `2313d8cf021b` | 2026-10-16 | #89 | cherry: all 1 commits already applied; cherry +0/-1 | `git push origin 2313d8cf021b8439cdefad632d3e0f75af869e37:refs/heads/claude/emmy-install` |
| `claude/gates-coverage` | `abe8553c1da2` | 2026-10-16 | #91 | tree diff of its 21 touched files against main is empty; cherry +6/-0 | `git push origin abe8553c1da216dbb5d7f4ab016e96f4a0a0d622:refs/heads/claude/gates-coverage` |
| `claude/inspect-hand-start` | `34e8ef258a77` | 2026-10-16 | #92 | cherry: all 1 commits already applied; cherry +0/-1 | `git push origin 34e8ef258a77740c22c61b542304a66253542f8a:refs/heads/claude/inspect-hand-start` |
| `claude/percent-framework` | `ed39965a55fa` | 2026-10-16 | #88 | merge point: PR #88, squash 02820021 on main: 11 touched files identical to tip; cherry +6/-0 | `git push origin ed39965a55fa5d05529abac29fecb96be24af0b3:refs/heads/claude/percent-framework` |
| `claude/record-gate-ci` | `7f044e9da63c` | 2026-10-16 | #96 | merge point: PR #96, squash c3592d25 on main: 2 touched files identical to tip; cherry +2/-0 | `git push origin 7f044e9da63c22eff7470f558809380ca2c62d83:refs/heads/claude/record-gate-ci` |
| `claude/record-tells-truth` | `3b41c2c2c468` | 2026-10-16 | #94 | merge point: PR #94, squash d9fc4683 on main: 21 touched files identical to tip; cherry +16/-0 | `git push origin 3b41c2c2c468dd5579b700562e25e247159b280e:refs/heads/claude/record-tells-truth` |
| `claude/sound-gate-stateful-waits-dev7` | `43e1974997fb` | 2026-10-09 | #51 | cherry: all 1 commits already applied; cherry +0/-1 | `git push origin 43e1974997fb973a9c74f60ec65463c529caf50b:refs/heads/claude/sound-gate-stateful-waits-dev7` |

### Protected, not touched: 20

| Branch | Tip | Why |
|---|---|---|
| `build/atuned-alpha-20261013` | `a47fe148e92c` | open PR #70 head |
| `claude/laughing-feynman-xhfyj3` | `999476cf2b09` | open PR #18 base |
| `claude/legal-pages` | `b08c64b6760c` | open PR #87 head |
| `claude/live-test-counts-in-readme-dev7` | `74ec5ed9b349` | open PR #52 head |
| `claude/rb-field-rail-bars` | `3e14b17cc48c` | open PR #18 head |
| `claude/stripe-go-live-switch-dev7` | `e83ed06ddb4b` | open PR #53 head |
| `claude/tutorial-feeling-words` | `2cf74c2ee1fc` | open PR #95 head |
| `claude/welcome-crisis-and-words` | `dba8ed034fe1` | open PR #86 head |
| `dev7/p0-alpha-gates-20261010` | `74279113003c` | open PR #65 base |
| `dev7/p1-import-identity-20261010` | `fd148e4065a8` | open PR #60 head |
| `dev8/development-log-20261010` | `47b487dde8c3` | open PR #63 head |
| `dev9/executive-handshake-20261011` | `4f2e0f9703b2` | open PR #64 head |
| `docs/agreements-readiness-20261011` | `5e501f04c44e` | open PR #67 head |
| `docs/atuned-master-index-20261012` | `9547523cc383` | open PR #69 head |
| `docs/p0-gift-approval-contract-clean-20261013` | `280c16cfd927` | open PR #73 head |
| `fix/copy-gate-delete-confirm-20261011` | `5c388cd48d2c` | open PR #65 head |
| `lookdev/p0-execution-20261014` | `00fa14c32f6c` | open PR #74 head |
| `main` | `920d7ed2b384` | default branch |
| `p1/gift-nature-client-20261011` | `fc7033fb24ec` | open PR #66 head |
| `recovery/p0-retention-receipt-20261012` | `2cebf8039287` | open PR #68 head |

### Keep, not proven inside main: 30

Each is kept. The count is commits whose change is not in main (`git log --cherry-pick
--right-only`), and the list is those commits, newest first, up to ten.

- **`alpha/p0-quiz-journey-repair-20261010`** at `7caa08ec5f29`, 2026-10-10, Lance Powell. 12 commits not in main; 4 files, 4 differ against main.
  - `7caa08ec `Run deletion receipt assertions before browser context closes
  - `21ce79dc `Test deletion receipt deadline and pending state
  - `ea1b5bfb `Show the deletion deadline and any retention-marking delay
  - `2806ffcb `Verify downloaded-copy account signup stays offline
  - `c9075882 `Give offline copies a truthful account limitation
  - `770b5dd3 `Model confirmed first-visit pass closure on sign out
  - `62a4ccaa `Allow credentialed first-visit read in privacy test contract
  - `7e8e5c5c `Make quiz-session readback assertion deterministic
  - `460c63b6 `Correct first-visit attachment contract comments
  - `165cf961 `Cover quiz funnel arrival and align first-visit test contract
  - and 2 more
- **`alpha/p0-release-save-accuracy-20261010`** at `d9119ffacdf6`, 2026-10-10, Lance Powell. 4 commits not in main; 3 files, 3 differ against main.
  - `d9119ffa `Allow subsequent release writes after injected snapshot failure
  - `f1c54665 `Test partial release save failure honestly
  - `795fac3e `Report release and snapshot persistence separately
  - `8d088f28 `Rollback an unsaved history snapshot
- **`claude/first-visit-signout`** at `3208c163f227`, 2026-10-09, Lance Powell. 5 commits not in main; 3 files, 3 differ against main. Merged PR #47, but the merge point test did not clear it: no commit on main names this PR.
  - `3208c163 `test: pass the visit id into the sign-out browser case
  - `a2ece0b1 `Raise the quit gate floor for pass-result coverage
  - `05426604 `Test confirmed and failed first-visit pass ending
  - `e6aba26a `Tell the truth when the first-visit pass does not end
  - `5dea3edb `Sign out ends the first visit's pass, here and on the server
- **`claude/gift-banks-2`** at `653ee3289219`, 2026-10-16, Claude. 1 commits not in main; 4 files, 4 differ against main.
  - `653ee328 `Gift banks: word sets for the five natures, the selector generalised, the card cut
- **`claude/golden-account-delete-dev7`** at `1a3aa78bd28c`, 2026-10-09, Lance Powell. 4 commits not in main; 3 files, 3 differ against main. Merged PR #49, but the merge point test did not clear it: no commit on main names this PR.
  - `1a3aa78b `test: assert the truthful first-visit retention receipt
  - `e42a4c8e `test: assert the deletion receipt names the retained account link
  - `6e253cf2 `privacy: disclose the retained first-visit account link
  - `5609a3ea `test: make golden account deletion a positive journey
- **`claude/kind-bardeen-8r7vse`** at `90b3c3249aa9`, 2026-09-16, Claude. 13 commits not in main; 19 files, 19 differ against main.
  - `90b3c324 `Add reconstruction draft: Overwhelmed by Work & Life truths
  - `98e85f71 `Add passes 6-8 and correct the four-cue claim
  - `7fe39a75 `Correct the card deck analysis after pass 5 re-read
  - `3d37b706 `Add Somatic Macro Pad artifact
  - `a5511463 `Add observed style patterns
  - `5ce2c199 `Add lexicon of terms with source definitions
  - `f322e612 `Add Body UI design spec
  - `0fa02fa3 `Add timeline and remaining visual findings
  - `f7976d3b `Add concepts found only in the image corpus
  - `327a1297 `Add Tula Way doctrine extracted from primary source
  - and 3 more
- **`claude/little-books-review-k7az9s`** at `e98a057859fb`, 2026-09-24, Claude. 26 commits not in main; 138 files, 138 differ against main.
  - `e98a0578 `Build thelittlebooksof.com, rule it the house, lock the price ladder
  - `800d9432 `Match the original Little Books pair format. The books were prose; they are lists.
  - `4bc1f828 `88 words is a ceiling, not a floor. Gate flipped, all pages trimmed.
  - `51d04e77 `Generate the installs as per-pair reframes, in Lance's measured grammar
  - `74b0ea79 `Build all eleven volumes from the corpus. 99 pairs, real text.
  - `6c05362c `Intake the archetype and nerve-belief maps; reject a bad match pass
  - `5d2bd9df `Make the search rule permanent; clean the corpus; stop at enough
  - `2a00b426 `Search before asking: the address mapping was already in the manuscript
  - `71b9948a `Harvest the addresses: they were already complete at 18, and find the tell
  - `fecff034 `Second corpus intake: the clean dictation, and compose/ is not lost
  - and 16 more
- **`claude/matrix-strategy`** at `84474b9514cb`, 2026-10-03, Claude. 1 commits not in main; 1 files, 1 differ against main.
  - `84474b95 `Plan the Matrix review: clusters, names, and what more it can do
- **`claude/profile-sync-off-alpha-dev7`** at `95e1938dfac0`, 2026-10-09, Lance Powell. 2 commits not in main; 2 files, 2 differ against main. Merged PR #50, but the merge point test did not clear it: no commit on main names this PR.
  - `95e1938d `test: prove account journeys never call profile sync in alpha
  - `d0659bd9 `privacy: keep profile sync disabled during alpha
- **`claude/quirky-pasteur-cpog96`** at `d53e175305bc`, 2026-09-17, Claude. 10 commits not in main; 26 files, 26 differ against main.
  - `d53e1753 `Optimize the capture pipeline: 64% less compositing, near-instant saves
  - `6743823a `Fix defects that corrupted takes: device arming, menu leak, silent failures
  - `516f2299 `Detect blocked camera/mic access and make device failures recoverable
  - `a7cc3c37 `Make release uploads reliable: retry, verify, and clear stale drafts
  - `b5a48415 `Rebuild control panel around setup flow; add camera test, flip, shaped ring
  - `8823ae50 `Upload release assets in separate steps so one failed upload can't fail the release
  - `5a7ceaa3 `Disable electron-builder auto-publish; add repository metadata
  - `0b00eb4a `Build recorder on pushes to the recorder folder
  - `e9a0be78 `Add Windows build workflow that publishes MOB Recorder releases
  - `b49c4dff `Add MOB Recorder: local Loom-style screen + camera bubble recorder
- **`claude/sweet-ptolemy-p0pkgw`** at `0c4ff6d6358a`, 2026-09-26, Claude. 1 commits not in main; 5 files, 5 differ against main.
  - `0c4ff6d6 `Sentence case the Summary heads, and drop the seat name from the coherence chip's title
- **`dev7/p0-alpha-gates-integrated-20261010`** at `d13bec0803e1`, 2026-10-10, Lance Powell. 17 commits not in main; 6 files, 6 differ against main.
  - `d13bec08 `test: assert concurrent funnel start marks the second caller reused
  - `8882436e `docs: record current P0 green runs and stacked Alpha gate dependency
  - `04b76e60 `test: pin design floor to 192 measured assertions
  - `6fdc2812 `docs: update P1-D status from current design-gate evidence
  - `1887e03c `test: document fixed Alpha assertion floor
  - `87632e82 `docs: record integrated Alpha gate acceptance and current dependencies
  - `f6967bf4 `test: pin Alpha journey floor to its measured 56 assertions
  - `24d2b772 `test: require a nonempty anonymous journey identifier
  - `753464ea `test: make concurrent-session regression fail without hanging
  - `1161e722 `test: guard Alpha journey against concurrent anonymous session starts
  - and 7 more
- **`dev7/p0-atomic-release-save`** at `d040f3fdd336`, 2026-10-10, Lance Powell. 20 commits not in main; 6 files, 5 differ against main.
  - `d040f3fd `P0-C: restore in-memory release state after a refused save
  - `53458961 `P0: call rollback status through engine API in regression
  - `ce866d46 `P0: test failed rollback remains an explicit save failure
  - `f522bbb3 `test: roll back partial writes that throw after mutation
  - `c5aff55f `test: preserve absent profile key after corrupt first write
  - `bb724a1f `fix: expose key removal to the storage rollback boundary
  - `05ba55ae `fix: preserve absence when rolling back a first corrupt profile write
  - `0c339b64 `test: preserve durable profile on corrupt storage writes
  - `4661d906 `fix: restore prior profile bytes after corrupt storage writes
  - `a6a2fea4 `test: bind durable storage for per-record undo fixture
  - and 10 more
- **`dev7/p0-integrated-alpha-check-20261010`** at `53fa3549202e`, 2026-10-10, Lance Powell. 18 commits not in main; 7 files, 7 differ against main.
  - `53fa3549 `test: assert concurrent funnel follower is marked reused
  - `57be4ccd `test: mirror Worker signout result for named funnel pass
  - `d38d531a `test: pin design floor to 192 measured assertions
  - `f295325d `docs: state integrated Alpha acceptance criteria
  - `c897fd4e `test: layer Alpha blocking gates onto P0-B integration
  - `861dacf7 `test: layer Alpha blocking gates onto P0-B integration
  - `3eb2c700 `test: layer Alpha blocking gates onto P0-B integration
  - `dafb5d03 `test: layer Alpha blocking gates onto P0-B integration
  - `4770c474 `test: require a nonempty anonymous journey identifier
  - `86c10dcc `test: make concurrent-session regression fail without hanging
  - and 8 more
- **`dev7/p0-quiz-first-visit-session`** at `cb3fa5aef537`, 2026-10-10, Lance Powell. 16 commits not in main; 3 files, 3 differ against main.
  - `cb3fa5ae `P0-B: refuse malformed persisted funnel credentials on reload
  - `1a65df18 `P0-B: reject malformed funnel sessions before persistence
  - `dbee38e8 `P0-B: restore prior funnel bytes on rejected session write
  - `3c316233 `P0: test truthful failure when funnel credential cannot persist
  - `3545118c `P0: reject funnel sessions that cannot persist locally
  - `c705f50c `P0: cover rejected funnel session creation and retry
  - `4770c474 `test: require a nonempty anonymous journey identifier
  - `86c10dcc `test: make concurrent-session regression fail without hanging
  - `f125ce61 `test: prevent duplicate anonymous sessions during slow quiz arrival
  - `c8708c91 `fix: coalesce concurrent anonymous funnel session starts
  - and 6 more
- **`docs/p0-alpha-gate-final-status-20261011`** at `6aa8f9c8ef01`, 2026-10-11, Lance Powell. 1 commits not in main; 1 files, 1 differ against main.
  - `6aa8f9c8 `Docs: correct final P0 gate and deployment status
- **`docs/p0-gift-approval-contract-20261013`** at `7922b2ad51ca`, 2026-10-13, Lance Powell. 33 commits not in main; 17 files, 17 differ against main.
  - `7922b2ad `docs: add gift catalog approval contract and validation checklist
  - `fc7033fb `P0: gate tutorial resumes before legacy gift allowance can leak
  - `3f5ac0f6 `Keep blank profile byte-for-byte compatibility; test first-run gift gate in journey
  - `8f29226b `Preserve blank-profile storage contract; gate gift at first-run boundary
  - `d69aecd7 `Test new profile defaults to no local starter gift
  - `4af5251e `P0: initialize new profiles with starter bank disabled
  - `b1fb570f `Test tutorial-first profile fails closed without a local gift bank
  - `438f909d `P0: disable implicit local gift on first-run tutorial entry
  - `92805016 `Fix browser test line-unit reference in onboarding gate
  - `7822b492 `Fix browser test line-unit reference in journey gate
  - and 23 more
- **`docs/p0-gift-approval-contract-main-20261013`** at `34fefbda52ec`, 2026-10-13, Lance Powell. 1 commits not in main; 1 files, 1 differ against main.
  - `34fefbda `docs: add gift catalog owner approval contract
- **`f1-distress-detector`** at `600e65e9e77c`, 2026-10-02, Claude. 1 commits not in main; 1 files, 1 differ against main.
  - `600e65e9 `Protect F1's partial distress-detector draft, found during disk cleanup
- **`f1-distress-detector-draft2`** at `e5f7333d21b3`, 2026-10-02, Claude. 3 commits not in main; 19 files, 18 differ against main.
  - `e5f7333d `WIP checkpoint: a second, diverged line of the distress-sniffer draft
  - `c1cbc1ad `Sniffer: wheel, subject, distress, restoring map, frameworks, frame (engine tests green)
  - `dd4440cc `WIP sniffer: frame, question frame, distress, lexicon and sniff changes (agent stopped by an API error; build products not committed)
- **`f5-mini-release`** at `0468c8cf98d3`, 2026-10-02, Claude. 3 commits not in main; 12 files, 12 differ against main.
  - `0468c8cf `Rebuild after F5
  - `779dd669 `F5: the plan helper takes a list, so F4's yes rows can feed it; functional accepts the first release title
  - `4590dd3e `Cap the first release at the ruled twelve lines, three addresses (F5)
- **`p1/gift-nature-choice-20261011`** at `e8915db78f2b`, 2026-10-11, Lance Powell. 71 commits not in main; 21 files, 18 differ against main.
  - `e8915db7 `test: cover all six starter gift categories
  - `96a72cab `test: prove unmapped gift categories never grant locally
  - `296105d6 `docs: clarify server-confirmed starter gift handoff
  - `2ea9b428 `test: include gift nature screen in copy gate
  - `f444ddd6 `test: verify gift choice and server-confirmed local grant
  - `f5c3013d `docs: define separate starter gift nature selection
  - `61f8173b `fix: keep gift choice UI compatible with existing syntax
  - `84f04673 `fix: keep local gift grant fail-closed until server confirms
  - `a10d99d2 `test: read onboarding record state inside browser context
  - `b3ac111c `test: verify the separate six-category gift choice
  - and 61 more
- **`ps-practitioner`** at `5191c9937814`, 2026-10-02, Claude. 1 commits not in main; 12 files, 8 differ against main.
  - `5191c993 `Practitioner page: fix the correctness bug, the unpack rule, the ring layout
- **`worktree-agent-a1e19222989511ad6`** at `74b1e8fb59cf`, 2026-10-02, Claude. 1 commits not in main; 21 files, 21 differ against main.
  - `74b1e8fb `Protect uncommitted sound-map work, found during disk cleanup
- **`worktree-agent-a65a2eddedf17fca7`** at `baf730923864`, 2026-10-02, Claude. 1 commits not in main; 120 files, 120 differ against main.
  - `baf73092 `Protect uncommitted onboarding-r2 mockup work, found during disk cleanup
- **`worktree-agent-ad7f4b5294abbc82c`** at `3869d96f04a5`, 2026-10-02, Claude. 1 commits not in main; 12 files, 12 differ against main.
  - `3869d96f `Protect uncommitted journey work: journey.js, journeyui.js, onboarding data
- **`worktree-agent-aecea0c65b338e96c`** at `538354c05a88`, 2026-10-02, Claude. 1 commits not in main; 1 files, 1 differ against main.
  - `538354c0 `Protect uncommitted story-redesign mockup work, found during disk cleanup
- **`worktree-agent-aee1bb1a600b4d30e`** at `14c395927621`, 2026-10-02, Claude. 2 commits not in main; 18 files, 18 differ against main.
  - `14c39592 `Protect uncommitted recipe engine and teachers panel work, found during disk cleanup
  - `cbc02cf2 `R1: the fourteen pole roster as data, the lines step, Love and Beauty at the Heart
- **`worktree-agent-af1df59152b26830d`** at `84f6b6add005`, 2026-10-02, Claude. 1 commits not in main; 18 files, 18 differ against main.
  - `84f6b6ad `Protect uncommitted identity/login work, found during disk cleanup
- **`worktree-agent-afc3efe134955a1f3`** at `9b0898d2aaa2`, 2026-10-02, Claude. 1 commits not in main; 12 files, 11 differ against main.
  - `9b0898d2 `Protect uncommitted left-menu/rail redesign work, found during disk cleanup

## rebootos-sourcce/Reboot-OS

main at the time of writing: `3d66f5ef4e3c3ea7d7319b3930e7b63e11dec648`. Branches on the server: 66.

- PROTECTED: 13
- SAFE: 24
- EQUIVALENT: 9
- KEEP: 20

Deleted in this pass: 24 (SAFE only). Held: 9 EQUIVALENT, see "Why the equivalent branches were held".

### Safe, fully inside main (deleted): 24

| Branch | Tip | Last commit | Merged PR | Evidence | Recreate |
|---|---|---|---|---|---|
| `claude/atuned-stripe-production-3` | `103a6a0cc059` | 2026-10-08 |  | ancestor of main; 88 commits behind | `git push origin 103a6a0cc059e338b30c8bfe6a562f4e91e093c1:refs/heads/claude/atuned-stripe-production-3` |
| `claude/ci-pin-and-worker-vars` | `ba62dd4e14df` | 2026-10-16 |  | ancestor of main; 4 commits behind | `git push origin ba62dd4e14df32c456ffe37aa68e6772209e50f6:refs/heads/claude/ci-pin-and-worker-vars` |
| `claude/delete-export-supabase` | `dbe1a282659f` | 2026-10-16 |  | ancestor of main; 8 commits behind | `git push origin dbe1a282659f58451e50659f388b8825193e0324:refs/heads/claude/delete-export-supabase` |
| `claude/funnel-continuity-1` | `27d6fba47041` | 2026-10-08 |  | ancestor of main; 76 commits behind | `git push origin 27d6fba4704187991edbc7dec6fd06a212517158:refs/heads/claude/funnel-continuity-1` |
| `claude/keep-dashboard-vars` | `a1087aec7b23` | 2026-10-09 |  | ancestor of main; 50 commits behind | `git push origin a1087aec7b231866d32ad00e8567937d8b641e27:refs/heads/claude/keep-dashboard-vars` |
| `claude/kpi-and-cloudflare-readback` | `1d9269686187` | 2026-10-15 |  | ancestor of main; 20 commits behind | `git push origin 1d92696861870c22a37273f99bdfd2a1f0f7730c:refs/heads/claude/kpi-and-cloudflare-readback` |
| `claude/kpi-breakdown` | `c52f15763281` | 2026-10-16 |  | ancestor of main; 14 commits behind | `git push origin c52f15763281155854e6b1f8b5ad71334e38d376:refs/heads/claude/kpi-breakdown` |
| `claude/kpi-state-honest` | `0e81c53da8bd` | 2026-10-16 |  | ancestor of main; 10 commits behind | `git push origin 0e81c53da8bd17ff0adb98b59585d9709b390bbd:refs/heads/claude/kpi-state-honest` |
| `claude/null-origin` | `fbad94c62212` | 2026-10-16 |  | ancestor of main; 16 commits behind | `git push origin fbad94c62212515f7046cd1b7a8e2252fff3336e:refs/heads/claude/null-origin` |
| `claude/pass-mail-key` | `b4ed252fe359` | 2026-10-16 |  | ancestor of main; 2 commits behind | `git push origin b4ed252fe3597ab711c2503a554cb64f8cd3738e:refs/heads/claude/pass-mail-key` |
| `claude/paywall-worker` | `689ab605c692` | 2026-10-09 |  | ancestor of main; 41 commits behind | `git push origin 689ab605c692ad7bb42a0a19d6ea78e3bc57ed66:refs/heads/claude/paywall-worker` |
| `claude/reset-link` | `c6e7ddf81c02` | 2026-10-09 |  | ancestor of main; 61 commits behind | `git push origin c6e7ddf81c02b7fd3d88d9bfab4bbe1a6e5b96a0:refs/heads/claude/reset-link` |
| `claude/smoke-settle-wait` | `8eaf06af8026` | 2026-10-08 |  | ancestor of main; 66 commits behind | `git push origin 8eaf06af80261683688bc9f31171b24b36bf3d13:refs/heads/claude/smoke-settle-wait` |
| `claude/starter-gift-readiness-contract-dev7` | `96458d8d1560` | 2026-10-09 |  | ancestor of main; 29 commits behind | `git push origin 96458d8d156023653c3201601b31fa0656df83f7:refs/heads/claude/starter-gift-readiness-contract-dev7` |
| `claude/stripe-wiring` | `6a8670f6c9ab` | 2026-10-15 |  | ancestor of main; 21 commits behind | `git push origin 6a8670f6c9abcd21027842fa9dc6a8ec0559c954:refs/heads/claude/stripe-wiring` |
| `claude/supabase-key-check` | `3c857d1179ab` | 2026-10-08 |  | ancestor of main; 67 commits behind | `git push origin 3c857d1179ab4f69e015a7e277cc6bb59fe02bd1:refs/heads/claude/supabase-key-check` |
| `claude/supabase-key-kinds` | `608918b14daf` | 2026-10-08 |  | ancestor of main; 70 commits behind | `git push origin 608918b14daf371feae365a125ce8169738d52db:refs/heads/claude/supabase-key-kinds` |
| `claude/supabase-key-kinds-2` | `410d97c0c286` | 2026-10-08 |  | ancestor of main; 68 commits behind | `git push origin 410d97c0c286e189623c2b9c4bba4cf318e49d24:refs/heads/claude/supabase-key-kinds-2` |
| `claude/voice-anon` | `9a2207e346bc` | 2026-10-09 |  | ancestor of main; 54 commits behind | `git push origin 9a2207e346bc40d7436656c5f1c501ba253f7ff7:refs/heads/claude/voice-anon` |
| `claude/voice-eleven` | `927fdad75c44` | 2026-10-09 |  | ancestor of main; 56 commits behind | `git push origin 927fdad75c4440c21e8e13d3747323741c5402eb:refs/heads/claude/voice-eleven` |
| `claude/voice-probe` | `fc3e40580fc9` | 2026-10-09 |  | ancestor of main; 52 commits behind | `git push origin fc3e40580fc96e1bf524351d99b078e0cf18528b:refs/heads/claude/voice-probe` |
| `claude/w1-cors-patch` | `aca5c13ca516` | 2026-10-09 |  | ancestor of main; 58 commits behind | `git push origin aca5c13ca51644e929ffad1012bebe2534ef9c85:refs/heads/claude/w1-cors-patch` |
| `claude/w3-firstvisit` | `2952c599b894` | 2026-10-09 |  | ancestor of main; 51 commits behind | `git push origin 2952c599b8943a1150d07b6763c41c99bef69727:refs/heads/claude/w3-firstvisit` |
| `claude/worker-hardening-1` | `fb538a13feb3` | 2026-10-08 |  | ancestor of main; 82 commits behind | `git push origin fb538a13feb34ab17362b577036f8ec275ba50f5:refs/heads/claude/worker-hardening-1` |

### Equivalent, content inside main (HELD, not deleted): 9

| Branch | Tip | Last commit | Merged PR | Evidence | Recreate |
|---|---|---|---|---|---|
| `claude-cf-secret-diagnostic` | `6cf74df507fe` | 2026-09-30 |  | cherry: all 1 commits already applied; cherry +0/-1 | `git push origin 6cf74df507fe0d3a10f7e40f6cede6679a977073:refs/heads/claude-cf-secret-diagnostic` |
| `claude/android-sdk-packages-dev7` | `eaae6b09ffd1` | 2026-10-09 | #28 | cherry: all 1 commits already applied; cherry +0/-1 | `git push origin eaae6b09ffd13117d8ab06d3fa8b7c8e852e09c8:refs/heads/claude/android-sdk-packages-dev7` |
| `claude/billing-live-smoke-switch-aware-dev7` | `dba6d30a14c8` | 2026-10-09 | #32 | cherry: all 1 commits already applied; cherry +0/-1 | `git push origin dba6d30a14c8beb369c192b7926abc024c96bdcb:refs/heads/claude/billing-live-smoke-switch-aware-dev7` |
| `claude/ci-hardening` | `a71c02db58e3` | 2026-10-16 | #63 | tree diff of its 8 touched files against main is empty; cherry +2/-0 | `git push origin a71c02db58e36d8a8d276154b2bd1dcd2484c4ae:refs/heads/claude/ci-hardening` |
| `claude/cleanup-readback-key-columns-dev7` | `c96763083deb` | 2026-10-09 | #23 | tree diff of its 2 touched files against main is empty; cherry +2/-0 | `git push origin c96763083deb0e8d4b48196f9adc2430650d4418:refs/heads/claude/cleanup-readback-key-columns-dev7` |
| `claude/firstvisit-delete-no-resurrection-dev7` | `fc8fe4f727bc` | 2026-10-09 | #30 | cherry: all 1 commits already applied; cherry +0/-1 | `git push origin fc8fe4f727bccaba73800f304f7798d1e664f7ff:refs/heads/claude/firstvisit-delete-no-resurrection-dev7` |
| `claude/firstvisit-timeout-expiry-dev7` | `51dc9afd7739` | 2026-10-09 | #29 | cherry: all 1 commits already applied; cherry +0/-1 | `git push origin 51dc9afd773909d5f726ec5b3e6bfdd07d5f5c9f:refs/heads/claude/firstvisit-timeout-expiry-dev7` |
| `claude/shots-fixed-date-constructor-dev7` | `d2bbf6d465b9` | 2026-10-09 | #21 | cherry: all 1 commits already applied; cherry +0/-1 | `git push origin d2bbf6d465b9ce02edd21b5ce3506341e616a8b5:refs/heads/claude/shots-fixed-date-constructor-dev7` |
| `docs/p0-release-evidence-refresh-20261014` | `d54db3b39dfd` | 2026-10-13 | #44 | tree diff of its 3 touched files against main is empty; cherry +6/-0 | `git push origin d54db3b39dfd03bec71dac3471fc28f18147e758:refs/heads/docs/p0-release-evidence-refresh-20261014` |

### Protected, not touched: 13

| Branch | Tip | Why |
|---|---|---|
| `alpha/p1-account-retention-24-months-20261010` | `5293b797d16f` | open PR #35 base |
| `alpha/p1-fixed-pattern-gift-contract-20261010` | `bfb1ea1e72a7` | open PR #35 head |
| `alpha/p1-profile-schema-map-20261010` | `919f92083efe` | open PR #36 head |
| `audit/geometry-crosswalk-20261014` | `780d7d72b0da` | open PR #52 head |
| `claude/app-migration-decision-yx56cj` | `f674d407e2d4` | open PR #2 head |
| `copy-system-mirror-sweep-2026-10-14` | `91a41802b34f` | open PR #54 head |
| `docs/p0-recursive-execution-audit-20261014` | `3dd693176c86` | open PR #45 head |
| `feat/p0-gift-bank-validator-20261014` | `eb1e9025c5b7` | open PR #48 head |
| `fix/p0-gate-least-privilege-20261014` | `2206743128f2` | open PR #53 head |
| `fix/p0-public-canon-allowlist-20261014` | `ab6de04bd741` | open PR #49 head |
| `fix/p0-reduced-motion-current-main-20261014` | `975faa2e016c` | open PR #46 head |
| `fix/p0-single-publisher-current-main-20261014` | `50aa9cbafaa5` | open PR #47 head |
| `main` | `3d66f5ef4e3c` | default branch |

### Keep, not proven inside main: 20

Each is kept. The count is commits whose change is not in main (`git log --cherry-pick
--right-only`), and the list is those commits, newest first, up to ten.

- **`claude/atuned-funnel-runtime-1`** at `c8a2c16ee4db`, 2026-10-08, Lance Powell. 13 commits not in main; 6 files, 6 differ against main. Merged PR #3, but the merge point test did not clear it: no commit on main names this PR.
  - `c8a2c16 D`ocument production funnel transport boundary
  - `cacf9a5 F`ix Wrangler TOML line break for Supabase configuration
  - `52b7d5b P`reserve route status codes and make Supabase health optional locally
  - `cb80133 K`eep Supabase funnel RPC migrations out of D1 migrations
  - `7f188a3 K`eep Supabase funnel RPC migrations out of D1 migrations
  - `97fbf24 A`lign attachment transport test with live starter gift invariant
  - `88b5fd5 F`ix Supabase URL trailing slash regex
  - `a18b25e A`dd atomic funnel session creation migration
  - `6175d86 A`dd atomic funnel session attachment migration
  - `cb08f61 T`est production funnel session transport
  - and 3 more
- **`claude/cleanup-live-funnel-smoke-dev7`** at `287ea247074f`, 2026-10-09, Lance Powell. 9 commits not in main; 3 files, 3 differ against main. Merged PR #22, but the merge point test did not clear it: no commit on main names this PR.
  - `287ea24 t`est: assert live profile sync remains disabled during alpha
  - `ca4585c t`est: retain both sessions when child cleanup fails
  - `ff132dd t`est: escape cleanup error parentheses correctly
  - `fca8795 f`ix: parse configured Supabase URL in smoke cleanup
  - `0290330 t`est: prove live-smoke cleanup leaves unrelated sessions untouched
  - `8d9640d t`est: read the live smoke database URL from Worker config
  - `b996bae t`est: remove only the synthetic live funnel rows after smoke
  - `05241a1 t`est: cover scoped live smoke cleanup and readback
  - `123d53f t`est: add scoped cleanup for live funnel smoke fixtures
- **`claude/delete-email-throttle-keys-dev7`** at `7a1836a19a24`, 2026-10-09, Lance Powell. 4 commits not in main; 3 files, 1 differ against main. Merged PR #26, but the merge point test did not clear it: no commit on main names this PR.
  - `7a1836a t`est: prove support deletion clears email throttles only
  - `de9311d f`ix: resolve email for support-driven account deletion
  - `b93a185 t`est: clear email throttles but retain IP abuse window
  - `d00991d p`rivacy: clear account email throttles on deletion
- **`claude/elevenlabs-legacy-surface-dev7`** at `9e3ef5d66e5d`, 2026-10-09, Lance Powell. 10 commits not in main; 9 files, 3 differ against main. Merged PR #27, but the merge point test did not clear it: no commit on main names this PR.
  - `9e3ef5d d`ocs: refresh generated log after packaged voice build
  - `e28165a c`i: document the packaged Worker-only voice gate
  - `f900ce5 b`uild: regenerate packaged UI from source
  - `7512d5c t`est: run packaged voice privacy gate in CI
  - `db9df89 b`uild: regenerate packaged UI outputs from canonical source
  - `0f329ea t`est: enforce Worker-only voice on the packaged app surface
  - `d3cf653 t`est: assert voice adapter readiness independent of browser APIs
  - `100bb7c t`est: require server voice initialization and no browser fallback
  - `93d888d s`tyle: add accessible voice disclosure and status notice
  - `a11dc7f v`oice: use server-rendered ElevenLabs audio on packaged surface
- **`claude/google-push-fail-closed-current-main-dev7`** at `0c68e1c4d9e1`, 2026-10-09, Lance Powell. 2 commits not in main; 2 files, 1 differ against main. Merged PR #25, but the merge point test did not clear it: no commit on main names this PR.
  - `0c68e1c t`est: cover missing and wrong Google push keys
  - `e4db3cb s`ecurity: fail closed on missing Google push key
- **`claude/google-push-fail-closed-dev7`** at `fb6d99d82390`, 2026-10-09, Lance Powell. 2 commits not in main; 2 files, 1 differ against main.
  - `fb6d99d t`est: cover missing and wrong Google push keys
  - `9e8c063 s`ecurity: reject Google Play pushes when the key is unset
- **`claude/google-push-fail-closed-mainline-dev7`** at `d3e435192c49`, 2026-10-09, Lance Powell. 2 commits not in main; 2 files, 1 differ against main.
  - `d3e4351 t`est: cover missing and wrong Google push keys
  - `e2472e8 s`ecurity: fail closed on missing Google push key
- **`claude/keen-brahmagupta-qt32zr`** at `1d30aaa8ff97`, 2026-10-02, Claude. 298 commits not in main; 703 files, 703 differ against main.
  - `1d30aaa v`337: add the integration threshold to the book, redo the search field, bank the marketing run
  - `e7b014f v`336: dock the hamburger left, center content when the sidebar collapses
  - `2775463 F`ile the memory-chord and point-cloud dictations with a shared routing note
  - `0dce1e6 v`335: add the neuroharmonics section to Chapter 23
  - `ad4b6cc v`334: place the warehouse analogy as a new Chapter 1 section
  - `112ddb8 R`oute the warehouse analogy: six existing sections, one compressed metaphor
  - `82fce41 R`oute the contiguous-loop dictation: framing material, three existing homes
  - `e3e6a51 v`333: wire the search into the site itself, apply the art direction to real chrome
  - `4bce8f6 A`dd the site flow panel: search-first wins on the numbers, guided wins in practice
  - `6591c75 R`un the reader panel on the cover redesign for the first time
  - and 288 more
- **`claude/profile-sync-off-alpha-dev7`** at `5d9370738f47`, 2026-10-09, Lance Powell. 7 commits not in main; 6 files, 5 differ against main. Merged PR #20, but the merge point test did not clear it: no commit on main names this PR.
  - `5d93707 t`est: pass the explicit sync opt-in into the in-memory Worker
  - `67eaacc t`est: explicitly opt in the legacy cloud-sync smoke server
  - `4fdfc65 d`ocs: state the live first-visit deletion retention accurately
  - `ecaa689 t`est: opt in export fixtures to profile sync
  - `42776ef c`onfig: keep profile sync off for alpha
  - `c044b10 t`est: reject profile sync by default
  - `6411136 p`rivacy: fail closed on profile sync until enabled
- **`claude/stripe-checkout-default-off-dev7`** at `9820a26c0140`, 2026-10-09, Lance Powell. 4 commits not in main; 4 files, 4 differ against main. Merged PR #31, but the merge point test did not clear it: no commit on main names this PR.
  - `9820a26 t`est: assert deployed paid checkout remains closed
  - `50571fa c`onfig: keep paid checkout closed until live validation
  - `1e2d15c t`est: prove paid checkout stays closed without release switch
  - `684a7a8 b`illing: require explicit release switch before paid checkout
- **`copy/mirror-cascade-daily-insight`** at `ba8d02db89bc`, 2026-10-14, Lance Powell. 3 commits not in main; 3 files, 3 differ against main.
  - `ba8d02d B`ound saboteur claims to ATUNED model and evidence
  - `8de5615 C`larify surfaced-state copy
  - `e927fe0 d`ocs(atuned): specify mirror cascade and daily insight copy
- **`docs/p0-node-topology-20261014`** at `69fd65150b91`, 2026-10-13, Lance Powell. 13 commits not in main; 9 files, 2 differ against main. Merged PR #43, but the merge point test did not clear it: no commit on main names this PR.
  - `69fd651 d`ocs(p0): record successful canonical topology gate
  - `7ac959f d`ocs(p0): record green topology gate and log repair
  - `a0efc31 d`ocs(p0): align canon tool description with node topology
  - `214296d d`ocs(p0): correct source-tree and canonical topology handoff
  - `00aee7a d`ocs(p0): sync generated log from CI count output
  - `ee47f72 d`ocs(p0): record exact NODEREG and pattern-data conflict
  - `2f8a13f c`i(p0): expose generated canon counts in gate logs
  - `2c7818a t`est(p0): enforce 112-node 108/2/2 canonical topology
  - `dde9134 f`ix(p0): report canonical above/below topology in generated log
  - `6ae954f d`ocs: supersede stale node topology with owner invariant
  - and 3 more
- **`docs/p0-release-evidence-matrix-20261013`** at `3fc5a6cff306`, 2026-10-13, Lance Powell. 131 commits not in main; 22 files, 22 differ against main.
  - `3fc5a6c d`ocs: add explicit P0 release evidence matrix
  - `e35dd50 t`est(p0): fail release smoke when first-visit schema is missing
  - `4831394 t`est: clarify canon allowlist count wording
  - `9a1949b s`ecurity: quarantine unreviewed canon tables
  - `a45ff79 s`ecurity: keep unreviewed RARE canon private
  - `a72c3ae P`0: align canon fingerprint Unicode handling with source generator
  - `c968395 P`0: preserve explicit nulls and omit absent canon fields
  - `6dc5418 P`0: restore typed canon rows before source digest verification
  - `be9a64a T`est content fingerprints for all 127 public canon tables
  - `95fd3f0 T`est canonical list order after physical row reorder
  - and 121 more
- **`docs/p0-release-evidence-matrix-main-20261013`** at `4291b62137d8`, 2026-10-13, Lance Powell. 39 commits not in main; 2 files, 1 differ against main.
  - `4291b62 d`ocs(atuned): require full source-library index reconciliation in handoff
  - `d79c42e d`ocs: index gift validation contract artifact
  - `3152ff5 d`ocs: define fail-closed gift bank validation contract
  - `36b9b6e d`ocs: correct gift source discovery and record candidate gaps
  - `6fb4ecf d`ocs: record gift approval intake and verify exact-head gates
  - `05a307c d`ocs: reconcile P0 matrix status and record verified gate
  - `10b9c94 d`ocs: require executive summary and index maintenance
  - `262ab85 d`ocs: clarify Cloudflare runtime and provider check
  - `a25215b d`ocs: record evidence matrix gate completion
  - `f99db65 d`ocs: record expanded reduced-motion gate pass
  - and 29 more
- **`docs/p0-source-traceability-20261014`** at `519df6cac6b5`, 2026-10-13, Lance Powell. 4 commits not in main; 2 files, 2 differ against main.
  - `519df6c d`ocs: record complete visible Library pagination
  - `6fa6093 d`ocs: link source traceability register
  - `d078b11 d`ocs: add P0 source traceability register
  - `f23adee d`ocs: update source traceability findings
- **`feedback-relay`** at `d81c7403e59e`, 2026-10-02, Claude. 7 commits not in main; 14 files, 11 differ against main.
  - `d81c740 S`erver: POST /v1/feedback, relayed to Discord behind a Worker secret
  - `f398143 S`erver: POST /v1/voice/synthesize, ElevenLabs behind a Worker secret
  - `23724ce M`anage billing names the App Store or Google Play when they hold the plan
  - `72a222b R`efuse a second checkout on an account already paying, 409
  - `c9c3a1a B`illing portal, cancel, tier change and subscription renewal
  - `e536668 F`our Stripe test-mode price ids, round PS
  - `f1c0913 A`dd Stripe as the fourth way a plan can change, alongside Apple and Google
- **`fix/android-sdk-tools-package`** at `ab88aa11c90a`, 2026-10-09, Lance Powell. 1 commits not in main; 1 files, 1 differ against main.
  - `ab88aa1 c`i: clarify Android SDK package list and rerun build gate
- **`fix/p0-reduced-motion-mic-20261014`** at `925713cf405f`, 2026-10-13, Lance Powell. 18 commits not in main; 6 files, 6 differ against main.
  - `925713c t`est: isolate reduced-motion fixtures from app DOM
  - `4f8feb6 b`uild: regenerate packaged UI and derived log from source
  - `6d78f65 b`uild: regenerate derived log when smoke checks change
  - `021564e f`ix: correct reduced-motion assertion formatting
  - `20600b3 f`ix: restore valid Python assertion line breaks
  - `3617cb4 f`ix: correct multiline reduced-motion assertions
  - `3e5c62f t`est: fix reduced-motion CSS guard regex
  - `042a9c6 t`est: assert reduced-motion overrides in packaged UI
  - `05de8c0 b`uild: regenerate packaged UI and derived log from source
  - `b57f8d8 t`est: cover reduced motion for sheet and entrance animations
  - and 8 more
- **`fix/p0-reduced-motion-refresh-20261014`** at `2806828196f9`, 2026-10-14, atuned-source-build. 3 commits not in main; 5 files, 5 differ against main.
  - `2806828 b`uild: regenerate packaged UI and derived log from source
  - `9f31f04 f`ix(a11y): honor reduced motion for pulse and sheet transitions
  - `ae4e919 c`i(p0): regenerate derived log when smoke checks change
- **`fix/p0-single-pages-publisher-20261013`** at `8f4b722a600f`, 2026-10-13, Lance Powell. 2 commits not in main; 1 files, 1 differ against main.
  - `8f4b722 c`i(p0): validate web artifact on pull requests
  - `70252de f`ix: prevent duplicate ATUNED Pages publishing

## Why the equivalent branches were held

The protocol said: before deleting an EQUIVALENT branch, push an archive tag at its tip so its
original commits stay reachable. This session cannot create tags. A tag push over git was
answered HTTP 403 by the session's GitHub proxy, and the GitHub API route answered "Write access
to this GitHub API path is not permitted through this proxy." Branch pushes are allowed, tags
are not. So every EQUIVALENT branch was left in place. Their content is already in main; only
their original commit history depends on the branch name. Most of them are also held by
GitHub's permanent pull request ref (`refs/pull/<number>/head`), which GitHub never deletes.
A session that can push tags, or the owner from GitHub's web page, can finish them.

## How the tests were checked before use

Both scripts were first run against a throwaway repository built with one branch of each
known kind: an ancestor, a cherry picked branch, a squash merge, a squash merge that main
then edited, a squash merge that dropped a file, an open pull request head, and an
unmerged branch. Every one classified as expected, and the two failure cases (squash then
edited with no PR named, squash that dropped a file) read KEEP, which is the safe side.

## How to get a deleted branch back

Run the Recreate command from its row, from any up to date clone of that repository.
A copy of every SAFE and EQUIVALENT branch also exists as a git bundle (one file holding the
commits) made in the cleaning session's scratch space. That space is temporary and is gone
when the session ends, so the Recreate commands are the real recovery route: main holds
every commit of every deleted branch.

