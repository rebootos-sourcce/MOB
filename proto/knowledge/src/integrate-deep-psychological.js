'use strict';

/*
 * ATUNED Deep Psyche -> runtime knowledge graph adapter.
 * Embeds source-qualified records, retaining all provisional/canon flags.
 * A source-row label bridge is navigation, not proof of psychological causality.
 * Every bridge is typed and reciprocal; visual-only slots need no semantic edges.
 */
function integrateDeepPsychological(entries, registry, catalog) {
  if (!Array.isArray(entries) || !registry || !Array.isArray(registry.records) ||
      !catalog || !Array.isArray(catalog.templates)) throw new Error('Missing integration inputs');
  const templates = new Map(catalog.templates.map(t => [t.id, t]));
  const byId = new Map();
  for (const entry of entries) {
    if (!entry.id || byId.has(entry.id)) throw new Error('Duplicate/missing engine record: '+entry.id);
    byId.set(entry.id, entry);
  }
  const sourceIds = new Set();
  const errors = [];
  const kindCounts = {};
  const bridges = [];
  const norm = value => String(value || '').trim().toLowerCase();
  const findEngine = (kind, name) =>
    entries.find(e => e.kind === kind && norm(e.nm) === norm(name));
  const checkMissing = (source, template) =>
    template.fields.filter(f => !Object.prototype.hasOwnProperty.call(source, f) ||
      source[f] === undefined || source[f] === null || source[f] === '');

  for (const source of registry.records) {
    if (!source || !source.id || sourceIds.has(source.id) || byId.has(source.id)) {
      errors.push('Duplicate or missing psychological record ID: '+(source && source.id));
      continue;
    }
    sourceIds.add(source.id);
    const template = templates.get(source.templateId);
    if (!template || template.kind !== source.kind) {
      errors.push(source.id+': missing/mismatched template '+source.templateId);
      continue;
    }
    const missing = checkMissing(source, template);
    if (missing.length) errors.push(source.id+': missing fields '+missing.join(','));
    const optional = template.optionalFields || [];
    if (Object.prototype.hasOwnProperty.call(source, 'complexTarget') && source.complexTarget != null) {
      if (!optional.includes('complexTarget'))
        errors.push(source.id+': complexTarget is not declared by template '+template.id);
      else if (typeof source.complexTarget !== 'string')
        errors.push(source.id+': complexTarget must be a string, got '+typeof source.complexTarget);
    }
    const copy = {
      id: source.id,
      kind: 'psych_'+source.kind,
      sourceKind: source.kind,
      recordType: source.recordType,
      nm: source.nm || source.displayName || source.canonicalName || source.id,
      seat: source.seat == null ? null : source.seat,
      fam: source.fam || source.layer || 'Deep Psychological',
      def: source.def || source.definition || '',
      body: source.body || source.definition || source.def || '',
      links: [...new Set(source.links || [])],
      graphEdgeEvidence: [],
      parentId: source.parentId || null,
      childIds: [...(source.childIds || [])],
      relationships: source.relationships || [],
      researchPasses: source.researchPasses || [],
      sourceRefs: source.sourceRefs || [],
      sourceStatus: source.status,
      canonicalStatus: source.canonicalStatus || 'NOT_ADJUDICATED',
      slotOnly: Boolean(source.slotOnly),
      templateId: template.id,
      template: Object.fromEntries([
        ...template.fields.map(f => [
          f, Object.prototype.hasOwnProperty.call(source,f) ? source[f] : null
        ]),
        /* An optional field is carried only when the record has it, so an
           unused one leaves the generated payload unchanged. */
        ...optional.filter(f => Object.prototype.hasOwnProperty.call(source,f))
          .map(f => [f, source[f]])
      ]),
      templateValidation: {
        schemaDefined: true,
        sourceBacked: Boolean(source.sourceRefs && source.sourceRefs.length),
        contentStatus: missing.length ? 'incomplete' : 'complete',
        sourceContentStatus: source.templateValidation && source.templateValidation.contentStatus,
        missingFields: missing
      }
    };
    entries.push(copy);
    byId.set(copy.id,copy);
    kindCounts[copy.kind]=(kindCounts[copy.kind]||0)+1;
  }
  if (errors.length) throw new Error(errors.join('\n'));

  // Establish bounded, source-table label bridges into the existing engine
  // using the exact source row's name. This is a transparent association, not
  // a promotion to an approved hierarchy or an inferred cause.
  const bridge = (source,target,sourceField) => {
    if (!source || !target || source.id===target.id) return;
    for (const [a,b] of [[source,target],[target,source]]) {
      if (!a.links.includes(b.id)) a.links.push(b.id);
      a.graphEdgeEvidence = a.graphEdgeEvidence || [];
      if (!a.graphEdgeEvidence.some(x => x.toId===b.id && x.type==='source_label_navigation')) {
        a.graphEdgeEvidence.push({
          type:'source_label_navigation', toId:b.id,
          fromId:a.id, sourceField,
          evidenceStatus:'EXACT_SOURCE_TABLE_LABEL_MATCH_NOT_CANONICAL_EQUIVALENCE'
        });
      }
    }
    bridges.push([source.id,target.id,sourceField]);
  };
  /* complexTarget names one entry of the complex family without saying which
     kind it is, because DESCENT can reclassify a step (Psychopathy's is under
     revision). gen-data builds these kinds from DESCENT and HCX_LIB, so the
     lookup searches all three. Unlike the four lookups below, a name that
     matches nothing, or more than one entry, is refused by name: it is never
     dropped and never bridged to whichever entry happens to come first. */
  const COMPLEX_KINDS = ['complex','hcx','supercomplex'];
  const bridgeErrors = [];
  const findComplex = (sourceId, name) => {
    const hits = entries.filter(e => COMPLEX_KINDS.includes(e.kind) && norm(e.nm) === norm(name));
    if (hits.length === 1) return hits[0];
    bridgeErrors.push(sourceId+': mapping_record.complexTarget "'+name+'" '+(hits.length
      ? 'matches more than one entry: '+hits.map(h => h.id).join(', ')
      : 'matches no '+COMPLEX_KINDS.join(' / ')+' entry'));
    return null;
  };
  for (const source of registry.records) {
    const entry=byId.get(source.id);
    if (source.recordType==='archetype_candidate') {
      bridge(entry,findEngine('arch',source.canonicalName),'archetype_candidate.canonicalName');
    }
    if (source.recordType==='mapping_record') {
      if (source.archetypeName)
        bridge(entry,findEngine('arch',source.archetypeName),'mapping_record.archetypeName');
      if (source.fetterLabel)
        bridge(entry,findEngine('sab',source.fetterLabel),'mapping_record.fetterLabel');
      /* ARCH18 explicitly records each tuple's seat. A seat-label route is
         source-backed navigation through the existing seat -> node -> nerve
         topology, including when an ARCH18 Saboteur alias is not an exact
         name in the current app's 39-name runtime catalog. */
      const seatName={
        root:'Root',sacral:'Sacral',solar:'Solar',heart:'Heart',
        throat:'Throat',eye:'3rd Eye',crown:'Crown'
      }[norm(source.seatLabel)];
      if (seatName)
        bridge(entry,findEngine('seat',seatName),'mapping_record.seatLabel');
      if (source.domainTarget)
        bridge(entry,findEngine('dom',source.domainTarget),'mapping_record.domainTarget');
      if (source.complexTarget)
        bridge(entry,findComplex(source.id,source.complexTarget),'mapping_record.complexTarget');
    }
  }
  if (bridgeErrors.length) throw new Error(bridgeErrors.join('\n'));

  const orphanLinks=[];
  const nonreciprocal=[];
  let totalPsychLinks=0;
  for (const source of registry.records) {
    const entry=byId.get(source.id);
    for (const targetId of entry.links) {
      totalPsychLinks++;
      const target=byId.get(targetId);
      if (!target) orphanLinks.push([entry.id,targetId]);
      else if (!target.links.includes(entry.id))
        nonreciprocal.push([entry.id,targetId]);
    }
    if (entry.parentId && !byId.has(entry.parentId))
      orphanLinks.push([entry.id,entry.parentId]);
  }
  if (orphanLinks.length || nonreciprocal.length)
    throw new Error('Deep Psychological graph violations: '+
      JSON.stringify({orphanLinks,nonreciprocal}).slice(0,3000));

  const result={
    status:'RUNTIME_GRAPH_ENTRIES_GENERATED',
    psychologicalRecords:sourceIds.size,
    kinds:kindCounts,
    sourceTableBridges:bridges.length,
    sourceTableBridgeRecords:[...new Set(bridges.map(x=>x[0]))].length,
    psychologicalLinks:totalPsychLinks,
    unlinkedRecords:registry.records.filter(x=>!(byId.get(x.id).links.length)).length,
    knownSourceDefinitionGaps:registry.records.filter(x=>x.templateValidation &&
      x.templateValidation.contentStatus!=='complete' && !x.slotOnly).length,
    note:'Structural graph traversal is testable; exact v341 definitions and canon promotions are separate gates.'
  };
  return result;
}
module.exports={integrateDeepPsychological};
