/* Prototype-only validator for spatial-contract-v1.json. No application modules are changed. */
'use strict';

const VIEWS = new Set(['front', 'back', 'head-cut']);
const EVIDENCE = new Set(['measured', 'sourced', 'proposed', 'unknown']);
const SIDES = new Set(['left', 'right', 'midline', 'bilateral']);

function validatePosition(p) {
  const errors = [];
  if (!p || typeof p !== 'object' || Array.isArray(p)) {
    return ['position must be an object'];
  }
  if (typeof p.id !== 'string' || !p.id.trim()) errors.push('id must be a non-empty string');
  if (!VIEWS.has(p.view)) errors.push('view is not supported');
  for (const key of ['x', 'y']) {
    if (typeof p[key] !== 'number' || !Number.isFinite(p[key]) || p[key] < 0 || p[key] > 100) {
      errors.push(key + ' must be a finite number in [0, 100]');
    }
  }
  if (p.z !== undefined && p.z !== null &&
      (typeof p.z !== 'number' || !Number.isFinite(p.z) || p.z < 0 || p.z > 100)) {
    errors.push('z must be null or a finite number in [0, 100]');
  }
  if (!EVIDENCE.has(p.evidence)) errors.push('evidence class is not supported');
  if (typeof p.source !== 'string' || !p.source.trim()) errors.push('source must be a non-empty string');
  if (p.side !== undefined && !SIDES.has(p.side)) errors.push('side is not supported');
  if (p.uncertaintyCm !== undefined &&
      (typeof p.uncertaintyCm !== 'number' || !Number.isFinite(p.uncertaintyCm) || p.uncertaintyCm < 0)) {
    errors.push('uncertaintyCm must be a finite non-negative number');
  }
  return errors;
}

function validatePositions(positions) {
  if (!Array.isArray(positions)) return { valid: false, errors: ['positions must be an array'] };
  const errors = [];
  const seen = new Set();
  positions.forEach((p, i) => {
    validatePosition(p).forEach(e => errors.push('positions[' + i + ']: ' + e));
    if (p && typeof p.id === 'string' && p.id.trim()) {
      if (seen.has(p.id)) errors.push('positions[' + i + ']: duplicate id "' + p.id + '"');
      seen.add(p.id);
    }
  });
  return { valid: errors.length === 0, errors };
}

module.exports = { validatePosition, validatePositions };
