
/* ============================================================
   The engine is DOM free. In a browser these are globals on the
   concatenated script. In node the same file is requireable, so the
   engine can be tested headlessly and shared with Atuned through the
   one profile object the schema contract defines.
   ============================================================ */
if(typeof module!=='undefined'&&module.exports){
 module.exports={
  /* data */      NODES:NODES, SAB_LIB:SAB_LIB, HCX_LIB:HCX_LIB, SAB33:SAB33, SAB_PI:SAB_PI, GATEGLYPH:GATEGLYPH, INFER_NOUN:INFER_NOUN,
                  SABAUTH:SABAUTH, ARCH18:ARCH18, CHILD:CHILD, CHARGES:CHARGES,
                  DOMAINS:DOMAINS, ARCH:ARCH, SI:SI, SINAMES:SINAMES, MASKS:MASKS,
                  BANDS:BANDS, PAL:PAL, ROOTD:ROOTD, ROOTCOL:ROOTCOL, AFFIN:AFFIN,
                  PRACTICE:PRACTICE, EXPR:EXPR, PMBANDS:PMBANDS, FLOWSEAT:FLOWSEAT,
                  PAINREG:PAINREG, PEOPLE:PEOPLE, LAWSET:LAWSET, BIRTH:BIRTH,
                  LEX:LEX, ADJ2CHG:ADJ2CHG, PHRASES:PHRASES, VERP:VERP,
                  NERVEBR:NERVEBR, BODYPATH:BODYPATH, TAB:TAB,
  /* indexes */   W:W, BY:BY, ALL_SAB:ALL_SAB, S:S,
  /* soul */      buildSoul:buildSoul, affinity:affinity, bandIg:bandIg,
  /* engine */    compute:compute, suscAll:suscAll, balance:balance, OUTWARD:OUTWARD, INWARD:INWARD,
  /* seed */      TYPE16:TYPE16, SEED16:SEED16, seedAxes:seedAxes, seedApply:seedApply,
                  seedClear:seedClear, seedShare:seedShare, seedValid:seedValid, accuracy:accuracy, sab33Detect:sab33Detect,
                  sabLevels:sabLevels, exprFill:exprFill, exprRead:exprRead,
  /* gates */     verpScan:verpScan, verpApply:verpApply, verpFactor:verpFactor,
                  verpRead:verpRead, verpShare:verpShare,
                  leanScan:leanScan, leanApply:leanApply, leanRead:leanRead,
                  VERPMIX:VERPMIX, LEANMIX:LEANMIX,
  /* the door */  read:read, input:input, throughput:throughput, output:output,
                  gatesClear:gatesClear, gatesLoad:gatesLoad, gatesSave:gatesSave,
  /* schema */    blankProfile:blankProfile, loadProfile:loadProfile,
                  saveProfile:saveProfile, snapshot:snapshot,
                  pExport:pExport, pImport:pImport, SCHEMA_V:SCHEMA_V,
                  bindStore:bindStore, PKEY:PKEY, pPersist:pPersist, saveState:saveState,
                  storeBound:function(){return STORE_BOUND;},
  /* intake */    iqList:iqList, iqScore:iqScore, iqApply:iqApply,
  /* sniffer */   scanStory:scanStory, parseStory:parseStory, applyStory:applyStory,
                  pathOf:pathOf, seatOf:seatOf, SEATXY:SEATXY, PATHSEAT:PATHSEAT,
  /* birth */     sunSign:sunSign, moonSign:moonSign, risingSign:risingSign,
                  lifePath:lifePath, spiritual:spiritual, converge:converge,
                  /* the rest of the module. they were reachable as browser
                     globals but absent from the contract, so nothing outside
                     a page could test them. */
                  masterNumber:masterNumber, chineseElement:chineseElement,
                  hdOf:hdOf, geneKey:geneKey,
  /* util */      clamp:clamp, leaves:(typeof leaves==='function'?leaves:null)
 };
}
