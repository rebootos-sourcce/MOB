'use strict';

// Framework-boundary evaluator for the canonical fetter -> Saboteur mapping.
// Charge compatibility and behavioral evidence are deliberately kept separate.
// No behavioral evidence is inferred from raw journal text or source prose.
const bands = require('./bands');
const catalog = require('./behavioral-catalog.json');

const EDGE = 0.75;
const BELOW = 2;
const ABOVE = 3;
const ARITY = Object.freeze({ 1: 0.80, 2: 1.00, 3: 1.10 });
const WEIGHT = Object.freeze({ Avoider: 0.55 });
const byName = new Map(catalog.records.map(record => [record.name, record]));

function member(value, low, high) {
  const midpoint = (low + high) / 2;
  const halfWidth = (high - low) / 2;
  if (value >= low && value <= high) {
    return halfWidth > 0 ? 1 - (1 - EDGE) * Math.abs(value - midpoint) / halfWidth : 1;
  }
  if (value < low) return Math.max(0, EDGE * (1 - (low - value) / BELOW));
  return Math.max(0, EDGE * (1 - (value - high) / ABOVE));
}

function chargeConfidence(parts, levels, name) {
  let product = 1;
  for (const [axis, low, high] of parts) {
    const value = levels[axis] == null ? 0 : levels[axis];
    const m = member(value, low, high);
    if (m <= 0) return 0;
    product *= m;
  }
  const geometric = Math.pow(product, 1 / parts.length);
  const weight = (WEIGHT[name] || 1) * (ARITY[parts.length] || 1);
  return Math.max(0, Math.min(1, geometric * weight));
}

function validateLevels(levels) {
  if (!levels || typeof levels !== 'object' || Array.isArray(levels)) {
    throw new TypeError('levels must be an object keyed by canonical fetter axis');
  }
  for (const [axis, value] of Object.entries(levels)) {
    if (!Number.isFinite(value) || value < 0 || value > 10) {
      throw new RangeError(axis + ' must be a finite number from 0 to 10');
    }
  }
}

function evaluateFetterSaboteurs(levels, evidence = {}) {
  validateLevels(levels);
  if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence)) {
    throw new TypeError('evidence must be an object keyed by canonical Saboteur name');
  }
  const candidates = bands.map(([name, parts]) => {
    const source = byName.get(name);
    const chargeScore = chargeConfidence(parts, levels, name);
    const supplied = evidence[name];
    const eligible = Boolean(source && source.scoring_eligible === true);
    const evidenceValid = Boolean(
      eligible && supplied &&
      supplied.sourceVerified === true &&
      Array.isArray(supplied.evidenceRefs) && supplied.evidenceRefs.length > 0 &&
      supplied.evidenceRefs.every(ref => typeof ref === 'string' && /^https:\/\//.test(ref)) &&
      Array.isArray(supplied.observationIds) && supplied.observationIds.length > 0 &&
      supplied.observationIds.every(id => typeof id === 'string' && id.trim().length > 0) &&
      Number.isFinite(supplied.support) && supplied.support >= 0 && supplied.support <= 1 &&
      Number.isFinite(supplied.contradiction) && supplied.contradiction >= 0 && supplied.contradiction <= 1
    );
    const behaviorScore = evidenceValid
      ? Math.max(0, supplied.support - supplied.contradiction)
      : null;
    return {
      name,
      chargeScore,
      behaviorScore,
      behaviorEvidenceStatus: !source ? 'catalog_missing'
        : !eligible ? (source.behavior_status || 'blocked')
        : evidenceValid ? 'verified_evidence_supplied'
        : 'not_scored',
      // Do not combine or globally rank incompatible / incomplete score modes.
      combinedScore: null
    };
  });

  const chargeRanking = [...candidates].sort((a, b) => b.chargeScore - a.chargeScore);
  const evidenceRanking = candidates
    .filter(candidate => candidate.behaviorScore !== null)
    .sort((a, b) => b.behaviorScore - a.behaviorScore);

  return {
    mode: 'charge_and_behavior_separate',
    candidateCount: candidates.length,
    behaviorScoredCount: evidenceRanking.length,
    chargeRanking,
    evidenceRanking,
    candidates,
    accuracyClaim: 'none: independent expected labels are required for accuracy measurement'
  };
}

module.exports = { evaluateFetterSaboteurs, member, chargeConfidence };
