/* ============================================================
   THE 112 ADDRESSES. 108 somatic, seated at a named plexus or
   nerve, plus 4 field anchors above and below the body.
   ============================================================ */
const NODES=
[{"i":1,"k":"Fear","b":"Root","n":"Lumbar Plexus","a":"Instinct, threat","d":"Avoidance","c":"Fear"},{"i":2,"k":"Shame","b":"Root","n":"Pudendal Nerve","a":"Worth, embodiment","d":"Self-rejection","c":"Shame"},{"i":3,"k":"Guilt","b":"Root","n":"Inferior Hypogastric Plexus","a":"Responsibility","d":"Overcompensation","c":"Shame"},{"i":4,"k":"Control","b":"Root","n":"Sacral Nerves","a":"Safety through force","d":"Domination","c":"Fear"},{"i":5,"k":"Insecurity","b":"Root","n":"Pelvic Nerve","a":"Belonging","d":"Dependency","c":"Fear"},{"i":6,"k":"Victimhood","b":"Root","n":"Coccygeal Plexus","a":"Agency","d":"Blame","c":"Sadness"},{"i":7,"k":"Scarcity","b":"Root","n":"Iliac Nerve Branch","a":"Resources","d":"Hoarding","c":"Fear"},{"i":8,"k":"Root_08_Unnamed","b":"Root","n":"Cauda Equina","a":"Privilege","d":"Deservingness","c":null},{"i":9,"k":"Possession","b":"Root","n":"Gluteal Nerve","a":"Attachment","d":"Control of objects","c":"Shock"},{"i":10,"k":"Lethargy","b":"Root","n":"Obturator Nerve","a":"Momentum","d":"Stagnation","c":"Sadness"},{"i":11,"k":"Resistance","b":"Root","n":"Perineal Branch","a":"Change","d":"Holding on","c":"Fear"},{"i":12,"k":"Compulsion","b":"Root","n":"Pelvic Floor Nerves","a":"Safety rituals","d":"Fixation","c":"Fear"},{"i":13,"k":"Disconnection","b":"Root","n":"Sacral Root Ganglia","a":"Presence","d":"Numbness","c":"Sadness"},{"i":14,"k":"Escapism","b":"Root","n":"Sciatic Nerve","a":"Facing pain","d":"Running","c":"Joy"},{"i":15,"k":"Panic","b":"Root","n":"Lumbar Sympathetic Chain","a":"Reaction","d":"Unconsciousness","c":"Fear"},{"i":16,"k":"Collapse","b":"Root","n":"Spinal Cord Base","a":"Structure","d":"Abandoning Self","c":"Sadness"},{"i":17,"k":"Addiction","b":"Sacral","n":"Sacral Plexus","a":"Craving","d":"Obsession","c":"Joy"},{"i":18,"k":"Lust","b":"Sacral","n":"Genitofemoral Nerve","a":"Desire","d":"Objectification","c":"Joy"},{"i":19,"k":"Envy","b":"Sacral","n":"Internal Pudendal Nerve","a":"Lack","d":"Hatred of others' joy","c":"Resentment"},{"i":20,"k":"Jealousy","b":"Sacral","n":"Obturator Nerve","a":"Possessiveness","d":"Paranoia","c":"Resentment"},{"i":21,"k":"Co-Dependency","b":"Sacral","n":"Pelvic Splanchnic Nerves","a":"Neediness","d":"Self-abandonment","c":"Disgust"},{"i":22,"k":"Shame Of Desire","b":"Sacral","n":"Hypogastric Plexus","a":"Repression","d":"Suppression","c":"Joy"},{"i":23,"k":"Hypersexuality","b":"Sacral","n":"Pudendal Plexus","a":"Validation","d":"Dissociation","c":"Joy"},{"i":24,"k":"Avoidance Of Pleasure","b":"Sacral","n":"Pelvic Nerve","a":"Sensuality","d":"Denial of life","c":"Joy"},{"i":25,"k":"Manipulation Through Emotion","b":"Sacral","n":"Uterovaginal Plexus","a":"Control","d":"Emotional blackmail","c":"Anger"},{"i":26,"k":"Oversensitivity","b":"Sacral","n":"Inferior Hypogastric Plexus","a":"Pain threshold","d":"Victim reactivity","c":"Shock"},{"i":27,"k":"Fantasy","b":"Sacral","n":"Splanchnic Root","a":"Escapism","d":"Delusion","c":"Joy"},{"i":28,"k":"Infatuation","b":"Sacral","n":"Lumbar-Sacral Overlap","a":"Projection","d":"Idealization","c":"Joy"},{"i":29,"k":"Obsession","b":"Sacral","n":"Pelvic Ganglia","a":"Focus","d":"Fixation","c":"Fear"},{"i":30,"k":"Guilt Of Pleasure","b":"Sacral","n":"Sacral Outflow","a":"Joy","d":"Self-denial","c":"Joy"},{"i":31,"k":"Need For Approval","b":"Sacral","n":"Iliac Branches","a":"Identity in others","d":"Conformity","c":"Shame"},{"i":32,"k":"Excess Emotion","b":"Sacral","n":"Urogenital Nerve","a":"Drama","d":"Flooding","c":"Shock"},{"i":33,"k":"Pride","b":"Solar","n":"Celiac Plexus","a":"Self-importance","d":"Superiority","c":"Anger"},{"i":34,"k":"Arrogance","b":"Solar","n":"Greater Splanchnic Nerve","a":"Ego","d":"Inflated Self","c":"Anger"},{"i":35,"k":"Competition","b":"Solar","n":"Aortic Plexus","a":"Comparison","d":"Division","c":"Anger"},{"i":36,"k":"Anger","b":"Solar","n":"Celiac Plexus","a":"Power misused","d":"Attack","c":"Anger"},{"i":37,"k":"Judgment","b":"Solar","n":"Splanchnic Plexus","a":"Othering","d":"Projection","c":"Anger"},{"i":38,"k":"Entitlement","b":"Solar","n":"Renal Plexus","a":"Control of outcomes","d":"Deserving","c":"Anger"},{"i":39,"k":"Rebellion","b":"Solar","n":"Renal Ganglia","a":"Defiance","d":"Misalignment","c":"Anger"},{"i":40,"k":"Perfectionism","b":"Solar","n":"Mesenteric Plexus","a":"Idealism","d":"Rigidity","c":"Fear"},{"i":41,"k":"Force","b":"Solar","n":"Splenic Plexus","a":"Control over flow","d":"Overpowering","c":"Fear"},{"i":42,"k":"Rigidity","b":"Solar","n":"Pancreatic Plexus","a":"Will","d":"Inflexibility","c":"Fear"},{"i":43,"k":"Resentment (Solar)","b":"Solar","n":"Suprarenal Plexus","a":"Grudge","d":"Recycled anger","c":"Resentment"},{"i":44,"k":"Unworthiness","b":"Solar","n":"Inferior Mesenteric Plexus","a":"Confidence","d":"Minimization","c":"Shame"},{"i":45,"k":"Anxiety","b":"Solar","n":"Adrenal Medulla","a":"Control of outcomes","d":"Future fear","c":"Fear"},{"i":46,"k":"Self-Judgment (Solar)","b":"Solar","n":"Epigastric Branches","a":"Inner war","d":"Invalidation","c":"Shame"},{"i":47,"k":"Need To Win","b":"Solar","n":"Vagus-Liver Plexus","a":"Ego","d":"Domination","c":"Anger"},{"i":48,"k":"Superiority","b":"Solar","n":"Hepatic Nerve","a":"Hierarchy","d":"Distinction","c":"Anger"},{"i":49,"k":"Hatred","b":"Heart","n":"Cardiac Plexus","a":"Forgiveness","d":"Vengeance","c":"Anger"},{"i":50,"k":"Resentment (Heart)","b":"Heart","n":"Thoracic Nerves","a":"Holding pain","d":"Withholding love","c":"Resentment"},{"i":51,"k":"Self-Judgment (Heart)","b":"Heart","n":"Vagus Nerve","a":"Grace","d":"Harshness","c":"Shame"},{"i":52,"k":"Betrayal","b":"Heart","n":"Thoracic Plexus","a":"Trust","d":"Abandonment","c":"Shock"},{"i":53,"k":"Separation","b":"Heart","n":"Pericardial Nerve","a":"Unity","d":"Isolation","c":"Sadness"},{"i":54,"k":"Martyrdom","b":"Heart","n":"Intercostal Nerves","a":"Self-sacrifice","d":"Guilt-driven love","c":"Sadness"},{"i":55,"k":"Longing","b":"Heart","n":"Cardiac Nerve Plexus","a":"Presence","d":"Fantasy","c":"Sadness"},{"i":56,"k":"Closed Heart","b":"Heart","n":"Costal Branches","a":"Vulnerability","d":"Armor","c":"Sadness"},{"i":57,"k":"Manipulative Kindness","b":"Heart","n":"Phrenic Nerve","a":"Motive","d":"Transactional giving","c":"Anger"},{"i":58,"k":"Expectation","b":"Heart","n":"Pulmonary Nerve Plexus","a":"Outcome","d":"Contractual love","c":"Fear"},{"i":59,"k":"Blame","b":"Heart","n":"Thoracic Ganglia","a":"Responsibility","d":"Externalization","c":"Anger"},{"i":60,"k":"False Love","b":"Heart","n":"Anterior Thoracic Roots","a":"Image","d":"Projection","c":"Disgust"},{"i":61,"k":"Rejection","b":"Heart","n":"Vagal Branches","a":"Inclusion","d":"Othering","c":"Sadness"},{"i":62,"k":"Avoidance Of Grief","b":"Heart","n":"Great Cardiac Nerve","a":"Loss","d":"Suppression","c":"Joy"},{"i":63,"k":"Need To Be Needed","b":"Heart","n":"Coronary Plexus","a":"Identity","d":"Validation","c":"Disgust"},{"i":64,"k":"Deceit","b":"Throat","n":"Cervical Plexus","a":"Honesty","d":"Manipulation","c":"Disgust"},{"i":65,"k":"Self-Silencing","b":"Throat","n":"Vagus Nerve","a":"Voice","d":"Withholding","c":"Shame"},{"i":66,"k":"People Pleasing","b":"Throat","n":"Superior Laryngeal Nerve","a":"Approval","d":"Inauthenticity","c":"Shame"},{"i":67,"k":"Lying","b":"Throat","n":"Recurrent Laryngeal Nerve","a":"Integrity","d":"Protection","c":"Disgust"},{"i":68,"k":"Interrupting","b":"Throat","n":"Pharyngeal Nerve","a":"Listening","d":"Imposition","c":"Anger"},{"i":69,"k":"Comparison","b":"Throat","n":"Accessory Nerve","a":"Voice Identity","d":"Envy","c":"Shame"},{"i":70,"k":"Excuse","b":"Throat","n":"Glossopharyngeal Nerve","a":"Ownership","d":"Victimization","c":"Disgust"},{"i":71,"k":"Stage Performing","b":"Throat","n":"Laryngeal Plexus","a":"Image","d":"Persona","c":"Shock"},{"i":72,"k":"Speaking To Be Right","b":"Throat","n":"Cervical Ganglia","a":"Ego","d":"Righteousness","c":"Anger"},{"i":73,"k":"Manic Expression","b":"Throat","n":"Spinal Accessory Nerve","a":"Over-talking","d":"Energy discharge","c":"Shock"},{"i":74,"k":"Talking To Avoid Feeling","b":"Throat","n":"Subclavian Nerve","a":"Presence","d":"Avoidance","c":"Shock"},{"i":75,"k":"Spiritual Language To Manipulate","b":"Throat","n":"Brachial Plexus","a":"Belonging","d":"Performance","c":"Disgust"},{"i":76,"k":"Delusion","b":"3rd Eye","n":"Optic Nerve","a":"Truth","d":"Illusion","c":"Disgust"},{"i":77,"k":"Cynicism","b":"3rd Eye","n":"Oculomotor Nerve","a":"Clarity","d":"Dismissal","c":"Disgust"},{"i":78,"k":"Distrust","b":"3rd Eye","n":"Abducens Nerve","a":"Faith","d":"Suspicion","c":"Fear"},{"i":79,"k":"Hypervigilance","b":"3rd Eye","n":"Optic Chiasm","a":"Control","d":"Overthinking","c":"Fear"},{"i":80,"k":"Dogma","b":"3rd Eye","n":"Pineal Gland","a":"Belief","d":"Rigidity","c":"Disgust"},{"i":81,"k":"Overanalysis","b":"3rd Eye","n":"Trigeminal Nerve","a":"Clarity","d":"Paralysis","c":"Shock"},{"i":82,"k":"Projection","b":"3rd Eye","n":"Visual Cortex","a":"Othering","d":"Blame","c":"Disgust"},{"i":83,"k":"Paranoia","b":"3rd Eye","n":"Lateral Geniculate","a":"Fear","d":"Narrative spinning","c":"Fear"},{"i":84,"k":"Distortion","b":"3rd Eye","n":"Occipital Nerve","a":"Reality","d":"Mis-seeing","c":"Disgust"},{"i":85,"k":"Doubt","b":"3rd Eye","n":"Cortical Visual Pathway","a":"Intuition","d":"Dismissal","c":"Fear"},{"i":86,"k":"Idealism","b":"3rd Eye","n":"Supraoptic Nucleus","a":"Fantasy","d":"Denial of reality","c":"Joy"},{"i":87,"k":"Lack Of Discernment","b":"3rd Eye","n":"Thalamus","a":"Perception","d":"Blind trust","c":"Disgust"},{"i":88,"k":"Doubt Of God","b":"Crown","n":"Corpus Callosum","a":"Faith","d":"Separation","c":"Resentment"},{"i":89,"k":"Hubris","b":"Crown","n":"Prefrontal Cortex","a":"Alignment","d":"Ego-God complex","c":"Anger"},{"i":90,"k":"Spiritual Pride","b":"Crown","n":"Pineal-Hypothalamic Axis","a":"Insight","d":"Superiority","c":"Disgust"},{"i":91,"k":"Nihilism","b":"Crown","n":"Parietal Cortex","a":"Meaning","d":"Apathy","c":"Sadness"},{"i":92,"k":"Spiritual Escapism","b":"Crown","n":"Dorsal Raphe Nucleus","a":"Presence","d":"Bypass","c":"Joy"},{"i":93,"k":"False Humility","b":"Crown","n":"Frontal Lobe","a":"Disguise","d":"Manipulation","c":"Shame"},{"i":94,"k":"Seeking Validation","b":"Crown","n":"Cerebral Cortex","a":"Ego","d":"Worship addiction","c":"Shame"},{"i":95,"k":"Savior Complex","b":"Crown","n":"Posterior Cingulate","a":"Responsibility","d":"Overreach","c":"Disgust"},{"i":96,"k":"Condemnation","b":"Crown","n":"Reticular Formation","a":"Mercy","d":"Judgment","c":"Anger"},{"i":97,"k":"Need To Be Special","b":"Crown","n":"Anterior Cingulate","a":"Identity","d":"Distinction","c":"Disgust"},{"i":98,"k":"Unworthy Of God","b":"Crown","n":"Pineal-Amygdala Axis","a":"Divinity","d":"Disbelief","c":"Resentment"},{"i":99,"k":"Knowing Better Than God","b":"Crown","n":"Default Mode Network","a":"Will","d":"Arrogance","c":"Resentment"},{"i":100,"k":"Denial Of Truth","b":"Crown","n":"Medial Forebrain Bundle","a":"Insight","d":"Resistance","c":"Resentment"},{"i":101,"k":"Rejection Of Spirit","b":"Crown","n":"Posterior Commissure","a":"Divinity","d":"Abandonment","c":"Resentment"},{"i":102,"k":"Fear Of God","b":"Crown","n":"Temporal Lobe","a":"Love","d":"Dread","c":"Resentment"},{"i":103,"k":"Anger At God","b":"Crown","n":"Hypothalamus","a":"Trust","d":"Rebellion","c":"Resentment"},{"i":104,"k":"Forgetfulness","b":"Crown","n":"Hippocampus","a":"Identity","d":"Amnesia","c":"Sadness"},{"i":105,"k":"Denial Of Light","b":"Crown","n":"Epithalamus","a":"Revelation","d":"Avoidance","c":"Resentment"},{"i":106,"k":"Rejection Of Unity","b":"Crown","n":"Neocortex","a":"Connection","d":"Separation","c":"Resentment"},{"i":107,"k":"Self-Exclusion","b":"Crown","n":"Superior Sagittal Sinus","a":"Belonging","d":"Disconnection","c":"Shame"},{"i":108,"k":"Endless Seeking","b":"Crown","n":"Ascension Column","a":"Arrival","d":"Never enough","c":"Sadness"},{"i":109,"k":"Sol Star","b":"Field-Above","n":null,"a":"Higher Self anchor","d":"field","c":null},{"i":110,"k":"Stellar Gateway","b":"Field-Above","n":null,"a":"Source connection","d":"field","c":null},{"i":111,"k":"Earth Star","b":"Field-Below","n":null,"a":"Grounding anchor","d":"field","c":null},{"i":112,"k":"Gaia Gateway","b":"Field-Below","n":null,"a":"Cosmic anchor","d":"field","c":null}];
/* ============================================================
   SAB_LIB · each named saboteur's three addresses and its family.

   compute() names a row on the address route when the mean load of its three
   addresses reaches 3.7, and draws it there; the card prints them under
   Connected (kbSabLinked, ui/drills.js); the family is the hyper-complex it
   compounds into. The engine reads an address only through the charge it
   carries, n.cf, so three addresses are three charges at three places.

   THE FIRST THIRTEEN came with the original source and are kept as written.
   They were picked by name against each saboteur's own words, before SAB33 was
   ported on 20 September, and several read a charge their canon row does not
   key on: Pleaser's three all carry Shame, where its row is apathy and fear.
   That is recorded here and not changed, because moving them moves every
   reading that already names them.

   ROWS WERE ADDED ON 22 OCTOBER for every saboteur the codex defines but one,
   flagged below, so it has a place in the body and not only a charge range.
   Each was picked the way the thirteen were, with one check they never had:
     1. by name, against its own words: SABDEF's definition, trigger and
        sentence in kb.js, and SABAUTH's composition in canon.js. Each note
        says which words each address answers.
     2. every address carries one of the row's own SAB33 charges. An address
        carrying another charge would name the saboteur off a charge it is not
        made of. Where the most literal address carries the wrong charge it
        was left out, and the note says so.
     3. no added row shares two addresses with any row. Two rows sharing two
        of three fire together and are one detector with two names. One
        legacy pair already does, Pleaser and Imposter on 2 and 66, and is
        recorded rather than changed.
   The family. The owner's TULA notes ("Emotions & Saboteurs & Hyper
   Personalities", April 2026) list the saboteurs each hyper-complex
   personality comes from, and HCX_LIB's sub names the personalities each
   family translates. Where TULA names one family it is used. Where it names
   two, the family whose d describes the saboteur's own SABDEF behaviour is
   used and both are named. Where it names none, the nearest canon sibling
   decides and the note says which.
   A row also leans the way its bands do: the charge with the higher band
   gets two of the three addresses.

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
   displaced, and the rows above would have added 42 more.

   SUPERIOR IS RETIRED, 22 October. It was a fourteenth row, 48 Superiority,
   33 Pride and 38 Entitlement in Grandiosity, and it was in neither SAB33 nor
   SABDEF, so a reading could name it and the card had nothing to say about
   it. No source of the owner's defines it: not the 33 in the codex, not
   SNIFFER_SPEC, not TULA's thirty, not the complete list. TULA carries the
   idea one rung up, as Entitlement, "that someone is beneath you", a layer on
   the saboteurs Narcissism is made of, Controller, Hyper-Achiever and Judge,
   and Narcissism is the Grandiosity family. As a saboteur it was a second
   name for addresses canon rows already read: 33 and 48 are Hyper-Achiever's,
   48 is Judge's, 38 is Aggressor's. All three carry Anger at the solar
   plexus, and over 6,000 random fields it fired together with Aggressor on 88
   per cent of the fields where either fired. Retiring it costs no address:
   all three stay named by the rows that hold them, so no inferred cluster
   appears in its place.
   ============================================================ */
const SAB_LIB=[
 /* S02. The owner renamed Controller to Micromanager on 18 October in
    canon.js; the rename reaches the library here. Same three addresses. */
 {"nm":"Micromanager","nids":[4,36,50],"hcx":"Rigidity"},
 {"nm":"Victim","nids":[6,50,3],"hcx":"Collapse"},
 {"nm":"Perfectionist","nids":[40,37,45],"hcx":"Rigidity"},
 {"nm":"Pleaser","nids":[66,2,65],"hcx":"Collapse"},
 {"nm":"Hyper-Achiever","nids":[33,40,48],"hcx":"Grandiosity"},
 {"nm":"Hyper-Vigilant","nids":[79,1,82],"hcx":"Dysregulation"},
 {"nm":"Judge","nids":[37,48,82],"hcx":"Predatory"},
 {"nm":"Avoider","nids":[1,14,89],"hcx":"Dissociation"},
 {"nm":"Worrywart","nids":[45,1,3],"hcx":"Dysregulation"},
 {"nm":"Loner","nids":[55,1,49],"hcx":"Dissociation"},
 {"nm":"Nihilist","nids":[91,88,90],"hcx":"Collapse"},
 {"nm":"Aggressor","nids":[36,49,38],"hcx":"Predatory"},
 {"nm":"Imposter","nids":[2,45,66],"hcx":"Collapse"},
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
 /* S07 Hyper-Rational, shock and disgust. 81 Overanalysis; 84 Distortion,
    reality mis-seen, "if I can't explain it, it isn't real"; 74 Talking To
    Avoid Feeling, the dismissal of emotion SABAUTH names. Two at the third
    eye, the Sage's seat. Dissociation: TULA names no family; the reasoned
    answer with nobody feeling inside it is Dissociation's d, the outline that
    holds with nobody in it. */
 {"nm":"Hyper-Rational","nids":[81,84,74],"hcx":"Dissociation"},
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
 /* S23 Cynic, disgust and sadness. 77 Cynicism, the pre-emptive dismissal;
    98 Unworthy Of God, disbelief; 13 Disconnection, presence into numbness,
    unimpressed and so safe from disappointment. Root and crown, the seats
    SNIFFER_SPEC gives the Orphan it pairs with, and the third eye. Collapse:
    TULA names no family; Nihilist runs on the same two charges and is
    Collapse. */
 {"nm":"Cynic","nids":[77,98,13],"hcx":"Collapse"},
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
    Shock and Anticipation, which its row does not key on. Dysregulation:
    TULA names no family; Worrywart, its nearest sibling, is Dysregulation. */
 {"nm":"Overthinker","nids":[85,83,46],"hcx":"Dysregulation"},
 /* S26 Escapist, apathy and fear. SABAUTH word for word: 14 Escapism, 27
    Fantasy for the overindulgence in fantasies, 18 Lust for the sensual
    desire. Root and sacral, the seats SNIFFER_SPEC gives the Explorer it
    pairs with. It shares 14 with Avoider and nothing more, the line SABDEF
    draws between them. Dissociation: TULA names no family; Avoider is
    Dissociation, and leaving before the feeling finishes is the outline
    left empty. */
 {"nm":"Escapist","nids":[14,27,18],"hcx":"Dissociation"},
 /* S29 Pessimist, sadness and fear. 91 Nihilism, the first word of its
    SABAUTH; 83 Paranoia, the case built before the outcome arrives; 56
    Closed Heart, vulnerability into armour against the hope. Collapse: TULA,
    Depression. */
 {"nm":"Pessimist","nids":[91,83,56],"hcx":"Collapse"},
 /* S30 Catastrophizer, fear and sadness. 1 Fear, instinct and threat; 7
    Scarcity, resources, the threat to survival its definition jumps to; 16
    Collapse, structure gone, "this will destroy everything". All three at the
    root. Dysregulation: TULA names no family; SABDEF calls the Worrywart the
    same thing on a smaller scale, and Worrywart is Dysregulation. */
 {"nm":"Catastrophizer","nids":[1,7,16],"hcx":"Dysregulation"},
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
    It shares no address with Micromanager or Hyper-Vigilant, the two it is
    composed of. Rigidity: TULA names no family; SABDEF says what separates it
    from Hyper-Vigilant is the scan organised around its own agency, which is
    Micromanager's Rigidity. */
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
