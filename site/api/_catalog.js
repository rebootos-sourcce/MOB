// Single source of truth for what is sellable. Prices come from
// site/pricing.json so the site and the checkout can never disagree.
const pricing = require('../pricing.json');

const VOLUMES = ['ANXIETY','SHAME','MONEY','ANGER','BURNOUT','DRIVE',
                 'WORTH','GRIEF','VOICE','CONTROL','DUTY'];

const SKUS = {
  single: {
    label: 'One volume',
    amount: pricing.digital.single.amount,
    pick: 1, digital: true,
  },
  cluster: {
    label: 'Three volume cluster',
    amount: pricing.digital.cluster.amount,
    pick: 3, digital: true,
  },
  library: {
    label: 'The full library, eleven volumes',
    amount: pricing.digital.library.amount,
    pick: VOLUMES.length, digital: true, all: true,
  },
  practitioner: {
    label: 'Practitioner pack',
    amount: pricing.digital.practitioner.amount,
    pick: VOLUMES.length, digital: true, all: true, extras: ['NODE_TABLE','PROTOCOL'],
  },
  print: {
    label: 'Paperback, printed on demand',
    amount: pricing.print.single.amount,
    pick: 1, digital: false, shipping: true,
  },
};

// Validates the client payload. The client never sends a price.
function resolve(body) {
  const sku = SKUS[body && body.sku];
  if (!sku) return { error: 'Unknown item.' };
  let volumes = Array.isArray(body.volumes) ? body.volumes : [];
  volumes = volumes.map(v => String(v).toUpperCase())
                   .filter(v => VOLUMES.includes(v));
  volumes = [...new Set(volumes)];
  if (sku.all) volumes = [...VOLUMES];
  if (volumes.length !== sku.pick) {
    return { error: `Choose ${sku.pick} volume(s).` };
  }
  return { sku: body.sku, spec: sku, volumes };
}

module.exports = { VOLUMES, SKUS, resolve, pricing };
