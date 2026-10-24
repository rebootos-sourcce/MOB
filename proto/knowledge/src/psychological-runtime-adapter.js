'use strict';

/* Pure adapter: project source-registry records into the runtime namespace.
   The caller supplies parsed registry and catalog objects; this module has no
   filesystem or process side effects. */
module.exports = function adaptPsychologicalRegistry(registry, catalog) {
  const records = Array.isArray(registry.records) ? registry.records : [];
  const sourceIds = new Set(records.map((record) => record.id));
  const templateById = new Map((catalog.templates || []).map((template) => [template.id, template]));
  const entries = [];
  const errors = [];
  for (const source of records) {
    const template = templateById.get(source.templateId);
    if (!template) {
      errors.push(source.id + ': undefined template ' + source.templateId);
      continue;
    }
    if (template.kind !== source.kind) {
      errors.push(source.id + ': template kind mismatch');
      continue;
    }
    const payload = {};
    for (const field of (template.fields || [])) {
      payload[field] = Object.prototype.hasOwnProperty.call(source, field) ? source[field] : null;
    }
    const missingFields = (template.fields || []).filter((field) =>
      !Object.prototype.hasOwnProperty.call(source, field) ||
      source[field] === null || source[field] === undefined || source[field] === ''
    );
    entries.push({
      id: 'psych:' + source.id,
      sourceRecordId: source.id,
      kind: source.runtimeKind || ('psych_' + source.kind),
      sourceRuntimeKind: source.runtimeKind || null,
      sourceKind: source.kind,
      recordType: source.recordType || null,
      layer: source.layer || null,
      nm: source.nm || source.displayName || source.canonicalName || source.id,
      seat: source.seat === undefined ? null : source.seat,
      fam: source.fam === undefined ? null : source.fam,
      def: source.def || source.definition || null,
      body: source.body || source.definition || source.def || null,
      templateId: template.id,
      template: payload,
      templateValidation: {
        schemaDefined: true,
        sourceBacked: Boolean(source.sourceRefs && source.sourceRefs.length),
        contentStatus: missingFields.length ? 'incomplete' : ((source.templateValidation && source.templateValidation.contentStatus && source.templateValidation.contentStatus !== 'complete') ? source.templateValidation.contentStatus : 'complete'),
        missingFields,
        runtimeIntegration: 'integrated',
        sourceRegistryVersion: registry.version || 'unspecified',
        templateCatalogVersion: catalog.version || 'unspecified'
      },
      links: [...new Set([...(source.links || []), ...(source.childIds || [])])]
        .filter((id) => id && id !== source.id && sourceIds.has(id))
        .map((id) => 'psych:' + id),
      parentId: source.parentId && sourceIds.has(source.parentId) ? 'psych:' + source.parentId : null,
      childIds: (source.childIds || []).filter((id) => sourceIds.has(id)).map((id) => 'psych:' + id),
      relationships: source.relationships || [],
      sourceRefs: source.sourceRefs || [],
      sourceClaims: source.sourceClaims || [],
      researchPasses: source.researchPasses || [],
      evidenceStrength: source.evidenceStrength || null,
      confidence: source.confidence === undefined ? null : source.confidence,
      status: source.status || 'unclassified',
      unresolvedQuestions: source.unresolvedQuestions || [],
      provenance: {
        sourceRecordId: source.id,
        sourceRegistryVersion: registry.version || 'unspecified',
        templateCatalogVersion: catalog.version || 'unspecified'
      }
    });
  }
  const entryIds = new Set(entries.map((entry) => entry.id));
  const entryById = new Map(entries.map((entry) => [entry.id, entry]));
  const edges = [];
  const edgeIds = new Set();
  for (const edge of (registry.relationshipEdges || [])) {
    const fromId = sourceIds.has(edge.fromId) ? 'psych:' + edge.fromId : edge.fromId;
    const internalTarget = edge.toId && sourceIds.has(edge.toId);
    const toId = internalTarget ? 'psych:' + edge.toId : (edge.toId || null);
    if (!entryIds.has(fromId)) errors.push((edge.edgeId || 'edge') + ': source endpoint missing');
    if (internalTarget && !entryIds.has(toId)) errors.push((edge.edgeId || 'edge') + ': target endpoint missing');
    if (!toId && (!edge.toLabel || !edge.status)) errors.push((edge.edgeId || 'edge') + ': unresolved target needs label and status');
    const edgeId = 'psych:' + edge.edgeId;
    if (edgeIds.has(edgeId)) errors.push(edgeId + ': duplicate edge id');
    edgeIds.add(edgeId);
    edges.push({
      ...edge,
      edgeId,
      fromId,
      toId,
      targetRegistry: internalTarget ? 'combined_runtime' : (edge.targetRegistry || 'external_or_unresolved'),
      validationStatus: 'imported_not_semantically_verified'
    });
    if (toId && edge.reciprocalRequired && entryById.has(fromId) && entryById.has(toId)) {
      const from = entryById.get(fromId);
      const to = entryById.get(toId);
      if (!from.links.includes(toId)) from.links.push(toId);
      if (!to.links.includes(fromId)) to.links.push(fromId);
    }
  }
  for (const entry of entries) {
    entry.links = [...new Set(entry.links)].filter((target) => target !== entry.id);
  }
  return {
    entries,
    relationshipEdges: edges,
    sourceRegistry: {
      registryId: registry.registryId,
      version: registry.version,
      recordCount: records.length,
      relationshipEdgeCount: edges.length
    },
    errors
  };
};
