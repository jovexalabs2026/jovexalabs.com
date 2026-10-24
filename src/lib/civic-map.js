import { geoCentroid, geoDistance, geoEquirectangular, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/land-110m.json' with { type: 'json' };
import boundaries from 'world-atlas/countries-50m.json' with { type: 'json' };
import codes from 'i18n-iso-countries/codes.json' with { type: 'json' };

const land = feature(world, world.objects.land);
const grid = geoGraticule10();
const sphere = { type: 'Sphere' };
const countryFeatures = feature(boundaries, boundaries.objects.countries).features;
export const MAP_COUNTRIES = countryFeatures.map((item, index) => {
  const iso = codes.find((code) => code[2] === item.id);
  return { id: `${item.id ?? 'unmapped'}-${index}`, name: item.properties.name,
    iso3: iso?.[1] ?? null, coordinates: geoCentroid(item), feature: item };
}).sort((a, b) => a.name.localeCompare(b.name, 'en'));

export function normalizeGlobeCenter([longitude, latitude]) {
  return [((longitude + 180) % 360 + 360) % 360 - 180,
    Math.max(-80, Math.min(80, latitude))];
}

export function createCivicMap(mode, center) {
  const globe = mode === 'globe';
  const projection = globe
    ? geoOrthographic().scale(210).translate([450, 225]).rotate([-center[0], -center[1]])
    : geoEquirectangular().scale(900 / (2 * Math.PI)).translate([450, 225]);
  const path = geoPath(projection);
  return {
    landPath: path(land),
    gridPath: path(grid),
    spherePath: path(sphere),
    countries: MAP_COUNTRIES.map((country) => ({ id: country.id, name: country.name, path: path(country.feature) })),
    project: (coordinate) => projection(coordinate),
    isVisible: (coordinate) => !globe || geoDistance(center, coordinate) < Math.PI / 2 - .001,
  };
}
