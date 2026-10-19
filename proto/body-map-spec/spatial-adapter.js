/* Explicit adapter boundary for legacy body-map placements.
 *
 * This module deliberately does not guess evidence class, source, anatomical
 * side, or depth. The caller must provide provenance and evidence per record.
 * Legacy x/y are already in the prototype's 0..100 figure coordinate space.
 */
'use strict';

const { validatePosition, validatePositions } = require('./spatial-validator');

function adaptLegacyPlacement(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new TypeError('legacy placement must be an object');
  }
  const { id, view, x, y, evidence, source } = record;
  const out = {
    id,
    view,
    x,
    y,
    evidence,
    source,
    // Do not synthesize depth from a 2D projection.
    z: record.z === undefined ? null : record.z
  };
  for (const key of ['side', 'landmarkId', 'uncertaintyCm', 'notes']) {
    if (record[key] !== undefined) out[key] = record[key];
  }
  const errors = validatePosition(out);
  if (errors.length) throw new TypeError('invalid spatial placement: ' + errors.join('; '));
  return out;
}

function adaptLegacyPlacements(records) {
  if (!Array.isArray(records)) throw new TypeError('legacy placements must be an array');
  const out = records.map(adaptLegacyPlacement);
  const result = validatePositions(out);
  if (!result.valid) throw new TypeError('invalid spatial placements: ' + result.errors.join('; '));
  return out;
}

module.exports = { adaptLegacyPlacement, adaptLegacyPlacements };
