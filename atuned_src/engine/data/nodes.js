/* ============================================================
   THE 112 ADDRESSES. 108 somatic, seated at a named plexus or
   nerve, plus 4 field anchors above and below the body.
   ============================================================ */
const NODES=
[{"i":1,"k":"Fear","b":"Root","n":"Lumbar Plexus","a":"Instinct, threat","d":"Avoidance","c":"Fear"},{"i":2,"k":"Shame","b":"Root","n":"Pudendal Nerve","a":"Worth, embodiment","d":"Self-rejection","c":"Shame"},{"i":3,"k":"Guilt","b":"Root","n":"Inferior Hypogastric Plexus","a":"Responsibility","d":"Overcompensation","c":"Shame"},{"i":4,"k":"Control","b":"Root","n":"Sacral Nerves","a":"Safety through force","d":"Domination","c":"Fear"},{"i":5,"k":"Insecurity","b":"Root","n":"Pelvic Nerve","a":"Belonging","d":"Dependency","c":"Fear"},{"i":6,"k":"Victimhood","b":"Root","n":"Coccygeal Plexus","a":"Agency","d":"Blame","c":"Sadness"},{"i":7,"k":"Scarcity","b":"Root","n":"Iliac Nerve Branch","a":"Resources","d":"Hoarding","c":"Fear"},{"i":8,"k":"Root_08_Unnamed","b":"Root","n":"Cauda Equina","a":"Privilege","d":"Deservingness","c":null},{"i":9,"k":"Possession","b":"Root","n":"Gluteal Nerve","a":"Attachment","d":"Control of objects","c":"Shock"},{"i":10,"k":"Lethargy","b":"Root","n":"Obturator Nerve","a":"Momentum","d":"Stagnation","c":"Sadness"},{"i":11,"k":"Resistance","b":"Root","n":"Perineal Branch","a":"Change","d":"Holding on","c":"Fear"},{"i":12,"k":"Compulsion","b":"Root","n":"Pelvic Floor Nerves","a":"Safety rituals","d":"Fixation","c":"Fear"},{"i":13,"k":"Disconnection","b":"Root","n":"Sacral Root Ganglia","a":"Presence","d":"Numbness","c":"Sadness"},{"i":14,"k":"Escapism","b":"Root","n":"Sciatic Nerve","a":"Facing pain","d":"Running","c":"Joy"},{"i":15,"k":"Panic","b":"Root","n":"Lumbar Sympathetic Chain","a":"Reaction","d":"Unconsciousness","c":"Fear"},{"i":16,"k":"Collapse","b":"Root","n":"Spinal Cord Base","a":"Structure","d":"Abandoning Self","c":"Sadness"},{"i":17,"k":"Addiction","b":"Sacral","n":"Sacral Plexus","a":"Craving","d":"Obsession","c":"Joy"},{"i":18,"k":"Lust","b":"Sacral","n":"Genitofemoral Nerve","a":"Desire","d":"Objectification","c":"Joy"},{"i":19,"k":"Envy","b":"Sacral","n":"Internal Pudendal Nerve","a":"Lack","d":"Hatred of others' joy","c":"Resentment"},{"i":20,"k":"Jealousy","b":"Sacral","n":"Obturator Nerve","a":"Possessiveness","d":"Paranoia","c":"Resentment"},{"i":21,"k":"Co-Dependency","b":"Sacral","n":"Pelvic Splanchnic Nerves","a":"Neediness","d":"Self-abandonment","c":"Disgust"},{"i":22,"k":"Shame Of Desire","b":"Sacral","n":"Hypogastric Plexus","a":"Repression","d":"Suppression","c":"Joy"},{"i":23,"k":"Hypersexuality","b":"Sacral","n":"Pudendal Plexus","a":"Validation","d":"Dissociation","c":"Joy"},{"i":24,"k":"Avoidance Of Pleasure","b":"Sacral","n":"Pelvic Nerve","a":"Sensuality","d":"Denial of life","c":"Joy"},{"i":25,"k":"Manipulation Through Emotion","b":"Sacral","n":"Uterovaginal Plexus","a":"Control","d":"Emotional blackmail","c":"Anger"},{"i":26,"k":"Oversensitivity","b":"Sacral","n":"Inferior Hypogastric Plexus","a":"Pain threshold","d":"Victim reactivity","c":"Shock"},{"i":27,"k":"Fantasy","b":"Sacral","n":"Splanchnic Root","a":"Escapism","d":"Delusion","c":"Joy"},{"i":28,"k":"Infatuation","b":"Sacral","n":"Lumbar-Sacral Overlap","a":"Projection","d":"Idealization","c":"Joy"},{"i":29,"k":"Obsession","b":"Sacral","n":"Pelvic Ganglia","a":"Focus","d":"Fixation","c":"Fear"},{"i":30,"k":"Guilt Of Pleasure","b":"Sacral","n":"Sacral Outflow","a":"Joy","d":"Self-denial","c":"Joy"},{"i":31,"k":"Need For Approval","b":"Sacral","n":"Iliac Branches","a":"Identity in others","d":"Conformity","c":"Shame"},{"i":32,"k":"Excess Emotion","b":"Sacral","n":"Urogenital Nerve","a":"Drama","d":"Flooding","c":"Shock"},{"i":33,"k":"Pride","b":"Solar","n":"Celiac Plexus","a":"Self-importance","d":"Superiority","c":"Anger"},{"i":34,"k":"Arrogance","b":"Solar","n":"Greater Splanchnic Nerve","a":"Ego","d":"Inflated Self","c":"Anger"},{"i":35,"k":"Competition","b":"Solar","n":"Aortic Plexus","a":"Comparison","d":"Division","c":"Anger"},{"i":36,"k":"Anger","b":"Solar","n":"Celiac Plexus","a":"Power misused","d":"Attack","c":"Anger"},{"i":37,"k":"Judgment","b":"Solar","n":"Splanchnic Plexus","a":"Othering","d":"Projection","c":"Anger"},{"i":38,"k":"Entitlement","b":"Solar","n":"Renal Plexus","a":"Control of outcomes","d":"Deserving","c":"Anger"},{"i":39,"k":"Rebellion","b":"Solar","n":"Renal Ganglia","a":"Defiance","d":"Misalignment","c":"Anger"},{"i":40,"k":"Perfectionism","b":"Solar","n":"Mesenteric Plexus","a":"Idealism","d":"Rigidity","c":"Fear"},{"i":41,"k":"Force","b":"Solar","n":"Splenic Plexus","a":"Control over flow","d":"Overpowering","c":"Fear"},{"i":42,"k":"Rigidity","b":"Solar","n":"Pancreatic Plexus","a":"Will","d":"Inflexibility","c":"Fear"},{"i":43,"k":"Resentment (Solar)","b":"Solar","n":"Suprarenal Plexus","a":"Grudge","d":"Recycled anger","c":"Resentment"},{"i":44,"k":"Unworthiness","b":"Solar","n":"Inferior Mesenteric Plexus","a":"Confidence","d":"Minimization","c":"Shame"},{"i":45,"k":"Anxiety","b":"Solar","n":"Adrenal Medulla","a":"Control of outcomes","d":"Future fear","c":"Fear"},{"i":46,"k":"Self-Judgment (Solar)","b":"Solar","n":"Epigastric Branches","a":"Inner war","d":"Invalidation","c":"Shame"},{"i":47,"k":"Need To Win","b":"Solar","n":"Vagus-Liver Plexus","a":"Ego","d":"Domination","c":"Anger"},{"i":48,"k":"Superiority","b":"Solar","n":"Hepatic Nerve","a":"Hierarchy","d":"Distinction","c":"Anger"},{"i":49,"k":"Hatred","b":"Heart","n":"Cardiac Plexus","a":"Forgiveness","d":"Vengeance","c":"Anger"},{"i":50,"k":"Resentment (Heart)","b":"Heart","n":"Thoracic Nerves","a":"Holding pain","d":"Withholding love","c":"Resentment"},{"i":51,"k":"Self-Judgment (Heart)","b":"Heart","n":"Vagus Nerve","a":"Grace","d":"Harshness","c":"Shame"},{"i":52,"k":"Betrayal","b":"Heart","n":"Thoracic Plexus","a":"Trust","d":"Abandonment","c":"Shock"},{"i":53,"k":"Separation","b":"Heart","n":"Pericardial Nerve","a":"Unity","d":"Isolation","c":"Sadness"},{"i":54,"k":"Martyrdom","b":"Heart","n":"Intercostal Nerves","a":"Self-sacrifice","d":"Guilt-driven love","c":"Sadness"},{"i":55,"k":"Longing","b":"Heart","n":"Cardiac Nerve Plexus","a":"Presence","d":"Fantasy","c":"Sadness"},{"i":56,"k":"Closed Heart","b":"Heart","n":"Costal Branches","a":"Vulnerability","d":"Armor","c":"Sadness"},{"i":57,"k":"Manipulative Kindness","b":"Heart","n":"Phrenic Nerve","a":"Motive","d":"Transactional giving","c":"Anger"},{"i":58,"k":"Expectation","b":"Heart","n":"Pulmonary Nerve Plexus","a":"Outcome","d":"Contractual love","c":"Fear"},{"i":59,"k":"Blame","b":"Heart","n":"Thoracic Ganglia","a":"Responsibility","d":"Externalization","c":"Anger"},{"i":60,"k":"False Love","b":"Heart","n":"Anterior Thoracic Roots","a":"Image","d":"Projection","c":"Disgust"},{"i":61,"k":"Rejection","b":"Heart","n":"Vagal Branches","a":"Inclusion","d":"Othering","c":"Sadness"},{"i":62,"k":"Avoidance Of Grief","b":"Heart","n":"Great Cardiac Nerve","a":"Loss","d":"Suppression","c":"Joy"},{"i":63,"k":"Need To Be Needed","b":"Heart","n":"Coronary Plexus","a":"Identity","d":"Validation","c":"Disgust"},{"i":64,"k":"Deceit","b":"Throat","n":"Cervical Plexus","a":"Honesty","d":"Manipulation","c":"Disgust"},{"i":65,"k":"Self-Silencing","b":"Throat","n":"Vagus Nerve","a":"Voice","d":"Withholding","c":"Shame"},{"i":66,"k":"People Pleasing","b":"Throat","n":"Superior Laryngeal Nerve","a":"Approval","d":"Inauthenticity","c":"Shame"},{"i":67,"k":"Lying","b":"Throat","n":"Recurrent Laryngeal Nerve","a":"Integrity","d":"Protection","c":"Disgust"},{"i":68,"k":"Interrupting","b":"Throat","n":"Pharyngeal Nerve","a":"Listening","d":"Imposition","c":"Anger"},{"i":69,"k":"Comparison","b":"Throat","n":"Accessory Nerve","a":"Voice Identity","d":"Envy","c":"Shame"},{"i":70,"k":"Excuse","b":"Throat","n":"Glossopharyngeal Nerve","a":"Ownership","d":"Victimization","c":"Disgust"},{"i":71,"k":"Stage Performing","b":"Throat","n":"Laryngeal Plexus","a":"Image","d":"Persona","c":"Shock"},{"i":72,"k":"Speaking To Be Right","b":"Throat","n":"Cervical Ganglia","a":"Ego","d":"Righteousness","c":"Anger"},{"i":73,"k":"Manic Expression","b":"Throat","n":"Spinal Accessory Nerve","a":"Over-talking","d":"Energy discharge","c":"Shock"},{"i":74,"k":"Talking To Avoid Feeling","b":"Throat","n":"Subclavian Nerve","a":"Presence","d":"Avoidance","c":"Shock"},{"i":75,"k":"Spiritual Language To Manipulate","b":"Throat","n":"Brachial Plexus","a":"Belonging","d":"Performance","c":"Disgust"},{"i":76,"k":"Delusion","b":"3rd Eye","n":"Optic Nerve","a":"Truth","d":"Illusion","c":"Disgust"},{"i":77,"k":"Cynicism","b":"3rd Eye","n":"Oculomotor Nerve","a":"Clarity","d":"Dismissal","c":"Disgust"},{"i":78,"k":"Distrust","b":"3rd Eye","n":"Abducens Nerve","a":"Faith","d":"Suspicion","c":"Fear"},{"i":79,"k":"Hypervigilance","b":"3rd Eye","n":"Optic Chiasm","a":"Control","d":"Overthinking","c":"Fear"},{"i":80,"k":"Dogma","b":"3rd Eye","n":"Pineal Gland","a":"Belief","d":"Rigidity","c":"Disgust"},{"i":81,"k":"Overanalysis","b":"3rd Eye","n":"Trigeminal Nerve","a":"Clarity","d":"Paralysis","c":"Shock"},{"i":82,"k":"Projection","b":"3rd Eye","n":"Visual Cortex","a":"Othering","d":"Blame","c":"Disgust"},{"i":83,"k":"Paranoia","b":"3rd Eye","n":"Lateral Geniculate","a":"Fear","d":"Narrative spinning","c":"Fear"},{"i":84,"k":"Distortion","b":"3rd Eye","n":"Occipital Nerve","a":"Reality","d":"Mis-seeing","c":"Disgust"},{"i":85,"k":"Doubt","b":"3rd Eye","n":"Cortical Visual Pathway","a":"Intuition","d":"Dismissal","c":"Fear"},{"i":86,"k":"Idealism","b":"3rd Eye","n":"Supraoptic Nucleus","a":"Fantasy","d":"Denial of reality","c":"Joy"},{"i":87,"k":"Lack Of Discernment","b":"3rd Eye","n":"Thalamus","a":"Perception","d":"Blind trust","c":"Disgust"},{"i":88,"k":"Doubt Of Source","b":"Crown","n":"Corpus Callosum","a":"Faith","d":"Separation","c":"Resentment"},{"i":89,"k":"Hubris","b":"Crown","n":"Prefrontal Cortex","a":"Alignment","d":"Ego-God complex","c":"Anger"},{"i":90,"k":"Spiritual Pride","b":"Crown","n":"Pineal-Hypothalamic Axis","a":"Insight","d":"Superiority","c":"Disgust"},{"i":91,"k":"Nihilism","b":"Crown","n":"Parietal Cortex","a":"Meaning","d":"Apathy","c":"Sadness"},{"i":92,"k":"Spiritual Escapism","b":"Crown","n":"Dorsal Raphe Nucleus","a":"Presence","d":"Bypass","c":"Joy"},{"i":93,"k":"False Humility","b":"Crown","n":"Frontal Lobe","a":"Disguise","d":"Manipulation","c":"Shame"},{"i":94,"k":"Seeking Validation","b":"Crown","n":"Cerebral Cortex","a":"Ego","d":"Worship addiction","c":"Shame"},{"i":95,"k":"Savior Complex","b":"Crown","n":"Posterior Cingulate","a":"Responsibility","d":"Overreach","c":"Disgust"},{"i":96,"k":"Condemnation","b":"Crown","n":"Reticular Formation","a":"Mercy","d":"Judgment","c":"Anger"},{"i":97,"k":"Need To Be Special","b":"Crown","n":"Anterior Cingulate","a":"Identity","d":"Distinction","c":"Disgust"},{"i":98,"k":"Unworthy Of Source","b":"Crown","n":"Pineal-Amygdala Axis","a":"Divinity","d":"Disbelief","c":"Resentment"},{"i":99,"k":"Knowing Better Than Source","b":"Crown","n":"Default Mode Network","a":"Will","d":"Arrogance","c":"Resentment"},{"i":100,"k":"Denial Of Truth","b":"Crown","n":"Medial Forebrain Bundle","a":"Insight","d":"Resistance","c":"Resentment"},{"i":101,"k":"Rejection Of Spirit","b":"Crown","n":"Posterior Commissure","a":"Divinity","d":"Abandonment","c":"Resentment"},{"i":102,"k":"Fear Of Source","b":"Crown","n":"Temporal Lobe","a":"Love","d":"Dread","c":"Resentment"},{"i":103,"k":"Anger At Source","b":"Crown","n":"Hypothalamus","a":"Trust","d":"Rebellion","c":"Resentment"},{"i":104,"k":"Forgetfulness","b":"Crown","n":"Hippocampus","a":"Identity","d":"Amnesia","c":"Sadness"},{"i":105,"k":"Denial Of Light","b":"Crown","n":"Epithalamus","a":"Revelation","d":"Avoidance","c":"Resentment"},{"i":106,"k":"Rejection Of Unity","b":"Crown","n":"Neocortex","a":"Connection","d":"Separation","c":"Resentment"},{"i":107,"k":"Self-Exclusion","b":"Crown","n":"Superior Sagittal Sinus","a":"Belonging","d":"Disconnection","c":"Shame"},{"i":108,"k":"Endless Seeking","b":"Crown","n":"Ascension Column","a":"Arrival","d":"Never enough","c":"Sadness"},{"i":109,"k":"Sol Star","b":"Field-Above","n":null,"a":"Higher Self anchor","d":"field","c":null},{"i":110,"k":"Stellar Gateway","b":"Field-Above","n":null,"a":"Source connection","d":"field","c":null},{"i":111,"k":"Earth Star","b":"Field-Below","n":null,"a":"Grounding anchor","d":"field","c":null},{"i":112,"k":"Gaia Gateway","b":"Field-Below","n":null,"a":"Cosmic anchor","d":"field","c":null}];
/* ============================================================
   SAB_LIB · each named saboteur's three addresses and its family.

   compute() names a row on the address route when the mean load of its three
   addresses reaches 3.7, and draws it there; the card prints them under
   Connected (kbSabLinked, ui/drills.js); the family is the hyper-complex it
   compounds into. The engine reads an address only through the charge it
   carries, n.cf, so three addresses are three charges at three places.

   EVERY ROW IS HELD TO FOUR RULES, and tests/engine.js, SL, checks each one
   on every row:
     1. by name, against its own words: SABDEF's definition, trigger and
        sentence in kb.js, SABAUTH's composition in canon.js, and the line
        the owner's TULA notes give it where they say more. Each note says
        which words each address answers.
     2. every address carries one of the row's own SAB33 charges. An address
        carrying another charge would name the saboteur off a charge it is not
        made of. Where the most literal address carries the wrong charge it
        was left out, and the note says so.
     3. a row leans the way its bands do: no charge has more of the three
        addresses than the charge whose band sits highest, read at the band's
        centre. Escapist is the one exception, and its note says why.
     4. no two rows share two addresses. Two rows sharing two of three fire
        together and are one detector with two names.
   The candidates for each row are written by hand from its words, each
   ranked as a word it uses, a close paraphrase, or only plausible, and the
   rows are then placed together, the lowest total rank that keeps rules 2
   to 4, because one row's choice closes another's: Hyper-Vigilant and
   Worrywart both answer to 83 Paranoia and 1 Fear, and only one of them may
   hold both. Where two candidates tie, the note says which was kept and why.

   ROWS WERE ADDED ON 22 OCTOBER for every saboteur the codex defines but one,
   flagged below, so it has a place in the body and not only a charge range.

   THE FIRST THIRTEEN WERE RE-GROUNDED LATER THE SAME DAY, reversing what
   this header first said of them, that they were kept as written and not
   changed. They came with the original source, picked by name before SAB33
   was ported on 20 September, and they were left alone because moving them
   moves every reading that already names them. The owner then asked for
   them to be re-grounded, so that reason no longer holds, and the readings
   move. Measured on the build before the change: 10 of the 13 had at least
   one address off their own charges, 16 addresses in all; Micromanager and
   Judge had none off and gave anger two of three under a higher band;
   Pleaser and Imposter shared 2 and 66. Five, Pleaser, Perfectionist,
   Hyper-Achiever, Hyper-Vigilant and Worrywart, had one address or none on
   their own charges, so their three reached 3.7 only off charges they are
   not made of, and the address route never named them inside their own
   band. Twelve of the thirteen changed. Aggressor met every rule and is as
   it came. Pleaser's three were all Shame and are gone, which ends the pair
   with Imposter, and 66 People Pleasing stays People-Pleaser's, whose row
   carries shame.
   Three of the rows added in the first pass broke rule 3, though this
   header said every added row met it: Hyper-Rational and Cynic are fixed,
   and Escapist is the exception. Pessimist met every rule and moved one
   address so that Worrywart could meet rule 4.
   Seven addresses left the library and no row holds them now: 18 Lust, 33
   Pride, 48 Superiority, 55 Longing, 79 Hypervigilance, 88 Doubt Of Source
   (named Doubt Of God before 25 October) and 89 Hubris. Eight joined it: 5, 24, 42, 44, 53, 76, 97 and 107. core.js
   reads every address no row holds through an inferred cluster, so the
   clusters moved with them, eighteen before and thirteen after. One move
   matters more than the rest: 88 and 89 join the crown's inferred anger
   cluster, and core.js's GRAND rule files a cluster as Grandiosity when any
   one of its addresses is named for grandiosity, so Hubris turns that
   cluster from Predatory to Grandiosity. On the worked examples the reading
   that leads, the mask, moves for four people, and for none of them through
   a named row: the Hubris move alone moves Sofia's and Lance 15's and
   decides which way Gordon's goes, and Ana's Grandiosity complex,
   Hyper-Achiever with the solar cluster that 33 and 48 joined, crosses 6.5,
   the line for one complex to make a hyper-complex, by a tenth. The compass
   moved too: the share of what is running that points at other people
   crossed one half for Derek and Ana, so both read The Devil where they
   read Turned inward.

   THE FAMILY. The owner's TULA notes ("Emotions & Saboteurs & Hyper
   Personalities", April 2026) list the saboteurs each hyper-complex
   personality comes from, and HCX_LIB's sub names the personalities each
   family translates. Every row's family follows them. Where TULA names one
   family it is used. Where it names two, the family whose d describes the
   saboteur's own behaviour is used and both are named. Where it names none,
   the note says what decides: a canon sibling the saboteur's own words or
   charges point to, or the family whose d describes what it does.

   THE FAMILIES OF THE FIRST THIRTEEN FOLLOWED, 22 October, after their
   addresses, because the owner asked for them to match TULA. Six moved:
   Micromanager from Rigidity and Judge from Predatory to Grandiosity, which
   translates the Narcissism TULA builds from the Controller, the
   Hyper-Achiever and the Judge; Avoider from Dissociation and Worrywart from
   Dysregulation to Collapse, which translates TULA's Anxiety disorders;
   Loner from Dissociation to Collapse, TULA's Depression; and
   Hyper-Vigilant from Dysregulation to Rigidity. None of the six had a
   family TULA names for it. The other seven already had one TULA names,
   or where it names none, one a sibling or their own behaviour decides,
   and each note now says which.

   HYPER-VIGILANT IS THE ONE OF THE SIX TULA NAMES TWICE: OCPD, which
   HCX_LIB translates as Rigidity, and Anxiety disorders, which it
   translates as Collapse. Its behaviour decides. Its definition is "Continuous anxiety
   about potential dangers. Constant risk management.", its sentence "The
   threat is always just ahead.", TULA's own line "Always on edge, expecting
   threats". That is a field held braced with everything under watch, which
   is Rigidity's d, "nothing is allowed out of its cell, including you".
   Collapse's d, "the structure gives way downward and stays down", is the
   one thing it does not do. TULA's two lines split the same way: OCPD is "a
   preoccupation with orderliness, perfectionism, and control", Anxiety
   disorders "a tendency to avoid challenging situations", and the
   Hyper-Vigilant manages the risk in a situation rather than avoiding it.
   HCX_LIB's Rigidity also translates paranoia, the first word of its
   SABAUTH. The case for Collapse is the word anxiety, in its definition and
   in Collapse's translations, and that word names its charge, not its
   behaviour. Measured, the choice matters: with Collapse, 4 of the 16
   worked examples would read differently from this, Ana's compass among
   them, Turned inward where with Rigidity it reads The Devil.

   FOUR ROWS OF THE FIRST PASS TOOK THEIR FAMILY FROM ONE OF THE SIX, so the
   method was run on them again. Catastrophizer and Overthinker follow the
   Worrywart to Collapse: SABDEF calls the Worrywart the Catastrophizer on a
   smaller scale, and the Overthinker's note named the Worrywart its nearest
   sibling, where Imposter, on the Overthinker's own two charges, is
   Collapse too. Escapist stays Dissociation and Control Freak stays
   Rigidity, each now on a reason its note gives: Avoider's own definition
   separates it from the Escapist, and Control Freak's other half, the
   Hyper-Vigilant, is Rigidity. Rows per family went from Collapse 9,
   Dysregulation 7, Predatory 5, Rigidity 4, Dissociation 4 and Grandiosity
   3 to Collapse 14, Grandiosity 5, Predatory 4, Rigidity 4, Dysregulation 3
   and Dissociation 2. tests/engine.js, SL, holds every family TULA names,
   each choice where it names two, and each sibling a family follows.
   On the worked examples 8 of the 16 read differently and the mask moves
   for 7 of them: Derek from Dysregulation to Collapse, James from Predatory
   and Collapse to Predatory and Grandiosity, Ana from Rigidity and
   Grandiosity to Collapse and Rigidity, Tomas from Dissociation and
   Dysregulation to Dysregulation and Collapse, Gordon from Predatory and
   Dissociation to Predatory and Rigidity, Lance 15 from Dissociation and
   Predatory to Predatory and Grandiosity, Lance 50 from Rigidity and
   Dysregulation to Rigidity and Collapse. Derek's compass goes back to
   Turned inward. Ana's stays The Devil. CQ does not move for anyone.

   ONE IS FLAGGED AND NOT WIRED: INNOCENT, S28. Its canon row is one low band,
   fear 2 to 4, and the addresses that say what it does, refusal to see, are
   87 Lack Of Discernment and 76 Delusion, which carry Disgust. A triple on
   its own charge is three fear addresses, a plain fear detector, and three
   fear addresses reach the address route's 3.7 only above fear 5 or so:
   measured on 22 October it named Innocent inside its own band in 1 of 90
   settings, and everywhere else only where the band ramp says it is fading.
   It stays on the range route, which reads its band, and kbSabLinked prints
   the open gap for it rather than a guess. tests/engine.js, SL, holds the
   flag by name, so wiring it later is a decision and not a slip.

   AND THE ADDRESS ROUTE NOW ASKS THE BAND, compute.js, 22 October. A row with
   a SAB33 row is named off its addresses only while its own configuration
   is on the band ramp in canon.js (sabFetters above zero). Before that the
   route fired on address load alone: on the worked examples 19 of its 34
   names were saboteurs whose own bands said they had not formed or had been
   displaced, and the rows above, without the check, add 38 more: 59 names
   on the worked examples, 21 of them inside their own band.
   The re-grounding does not replace the check. A row on its own charges
   answers those charges, not the band they sit in. With the check set
   aside the library gives 86 names on the worked examples, 52 outside their
   band, where the first pass gave 95 and 58; with it, 34, every one inside.
   What the re-grounding changes is reach. Over 6,000 random fields the
   sixteen rows that moved fire inside their own band 3,010 times where they
   fired 1,466, and set at their own band positions the address route names
   them in 1,598 of 5,400 settings where it named them in 594. Not one of
   them is named less.

   SUPERIOR IS RETIRED, 22 October. It was a fourteenth row, 48 Superiority,
   33 Pride and 38 Entitlement in Grandiosity, and it was in neither SAB33 nor
   SABDEF, so a reading could name it and the card had nothing to say about
   it. No source of the owner's defines it: not the 33 in the codex, not
   SNIFFER_SPEC, not TULA's thirty, not the complete list. TULA carries the
   idea one rung up, as Entitlement, "that someone is beneath you", a layer on
   the saboteurs Narcissism is made of, Controller, Hyper-Achiever and Judge,
   and Narcissism is the Grandiosity family. As a saboteur it was a second
   name for addresses canon rows already read: 33 and 48 were
   Hyper-Achiever's, 48 was Judge's, 38 is Aggressor's. All three carry Anger
   at the solar plexus, and over 6,000 random fields it fired together with
   Aggressor on 88 per cent of the fields where either fired. When it was
   retired all three stayed named by those rows. Since the re-grounding 33
   Pride and 48 Superiority are named by no row: Hyper-Achiever is apathy
   and fear, and Judge keeps one anger address, its own name, where a second
   would break rule 3. They join the solar plexus's inferred anger cluster,
   which core.js files as Grandiosity, the family Superior had. 38 stays
   Aggressor's.
   ============================================================ */
const SAB_LIB=[
 /* S02 Micromanager, fear and anger, its fear band the higher, so two fear
    addresses and one anger. 4 Control, safety through force, "if I release
    my grip"; 42 Rigidity, will into inflexibility, the fear response "running
    so long it looks like a management style"; 36 Anger, power misused, the
    "do-as-I-say mechanism" its definition layers in. It was 4, 36 and 50:
    50 Resentment carries Anger, which gave anger two of three under a higher
    fear band, and 50 stays the Victim's. The owner renamed Controller to
    Micromanager on 18 October in canon.js. Grandiosity, moved from
    Rigidity: TULA builds Narcissism from the Controller, the Hyper-Achiever
    and the Judge, with Entitlement and Justification on top, and its own
    definition says "Entitlement provides the justification". */
 {"nm":"Micromanager","nids":[4,42,36],"hcx":"Grandiosity"},
 /* S03 Victim, sadness, anger and apathy, its sadness band the highest. 6
    Victimhood, agency into blame, "this keeps happening to me"; 44
    Unworthiness, the self-loathing SABAUTH names, which carries Sad because
    canon.js reads UNWORTH as a heart key; 50 Resentment at the heart, pain
    held, the resentment TULA's line gives it beside sadness. It was 6, 50 and
    3: 3 Guilt carries Shame, which its row does not key on. 54 Martyrdom,
    which its definition names, is the Martyr's, and 44 keeps the two apart.
    Collapse, as it came: TULA puts it in Bipolar, BPD and Depression, which
    HCX_LIB translates as Dysregulation once and Collapse twice, and "this
    keeps happening to me" is a structure given way and staying down,
    Collapse's d. */
 {"nm":"Victim","nids":[6,44,50],"hcx":"Collapse"},
 /* S04 Perfectionist, disgust and anger, its disgust band the higher. TULA:
    "driven by an aversion to imperfection". 37 Judgment, "imperfections in
    self and others"; 84 Distortion, reality mis-seen, "it is not good enough
    yet"; 97 Need To Be Special, identity into distinction, the "continuous
    pressure to do better". It was 40, 37 and 45: 40 Perfectionism, its own
    name, carries Fear and 45 Anxiety carries Anticipation. The node map's
    Fear at 40 and SABAUTH's "fear of failure" read it as fear, where its
    row and TULA's line read disgust and anger; the canon row decides here,
    and the disagreement between the owner's sources is left open. Rigidity,
    as it came: TULA, OCPD. */
 {"nm":"Perfectionist","nids":[37,84,97],"hcx":"Rigidity"},
 /* S05 Pleaser, apathy and fear, its fear band the higher, 3 to 8 against 3
    to 5. 5 Insecurity, belonging into dependency, "to gain acceptance", the
    fear of rejection SABAUTH names; 1 Fear, threat into avoidance, "when
    there is potential for disapproval"; 30 Guilt Of Pleasure, joy into self
    denial, TULA's "sometimes neglecting personal needs". It was 66, 2 and 65,
    all three Shame, and not one of them was on its own charges. 66 People
    Pleasing is the most literal and stays People-Pleaser's, whose row
    carries shame. Leaving 2 and 66 ends the pair it shared with Imposter.
    Collapse, as it came: TULA names no family for it, and People-Pleaser,
    the sibling that shares its name, is Collapse by TULA's BPD. */
 {"nm":"Pleaser","nids":[5,1,30],"hcx":"Collapse"},
 /* S06 Hyper-Achiever, apathy and fear, both bands centred at 6, so either
    may take two. 40 Perfectionism, idealism into rigidity, the "fear of
    being ordinary"; 17 Addiction, craving, the "workaholic", "overwork"; 24
    Avoidance Of Pleasure, "when rest is available", refused. It was 33, 40
    and 48: 33 Pride and 48 Superiority carry Anger, which its row does not
    key on. Grandiosity, as it came: TULA, Narcissism. */
 {"nm":"Hyper-Achiever","nids":[40,17,24],"hcx":"Grandiosity"},
 /* S08 Hyper-Vigilant, fear and anger, its fear band the higher. 83 Paranoia
    and 1 Fear are its SABAUTH word for word; 78 Distrust, for when "trust is
    required". All three carry Fear; its anger is read by the band check,
    which still has to find it in its band. It was 79, 1 and 82: 79
    Hypervigilance, its own name, carries Anticipation, because canon.js
    reads HYPERVIGIL as anticipation, and 82 Projection carries Disgust.
    SABAUTH's third word, Panic, is 15 Panic, which carries Surprise.
    Rigidity, moved from Dysregulation, which TULA does not name for it.
    TULA names two, OCPD for Rigidity and Anxiety disorders for Collapse;
    the header says why its behaviour decides for Rigidity. */
 {"nm":"Hyper-Vigilant","nids":[83,1,78],"hcx":"Rigidity"},
 /* S11 Judge, disgust, anger and apathy, its disgust band the highest. 37
    Judgment, its own name and SABAUTH's "othering"; 82 Projection, othering
    into blame, "someone is responsible for this"; 80 Dogma, belief into
    rigidity, "certainty without evidence". It was 37, 48 and 82: 48
    Superiority carries Anger, which gave anger two of three under a higher
    disgust band. Grandiosity, moved from Predatory: TULA builds Narcissism
    from the Controller, the Hyper-Achiever and the Judge, and rests it on
    the difference in value a judge sees between itself and the judged. */
 {"nm":"Judge","nids":[37,82,80],"hcx":"Grandiosity"},
 /* S33 Avoider, apathy and fear, its apathy band the higher. 1 Fear, threat
    into avoidance, the "fear of confrontation"; 92 Spiritual Escapism,
    presence into bypass, "not present for it"; 86 Idealism, fantasy into
    denial of reality, SABAUTH's "delusion", "if I stay unaware". It was 1,
    14 and 89: 89 Hubris carries Anger, and 14 Escapism is the Escapist's,
    the line its own definition draws: "not fleeing discomfort the way the
    Escapist does". Collapse, moved from Dissociation: TULA, Anxiety
    disorders, "a tendency to avoid challenging situations", and HCX_LIB's
    Collapse translates anxiety. */
 {"nm":"Avoider","nids":[1,92,86],"hcx":"Collapse"},
 /* S14 Worrywart, fear and sadness, its fear band the higher. 83 Paranoia,
    narrative spinning, the "rehearsal of disaster", "worst-case scenarios";
    7 Scarcity, resources into hoarding, the "illusion of preparedness"; 56
    Closed Heart, vulnerability into armour, "worrying is preparation". It
    was 45, 1 and 3: 45 Anxiety carries Anticipation and 3 Guilt carries
    Shame. 1 Fear is its SABAUTH word and could not stay: beside 83 it is
    Hyper-Vigilant's pair, beside 7 it is Catastrophizer's. Collapse, moved
    from Dysregulation: TULA, Anxiety disorders, "excessive worry", and
    HCX_LIB's Collapse translates anxiety. */
 {"nm":"Worrywart","nids":[83,7,56],"hcx":"Collapse"},
 /* S15 Loner, sadness and fear, its sadness band the higher. 53 Separation,
    unity into isolation, "withdraws from contact"; 56 Closed Heart,
    vulnerability into armour, SABAUTH's "fear of intimacy" and its
    definition's "independence as defense"; 78 Distrust, SABAUTH's first
    word. It was 55, 1 and 49: 49 Hatred carries Anger. 61 Rejection, the
    "fear of rejection" its definition names, answers one phrase where 56
    answers two, so 56 takes the place. Collapse, moved from Dissociation:
    TULA, Depression, and HCX_LIB's Collapse translates depression. */
 {"nm":"Loner","nids":[53,56,78],"hcx":"Collapse"},
 /* S27 Nihilist, disgust and sadness, its disgust band the higher. 91
    Nihilism, its own name, the "refusal of meaning"; 90 Spiritual Pride,
    insight into superiority, the "contempt" SABAUTH names; 77 Cynicism,
    clarity into dismissal, "despair worn as clarity". It was 91, 88 and 90:
    88 Doubt Of Source carries Anger, its Resentment label routed by REROUTE.
    Collapse, as it came: TULA names no family for it, and its definition
    removes "the foundation of meaning", the structure given way, which is
    Collapse's d. */
 {"nm":"Nihilist","nids":[91,90,77],"hcx":"Collapse"},
 /* S21 Aggressor, anger and apathy, unchanged: all three carry Anger, its
    higher band, and they are its SABAUTH in order, 36 Anger for aggression,
    49 Hatred for cruelty, 38 Entitlement for self-importance. Predatory, as
    it came: TULA, Antisocial. */
 {"nm":"Aggressor","nids":[36,49,38],"hcx":"Predatory"},
 /* S20 Imposter, shame and fear, its shame band the higher. 107
    Self-Exclusion, belonging into disconnection, "they will find out I do
    not belong here"; 2 Shame, SABAUTH's first word; 85 Doubt, intuition into
    dismissal, the "discounting of evidence". It was 2, 45 and 66: 45 Anxiety
    carries Anticipation, the "anticipation of exposure" SABAUTH names and
    its row does not key on. 66 People Pleasing, the fraud it fears it is,
    answers less closely than 85 and stays People-Pleaser's. Collapse, as it
    came: TULA puts it in BPD and ADHD, Collapse and Dysregulation, and a
    competence it believes "unearned and discoverable as fraud" is worth
    giving way, Collapse's d, where nothing in it swings. */
 {"nm":"Imposter","nids":[107,2,85],"hcx":"Collapse"},
 /* S01 Negotiator, fear and apathy. 85 Doubt and 11 Resistance are the doubt
    SABAUTH names and the pause its trigger names, change held off one more
    day. 17 Addiction is "just this once", the momentary gratification TULA
    names. Dysregulation: TULA names no family; intention and indulgence
    swing and never settle, and fear is Dysregulation in FAM_OF. */
 {"nm":"Negotiator","nids":[85,11,17],"hcx":"Dysregulation"},
 /* S09 Restless, apathy and fear. 28 Infatuation, the new thing idealised;
    17 Addiction, the next thrill TULA names; 92 Spiritual Escapism, "rarely
    at peace with the current moment", presence bypassed. Its fear sits at 2
    to 4 and is left to the range route. Dysregulation: TULA puts it in
    Bipolar and ADHD, and HCX_LIB translates both as Dysregulation. */
 {"nm":"Restless","nids":[28,17,92],"hcx":"Dysregulation"},
 /* S10 Stickler, disgust and anger. 80 Dogma, belief held as rigidity,
    "there is a right way"; 72 Speaking To Be Right and 68 Interrupting, the
    correction of others SABAUTH names. Two at the throat, where SNIFFER_SPEC
    seats the Creator it pairs with. Rigidity: TULA, OCPD. */
 {"nm":"Stickler","nids":[80,72,68],"hcx":"Rigidity"},
 /* S07 Hyper-Rational, shock and disgust, its disgust band the higher, so
    two disgust addresses and one shock. 74 Talking To Avoid Feeling,
    presence into avoidance, the "dismissal of emotions" SABAUTH names, the
    "emotional concerns" it is impatient with, the "emotional input" that
    triggers it; 84 Distortion, reality mis-seen, "if I can't explain it, it
    isn't real"; 76 Delusion, truth into illusion, the same sentence from the
    other side, what cannot be explained called unreal. On 22 October it was
    81, 84 and 74, two shock under a higher disgust band, which the header
    claimed no row did. One of the two shock addresses had to go: 74 answers
    three of its phrases and 81 Overanalysis, "processes everything through
    logic", one, and 81 stays the Skeptic's. Two at the third eye, the Sage's
    seat. Dissociation: TULA names no family; the reasoned answer with nobody
    feeling inside it is Dissociation's d, the outline that holds with nobody
    in it. */
 {"nm":"Hyper-Rational","nids":[74,84,76],"hcx":"Dissociation"},
 /* S12 Deflector, shame and anger. 59 Blame, responsibility pushed outward,
    "does not own"; 93 False Humility, the pretending SABAUTH names; 2 Shame,
    worth rejected, "if they knew the real me they would leave". 70 Excuse
    and 67 Lying are more literal and carry Disgust, which its row does not
    key on. Predatory: TULA, Antisocial. */
 {"nm":"Deflector","nids":[59,93,2],"hcx":"Predatory"},
 /* S13 Dramatizer, shock and sadness. 32 Excess Emotion, drama into
    flooding; 71 Stage Performing, the audience its trigger needs; 73 Manic
    Expression, the exaggeration SABAUTH names. Grandiosity: TULA puts it in
    Bipolar and Histrionic. HCX_LIB's Grandiosity translates histrionic, and
    its d, the shape held bigger than it is, is what its card says it does:
    you tell it bigger. */
 {"nm":"Dramatizer","nids":[32,71,73],"hcx":"Grandiosity"},
 /* S16 People-Pleaser, apathy and shame, its apathy band the higher, so two
    apathy addresses and one shame. 66 People Pleasing, approval into
    inauthenticity; 22 Shame Of Desire and 30 Guilt Of Pleasure, its own wants
    suppressed and its own joy denied, the self erasure SABAUTH names.
    Collapse: TULA puts it in BPD and Histrionic; Pleaser, its sibling, is
    Collapse, and self erasure is the structure giving way. */
 {"nm":"People-Pleaser","nids":[66,22,30],"hcx":"Collapse"},
 /* S17 Skeptic, disgust and shock. 77 Cynicism, clarity into dismissal, the
    pre-emptive doubt; 80 Dogma, the refusal to be moved; 81 Overanalysis,
    clarity into paralysis. 78 Distrust is more literal and carries Fear.
    All three at the third eye, the Sage's seat. Predatory: TULA,
    Machiavellianism. */
 {"nm":"Skeptic","nids":[77,80,81],"hcx":"Predatory"},
 /* S18 Dreamer, apathy and sadness. 27 Fantasy and 86 Idealism, the retreat
    into the possible and the denial of the actual; 108 Endless Seeking,
    arrival that never comes, "someday". Grandiosity: TULA puts it in
    Histrionic and ADHD; Grandiosity's d, the shape held bigger than it is
    and the gap defended, is its trigger, the gap between the vision and the
    current reality. */
 {"nm":"Dreamer","nids":[27,86,108],"hcx":"Grandiosity"},
 /* S19 Procrastinator, fear and sadness, its fear band the higher. SABAUTH
    is avoidance, doubt and fear of failure: 85 Doubt; 40 Perfectionism, the
    fear of failure, which the owner's TULA archetype notes say leads "to
    procrastination or dissatisfaction with outcomes"; 10 Lethargy, momentum
    into stagnation, the delay. Dysregulation: TULA names no family; the delay
    and the rush at the deadline swing and never settle, and fear is
    Dysregulation in FAM_OF. */
 {"nm":"Procrastinator","nids":[85,40,10],"hcx":"Dysregulation"},
 /* S22 Martyr, sadness, shame and apathy, one address each. 54 Martyrdom,
    self sacrifice into guilt driven love; 3 Guilt, responsibility into
    overcompensation, the over-giving; 30 Guilt Of Pleasure, its own joy
    denied. 57 Manipulative Kindness and 50 Resentment fit the obligation and
    the resentment and carry Anger, which its row does not key on. Collapse:
    TULA names no family; SABDEF files martyrdom under Victim, which is
    Collapse. */
 {"nm":"Martyr","nids":[54,3,30],"hcx":"Collapse"},
 /* S23 Cynic, disgust and sadness, its disgust band the higher, so two
    disgust addresses and one sad. 77 Cynicism, its own name, the
    "pre-emptive dismissal"; 76 Delusion, truth into illusion, "optimism is
    naive", hope called an illusion; 13 Disconnection, presence into
    numbness, SABAUTH's "lack of effort" and TULA's "safety of skepticism",
    unimpressed and so safe from disappointment, as its card puts it. On 22
    October it was 77, 98 and 13, two sad under a higher disgust band, and 98
    is now the Pessimist's. Root and third eye: with 98 it loses the crown,
    one of the two seats SNIFFER_SPEC gives the Orphan it pairs with.
    Collapse: TULA names no family; Nihilist runs on the same two charges and
    is Collapse. */
 {"nm":"Cynic","nids":[77,76,13],"hcx":"Collapse"},
 /* S24 Manipulator, anger and apathy. 25 Manipulation Through Emotion,
    control by emotional blackmail; 57 Manipulative Kindness, transactional
    giving; 43 Resentment, the grudge, which SNIFFER_SPEC rules is anger and
    apathy held together, its own row. 64 Deceit and 75 Spiritual Language To
    Manipulate sit at the throat where the canon seats its Magician and carry
    Disgust, so they are left out. Predatory: TULA, Machiavellianism. */
 {"nm":"Manipulator","nids":[25,57,43],"hcx":"Predatory"},
 /* S25 Overthinker, fear and shame. 85 Doubt, intuition dismissed; 83
    Paranoia, the narrative spinning a loop is; 46 Self-Judgment, the inner
    war. 81 Overanalysis and 79 Hypervigilance name it outright and carry
    Shock and Anticipation, which its row does not key on. Collapse, moved
    from Dysregulation with its sibling: TULA names no family for it, and
    the Worrywart, its nearest sibling, is Collapse now by TULA's Anxiety
    disorders. Imposter, which runs on the same two charges, fear and
    shame, is Collapse, and the Overthinker's SABAUTH opens on anxiety,
    which HCX_LIB's Collapse translates. */
 {"nm":"Overthinker","nids":[85,83,46],"hcx":"Collapse"},
 /* S26 Escapist, apathy and fear, and the one row that does not lean the
    way its bands do. Its fear band is the higher, 6 to 8 against apathy 4 to
    6, and of the addresses carrying Fear only 1 Fear, threat into
    avoidance, says what it does: TULA's "avoids dealing with issues", the
    exit its definition takes from discomfort "before it resolves". A second
    fear address would be one picked for its charge and not its words. So it
    carries its fear once, beside 14 Escapism and 27 Fantasy, the
    "overindulgence in fantasies" SABAUTH names. On 22 October it was 14, 27
    and 18, all three apathy, which the header claimed no row did, and 18
    Lust, SABAUTH's "sensual desire", is the address that gave way: set at
    its own band positions over the sweep's 270 settings, the address route
    names it in 80 with 1 and in 51 with 18. tests/engine.js, SL, holds it
    as the one exception by name. Root and sacral, the seats SNIFFER_SPEC
    gives the Explorer it pairs with. It shares 1 with Avoider and nothing
    more, and 14, the line Avoider's definition draws between them, is its
    own. Dissociation: TULA names no family for it. This note first leaned
    on Avoider being Dissociation, and Avoider is Collapse now by TULA's
    Anxiety disorders; but Avoider's own definition separates the two, so it
    does not carry the Escapist with it. What decides is its own behaviour:
    leaving before the feeling finishes is the outline left with nobody in
    it, Dissociation's d, and HCX_LIB's Dissociation translates withdrawal. */
 {"nm":"Escapist","nids":[14,27,1],"hcx":"Dissociation"},
 /* S29 Pessimist, sadness and fear, its sadness band the higher. 91
    Nihilism, the first word of its SABAUTH; 83 Paranoia, narrative spinning,
    the case built "before they materialize"; 98 Unworthy Of Source, divinity
    into disbelief, SABAUTH's "hopelessness", "it will not work out". On 22
    October it was 91, 83 and 56 and met every rule. Worrywart's re-grounding
    needed 83 and 56 together and had nothing as close, and two rows may not
    share two, so 56 Closed Heart went to Worrywart and 98 came free from the
    Cynic. Collapse: TULA, Depression. */
 {"nm":"Pessimist","nids":[91,83,98],"hcx":"Collapse"},
 /* S30 Catastrophizer, fear and sadness. 1 Fear, instinct and threat; 7
    Scarcity, resources, the threat to survival its definition jumps to; 16
    Collapse, structure gone, "this will destroy everything". All three at the
    root. Collapse, moved from Dysregulation with its sibling: TULA names no
    family for it, SABDEF calls the Worrywart the same thing on a smaller
    scale, and the Worrywart is Collapse now by TULA's Anxiety disorders. */
 {"nm":"Catastrophizer","nids":[1,7,16],"hcx":"Collapse"},
 /* S31 Enabler, apathy and shame, its shame band the higher, so two shame
    addresses and one apathy, the reverse of People-Pleaser, whose charges are
    the same two. 65 Self-Silencing, you see it and you do not say it; 31 Need
    For Approval, identity held in the other; 17 Addiction, the overindulgence
    SABAUTH names, backed up rather than named. 63 Need To Be Needed and 21
    Co-Dependency name it outright and carry Disgust, which its row does not
    key on. Collapse: TULA names no family; Pleaser, which SABDEF sets it
    beside, is Collapse. */
 {"nm":"Enabler","nids":[65,31,17],"hcx":"Collapse"},
 /* S32 Control Freak, fear, anger and anticipation. 45 Anxiety at the
    adrenal medulla, the sustained sympathetic activation its definition ends
    on; 41 Force, control over flow; 78 Distrust, distrust of others' hands.
    Of the two it is composed of it shares one address with Hyper-Vigilant,
    78, since that row was re-grounded, and none with Micromanager.
    Rigidity: TULA names no family for it. This note first gave the reason
    as Micromanager's Rigidity, and Micromanager is Grandiosity now by
    TULA's Narcissism. Its other half, Hyper-Vigilant, is Rigidity by TULA's
    OCPD, and its own drill names the state, the jaw, the shoulders and the
    diaphragm already locked: nothing allowed out of its cell, Rigidity's d.
    It stays. */
 {"nm":"Control Freak","nids":[45,41,78],"hcx":"Rigidity"}];
/* THE CLINICAL NAMES ARE NOT SHOWN TO THE PERSON THEY ARE ABOUT.

   sub carries the diagnostic families these architectures correspond to, and
   the card renderer printed it straight: a person opening the Body page was
   told "bipolar and ADHD" or "depression, BPD and anxiety" about themselves,
   as a subtitle, with no clinician, no assessment and nothing attached. This
   product reads self report out of a story somebody typed. It is not
   qualified to hand anybody a diagnosis and it must not look as though it is.

   So d is what a person is shown: what the architecture DOES, in behaviour, in
   the product's own voice. sub stays because the correspondence is real and
   the codex needs it, and it is now internal. Anything rendering to a person
   takes d.

/* THIRTY NINE SABOTEURS SHARED ONE GLYPH, their seat's, and a person opening
   the deck saw the same mark thirty nine times. Thirty nine hand drawn marks
   would be thirty nine inventions, most of them arbitrary, so the family takes
   the mark: a saboteur is a contraction of a fetter and what distinguishes one
   from the next behaviourally is which of the six architectures it belongs to.
   Six marks, each drawn as what the structure does to a shape under load, and
   a seat for the colour argued from where that architecture is held.

   b is the seat and is for colour only. Rigidity clenches at the solar plexus,
   collapse drops to the root, grandiosity inflates at the throat, dysregulation
   oscillates at the sacral, predatory reaches from the third eye because it is
   calculated rather than felt, and dissociation leaves through the crown. */
const HCX_LIB=[
 /* a shape blown past its own outline. */
 {"nm":"Grandiosity","d":"the shape is held bigger than it is, and the gap is defended","sub":"narcissism · histrionic","b":"Throat",
  "ic":"M12 3a9 9 0 100 18 9 9 0 100-18 M12 7a5 5 0 100 10 5 5 0 100-10"},
 /* a point, and the line that arrived at it from outside the frame. */
 {"nm":"Predatory","d":"other people are read as terrain, and the move is made before it is felt","sub":"machiavellian · antisocial","b":"3rd Eye",
  "ic":"M3 3l9 9 M12 12l9-9 M12 12v9 M8 21h8"},
 /* a structure that has lost its top and is resting on the floor. */
 {"nm":"Collapse","d":"the structure gives way downward and stays down","sub":"depression · BPD · anxiety","b":"Root",
  "ic":"M4 20h16 M6 20V9 M18 20V9 M6 9l6 5 6-5"},
 /* a grid with nothing allowed out of its cell. */
 {"nm":"Rigidity","d":"nothing is allowed out of its cell, including you","sub":"OCPD · paranoia","b":"Solar",
  "ic":"M4 4h16v16H4z M4 12h16 M12 4v16"},
 /* an oscillation that overshoots at both ends. */
 {"nm":"Dysregulation","d":"the swing overshoots at both ends and never settles at the middle","sub":"bipolar · ADHD","b":"Sacral",
  "ic":"M3 12h3l2-7 3 14 3-11 2 4h5"},
 /* an outline with its middle gone. still a shape, nobody in it. */
 {"nm":"Dissociation","d":"the outline holds and there is nobody inside it","sub":"schizoid · withdrawal","b":"Crown",
  "ic":"M12 3a9 9 0 019 9 M21 12a9 9 0 01-9 9 M12 21a9 9 0 01-9-9 M3 12a9 9 0 019-9"}];
