/**
 * LogiSetu's multimodal network, as drawn on the globe.
 *
 * Waypoints are real [lat, lon] positions — sea lanes follow actual shipping
 * routes (Arabian Sea, Gulf of Aden, Suez, Gibraltar, the Channel) rather than
 * cutting across land, and rail follows the Dedicated Freight Corridor
 * alignments. Edit these arrays to change what the globe shows.
 */

/**
 * Visual treatment per transport mode.
 *
 * `lift` drives how high the arc flies above the surface — it is what separates
 * an air corridor from a shipping lane. `tube` is in globe-radius units: the
 * globe is radius 1.5 and renders around 180px, so ~120px per unit. Anything
 * below about 0.012 lands under a pixel and disappears entirely, which is why
 * the surface modes are not as thin as their hierarchy would suggest.
 */
export const MODES = {
  air: {
    label: 'Air Cargo',
    color: 0xf1731f,
    lift: 0.30,
    hug: 0.012,
    tube: 0.0165,
    glow: 0.040,
    speed: 0.075,
    marker: 0.030,
  },
  sea: {
    label: 'Sea Freight',
    color: 0x38bdf8,
    lift: 0.0,
    hug: 0.011,
    tube: 0.0155,
    glow: 0.038,
    speed: 0.030,
    marker: 0.028,
  },
  rail: {
    label: 'Rail Freight',
    color: 0xa78bfa,
    lift: 0.018,
    hug: 0.010,
    tube: 0.0155,
    glow: 0.036,
    speed: 0.055,
    marker: 0.025,
  },
  road: {
    label: 'Road Freight',
    color: 0x34d399,
    lift: 0.008,
    hug: 0.008,
    tube: 0.0145,
    glow: 0.034,
    speed: 0.065,
    marker: 0.023,
  },
};

export const ROUTES = [
  /* ------------------------------------------------------------- air --- */
  {
    mode: 'air',
    name: 'Delhi → Dubai',
    waypoints: [[28.56, 77.10], [25.25, 55.36]],
  },
  {
    mode: 'air',
    name: 'Dubai → London Heathrow',
    waypoints: [[25.25, 55.36], [51.47, -0.45]],
  },
  {
    mode: 'air',
    name: 'Mumbai → London Heathrow',
    waypoints: [[19.09, 72.87], [51.47, -0.45]],
  },

  /* ------------------------------------------------------------- sea --- */
  {
    mode: 'sea',
    name: 'Nhava Sheva → Jebel Ali',
    waypoints: [
      [18.95, 72.95], [21.20, 66.50], [23.80, 60.20], [25.01, 55.06],
    ],
  },
  {
    // Jebel Ali to Felixstowe via the Gulf of Aden, Suez and Gibraltar.
    mode: 'sea',
    name: 'Jebel Ali → Felixstowe',
    waypoints: [
      [25.01, 55.06], [25.60, 57.40], [20.00, 60.00], [14.00, 52.00],
      [12.50, 45.00], [14.50, 42.00], [20.00, 38.50], [27.00, 34.50],
      [29.93, 32.55], [32.20, 30.50], [34.50, 22.00], [36.20, 12.00],
      [37.20, 3.00], [35.95, -5.60], [37.50, -9.30], [43.50, -10.50],
      [48.50, -5.50], [50.20, -1.00], [51.95, 1.35],
    ],
  },
  {
    mode: 'sea',
    name: 'Chennai → Colombo → Jebel Ali',
    waypoints: [
      [13.08, 80.29], [8.20, 81.00], [6.93, 79.84], [9.50, 72.00],
      [17.50, 62.00], [25.01, 55.06],
    ],
  },

  /* ------------------------------------------------------------ rail --- */
  {
    mode: 'rail',
    name: 'Western DFC — Delhi → JNPT',
    waypoints: [
      [28.61, 77.21], [28.19, 76.62], [26.91, 75.79], [26.45, 74.64],
      [23.03, 72.58], [22.31, 73.18], [19.07, 72.88],
    ],
  },
  {
    mode: 'rail',
    name: 'Eastern DFC — Delhi → Kolkata',
    waypoints: [
      [28.61, 77.21], [27.90, 78.08], [26.45, 80.33], [25.44, 81.85],
      [25.28, 83.12], [23.80, 86.43], [22.57, 88.36],
    ],
  },

  {
    mode: 'rail',
    name: 'Chennai → Bengaluru freight line',
    waypoints: [[13.08, 80.29], [12.92, 79.13], [12.97, 77.59]],
  },
  {
    // Inland rail haul from the UK deep-sea port, where the sea lane ends.
    mode: 'rail',
    name: 'Felixstowe → Midlands rail freight',
    waypoints: [[51.95, 1.35], [52.05, 0.72], [52.20, -0.90], [52.48, -1.90]],
  },

  /* ------------------------------------------------------------ road --- */
  {
    mode: 'road',
    name: 'Delhi → Mumbai Expressway',
    waypoints: [
      [28.61, 77.21], [26.91, 75.79], [25.18, 75.83], [22.31, 73.18],
      [19.08, 72.88],
    ],
  },
  {
    mode: 'road',
    name: 'Mumbai → Bengaluru → Chennai',
    waypoints: [[19.08, 72.88], [16.70, 74.24], [12.97, 77.59], [13.08, 80.29]],
  },
  {
    mode: 'road',
    name: 'Delhi → Kolkata trunk route',
    waypoints: [[28.61, 77.21], [26.85, 80.95], [25.59, 85.14], [22.57, 88.36]],
  },
  {
    mode: 'road',
    name: 'Jebel Ali → Dubai → Abu Dhabi',
    waypoints: [[25.01, 55.06], [25.20, 55.27], [24.85, 55.00], [24.45, 54.38]],
  },
  {
    mode: 'road',
    name: 'London → Felixstowe haulage',
    waypoints: [[51.51, -0.13], [51.75, 0.47], [51.95, 1.35]],
  },
];

/**
 * Places marked on the globe. `tier: 'hub'` gets a label and a pulsing ring;
 * `'port'` is a smaller unlabelled dot so the network reads as a system.
 */
export const PLACES = [
  { name: 'India',  role: 'On-ground execution', lat: 19.07, lon: 72.88, tier: 'hub', anchor: true },
  { name: 'Dubai',  role: 'Global headquarters', lat: 25.20, lon: 55.27, tier: 'hub' },
  { name: 'London', role: 'NRI & investor',      lat: 51.51, lon: -0.13, tier: 'hub' },

  { name: 'Delhi',      lat: 28.61, lon: 77.21, tier: 'port' },
  { name: 'Chennai',    lat: 13.08, lon: 80.29, tier: 'port' },
  { name: 'Kolkata',    lat: 22.57, lon: 88.36, tier: 'port' },
  { name: 'Colombo',    lat: 6.93,  lon: 79.84, tier: 'port' },
  { name: 'Suez',       lat: 29.93, lon: 32.55, tier: 'port' },
  { name: 'Gibraltar',  lat: 35.95, lon: -5.60, tier: 'port' },
  { name: 'Felixstowe', lat: 51.95, lon: 1.35,  tier: 'port' },
  { name: 'Abu Dhabi',  lat: 24.45, lon: 54.38, tier: 'port' },
];
