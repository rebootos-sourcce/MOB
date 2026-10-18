'use strict';

// Experimental ranker: consumes independently supplied charge and behavioral evidence.
// It does not infer behavioral evidence from journal text. The default weights are
// provisional engineering settings, not canonical or empirically validated values.
const DEFAULT_WEIGHTS = Object.freeze({ behavior: 0.65, charge: 0.35 });

function validateScore(value, label) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError(label + ' must be a number from 0 to 1');
  return value;
}

function scoreCandidates(candidates, weights = DEFAULT_WEIGHTS) {
  if (!Array.isArray(candidates)) throw new TypeError('candidates must be an array');
  const wb = validateScore(weights.behavior, 'weights.behavior');
  const wc = validateScore(weights.charge, 'weights.charge');
  if (Math.abs(wb + wc - 1) > 1e-9) throw new RangeError('weights must sum to 1');
  return candidates.map(candidate => {
    const charge = candidate.chargeScore == null ? null : validateScore(candidate.chargeScore, candidate.name + '.chargeScore');
    const support = candidate.behaviorSupport == null ? null : validateScore(candidate.behaviorSupport, candidate.name + '.behaviorSupport');
    const contradiction = candidate.behaviorContradiction == null ? null : validateScore(candidate.behaviorContradiction, candidate.name + '.behaviorContradiction');
    const behaviorAvailable = support !== null && contradiction !== null && candidate.behaviorSourceVerified === true;
    const behavior = behaviorAvailable ? Math.max(0, support - contradiction) : null;
    const score = behaviorAvailable && charge !== null ? wb * behavior + wc * charge : null;
    return { name: candidate.name, chargeScore: charge, behaviorScore: behavior, combinedScore: score,
      mode: score === null ? 'charge_only_or_incomplete_behavior' : 'experimental_behavior_weighted',
      rationale: behaviorAvailable ? 'Behavior evidence supplied with verified source; score is experimental.' : 'Behavior score withheld: require sourced support and contradiction ratings; charge score remains separate.' };
  }).sort((a,b) => (b.combinedScore ?? b.chargeScore ?? -1) - (a.combinedScore ?? a.chargeScore ?? -1));
}

module.exports = { DEFAULT_WEIGHTS, scoreCandidates };
