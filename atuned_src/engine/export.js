
/* ============================================================
   The engine is DOM free. In a browser these are globals on the
   concatenated script. In node the same file is requireable, so the
   engine can be tested headlessly and shared with Atuned through the
   one profile object the schema contract defines.
   ============================================================ */
if(typeof module!=='undefined'&&module.exports){
 module.exports={
  /* data */      NODES:NODES, SAB_LIB:SAB_LIB, HCX_LIB:HCX_LIB, SAB33:SAB33,
                  SABAUTH:SABAUTH, ARCH18:ARCH18, CHILD:CHILD, CHARGES:CHARGES,
                  DOMAINS:DOMAINS, ARCH:ARCH, SI:SI, SINAMES:SINAMES, MASKS:MASKS,
                  BANDS:BANDS, PAL:PAL, ROOTD:ROOTD, ROOTCOL:ROOTCOL, AFFIN:AFFIN,
                  PRACTICE:PRACTICE, EXPR:EXPR, PMBANDS:PMBANDS, FLOWSEAT:FLOWSEAT,
                  PAINREG:PAINREG, PEOPLE:PEOPLE, LAWSET:LAWSET, BIRTH:BIRTH,
                  LEX:LEX, ADJ2CHG:ADJ2CHG, PHRASES:PHRASES, VERP:VERP,
                  NERVEBR:NERVEBR, BODYPATH:BODYPATH, TAB:TAB,
  /* indexes */   W:W, BY:BY, ALL_SAB:ALL_SAB, S:S,
  /* soul */      buildSoul:buildSoul, affinity:affinity, bandIg:bandIg,
  /* engine */    compute:compute, accuracy:accuracy, sab33Detect:sab33Detect,
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
                  bindStore:bindStore, PKEY:PKEY,
  /* intake */    iqList:iqList, iqScore:iqScore, iqApply:iqApply,
  /* sniffer */   scanStory:scanStory, parseStory:parseStory, applyStory:applyStory,
  /* birth */     sunSign:sunSign, moonSign:moonSign, risingSign:risingSign,
                  lifePath:lifePath, spiritual:spiritual, converge:converge,
  /* util */      clamp:clamp, leaves:(typeof leaves==='function'?leaves:null)
 };
}
