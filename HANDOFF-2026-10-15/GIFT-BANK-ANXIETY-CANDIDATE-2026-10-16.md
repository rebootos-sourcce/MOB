# Anxiety gift bank, first candidate

16 October 2026. Built from the LET GO corpus for the owner to review. Not approved. Nothing committed or pushed.

**100 sentences, all in your own words from the LET GO corpus. None is approved yet.**

- Bank version: `anxiety-candidate-2026-10-16-v1`
- Bank hash, worked out by the validator's own method over the whole file: `8647ef2b2202cf517cdd56930f9ce12d5a4a16988898f16fdca9d35923986735`
- File hash of the bank as written: `92c6f39ab09bf24d89bcfd88d10c171797fc2c4589786eeb8c954a0e936183fb`

## Where the sentences came from

- Reboot-OS at commit `fbad94c` (branch `claude/null-origin`). The corpus files there are the same, byte for byte, as on main.
- 80 come from your 2026 dictation (`atuned/data/letgo/raw/2026_Let_Go_List.txt.gz`, records in `letgo_2026.json`).
- 20 come from the larger typed list (`TULA__Lances_Let_Go_List_1.pdf`, records in `letgo_pdf_b.json`). It is called "typed list B" in the table.
- None comes from the smaller typed list. Every line of it that qualified is also in one of the other two, and the copy kept is the dictation's.
- How a sentence was cut. In a typed list: one typed line, joined to its wrap line when the line ran past the margin. In the dictation, which has no full stops: one spoken line, and where a line holds a long run, from each "I'm letting go" to the next one. No word was changed, added or moved.
- How it is spelled. Each sentence is shown in the reading you ruled on 11 September, where "bleeding" is read as "believing" and "I;m" as "I'm". For 25 of the 100 that reading differs from the raw transcription. The raw words sit beside every sentence in the bank file, so both can be checked.

## How anxiety was decided

- By the words in the sentence itself. Nothing in the corpus sorts sentences by nature: headings, index nodes and the intake's fetter join (its guess at which canonical fetter a whole record is about) all label a whole record, not a sentence. Only 1 of these 100 comes from a record the intake joined to the Anxiety fetter.
- Two groups of words count. Core: anxious, anxiety, worry, worried, worrying, nervous, panic, panicking, dread. Fear: afraid, scared, fear, fearing, terrified, frightened, and their close forms.
- 39 of the 100 use a core word. 61 use only a fear word.

## How many were available

- 2,470 different "I'm letting go of" sentences in the three files.
- 403 of them name anxiety or fear.
- 205 passed the rules in the next section. I then read all 205 and held 23 more. 182 were left.
- The 100 here are the top of those 182, in this order: core words before fear words; dictation before the typed list; spread across headings, so each heading's shortest sentence comes before any heading's second; shorter before longer. Ties break on the stable id, so the order never depends on where a line sits in a file.
- The other 82 are kept, ranked, in a reserve file beside the bank. They are not in the bank.

## What I left out, and why

Counts are different sentences. A sentence held for two reasons is counted once, under the first.

| Why it was left out | How many |
|---|---|
| From a typed or pasted list, not dictation: full stops on most lines, or hidden characters a chat window leaves behind | 73 |
| Two releases run together in one line, and cutting them apart would be a guess | 43 |
| Filed under a heading that names another nature, for example "Let him go feeling depressed" | 28 |
| Names another of the six natures in the sentence itself: overwhelmed, exhausted, tired, depressed, grief, sad | 22 |
| Longer than 30 words | 22 |
| About one other person (he, she, my ex) | 5 |
| The state is turned around ("not afraid") | 3 |
| A censored word | 2 |
| Held on reading: the transcription changed the meaning, for example "and secure" for "insecure", "a mobile" for "immobile", "the line" for "a lie", or the line stops mid word | 20 |
| Held on reading: speaks to men only ("to be a man") | 3 |

Every one of the 221 is listed with its reason in `anxiety-held.json`, beside the bank.

Overlap with the other five banks is not measured yet, because they do not exist. Leaving out sentences that name another nature keeps this bank apart from them by design. The overlap gets measured when the next bank is built.

## The bank file and the validator

- The bank is written in the validator's format: the nine bank fields it requires, and per row a stable id, the sentence, a release or reframe class, and its source.
- The validator names no folder for banks. The file sits where the validator's own test puts one, relative to a repository root: `atuned/data/gift_banks/banks/anxiety.json`, with `schema.json` and `mapping.json` beside the `banks` folder.
- The validator run is the branch's file, unchanged (its SHA-256 matches `git show` of the branch byte for byte), run with `python3 -I`.
- **Result: rejected, 16 refusals, exit code 1.** None of the 16 can be fixed honestly by changing the bank:
  - 3 for this bank's approval fields, which stay empty until you approve it.
  - 3 for the item schema's approval fields, the same.
  - 5 because the other five banks do not exist yet. The validator only accepts all six at once.
  - 5 for the map from nature to meter track. It is not defined, and the research handshake says it must not be invented.
- **No refusal is about the bank's content.** 100 rows, 100 different ids, the bank hash matches, every row has its source file, record and place in the file, and every class is an allowed one.
- A second check, run apart from the validator, read each of the 100 back out of the raw files using the intake tool's own reading rules: 100 match, none differ.

## The supplementary material, a separate option, not used

The corpus held 182 sentences that qualify, so there is no gap to fill. If you want to swap lines in anyway:

- **The "50 Limiting Beliefs" cards.** 11,700 lines in 233 sets. 746 different lines use a core anxiety word, for example "Worried that I have permanently damaged my future." They were made in a chat session, not dictated, and they are not in the "I'm letting go of" form. Using one means adding words in front of it, which is a rewrite and needs your ruling first.
- **The Little Books anxiety volume** (MOB branch `claude/little-books-review-k7az9s`). Nine charge lines sourced from you, each one long list of states in a single sentence. The one on the volume's page also names "overwhelmed", so it crosses into the overwhelm bank. Nine at most.

## The 100

Each row's hash is the SHA-256 of the sentence alone. That is the same check the frozen pattern set migration makes on every row (`pattern_hash`). The validator hashes the whole bank, which is the bank hash at the top.

| # | Stable id | Sentence | Source | Sentence hash (SHA-256) |
|---|---|---|---|---|
| 1 | `anxiety-ab8a58ffba6da634` | I'm letting go of being nervous making mistakes | 2026 dictation, record 2026-375, line 3468, part 5 (heading: I want to go being self-righteous) | `ab8a58ffba6da634d833c29c42670ba6d2cdfb2b10ad45f2efbd9c61f653ffb9` |
| 2 | `anxiety-c6b668c79fd32da9` | I'm letting go of being nervous to win | 2026 dictation, record 2026-355, line 3098, part 21 (heading: Doing Your Best) | `c6b668c79fd32da9b4856eed223a2b95cb0dbed50a3b7ef2ec6717bb52ba3cc5` |
| 3 | `anxiety-0a3ecf444a762156` | I'm letting go of being anxious when I'm challenged | 2026 dictation, record 2026-310, line 2427, part 4 (heading: Challenge) | `0a3ecf444a7621567df71579bce9df68e9204f207c3c30f2e118307fdc925e56` |
| 4 | `anxiety-3c46711d73c4fd10` | I'm letting go of believing I'm nervous communicating directly | 2026 dictation, record 2026-330, line 2731, part 4 (heading: Being Direct) | `3c46711d73c4fd1059c4fe116706392c549b14eacf4d0528af3f86eeb29e3e60` |
| 5 | `anxiety-99c6c4027bf9b9a0` | I'm letting go of being nervous to project my voice | 2026 dictation, record 2026-342, line 2910, part 5 (heading: Shy and insecure) | `99c6c4027bf9b9a0df0c1f12dd8af594b2cffc6127f1692459cfe14675c45d1c` |
| 6 | `anxiety-9b11f4bfd677a58b` | I'm letting go of being nervous to do the hard thing first | 2026 dictation, record 2026-353, line 3065, part 10 (heading: Goals and tasks) | `9b11f4bfd677a58bf1fdcab10c2fd9f371341f0200698856dd0b839c6af8864c` |
| 7 | `anxiety-dadcd0139287335a` | I'm letting go of panicking when someone asks me for my time unexpected | 2026 dictation, record 2026-352, line 3040, part 2 (heading: PTSD) | `dadcd0139287335af10fc1938aafaa9870b25ac4537ad521c6dc329dfe4d9abc` |
| 8 | `anxiety-5eccd6ebf2c1c7f1` | I'm letting go of being scared, afraid, nervous, concerned, anxious to be misunderstood or misjudged by others | 2026 dictation, record 2026-363, line 3217, part 2 (heading: Misunderstood and judged) | `5eccd6ebf2c1c7f1c1a607ed09c75b0fb8aaae5b698352d17d6b060576586dd6` |
| 9 | `anxiety-ac1d5260a80d8ac2` | I'm letting go of being terrified of the future worried concern frustrated annoyed ashamed embarrassed defeated deflated made small insecure insufficient unclear uncertain of the future | 2026 dictation, record 2026-179, line 1025, part 2 (heading: The future) | `ac1d5260a80d8ac222e0d6d5181d98af35a2e391acab73efc2f2f5ecafedda6b` |
| 10 | `anxiety-24d2e1d119494ffc` | I'm letting go of believing I'm pissed annoyed bothered frustrated irritated anxious shy insecure humiliated embarrassed ashamed rejected abandoned defeated deflated heavy when people tell me no | 2026 dictation, record 2026-279, line 2108, part 1 (heading: No) | `24d2e1d119494ffc0e0b92dd5bfafe72773140dfbf4237923d4972925400dcd2` |
| 11 | `anxiety-92991dd0ff054c68` | I'm letting go of being nervous to be challenged | 2026 dictation, record 2026-310, line 2426, part 3 (heading: Challenge) | `92991dd0ff054c6872b004acf3f0fb450c64ef86ddb1d2441ddb44439691b0c2` |
| 12 | `anxiety-e90e128435525bb4` | I'm letting go of being nervous to ask for what I want | 2026 dictation, record 2026-338, line 2851, part 9 (heading: Just ask) | `e90e128435525bb432ecce4340217bfac59efe18b1e8ca9df1f96b1f4d77da85` |
| 13 | `anxiety-8d4d413ebcd332b5` | I'm letting go of being nervous anxious worried to not stand up for my opinion | 2026 dictation, record 2026-370, line 3320, part 12 (heading: Leadership) | `8d4d413ebcd332b5dd19cac22f23874b92ee04484c60477ab9e326da1c47c82d` |
| 14 | `anxiety-83da16a03f161be3` | I'm letting go of being nervous to be seen | 2026 dictation, record 2026-206, line 1307, part 6 (heading: Life's experiences) | `83da16a03f161be39d983e0f20ebe2d984bba3335fbc4898d123919f7ec7a034` |
| 15 | `anxiety-0a2f5da5294c8916` | I'm letting go of being nervous to speak at full volume | 2026 dictation, record 2026-244, line 1729, part 15 (heading: No one's coming to save me) | `0a2f5da5294c8916a3ac0f449017888ec4744414d566cd922b9f1853473f7899` |
| 16 | `anxiety-148a6366bdf5537d` | I'm letting go of being shy stressed tense bothered annoyed irritated frustrated ashamed anxious nervous concerned worried about using my voice | 2026 dictation, record 2026-247, line 1789, part 19 (heading: Voice) | `148a6366bdf5537db85e36a530b285a1b1983cc0a91d676d07671a56514929eb` |
| 17 | `anxiety-60dd7c2e7c338b41` | I'm letting go of being nervous to lead | 2026 dictation, record 2026-364, line 3222, part 2 (heading: Leadership) | `60dd7c2e7c338b4115ed79126929d626e29cadd52d2ef7edbfb7dfd398e0003c` |
| 18 | `anxiety-7f09cd6782d4787c` | I'm letting go of being nervous insecure shy terrified worried bothered annoyed irritated frustrated pissed off to try | 2026 dictation, record 2026-206, line 1311, part 10 (heading: Life's experiences) | `7f09cd6782d4787c18af12e35d991975a2ac6084ed7ad375b3cc04e58a157ae7` |
| 19 | `anxiety-25df69632152b29c` | I'm letting go of being worried about the thoughts of others about me | 2026 dictation, record 2026-364, line 3252, part 32 (heading: Leadership) | `25df69632152b29ce75b87dd3650d3bdb3c83811bbbcbadb9c42e554a418d86d` |
| 20 | `anxiety-a284d7625cbdd4bc` | I'm letting go of being nervous and of what people think when I lead | 2026 dictation, record 2026-364, line 3257, part 37 (heading: Leadership) | `a284d7625cbdd4bcbf0cb83a17ad8672c9228d4505e7963bd76b5905235109e9` |
| 21 | `anxiety-3a8b59900947a8fc` | I'm letting go of worrying about tomorrow | typed list B, record pdf_b-110, page 51 line 39 (heading: I forgive myself for doubting myself) | `3a8b59900947a8fc3c3b6b9b8a8096d74eb6df5acefea085530b8287f70b963e` |
| 22 | `anxiety-f978eb8640b29219` | I'm letting go of worrying about yesterday | typed list B, record pdf_b-110, page 51 line 40 (heading: I forgive myself for doubting myself) | `f978eb8640b292192fcee80a54b7cc82a2094959b88c3f78ef05d4828af4a4e0` |
| 23 | `anxiety-c09b557046e17cac` | I'm letting go of the sensation labeled anxious talking to people in positions of power | typed list B, record pdf_b-119, page 61 line 17 (heading: Sensations) | `c09b557046e17cac06188133b98eb890dcff1834e0c32dcd4822910c76c51a6e` |
| 24 | `anxiety-1d7b02f87b833637` | I'm letting go of worry about my finance | typed list B, record pdf_b-110, page 52 line 7 (heading: I forgive myself for doubting myself) | `1d7b02f87b833637266343a75a54944606f0cadca6278c47d77edd0f87a2e0bc` |
| 25 | `anxiety-8f75bcd1c6a87763` | I'm letting go of being anxious of pain | typed list B, record pdf_b-116, page 58 line 6 (heading: Fear speaking my needs) | `8f75bcd1c6a8776342ed3ac149f036b361cca86752076b7c328878ab0f4a81ce` |
| 26 | `anxiety-57445bda7436d3f2` | I'm letting go of being nervous about death | typed list B, record pdf_b-110, page 52 line 17 (heading: I forgive myself for doubting myself) | `57445bda7436d3f273f690503b08e46ead1ebd39d07f9b875f5aab115b90b154` |
| 27 | `anxiety-ac06af7c851456f7` | I'm letting go of worrying about the past | typed list B, record pdf_b-110, page 51 line 50 (heading: I forgive myself for doubting myself) | `ac06af7c851456f73e1418b2cddee5fa826b2a9aadbabd9d8791b1b29f6a11de` |
| 28 | `anxiety-e0c64b049f7017db` | I'm letting go of worrying about being sick | typed list B, record pdf_b-110, page 52 line 15 (heading: I forgive myself for doubting myself) | `e0c64b049f7017dbc501065a3bfd1c60701d6e4881bbb2354f65827179bdaecd` |
| 29 | `anxiety-2b118669e5ae5e28` | I'm letting go of worrying about my sex drive | typed list B, record pdf_b-110, page 52 line 5 (heading: I forgive myself for doubting myself) | `2b118669e5ae5e28e550cfdf5961c1c715c281af9b6cd19a551f8db48868d08e` |
| 30 | `anxiety-acf16a57d868ea81` | I'm letting go of worrying about the company failing | typed list B, record pdf_b-110, page 52 line 8 (heading: I forgive myself for doubting myself) | `acf16a57d868ea816c6a60fcff0eb2bf6f366d8b97a70ec63e775033ad78e780` |
| 31 | `anxiety-c3e0d9df2820222d` | I'm letting go of worrying about them accepting me | typed list B, record pdf_b-110, page 51 line 51 (heading: I forgive myself for doubting myself) | `c3e0d9df2820222d4ba6fe346411e7f35e36c1448a2b1e74d39b0d104f386ccb` |
| 32 | `anxiety-ce5fa944a6ca6f33` | I'm letting go of worrying about them rejecting me | typed list B, record pdf_b-110, page 52 line 1 (heading: I forgive myself for doubting myself) | `ce5fa944a6ca6f334d7549f0a42b0f1655fb130ee35c0e5791300106f4857d6d` |
| 33 | `anxiety-d32f9ddf63a9350c` | I'm letting go of worrying about what happens next | typed list B, record pdf_b-110, page 51 line 38 (heading: I forgive myself for doubting myself) | `d32f9ddf63a9350cd89454fbc45f2c50dd66ca4955788e8b4f80fd1836dd6dab` |
| 34 | `anxiety-4b094d049b997f5e` | I'm letting go of being nervous to ask for help | typed list B, record pdf_b-110, page 53 line 12 (heading: I forgive myself for doubting myself) | `4b094d049b997f5e815cd67589c8532be0a3974069a408cfd6903d9bf42618dd` |
| 35 | `anxiety-c8b681a886228f76` | I'm letting go of the story I'm nervous about confrontation | typed list B, record pdf_b-110, page 52 line 26 (heading: I forgive myself for doubting myself) | `c8b681a886228f76cc0f6537c40d2430d646a7798dbb1dc924e4a6d3aeca6805` |
| 36 | `anxiety-12e0ba835551c7dd` | I'm letting go of worrying if I will never love again | typed list B, record pdf_b-110, page 51 line 46 (heading: I forgive myself for doubting myself) | `12e0ba835551c7ddd490bf3eb7a7afe63ce79c07a617b70b807c4a849107277b` |
| 37 | `anxiety-20fe3e1a7b7c2edb` | I'm letting go of being nervous of taking full responsibility for my life | typed list B, record pdf_b-109, page 49 line 44 (heading: Temptation) | `20fe3e1a7b7c2edbed3e941f3192a6be939010e12188a747142b677d7a50077f` |
| 38 | `anxiety-6cc0da0962a8faa5` | I'm letting go of being nervous asking people to do things for me | typed list B, record pdf_b-110, page 53 line 10 (heading: I forgive myself for doubting myself) | `6cc0da0962a8faa53a85dd7ba1c80bdd778083d169937177086aeacbb5cc1e13` |
| 39 | `anxiety-b88d140e25874a87` | I'm letting go of the story I'm worried I'll be hurt during a conversation | typed list B, record pdf_b-110, page 52 line 27 (heading: I forgive myself for doubting myself) | `b88d140e25874a87d9a69831210150d56393adf1c2b2ee83d1355f1421541859` |
| 40 | `anxiety-0abc5a502fc35482` | I'm letting go of being scared about aging | 2026 dictation, record 2026-351, line 3032, part 3 (heading: Looks) | `0abc5a502fc354828ec02b49b19f214628bc5afd4e4f5da7a205c6f6697fd3c6` |
| 41 | `anxiety-0c47fe24bd32f946` | I'm letting go of being scared to lead | 2026 dictation, record 2026-364, line 3235, part 15 (heading: Leadership) | `0c47fe24bd32f946f1debcb955f88239f07cf389de0f0a5556ca9ff53bfab6ca` |
| 42 | `anxiety-316a48e514fc3c0e` | I'm letting go of being scared to try | 2026 dictation, record 2026-206, line 1310, part 9 (heading: Life's experiences) | `316a48e514fc3c0e3206295c4e4cee9b2a2548d96ef6ba5f33273a4c0a938a67` |
| 43 | `anxiety-71563455ba28727c` | I'm letting go of being afraid of change | 2026 dictation, record 2026-311, line 2438, part 1 (heading: Change) | `71563455ba28727c212967bf25555c4779db07e262164f17d5706b524da39753` |
| 44 | `anxiety-a7c162227fde21ad` | I'm letting go of being scared of crowds | 2026 dictation, record 2026-305, line 2366, part 4 (heading: Epigenetics) | `a7c162227fde21add490a07b700b1e856c65d402ccb873a0ad1b83b2cfc7c91d` |
| 45 | `anxiety-ed3d77d87770a031` | I'm letting go of being scared to succeed | 2026 dictation, record 2026-349, line 3013, part 5 (heading: Defeated) | `ed3d77d87770a031da383d79886a34dde0aa0e864ebb9c1099d7003ef6d5c833` |
| 46 | `anxiety-163f4be22d4a45c9` | I'm letting go of being terrified for the world | 2026 dictation, record 2026-373, line 3393, part 10 (heading: Immature) | `163f4be22d4a45c9345267245f7ed6c10a8d24424348452f9bd7b61d2aac1318` |
| 47 | `anxiety-24ef5a30f37acb69` | I'm letting go of being afraid to be myself | 2026 dictation, record 2026-258, line 1928, part 26 (heading: Ego) | `24ef5a30f37acb69e6efabbcd7d82cdc6f108b6d9a2a30a62c364d3a32b18f71` |
| 48 | `anxiety-4af2010b500f5b00` | I'm letting go of believing I'm afraid of death | 2026 dictation, record 2026-248, line 1793, part 1 (heading: Death) | `4af2010b500f5b0029427b9a7451cf074f791c98079a4d62c9e30c88089223a9` |
| 49 | `anxiety-c80e6ad6b42514c9` | I'm letting go of believing I'm afraid of conflict | 2026 dictation, record 2026-304, line 2354, part 1 (heading: Conflict) | `c80e6ad6b42514c957b15b35573567deba2421b1ca67373640afdf49a64ef8aa` |
| 50 | `anxiety-24dcc562e351525f` | I'm letting go of believing I'm afraid to lose power | 2026 dictation, record 2026-313, line 2492, part 27 (heading: Progress) | `24dcc562e351525fa98e97b04150b8306b28a99b36bdb735ace4d3caeb43adfa` |
| 51 | `anxiety-756181ba4ae2f98b` | I'm letting go of believing I'm afraid to expose myself | 2026 dictation, record 2026-244, line 1720, part 6 (heading: No one's coming to save me) | `756181ba4ae2f98baf7806ab2f36c86904763a50a85d9198892339eae7d6332d` |
| 52 | `anxiety-8250722f61124209` | I'm letting go of not trying over fear of failure | 2026 dictation, record 2026-341, line 2890, part 20 (heading: Self Doubt) | `8250722f61124209b47797f950c733ed963b2a94dfced346398af4c74c9f4433` |
| 53 | `anxiety-9d948eb86e683e28` | I'm letting go of being scared to create a pattern | 2026 dictation, record 2026-202, line 1262, part 2 (heading: Scared to set routine) | `9d948eb86e683e284a05e4e44ffd25657bff96d6bb8f7e8a357694875af93cc4` |
| 54 | `anxiety-c9ee77f47c3dc117` | I'm letting go of being scared to feel my emotions | 2026 dictation, record 2026-331, line 2737, part 2 (heading: Feel) | `c9ee77f47c3dc1176bb60c03df360f2a831d22ce48a8e2b600f8e3828889b8d9` |
| 55 | `anxiety-cd9e02ac6fbc4896` | I'm letting go of being scared to fill my shoes | 2026 dictation, record 2026-370, line 3318, part 10 (heading: Leadership) | `cd9e02ac6fbc48966535941ce30999093fcda1499953e40b3e446e02762c500f` |
| 56 | `anxiety-d85dc929fadce4ab` | I'm letting go of being scared to make new friends | 2026 dictation, record 2026-321, line 2591, part 1 (heading: Making new friends) | `d85dc929fadce4ab6ee5e2d13943bd5e148a08f80962657d73a5d365fd14cd71` |
| 57 | `anxiety-dbba0fbea3807fea` | I'm letting go of believing I'm easily startled or scared | 2026 dictation, record 2026-256, line 1891, part 1 (heading: Scared and startled) | `dbba0fbea3807fea594bc53dd48ddfe8e61d0b091b0076fb5a833cd7e690edf9` |
| 58 | `anxiety-e59cb7504079f000` | I'm letting go of minimizing my voice out of fear | 2026 dictation, record 2026-247, line 1777, part 7 (heading: Voice) | `e59cb7504079f000f3d4caaadf1c761215f0d916231b946be7cfaca59a299e74` |
| 59 | `anxiety-4e9544807306a231` | I'm letting go of being scared and impatient when I'm bored | 2026 dictation, record 2026-065, line 321, part 2 (heading: Boredom) | `4e9544807306a2313e0e8c35cd39e760907afb6193adcb4f59bbd1019d41e5ef` |
| 60 | `anxiety-9d514cc192c68731` | I'm letting go of being afraid to speak up for myself | 2026 dictation, record 2026-374, line 3454, part 18 (heading: Be at rest) | `9d514cc192c68731fac5d1623be294b203da9063405cefb6b27133247533bcb1` |
| 61 | `anxiety-c991af0924db1f2e` | I'm letting go of believing I'm scared to ask for help | 2026 dictation, record 2026-188, line 1084, part 3 (heading: Looking dumb) | `c991af0924db1f2e18e9d76b60ba392bb297d8738c6fe87ada24f015e879bfcf` |
| 62 | `anxiety-64e89ce930462854` | I'm letting go of being scared to ask for what I want | 2026 dictation, record 2026-338, line 2850, part 8 (heading: Just ask) | `64e89ce930462854f3866689abe653e4dd5eb1fcd710037c6ad49ad0dcd0bb73` |
| 63 | `anxiety-fa6b5f73bae73c30` | I'm letting go of being terrified at the state of our finances | 2026 dictation, record 2026-102, line 574, part 1 (heading: Finances) | `fa6b5f73bae73c3031cd93b3ed8013ccedc5a6f862cb9575ec92e89a7c66563e` |
| 64 | `anxiety-182073f54dcad160` | I'm letting go of rejecting abundance out of scarcity or smallness or fear | 2026 dictation, record 2026-018, line 82, part 3 (heading: Money) | `182073f54dcad160eb125908773521347a3c64dd6d5217de8b0eda61971ce4a9` |
| 65 | `anxiety-4497a0fe7350c950` | I'm letting go of believing I'm scared to take control of my space | 2026 dictation, record 2026-204, line 1291, part 13 (heading: Kingsley status) | `4497a0fe7350c9507f82dcd751ec94b0060162a639758bea5d523a81244b8988` |
| 66 | `anxiety-a11ed4505458962a` | I'm letting go of believing I'm scared and don't know what to do next | 2026 dictation, record 2026-197, line 1177, part 8 (heading: Hard) | `a11ed4505458962a4c1200e76728e2a086814afe95f5a621ad014f2c006a41b9` |
| 67 | `anxiety-e03792399f70954c` | I'm letting go of fearing judgment of others when I reveal or show my art | 2026 dictation, record 2026-317, line 2537, part 11 (heading: Master artistry) | `e03792399f70954c9778808fe6ac07f9171f52f104b80193855e1201c6dde532` |
| 68 | `anxiety-0de4815c06cb17dc` | I'm letting go of being scared to conquer | 2026 dictation, record 2026-364, line 3244, part 24 (heading: Leadership) | `0de4815c06cb17dc165a4147f714faf7ba0c5d951d8e961b1c29192dafd63276` |
| 69 | `anxiety-44345275912696e2` | I'm letting go of being scared to be myself | 2026 dictation, record 2026-258, line 1929, part 27 (heading: Ego) | `44345275912696e23826ab243f4bb0b5571b506292d8f4f8c0fdc2b988373ca8` |
| 70 | `anxiety-45fe48e6b87ac4b0` | I'm letting go of being afraid to be seen | 2026 dictation, record 2026-206, line 1306, part 5 (heading: Life's experiences) | `45fe48e6b87ac4b004a9a7e57b2b255f26e96c4821992cb406c1b1109cd51dea` |
| 71 | `anxiety-7d3df0fca37a11ec` | I'm letting go of believing I'm afraid of crowds | 2026 dictation, record 2026-305, line 2365, part 3 (heading: Epigenetics) | `7d3df0fca37a11ece4a659c4e02138983dff1a7118e59f76e51a509890fce33f` |
| 72 | `anxiety-a7d99927b8385d1c` | I'm letting go of being afraid to make mistakes | 2026 dictation, record 2026-375, line 3467, part 4 (heading: I want to go being self-righteous) | `a7d99927b8385d1c3e1842d019109b0ef709d0354f0b917e791556e9a15211d2` |
| 73 | `anxiety-cbea588e54fcea10` | I'm letting go of being frightened for the world | 2026 dictation, record 2026-373, line 3392, part 9 (heading: Immature) | `cbea588e54fcea1040e4d00c35365636eeb5b265864412ed75fd16c4f6f1950f` |
| 74 | `anxiety-b8819da6ddb29c83` | I'm letting go of believing I'm afraid to be vulnerable | 2026 dictation, record 2026-244, line 1719, part 5 (heading: No one's coming to save me) | `b8819da6ddb29c83482f02e14faf11a43da187dab76f0f9bf429dede6689f0c9` |
| 75 | `anxiety-d4241c415c162745` | I'm letting go of being scared to win my game | 2026 dictation, record 2026-349, line 3014, part 6 (heading: Defeated) | `d4241c415c162745a171256a41fa9e01a51cec6c60060e208af411964a90e0b1` |
| 76 | `anxiety-a0e7cd9bc25bf027` | I'm letting go of believing I'm scared to set a routine | 2026 dictation, record 2026-202, line 1261, part 1 (heading: Scared to set routine) | `a0e7cd9bc25bf027e0f5b043185ec9ee4096b2a73d595e6a340fa273b7b9ffd6` |
| 77 | `anxiety-cbee5cd6c7a4ffdf` | I'm letting go of believing I'm scared to use my voice | 2026 dictation, record 2026-247, line 1788, part 18 (heading: Voice) | `cbee5cd6c7a4ffdff5e9834dcec1dc26b5cbff1ea136b5b5a9f5f4777e5493da` |
| 78 | `anxiety-d3252d08d8b6ca2e` | I'm letting go of believing I'm shocked easily terrified mortified horrified easily | 2026 dictation, record 2026-256, line 1893, part 3 (heading: Scared and startled) | `d3252d08d8b6ca2eddcbfea9379e639f455131e159938f90f378d892880adf91` |
| 79 | `anxiety-51b41fc5677d9b45` | I'm letting go of being scared to do my job with maximum effort | 2026 dictation, record 2026-355, line 3085, part 7 (heading: Doing Your Best) | `51b41fc5677d9b451ecd2410556cc16ed9ffa2e9a215c23bd7cdd696905ba437` |
| 80 | `anxiety-acf1c5b468a09b3f` | I'm letting go of believing I'm scared to look like I don't know | 2026 dictation, record 2026-188, line 1083, part 2 (heading: Looking dumb) | `acf1c5b468a09b3f740e68f577f5616c330f923df5de15f548727b1d1079823f` |
| 81 | `anxiety-b98d2d19ade5beeb` | I'm letting go of believing I'm afraid to take control over my space | 2026 dictation, record 2026-204, line 1291, part 12 (heading: Kingsley status) | `b98d2d19ade5beeb0c554e6ca016051064677fec27d50001f7cf57e968325a68` |
| 82 | `anxiety-495862b4e28c0fe7` | I'm letting go of being afraid to lead | 2026 dictation, record 2026-364, line 3234, part 14 (heading: Leadership) | `495862b4e28c0fe7a27aee960a7b111139f9eb16ff853fb0a8b2209657c1f1b4` |
| 83 | `anxiety-bf894b0ccf68f7cd` | I'm letting go of believing I'm scared to become | 2026 dictation, record 2026-258, line 1910, part 7 (heading: Ego) | `bf894b0ccf68f7cd2432bd71ef4fb7572b9c030048bb0684787cfd43e93e7c5a` |
| 84 | `anxiety-d0d946f65130eb9b` | I'm letting go of being afraid to be challenged | 2026 dictation, record 2026-310, line 2424, part 1 (heading: Challenge) | `d0d946f65130eb9b6c2a944258f441ae3240f129458702813ebbcbbfbca0ab14` |
| 85 | `anxiety-260422a604f9c3c2` | I'm letting go of feeling afraid to speak the truth | 2026 dictation, record 2026-373, line 3425, part 42 (heading: Immature) | `260422a604f9c3c2a443efeff9ce097fb8870604e4dd2bb5439ec98787092edf` |
| 86 | `anxiety-d930c0907dce79c5` | I'm letting go of being scared to do my job with the highest quality service | 2026 dictation, record 2026-355, line 3086, part 8 (heading: Doing Your Best) | `d930c0907dce79c598c931c6b55b1d92f81ae6e52d096c06b468846799f43db0` |
| 87 | `anxiety-16cf5cd3d3a2efea` | I'm letting go of being scared I will be rejected if I ask for what I want | 2026 dictation, record 2026-338, line 2852, part 10 (heading: Just ask) | `16cf5cd3d3a2efea29a57d80b2a87dc891148a03998957af9214dca4e06e3509` |
| 88 | `anxiety-9bd290c566e5e64d` | I'm letting go of being scared to create a natural rhythm so that I can be successful | 2026 dictation, record 2026-202, line 1263, part 3 (heading: Scared to set routine) | `9bd290c566e5e64d82622efa43ad2d806003a95a1032eddd3611b017ee6c6d10` |
| 89 | `anxiety-854340930a4e1e09` | I'm letting go of being afraid of life's experiences | 2026 dictation, record 2026-206, line 1302, part 1 (heading: Life's experiences) | `854340930a4e1e099ba7cfcdf51dd4e44a8ceb6d3bdd7516695193cc6e58de1f` |
| 90 | `anxiety-4ad34641486b94dd` | I'm letting go of being scared to speak the truth | 2026 dictation, record 2026-373, line 3423, part 40 (heading: Immature) | `4ad34641486b94ddf195120174fb44133a0f5a8ebc1f250675bfddf72ab1c653` |
| 91 | `anxiety-9b9be20c6d564e01` | I'm letting go of believing I'm scared to become who I'm supposed to be | 2026 dictation, record 2026-258, line 1911, part 8 (heading: Ego) | `9b9be20c6d564e011b5e294b6f60a114a325f0759ba127cfca2869166a036901` |
| 92 | `anxiety-7dff1f25e42996a1` | I'm letting go of being scared to compete | 2026 dictation, record 2026-364, line 3246, part 26 (heading: Leadership) | `7dff1f25e42996a173d6422b83133c7c2fe8acf8c38d611730e9a3390b380767` |
| 93 | `anxiety-b0381810f470969b` | I'm letting go of being terrified to speak the truth | 2026 dictation, record 2026-373, line 3429, part 46 (heading: Immature) | `b0381810f470969b928bef76b28b52ab6489ca6d37714fbc792ac8478e1d2208` |
| 94 | `anxiety-f7d15c802626d300` | I'm letting go of being terrified to take a leap of faith | 2026 dictation, record 2026-206, line 1304, part 3 (heading: Life's experiences) | `f7d15c802626d300c5584ca05e417978d08be565492f37192ff3e932267bfe9d` |
| 95 | `anxiety-fb08fb050e44b989` | I'm letting go of being afraid to be at peace | 2026 dictation, record 2026-373, line 3436, part 53 (heading: Immature) | `fb08fb050e44b9895e5cb6f47aa0e1e1c736b3e14190a464154e88321e30ea88` |
| 96 | `anxiety-ec893e1ac9992c2b` | I'm letting go of being scared to put myself out there | 2026 dictation, record 2026-364, line 3255, part 35 (heading: Leadership) | `ec893e1ac9992c2ba24bed38546f20ec0051983eff54922d78b46b91532cde74` |
| 97 | `anxiety-d839e6cf9e822dbe` | I'm letting go of being scared to get caught in a lie | 2026 dictation, record 2026-373, line 3431, part 48 (heading: Immature) | `d839e6cf9e822dbeedca02f195853f2ab74abaf515bb7689f0a99203ebb57ce8` |
| 98 | `anxiety-dbf2ac36a02434c6` | I'm letting go of being scared to put myself out there to lead | 2026 dictation, record 2026-364, line 3256, part 36 (heading: Leadership) | `dbf2ac36a02434c6adb9e0157118d846767b9acc88af83ead0dc2737aa2b7be5` |
| 99 | `anxiety-1c6b1a9b6c89622e` | I'm letting go of being scared that I don't have The bravery to lead | 2026 dictation, record 2026-364, line 3243, part 23 (heading: Leadership) | `1c6b1a9b6c89622e7a85e85c6c8235b21b71e993d24094aa5e6bf3432ce22a58` |
| 100 | `anxiety-3fbc94013e5e5681` | I'm letting go of fearing originality | typed list B, record pdf_b-101, page 34 line 22 (heading: Creative) | `3fbc94013e5e568149d527b07d4dc9db816895e43e9eed244ca6cf0779c96bdd` |

## How you approve

Reply "I approve anxiety bank anxiety-candidate-2026-10-16-v1, hash 8647ef2b2202cf517cdd56930f9ce12d5a4a16988898f16fdca9d35923986735" and that reply, with your name and the time, goes into the bank's three empty approval fields; name line numbers instead and those lines are swapped for reserve lines under a new version and a new hash.

## Files

- Bank: `HANDOFF-2026-10-15/giftbank/anxiety/banks/anxiety.json`
- Item schema, not approved: `HANDOFF-2026-10-15/giftbank/anxiety/schema.json`
- Map from nature to track, empty on purpose: `HANDOFF-2026-10-15/giftbank/anxiety/mapping.json`
- Reserve, the 82 ranked next: `HANDOFF-2026-10-15/giftbank/anxiety/anxiety-reserve.json`
- Everything left out, with its reason: `HANDOFF-2026-10-15/giftbank/anxiety/anxiety-held.json`
- Validator output: `HANDOFF-2026-10-15/giftbank/anxiety/validator-run-2026-10-16.stdout.json`, `.stderr.txt`, `.exit.txt`
- Scripts that cut, pick, build and recheck: `HANDOFF-2026-10-15/giftbank/tools/`
