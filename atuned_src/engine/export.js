
/* ============================================================
   The engine is DOM free. In a browser these are globals on the
   concatenated script. In node the same file is requireable, so the
   engine can be tested headlessly and shared with Atuned through the
   one profile object the schema contract defines.
   ============================================================ */
if(typeof module!=='undefined'&&module.exports){
 module.exports={
  /* data */      NODES:NODES, SAB_LIB:SAB_LIB, HCX_LIB:HCX_LIB, SAB33:SAB33, SAB_PI:SAB_PI, GATEGLYPH:GATEGLYPH,
                  APC:APC, APC_REL:APC_REL, APC_EMB:APC_EMB,
                  SABDEF:SABDEF, DOMDEF:DOMDEF, GLOSS:GLOSS, HARM:HARM,
  /* meter */    meterFirst:meterFirst,
  /* undo */     undoPush:undoPush, undoPop:undoPop, undoDepth:undoDepth,
                 redoPop:redoPop, redoDepth:redoDepth, redoPeek:redoPeek,
                  undoPeek:undoPeek, undoClear:undoClear, UNDO_MAX:UNDO_MAX,
  /* avatar */   avatarBlank:avatarBlank, avatarValid:avatarValid, avatarDue:avatarDue,
                 avatarDaysLeft:avatarDaysLeft, avatarGap:avatarGap,
                 avatarProgress:avatarProgress, AV_MONTH:AV_MONTH,
  /* purpose */  purposeBlank:purposeBlank, purposeReady:purposeReady,
                 purposeCentre:purposeCentre, purposeRead:purposeRead,
                 boundaryCount:boundaryCount, boundaryCross:boundaryCross,
                 PUR_SIDES:PUR_SIDES, PUR_PER_SIDE:PUR_PER_SIDE,
                 PUR_SOUL:PUR_SOUL, PUR_EGO:PUR_EGO,
  /* plan */     PLANS:PLANS, PLAN_BY:PLAN_BY, PLAN_ALWAYS:PLAN_ALWAYS, SEE_ORDER:SEE_ORDER,
                 PLAN_LIVE:PLAN_LIVE, PLAN_DEAD:PLAN_DEAD,
                 planState:planState, planOf:planOf, planSees:planSees,
                 planNextSight:planNextSight, planAllowance:planAllowance,
                 planUpgrade:planUpgrade, RUN_MAX:RUN_MAX, RUN_MIN:RUN_MIN,
                 planYear:planYear, PLAN_YEAR_FREE:PLAN_YEAR_FREE,
                 planYear:planYear, PLAN_YEAR_FREE:PLAN_YEAR_FREE,
                 LEAD_SEES:LEAD_SEES, LEAD_HIDDEN:LEAD_HIDDEN, leadSees:leadSees,
                 EQUIV:EQUIV, EQUIV_NONE:EQUIV_NONE, equivOf:equivOf, planWorth:planWorth,
  /* ages */     AGES:AGES, AGE_TEST:AGE_TEST, AGE_LO:AGE_LO, AGE_HI:AGE_HI,
                 ageFinding:ageFinding, AGE_WORKED:AGE_WORKED,
  /* compass */  MIRROR:MIRROR, MASTERS:MASTERS, BLUEPRINT:BLUEPRINT, CIRCLES:CIRCLES,
                 CASCADE:CASCADE, DESCENT:DESCENT, DESCENT_REFER:DESCENT_REFER,
                 mirrorAt:mirrorAt, darkRead:darkRead, circleAt:circleAt,
                 DARK_MAL:DARK_MAL, DARK_CQ:DARK_CQ,
                 GOVERN:GOVERN, quadrant:quadrant, outwardShare:outwardShare, organisedShare:organisedShare, ORG_W:ORG_W,
                 FAM_OUT:FAM_OUT, FAM_IN:FAM_IN, GOV_ORG:GOV_ORG, GOV_MAL:GOV_MAL, GOV_ANGEL:GOV_ANGEL,
  /* labels */   TIERDEF:TIERDEF, TIER_BY:TIER_BY, tierOf:tierOf, TIERCOL:TIERCOL,
                 MEDIAN:MEDIAN, MEDIAN_LO:MEDIAN_LO, MEDIAN_HI:MEDIAN_HI,
                 medianRange:medianRange, tierTop:tierTop, tierRange:tierRange,
  /* astro */     julianDay:julianDay, sunLon:sunLon, moonLon:moonLon, gmst:gmst,
                  ascendant:ascendant, signOf:signOf, degInSign:degInSign,
                  gateOf:gateOf, designJD:designJD, birthJD:birthJD, PLACE:PLACE,
                  usDST:usDST, euDST:euDST, GATE_WHEEL:GATE_WHEEL, GATE_ARC:GATE_ARC,
                  chineseYear:chineseYear, spiritualOf:spiritualOf,
  /* catalog */   C3_VERB:C3_VERB, C3_STEM:C3_STEM, C3_TRUTH:C3_TRUTH, C3_GATE9:C3_GATE9,
                  C3_BAND:C3_BAND, C3_LADDER:C3_LADDER, C3_POLE:C3_POLE, C3_BILATERAL:C3_BILATERAL,
                  C3_CHAIN:C3_CHAIN, C3_DIR:C3_DIR, C3_PART:C3_PART, C3_HEAD:C3_HEAD,
                  C3_THEME:C3_THEME, C3_KIND:C3_KIND, C3_TRUTHRULE:C3_TRUTHRULE, C3_FAIL:C3_FAIL,
                  CARDSET:CARDSET, CARD_OPEN:CARD_OPEN, CARD_SHUT:CARD_SHUT, CARD_STEP:CARD_STEP,
                  AXCARD:AXCARD, AXC_UN:AXC_UN, CARD_BY:CARD_BY, AXC_BY:AXC_BY, AX_STEM:AX_STEM,
                  cardLine:cardLine, cardDepth:cardDepth, axLine:axLine, c3Band:c3Band,
                  HARM_AX:HARM_AX, KB_RENAME:KB_RENAME, KB_KEY:KB_KEY, INFER_NOUN:INFER_NOUN,
                  SABAUTH:SABAUTH, ARCH18:ARCH18, CHILD:CHILD, CHARGES:CHARGES,
                  DOMAINS:DOMAINS, ARCH:ARCH, SI:SI, SINAMES:SINAMES, MASKS:MASKS,
                  BANDS:BANDS, PAL:PAL, ROOTD:ROOTD, ROOTCOL:ROOTCOL, AFFIN:AFFIN,
                  PRACTICE:PRACTICE, EXPR:EXPR, PMBANDS:PMBANDS, FLOWSEAT:FLOWSEAT, seatHz:seatHz,
                  PAINREG:PAINREG, PEOPLE:PEOPLE, LAWSET:LAWSET, BIRTH:BIRTH,
                  LEX:LEX, ADJ2CHG:ADJ2CHG, PHRASES:PHRASES, VERP:VERP,
                  NERVEBR:NERVEBR, BODYPATH:BODYPATH, TAB:TAB,
  /* the ladder */MARKS:MARKS, ladderRead:ladderRead, ledgerRead:ledgerRead,
                  intentionRead:intentionRead, INTENT_DAYS:INTENT_DAYS,
                  streakRead:streakRead, pracDays:pracDays, pracDay:pracDay,
  /* indexes */   W:W, BY:BY, ALL_SAB:ALL_SAB, S:S,
  /* soul */      buildSoul:buildSoul, affinity:affinity, bandIg:bandIg,
  /* engine */    compute:compute, suscAll:suscAll, balance:balance, OUTWARD:OUTWARD, INWARD:INWARD,
  /* the child pattern, and the reading of it that is assumed. Both exported,
     because a gate that cannot reach the constant cannot tell whether the
     count it read belongs to the reading it thinks it is looking at. */
                  childFound:childFound, CHILD_READ:CHILD_READ, SEATPRIM:SEATPRIM,
  /* THE CEILING. Absent from this contract for as long as it has existed, and
     two seats have now needed it and built their own copy instead: the
     integrity probe re-evals the whole engine source to reach it, and the
     avatar rise sim recomputes the reach by hand beside a comment saying why.
     A number no caller can reach is a number with no owner, which is the same
     defect the lean tables and IQ_STEM were fixed for.

     It is the one the owner has ruled most important. His words are that a
     person is already the most powerful version of themselves and the limiters
     are what hold them down, so the ceiling is the person and the reading is
     the drag against it.

     Renamed from cqCeiling and cqHeadroom when CQ became the 21 laws alone:
     what a release moves visibly is the shadow, so its ceiling is read on
     expression. The lever and the law test are exported beside them so a gate
     can pin the fitted curve and reproduce the simulation's worked people
     without re-deriving either.

     AND WHAT A RELEASE DOES TO THE LAWS, corrected 25 September after ship: a
     release lifts the laws at its seat by LIFT_R of the distance left, fitted
     to his fifteen thousand. Exported so the gate can drive a release through
     the same function the release panel calls, and hold the rate to the fit. */
                  exCeiling:exCeiling, exHeadroom:exHeadroom,
                  lawIn:lawIn, cqSum:cqSum, leverPull:leverPull,
                  LEVER_MU:LEVER_MU, LEVER_SD:LEVER_SD, CQ_MODEL:CQ_MODEL,
                  LIFT_R:LIFT_R, lawLift:lawLift, lawWork:lawWork, lawNow:lawNow,
                  releaseWork:releaseWork, lawAnswered:lawAnswered,
  /* seed */      TYPE16:TYPE16, SEED16:SEED16, seedAxes:seedAxes, seedApply:seedApply,
                  seedClear:seedClear, seedShare:seedShare, seedValid:seedValid, accuracy:accuracy, sab33Detect:sab33Detect,
                  sabLevels:sabLevels, exprFill:exprFill, exprRead:exprRead,
  /* gates */     verpScan:verpScan, verpApply:verpApply, verpFactor:verpFactor,
                  verpRead:verpRead, verpShare:verpShare,
                  leanScan:leanScan, leanApply:leanApply, leanRead:leanRead,
                  VERPMIX:VERPMIX, LEANMIX:LEANMIX,
  /* the lean, two channels. exported so the gate can reach the tables and
     the weights by name. a table no test can reach is a table with no
     owner, which is how six broken intake questions shipped. */
                  LEANCH:LEANCH, LEANLEX:LEANLEX, LEANCUE:LEANCUE,
                  LEANFRAME:LEANFRAME, LEANOUT:LEANOUT,
                  leanAdmit:leanAdmit, leanSeries:leanSeries, leanChan:leanChan,
                  leanNegated:leanNegated, leanCount:leanCount, LEANNEG:LEANNEG, LEAN_NEG_W:LEAN_NEG_W,
  /* VERPCUE was reachable as a browser global and absent from the contract,
     so no test could check the lean tables against it. One phrase in both
     moves two instruments on one occurrence, which is what 'let it go' did. */
                  VERPCUE:VERPCUE, VERPMULT:VERPMULT,
                  LEAN_FRAME_W:LEAN_FRAME_W, LEAN_TRUST_CAP:LEAN_TRUST_CAP,
                  LEAN_TRUST_HALF:LEAN_TRUST_HALF, LEAN_MIN_CH:LEAN_MIN_CH,
  /* the door */  read:read, input:input, throughput:throughput, output:output,
                  gatesClear:gatesClear, gatesLoad:gatesLoad, gatesSave:gatesSave,
  /* schema */    blankProfile:blankProfile, loadProfile:loadProfile,
                  saveProfile:saveProfile, snapshot:snapshot, LAW_DEFAULT:LAW_DEFAULT,
  /* the twenty one on every history row, the one law over time a graph reads,
     and the renames both the loader and the boundary read */
                  snapLaws:snapLaws, lawSeries:lawSeries, LAW_WAS:LAW_WAS,
  /* the unanswered marks, which CQ now reads through lawIn. The object is
     never reassigned, only its keys, so the reference exported here stays the
     live one. A headless caller that sets S.law directly after a blank profile
     has been loaded clears these to say the values it set were answered;
     otherwise a law set to exactly the seed reads as unanswered, which is
     saveProfile's documented blind spot and correct for a person. */
                  LAW_UNSET:LAW_UNSET,
                  pExport:pExport, pImport:pImport, validateProfile:validateProfile, importError:importError,
                  meterRun:meterRun, meterRead:meterRead, meterKey:meterKey, meterBudget:meterBudget,
                  meterNext:meterNext, meterPlan:meterPlan, LINES_PER_CH:LINES_PER_CH, MARKERS:MARKERS, markersFor:markersFor, PAT_PER_YEAR:PAT_PER_YEAR,
                  PAT_GEN:PAT_GEN, PAT_REF_AGE:PAT_REF_AGE,
                  profiles:function(){return PROFILES;}, current:function(){return CURP;}, SCHEMA_V:SCHEMA_V,
                  bindStore:bindStore, PKEY:PKEY, pPersist:pPersist, saveState:saveState,
                  storeBound:function(){return STORE_BOUND;},
  /* intake */    iqList:iqList, iqScore:iqScore, iqApply:iqApply,
  /* exported so the gate can assert it against SI in both directions. The
     rename that missed this table shipped six broken questions, and a table
     no test can reach is a table with no owner. */
                  IQ_STEM:IQ_STEM,
  /* sniffer */   scanStory:scanStory, normMap:normMap, marksOf:marksOf, parseStory:parseStory, applyStory:applyStory,
  /* THE OUTPUT CONTRACT, SNIFFER_SPEC.md section 10. sniffStory is the one
     entry point a caller needs; the seven part builders are exported beside it
     because the gate asserts each part on its own and a part no test can reach
     is a part with no owner, which is the defect this layer exists to close. */
                  sniffStory:sniffStory, sniffAxes:sniffAxes,
                  sniffSaboteurs:sniffSaboteurs, sniffLaws:sniffLaws,
                  sniffFlow:sniffFlow, sniffGates:sniffGates,
                  sniffDepth:sniffDepth, sniffOffer:sniffOffer,
                  SPEC_POLE:SPEC_POLE, LEXCOMP:LEXCOMP, LAWVIO:LAWVIO,
                  lexComposite:lexComposite, LEXCOMPRUN:LEXCOMPRUN,
                  SAB_SHOW:SAB_SHOW, OFFER_MAX:OFFER_MAX,
                  GATE_BASE:GATE_BASE, GATE_STEP:GATE_STEP,
  /* the band edge. sabMember is the ramp itself and the gate asserts it is
     continuous where the shipped staircase was not, so it has to be reachable.
     sabConfidence and sabWeight carry the specificity ruling. */
                  sabMember:sabMember, sabFetters:sabFetters,
                  sabConfidence:sabConfidence, sabWeight:sabWeight,
                  SAB_EDGE:SAB_EDGE, SAB_BELOW:SAB_BELOW, SAB_ABOVE:SAB_ABOVE,
                  SAB_ARITY:SAB_ARITY, SABW:SABW,
  /* the law, expression and depth cue tables, and the coverage report that
     refuses to let an average hide the hole in them. */
                  LAWCUE:LAWCUE, EXPRCUE:EXPRCUE, DANTECUE:DANTECUE,
                  lawCoverage:lawCoverage, C8_GIVE:C8_GIVE, C8_AUDIENCE:C8_AUDIENCE,
                  LAW_SELF:LAW_SELF, LAW_OTHER:LAW_OTHER, LAW_ONE:LAW_ONE,
  /* the lexicon's schema and its provenance. exported because the gate has to
     be able to prove the validator REFUSES, and because a provenance table no
     test can reach is a provenance table with no owner, which is the defect
     this whole layer exists to close. lexAdd and chgAdd are load time builders:
     they are what the canon and fold passes are made of, and nothing calls them
     after boot. */
  /* the two canon tables the canon pass derives every seat and fetter from.
     exported so the gate can assert the derivation against them rather than
     against a number typed into the test, which is the failure this repository
     has been bitten by seven times. */
                  CHG2SEAT:CHG2SEAT, CHG2FET:CHG2FET, B2K:B2K, K2BAND:K2BAND,
                  LEX_SEAT:LEX_SEAT, LEX_AMT:LEX_AMT, LEX_FET:LEX_FET,
                  LEX_SEATS:LEX_SEATS, LEX_SRC:LEX_SRC, LEX_AMT_MAX:LEX_AMT_MAX,
                  LEXMETA:LEXMETA, CHGMETA:CHGMETA,
                  lexKeyOk:lexKeyOk, lexRefuse:lexRefuse,
                  lexAdd:lexAdd, chgAdd:chgAdd,
                  LEX_FOLD_RULES:LEX_FOLD_RULES, LEX_FOLD_OK:LEX_FOLD_OK,
                  LEX_FOLD_NO:LEX_FOLD_NO, lexFold:lexFold,
                  LEX_DEAD:LEX_DEAD,
                  lexCanon:lexCanon, lexCanonWords:lexCanonWords,
                  lexFamilyFloor:lexFamilyFloor,
                  LEXCANONRUN:LEXCANONRUN, LEXFOLDRUN:LEXFOLDRUN,
                  pathOf:pathOf, seatOf:seatOf, SEATXY:SEATXY, PATHSEAT:PATHSEAT,
  /* birth */     sunSign:sunSign, moonSign:moonSign, risingSign:risingSign,
                  lifePath:lifePath, spiritual:spiritual, converge:converge,
                  /* the rest of the module. they were reachable as browser
                     globals but absent from the contract, so nothing outside
                     a page could test them. */
                  masterNumber:masterNumber, chineseElement:chineseElement,
                  hdOf:hdOf, geneKey:geneKey,
  /* numerology */numerology:numerology, numerologyOf:numerologyOf,
                  numReduce:numReduce, numIsVowel:numIsVowel, numSum:numSum,
                  numAcross:numAcross, numParts:numParts, numSays:numSays,
                  numFullName:numFullName,
                  NUM_LET:NUM_LET, NUM_MASTER:NUM_MASTER, NUM_DEBT:NUM_DEBT,
                  NUM_CORE:NUM_CORE, NUM_DEBT_SAYS:NUM_DEBT_SAYS,
                  FULLNAME:FULLNAME, BIRTH:BIRTH,
  /* store */     storeRefused:storeRefused, pStore:pStore, pPersist:pPersist,
  /* the save and the snapshot write every surface calls, and the only route a
     history row reaches the disk by. They were browser globals and nothing
     headless could drive them, so the one write that grows the record had no
     gate of its own. */
                  pSave:pSave, pSnap:pSnap, pNew:pNew,
                  saveState:saveState,
                  validateProfile:validateProfile, loadProfile:loadProfile,
                  blankProfile:blankProfile,
  /* the two nested bags' closed key sets, exported so the gate can assert
     them against OB_NEVER rather than against a second list typed in the
     test, and RIT_PLAN_MAX so the surface and the boundary are one number */
                  RIT_KEYS:RIT_KEYS, ENT_KEYS:ENT_KEYS,
                  RIT_PLAN_MAX:RIT_PLAN_MAX, RIT_MIN_MAX:RIT_MIN_MAX,
  /* the ring's parameter. ritTarget tells the three shapes apart off the
     tables and returns a target only for the one that is a count, so a
     generator has somewhere to read it from instead of typing a one. */
                  ritTarget:ritTarget, RIT_SHAPES:RIT_SHAPES, C3_BAND_N:C3_BAND_N,
  /* palettes */  PAL_VIVID:PAL_VIVID,
  /* series */    seriesRead:seriesRead, SPANS:SPANS, spanOf:spanOf,
  /* outbox */    obQueue:obQueue, obValidate:obValidate, obDrain:obDrain,
                  obCount:obCount, obStore:obStore, obBand:obBand,
                  bindSend:bindSend, OBKEY:OBKEY, OB_MAX:OB_MAX,
                  OB_KEYS:OB_KEYS, OB_NEVER:OB_NEVER, OB_LIMIT:OB_LIMIT,
                  OB_KINDS:OB_KINDS,
  /* storage */   bindStore:bindStore,
  /* util */      clamp:clamp, leaves:(typeof leaves==='function'?leaves:null)
 };
}
