/**
 * Step 1 of the Earth texture build: convert Natural Earth TopoJSON into a
 * flat GeoJSON ring list that the Python rasteriser can draw directly.
 *
 *   node .tools/make-earth-texture.mjs
 */

import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const topo = require('world-atlas/countries-50m.json');

const countries = feature(topo, topo.objects.countries);

/** Flatten Polygon/MultiPolygon into a plain array of [lon, lat] rings. */
const rings = [];
for (const f of countries.features) {
  const { type, coordinates } = f.geometry ?? {};
  if (type === 'Polygon') {
    rings.push(coordinates);
  } else if (type === 'MultiPolygon') {
    for (const poly of coordinates) rings.push(poly);
  }
}

writeFileSync(
  new URL('./earth-rings.json', import.meta.url),
  JSON.stringify(rings)
);

console.log(`${countries.features.length} countries -> ${rings.length} polygons`);
