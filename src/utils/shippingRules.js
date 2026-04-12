const BRANCHES = {
  cdmx: { key: 'cdmx', name: 'Sucursal CDMX', state: 'cdmx', region: 'centro' },
  guadalajara: { key: 'guadalajara', name: 'Sucursal Guadalajara', state: 'jalisco', region: 'occidente' },
  monterrey: { key: 'monterrey', name: 'Sucursal Monterrey (Matriz)', state: 'nuevo leon', region: 'norte' },
  puebla: { key: 'puebla', name: 'Sucursal Puebla', state: 'puebla', region: 'centro-sur' },
  merida: { key: 'merida', name: 'Sucursal Merida', state: 'yucatan', region: 'sureste' },
  leon: { key: 'leon', name: 'Sucursal Leon GTO', state: 'guanajuato', region: 'bajio' },
};

const BRANCH_BY_STATE = {
  cdmx: 'cdmx',
  'estado de mexico': 'cdmx',
  hidalgo: 'cdmx',
  morelos: 'cdmx',
  queretaro: 'cdmx',
  tlaxcala: 'puebla',
  puebla: 'puebla',
  veracruz: 'puebla',
  oaxaca: 'puebla',
  chiapas: 'puebla',
  jalisco: 'guadalajara',
  nayarit: 'guadalajara',
  colima: 'guadalajara',
  'nuevo leon': 'monterrey',
  coahuila: 'monterrey',
  tamaulipas: 'monterrey',
  'san luis potosi': 'monterrey',
  chihuahua: 'monterrey',
  durango: 'monterrey',
  sonora: 'monterrey',
  'baja california': 'monterrey',
  'baja california sur': 'monterrey',
  guanajuato: 'leon',
  aguascalientes: 'leon',
  zacatecas: 'leon',
  michoacan: 'leon',
  yucatan: 'merida',
  campeche: 'merida',
  'quintana roo': 'merida',
  tabasco: 'merida',
};

const REGION_BY_STATE = {
  cdmx: 'centro',
  'estado de mexico': 'centro',
  hidalgo: 'centro',
  morelos: 'centro',
  queretaro: 'centro',
  tlaxcala: 'centro-sur',
  puebla: 'centro-sur',
  veracruz: 'centro-sur',
  oaxaca: 'centro-sur',
  chiapas: 'centro-sur',
  jalisco: 'occidente',
  nayarit: 'occidente',
  colima: 'occidente',
  'nuevo leon': 'norte',
  coahuila: 'norte',
  tamaulipas: 'norte',
  'san luis potosi': 'norte',
  chihuahua: 'norte',
  durango: 'norte',
  sonora: 'norte',
  'baja california': 'norte',
  'baja california sur': 'norte',
  guanajuato: 'bajio',
  aguascalientes: 'bajio',
  zacatecas: 'bajio',
  michoacan: 'bajio',
  yucatan: 'sureste',
  campeche: 'sureste',
  'quintana roo': 'sureste',
  tabasco: 'sureste',
};

const EXTENDED_STATES = new Set(['baja california', 'baja california sur', 'quintana roo', 'chiapas']);

const STATE_ALIASES = {
  nl: 'nuevo leon',
  'n.l.': 'nuevo leon',
  cdmx: 'cdmx',
  'cdmx.': 'cdmx',
  df: 'cdmx',
  'edo mex': 'estado de mexico',
  'edo. mex.': 'estado de mexico',
  gto: 'guanajuato',
};

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveState(rawState) {
  const normalized = normalizeText(rawState);
  if (!normalized) return '';
  return STATE_ALIASES[normalized] || normalized;
}

function resolveRates() {
  return {
    local: Number(import.meta.env.VITE_SHIPPING_RATE_LOCAL || 90),
    regional: Number(import.meta.env.VITE_SHIPPING_RATE_REGIONAL || 150),
    national: Number(import.meta.env.VITE_SHIPPING_RATE_NATIONAL || 220),
    extended: Number(import.meta.env.VITE_SHIPPING_RATE_EXTENDED || 320),
  };
}

function resolveEtaByZone(zone) {
  if (zone === 'local') return '1-2 dias habiles';
  if (zone === 'regional') return '2-4 dias habiles';
  if (zone === 'extended') return '4-8 dias habiles';
  return '3-6 dias habiles';
}

function resolveZone(destinationState, branch) {
  if (!destinationState || !branch) return 'national';
  if (destinationState === branch.state) return 'local';
  if (EXTENDED_STATES.has(destinationState)) return 'extended';

  const destinationRegion = REGION_BY_STATE[destinationState];
  if (destinationRegion && destinationRegion === branch.region) {
    return 'regional';
  }

  return 'national';
}

export function calculateShippingQuote({ subtotal = 0, state = '', zipCode = '' } = {}) {
  const rates = resolveRates();
  const freeShippingThreshold = Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD || 1000);
  const destinationState = resolveState(state);
  const branchKey = BRANCH_BY_STATE[destinationState] || 'monterrey';
  const branch = BRANCHES[branchKey] || BRANCHES.monterrey;
  const zone = resolveZone(destinationState, branch);
  const baseCost = Number(rates[zone] ?? rates.national);
  const hasFreeShipping = Number(subtotal) >= freeShippingThreshold;

  return {
    cost: hasFreeShipping ? 0 : baseCost,
    baseCost,
    zone,
    zoneLabel:
      zone === 'local'
        ? 'Local'
        : zone === 'regional'
          ? 'Regional'
          : zone === 'extended'
            ? 'Cobertura extendida'
            : 'Nacional',
    etaLabel: resolveEtaByZone(zone),
    branchName: branch.name,
    branchKey: branch.key,
    destinationState: destinationState || 'no_definido',
    zipCode: String(zipCode || ''),
    freeShippingThreshold,
    hasFreeShipping,
  };
}
