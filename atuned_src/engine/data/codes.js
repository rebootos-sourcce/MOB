/* ============================================================
   THE CODES, the tables. 23 October. The functions that read them are in
   engine/codes.js.

   One fixed code for every thing the engine names, and every other label a
   source uses for that thing, written down once beside the code it means.
   Phase one of the content library: identity and plumbing only. Nothing
   here is content, nothing here moves a number, and nothing in compute()
   or trace.js reads it yet.

   WHY A CODE AND NOT A NAME. A name is display and a code is identity. S02
   was Controller until the owner renamed it Micromanager on 18 October, and
   for four days one saboteur printed as two, in two families, because the
   merge in compute() keyed on the spelling. A code never changes. A name
   may, and when it does the old name becomes a row in CODE_ALIAS and every
   record that held the code is still right.

   WHERE EACH CODE COMES FROM
     saboteur     SABDEF's own c field, S01 and up. Already fixed, kept.
     cluster      by rule from core.js: S.<seat>.<emotion>, the seat as B2K
                  keys it, or S.diffuse.<emotion> for the cross band rows.
     overshot     the code it overshoots, then .over.
     family       CODE_FAMILY below, K1 and up, in the order the book numbers
                  its clusters, I to VI (v192 lines 4501 to 4523).
     pole         its family's code, then o, the name read off FAM_POLE.
     structure    CODE_STRUCT below, X01 and up, one per record of canon.json's
                  complexes and hyper_complexes registers, in file order. The
                  code carries no tier, on purpose: canon.json files Dark
                  Triad as a hyper-complex while its own note calls it a
                  super-complex, and MOB's DESCENT files Psychopathy as a
                  super complex where canon.json files it a hyper-complex. A
                  ruling that moves a record between registers changes its
                  filed field and never its code.
     pair         compute()'s complex rung, two saboteurs of one family: the
                  two codes, sorted, joined by +. Order free, so the same two
                  saboteurs are one code whichever is heavier today.
     family-pair  compute()'s fourth rung, its sups, two families or poles:
                  the two codes, sorted, joined by /. trace.js and the Field
                  bar name this rung Character. The owner's 19 October
                  proposal and his 23 October dictation put a super-complex
                  below Character, so the kind is named for what it is made
                  of and carries neither word.
     address      the NODES number, as a string. Already the identity a
                  record stores, so the code is that number and nothing else.
     emotion      the CHILD name. Already the key p.axes and the trace's
                  fetter: ids store, so the code is that name, frozen in
                  CODE_EMOTION so a rename of CHILD fails the gate first.
     archetype    CODE_ARCH below, AR01 and up, row for row with ARCH, because
                  p.soul.arcs stores the ARCH index and p.avatar.arch the ARCH
                  name, so ARCH's order and names are both identity today.

   THE THREE ROW TABLES. Each row names its source, from CODE_SOURCES, or a
   list of them, or any.
     CODE_ALIAS     [source, kind, label, code, why]. A label that source
                    uses for a thing that has a code.
     CODE_UNMAPPED  [source, kind, label, why]. A label that source uses that
                    has no code, and why it has none. Refused by name.
     CODE_RETIRED   [source, kind, label, date, why]. A label withdrawn, with
                    the day and the reason. Refused by name.
   A source's own row answers for its own kind before any name in MOB's
   tables does, because it says what that source means: canon.json's
   Entitlement is address 8, where MOB's is 38.

   Every row says where it was read. Book line numbers are for v192, md5
   3d2671d9, the copy reboot-os holds. canon.json is 1.0.0, md5 7e844c0d.
   ============================================================ */
const CODE_SOURCES=[
 ['mob','this repository: its own tables, SNIFFER_SPEC.md and DESCENT'],
 ['canon','reboot-os atuned/data/canon.json, SOURCE OS CANON 1.0.0, issued 8 September by the owner, md5 7e844c0d'],
 ['book','The Mechanics of Being v192, reboot-os atuned/data/corpus/MOB_Complete_v192.txt, md5 3d2671d9'],
 ['app','the reboot-os app tables, atuned/data/canon_tables: SAB33, SABAUTH, HYPER, NODEREG'],
 ['nodes112','reboot-os atuned/data/nodes_112.json'],
 ['any','every source in this table']];

const CODE_KINDS=[
 ['saboteur','a named saboteur, by its SABDEF code'],
 ['cluster','an inferred saboteur: two or more addresses in one seat carrying one child emotion, or the cross seat leftovers of one emotion'],
 ['overshot','a saboteur or cluster read past the point where it serves'],
 ['family','a hyper-complex family of HCX_LIB'],
 ['pole','a family done past the point where it helps, from FAM_POLE'],
 ['structure','a complex or hyper-complex of canon.json, whichever register it is filed in'],
 ['pair','the complex compute() makes of two saboteurs of one family'],
 ['family-pair','the fourth rung compute() makes, its sups, of two families or poles. trace.js names it Character'],
 ['address','an address of NODES'],
 ['emotion','a child emotion of CHILD'],
 ['archetype','an archetype of ARCH']];

/* [code, MOB's name, the book's cluster numeral]. HCX_LIB is the same six in
   the same order today, and the gate holds the names, not the order, so a
   reorder of HCX_LIB moves nothing here. */
const CODE_FAMILY=[['K1','Grandiosity','I'],['K2','Predatory','II'],['K3','Collapse','III'],
 ['K4','Rigidity','IV'],['K5','Dysregulation','V'],['K6','Dissociation','VI']];

/* [code, name, register it is filed in, its row in that register, R ruled by
   the owner or I inferred]. Generated from canon.json on 23 October. The
   tag is kept because canon.json's own rule is that an inferred record shows
   as inferred everywhere it appears. No children: what each is made of is
   content, and content is phase two. */
const CODE_STRUCT=[
 ["X01","Dominance Enforcement","complex",0,"R"],
 ["X02","Blame Displacement","complex",1,"R"],
 ["X03","Superiority-Persecution","complex",2,"R"],
 ["X04","Narcissistic","complex",3,"R"],
 ["X05","Machiavellian Tactics","complex",4,"R"],
 ["X06","Antisocial","complex",5,"R"],
 ["X07","Oscillation","complex",6,"R"],
 ["X08","Abandonment Reactivity","complex",7,"R"],
 ["X09","Rigidity","complex",8,"R"],
 ["X10","Attention Seeking","complex",9,"R"],
 ["X11","Threat Scanning","complex",10,"R"],
 ["X12","Collapse","complex",11,"R"],
 ["X13","Scatter","complex",12,"R"],
 ["X14","Anticipatory Freeze","complex",13,"I"],
 ["X15","Catastrophic Bracing","complex",14,"I"],
 ["X16","Meaning Withdrawal","complex",15,"I"],
 ["X17","Retreat","complex",16,"I"],
 ["X18","Cold Analysis","complex",17,"I"],
 ["X19","Self-Erasure","complex",18,"I"],
 ["X20","Sacrificial Ledger","complex",19,"I"],
 ["X21","Exploitation","complex",20,"I"],
 ["X22","Standard Enforcement","complex",21,"I"],
 ["X23","Imposture","complex",22,"I"],
 ["X24","Malignant Narcissism","hyper_complex",0,"R"],
 ["X25","Sociopathy","hyper_complex",1,"I"],
 ["X26","Psychopathy","hyper_complex",2,"I"],
 ["X27","Machiavellianism","hyper_complex",3,"I"],
 ["X28","Megalomania","hyper_complex",4,"I"],
 ["X29","Malignant Grandiosity","hyper_complex",5,"I"],
 ["X30","Dark Triad","hyper_complex",6,"I"],
 ["X31","Persecutory Collapse","hyper_complex",7,"I"]];

/* BLAME DISPLACEMENT AND ANTISOCIAL ARE TWO CODES, X02 AND X06. canon.json
   gives both the same two saboteurs, Aggressor and Deflector, and tags both
   ruled. They are kept apart because the book names both, in two roles, in
   one paragraph (v192 line 4319): "Aggressor + Deflector -> blame
   displacement + force system" is a complex inside Malignant Narcissism, and
   "Narcissistic Complex + Antisocial Complex" is the hyper-complex itself.
   And because the shared pair is a substitution left half done, not a
   ruling that they are one: Antisocial's own note is "Rebel removed.", and
   canon.json's open ruling 6 says Rebel was ruled an archetype and "Four
   substitutions needed." So Antisocial lost a child and was given
   Blame Displacement's pair while the substitution waits. If the owner
   rules them one, the later code becomes a CODE_ALIAS row of the earlier and
   every record still resolves. Two codes merged later is additive. One code
   split later is not, because a record holding it cannot say which half it
   meant. */

/* [code, ARCH's name]. Row i is ARCH[i], and the gate fails if either moves. */
const CODE_ARCH=[['AR01','Warrior'],['AR02','Sage'],['AR03','Rebel'],['AR04','Caregiver'],
 ['AR05','Creator'],['AR06','Magician'],['AR07','Ruler'],['AR08','Explorer'],['AR09','Lover'],
 ['AR10','Jester'],['AR11','Everyman'],['AR12','Innocent']];

/* the child emotions, frozen. The gate holds CHILD and CHARGES to it both ways. */
const CODE_EMOTION=['Fear','Anger','Shame','Disgust','Apathy','Shock','Sad','Surprise','Anticipation'];

const CODE_ALIAS=[
 /* saboteurs */
 ['any','saboteur','Controller','S02',"S02's name until the owner renamed it Micromanager on 18 October, finished at commit 41009c04. Shirzad Chamine, whose Positive Intelligence it comes from, calls it the Controller (SAB_PI_AS), and canon.json, the book (v192 line 4346) and the app's SAB33 still print it"],
 ['any','saboteur','Sceptic','S17',"the book's spelling of Skeptic, once, in its descent (v192 line 3088). Every other line of the book, canon.json, the app and MOB spell it Skeptic"],
 /* structures, named otherwise than canon.json names them */
 ['any','structure','Narcissism','X04',"the book's descent (v192 line 3088) and the app's HYPER table give Narcissism the three saboteurs canon.json gives Narcissistic, Controller, Hyper-Achiever and Judge, and the book's four parts, entitlement, justification, comparison and judgment, are canon.json's own note on it. MOB's DESCENT files it a complex as canon.json does; the book calls it a hyper-complex (line 4315), which is why the code carries no tier"],
 /* clinical filings. Internal only: a code is never shown as a diagnosis */
 ['any','structure','Bipolar','X07',"clinical filing, internal only. canon.json files Oscillation as Bipolar in the March table, and the book's clinical list gives Bipolar the same three saboteurs (v192 line 3090)"],
 ['any','structure','BPD','X08',"clinical filing, internal only. canon.json files Abandonment Reactivity as BPD, and the book's clinical list gives BPD the same three saboteurs (v192 line 3090)"],
 ['any','structure','OCPD','X09',"clinical filing, internal only. canon.json files its Rigidity complex as OCPD, and the book's clinical list gives OCPD the same three saboteurs (v192 line 3090)"],
 ['any','structure','Histrionic','X10',"clinical filing, internal only. canon.json files Attention Seeking as Histrionic, and the book's clinical list gives Histrionic the same three saboteurs (v192 line 3090)"],
 ['canon','structure','Anxiety Disorders','X11',"clinical filing, internal only. canon.json files Threat Scanning as Anxiety Disorders"],
 ['book','structure','Anxiety','X11',"clinical filing, internal only. The book's clinical list gives Anxiety the three saboteurs canon.json gives Threat Scanning (v192 line 3090)"],
 ['any','structure','Depression','X12',"clinical filing, internal only. canon.json files its Collapse complex as Depression, and the book's clinical list gives Depression the same three saboteurs (v192 line 3090)"],
 ['canon','structure','ADHD','X13',"clinical filing, internal only. canon.json files Scatter as ADHD. The book's clinical list has no ADHD"],
 /* families */
 ['any','family','Narcissism','K1',"the book names cluster I Narcissism (v192 line 4501), and SNIFFER_SPEC.md section 5 maps Grandiosity to cluster I, Narcissism"],
 /* archetypes */
 ['any','archetype','Caretaker','AR04',"SNIFFER_SPEC.md section 4 and canon.json's jungian register name it Caretaker. ARCH, ARCH18, the app's ARCH12 and ARCH18 and canon.json's archetype register name it Caregiver, and none of those tables carries both"],
 /* emotions */
 ['any','emotion','Sadness','Sad',"the Sad axis as MOB's node map, SAB33, canon.json's ladders and the book's bands spell it. REROUTE, CHG2FET and compute() already read the two as one"],
 /* addresses, named or numbered otherwise */
 [['canon','book'],'address','Entitlement','8',"canon.json and the book (v192 line 8776) name this Root address Entitlement, where MOB holds it unnamed as Root_08_Unnamed, which is the owner's call. MOB gives the name Entitlement to its Solar address at the Renal Plexus"],
 [['canon','book'],'address','Entitlement (Will-based)','38',"canon.json and the book (v192 line 8808) name this Solar address so. MOB names it Entitlement"],
 [['canon','book'],'address','Resentment','43',"canon.json and the book (v192 line 8813) name this address Resentment. MOB names it Resentment (Solar), beside its Resentment (Heart)"],
 [['canon','book'],'address','Self-Judgment','46',"canon.json and the book (v192 line 8816) name this address Self-Judgment. MOB names it Self-Judgment (Solar), beside its Self-Judgment (Heart)"],
 [['canon','book'],'address','Using Spiritual Language to Manipulate','75',"canon.json and the book (v192 line 8847) name this Throat address so. MOB names it Spiritual Language To Manipulate"],
 ['canon','address','Doubt of Source','88',"canon.json writes Source where MOB, the book and the app write God, by its own lock that the divine term is Source. MOB names it Doubt Of God"],
 ['canon','address','Unworthy of Source','98',"canon.json's Source for God. MOB names it Unworthy Of God"],
 ['canon','address','Knowing Better than Source','99',"canon.json's Source for God. MOB names it Knowing Better Than God"],
 ['canon','address','Fear of Source','102',"canon.json's Source for God. MOB names it Fear Of God"],
 ['canon','address','Anger at Source','103',"canon.json's Source for God. MOB names it Anger At God"],
 [['canon','book'],'address','109','112',"canon.json and the book (v192 line 8886) number the field nodes in another order. Their 109 is Gaia Gateway, MOB's 112"],
 [['canon','book'],'address','110','111',"canon.json and the book number the field nodes in another order. Their 110 is Earth Star, MOB's 111"],
 [['canon','book'],'address','111','109',"canon.json and the book number the field nodes in another order. Their 111 is Soul Star, MOB's 109, Sol Star"],
 [['canon','book'],'address','112','110',"canon.json and the book number the field nodes in another order. Their 112 is Stellar Gateway, MOB's 110"],
 ['any','address','Soul Star','109',"every source but MOB spells MOB's Sol Star this way: canon.json, the book, the app's NODEREG and nodes_112"],
 ['app','address','Entitlement (Root)','8',"the app's NODEREG names the unnamed Root address so. MOB holds it unnamed as Root_08_Unnamed"]];

const CODE_UNMAPPED=[
 /* emotions: labels for a charge that are not one of the child emotions */
 ['mob','emotion','Joy',"a charge label on MOB's node map. REROUTE sends it to Apathy by rule, and CHILD gives Joy as the coherent pole of Sad, so it names no child emotion"],
 ['mob','emotion','Resentment',"a charge label on MOB's node map. REROUTE sends it to Anger by rule, and the book holds resentment apart from anger (v192 line 4319)"],
 ['canon','emotion','joy',"canon.json's charge label at its addresses and in its ladders. Not a child emotion, and canon.json's open ruling 1 says the rosters of the base emotions disagree"],
 ['canon','emotion','resent',"canon.json's charge label at its addresses and in its ladders. Not a child emotion"],
 ['canon','emotion','love',"canon.json's charge at Expectation and at False Love. No table in either repository routes it to a child emotion"],
 ['canon','emotion','anxiety',"canon.json's charge at Compulsion, in the Root. MOB's CHG2FET routes the word to Anticipation, which is a rule, not a name"],
 ['book','emotion','Happiness',"a band axis of the book's saboteur library, The Negotiator's second (v192 line 4338). Not a child emotion"],
 ['book','emotion','Entitlement',"a band axis of the book's saboteur library, the Controller's third (v192 line 4346). Not a child emotion"],
 ['book','emotion','Resentment',"a band axis of the book's saboteur library, the Victim's second (v192 line 4350). Not a child emotion"],
 /* saboteurs: names that are not one of SABDEF's */
 ['mob','saboteur','Bully',"carried in SABAUTH with a composition of its own, and not a saboteur SABDEF codes: no SAB33 row and no card"],
 ['mob','saboteur','Codependent',"carried in SABAUTH with a composition of its own, and not a saboteur SABDEF codes"],
 ['mob','saboteur','Critic',"carried in SABAUTH with a composition of its own, and not a saboteur SABDEF codes"],
 ['mob','saboteur','Hero',"carried in SABAUTH with a composition of its own, and not a saboteur SABDEF codes. ARCH18 also carries Hero as an archetype"],
 ['mob','saboteur','Intellectualizer',"carried in SABAUTH with a composition of its own, and not a saboteur SABDEF codes"],
 ['mob','saboteur','Nonconformist',"carried in SABAUTH with a composition of its own, and not a saboteur SABDEF codes"],
 ['mob','saboteur','Savior',"carried in SABAUTH with a composition of its own, and not a saboteur SABDEF codes"],
 ['any','saboteur','Rebel',"canon.json's open ruling 6: ruled a Jungian archetype, still standing in four places as a saboteur. MOB's SABAUTH and the app's still carry it. As an archetype it is AR03"],
 ['app','saboteur','Rescuer',"the app's SABAUTH carries it. canon.json's open ruling 7 rules it a head archetype, not one of the saboteurs"],
 ['app','saboteur','The Withholder',"the app's last SAB33 row, where MOB and canon.json carry Avoider, with another charge profile, fear and silence. reboot-os records Avoider as missing from that table, not renamed (atuned/docs/ATUNED_SUCCESS_AND_DECISION_LOGGING_RULE_2026-10-18.md line 47)"],
 /* archetypes outside ARCH */
 ['any','archetype','Outlaw',"canon.json's archetype register carries Outlaw and Rebel as two. SNIFFER_SPEC.md section 4 and canon.json's jungian register carry Outlaw where ARCH carries Rebel. Whether they are one is the owner's call"],
 ['any','archetype','Orphan',"ARCH18 and canon.json's archetype register carry Orphan and Everyman as two. SNIFFER_SPEC.md section 4 and canon.json's jungian register carry Orphan where ARCH carries Everyman. Whether they are one is the owner's call"],
 ['any','archetype','Hero',"carried by ARCH18 and canon.json's archetype register, not by ARCH, the roster a record stores. The roster's count is open (SNIFFER_SPEC.md section 4)"],
 ['any','archetype','Mentor',"carried by ARCH18 and canon.json's archetype register, not by ARCH, the roster a record stores. The roster's count is open (SNIFFER_SPEC.md section 4)"],
 ['any','archetype','Shadow',"carried by ARCH18 and canon.json's archetype register, not by ARCH, the roster a record stores. The roster's count is open (SNIFFER_SPEC.md section 4)"],
 ['any','archetype','Shapeshifter',"carried by ARCH18 and canon.json's archetype register, not by ARCH, the roster a record stores. The roster's count is open (SNIFFER_SPEC.md section 4)"],
 ['any','archetype','Healer',"carried by ARCH18 and canon.json's archetype register, not by ARCH, the roster a record stores. The roster's count is open (SNIFFER_SPEC.md section 4)"],
 ['canon','archetype','Pleaser',"canon.json's archetype register carries Pleaser, which MOB and canon.json both carry as the saboteur S05. ARCH has no Pleaser"],
 /* structures with no canon.json record */
 ['book','structure','Borderline-Sociopath',"a link in the book's descent (v192 line 3088) that canon.json has no record of"],
 ['book','structure','The Performer',"the book names it a hyper-complex (v192 line 4487). canon.json has no record of it"],
 ['app','structure','Bipolar Disorder',"the app's HYPER table, with Nonconformist where canon.json's Oscillation, filed as Bipolar, has Restless. Whether they are one record is not written anywhere"],
 ['app','structure','Borderline Personality Disorder',"the app's HYPER table, sharing no saboteur with canon.json's Abandonment Reactivity, filed as BPD. Whether they are one record is not written anywhere"],
 ['app','structure','Obsessive-Compulsive Disorder',"the app's HYPER table. canon.json files its Rigidity complex as OCPD, a different filing, with Stickler where this has Overthinker"],
 ['app','structure','Antisocial Personality Disorder',"the app's HYPER table, with Nonconformist and Judge where canon.json's Antisocial has Deflector. Whether they are one record is not written anywhere"],
 ['app','structure','Schizoid Personality Disorder',"the app's HYPER table. No canon.json record carries the name"],
 ['app','structure','Histrionic Personality Disorder',"the app's HYPER table, with Pleaser and Escapist where canon.json's Attention Seeking, filed as Histrionic, has People-Pleaser and Dreamer. Whether they are one record is not written anywhere"],
 /* addresses */
 ['nodes112','address','PARAM SHIVA / ASCENSION',"nodes_112 puts it at 112, where MOB has Gaia Gateway, and has no Gaia Gateway anywhere. Whether they are one node is not written anywhere"],
 ['nodes112','address','112',"nodes_112's 112 is PARAM SHIVA / ASCENSION, where MOB's is Gaia Gateway. Whether they are one node is not written anywhere"]];

const CODE_RETIRED=[
 ['mob','saboteur','Superior','2026-10-22',"retired from SAB_LIB at commit 41009c04. No source of the owner's defines it, TULA carries the idea as Entitlement on the saboteurs Narcissism is made of, all three of its addresses belong to canon rows, and it fired with Aggressor on 88 per cent of the fields where either fired"]];
