'use strict';

// Reproducible synthetic charge baseline and exhaustive band-overlap enumerator.
// Outputs logic diagnostics only; it is not an empirical behavioral-accuracy test.
const bands = require('./bands');
const { evaluateFetterSaboteurs } = require('./fetter-saboteur-evaluator');

function normalized(parts) {
  return parts.map(([axis, low, high]) => [axis, low, high])
    .sort((a, b) => a[0].localeCompare(b[0]));
}
function sameSignature(a, b) {
  return JSON.stringify(normalized(a)) === JSON.stringify(normalized(b));
}
function sharedIntervals(a, b) {
  const out = [];
  for (const [axisA, lowA, highA] of a) {
    for (const [axisB, lowB, highB] of b) {
      if (axisA !== axisB) continue;
      const low = Math.max(lowA, lowB);
      const high = Math.min(highA, highB);
      if (low <= high) out.push({ axis: axisA, low, high });
    }
  }
  return out;
}
function runSimulation() {
  const collisions = [];
  const exactDuplicates = [];
  for (let i = 0; i < bands.length; i++) {
    for (let j = i + 1; j < bands.length; j++) {
      const [nameA, partsA] = bands[i];
      const [nameB, partsB] = bands[j];
      const shared = sharedIntervals(partsA, partsB);
      if (shared.length) collisions.push({ a: nameA, b: nameB, shared });
      if (sameSignature(partsA, partsB)) exactDuplicates.push([nameA, nameB]);
    }
  }

  const fixtures = bands.map(([target, parts]) => {
    const levels = {};
    for (const [axis, low, high] of parts) levels[axis] = (low + high) / 2;
    const result = evaluateFetterSaboteurs(levels);
    const rank = result.chargeRanking.findIndex(x => x.name === target) + 1;
    return { target, rank, topThree: rank > 0 && rank <= 3,
      topFive: rank > 0 && rank <= 5,
      topResults: result.chargeRanking.slice(0, 5).map(x => ({ name: x.name, score: Number(x.chargeScore.toFixed(6)) })) };
  });

  return {
    classification: 'synthetic_logic_regression_not_empirical_accuracy',
    canonicalProfileCount: bands.length,
    possiblePairs: bands.length * (bands.length - 1) / 2,
    pairsWithAnySharedAxisInterval: collisions.length,
    exactFullSignatureDuplicates: exactDuplicates,
    topOne: fixtures.filter(x => x.rank === 1).length,
    topThree: fixtures.filter(x => x.topThree).length,
    fixtures,
    collisions
  };
}
if (require.main === module) console.log(JSON.stringify(runSimulation(), null, 2));
module.exports = { runSimulation, sharedIntervals, sameSignature };
