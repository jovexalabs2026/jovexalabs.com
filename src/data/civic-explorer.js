export const CIVIC_LAYERS = [
  { id: 'learning', name: 'Learning', color: '#bdf58b' },
  { id: 'services', name: 'Public services', color: '#71d6ff' },
  { id: 'community', name: 'Community', color: '#ffc58a' },
];

// Representative capital coordinates, not locations of actual projects or incidents.
export const CIVIC_REGIONS = [
  { id: 'ph', name: 'Philippines', city: 'Manila', continent: 'Asia', coordinates: [120.98, 14.60], layer: 'learning', focus: 'Digital literacy and safer online habits', url: 'https://www.gov.ph/' },
  { id: 'jp', name: 'Japan', city: 'Tokyo', continent: 'Asia', coordinates: [139.69, 35.68], layer: 'services', focus: 'Finding official public-service information', url: 'https://www.japan.go.jp/' },
  { id: 'in', name: 'India', city: 'New Delhi', continent: 'Asia', coordinates: [77.21, 28.61], layer: 'community', focus: 'Accessible community learning', url: 'https://www.india.gov.in/' },
  { id: 'de', name: 'Germany', city: 'Berlin', continent: 'Europe', coordinates: [13.40, 52.52], layer: 'learning', focus: 'Digital skills and source literacy', url: 'https://www.bundesregierung.de/' },
  { id: 'ke', name: 'Kenya', city: 'Nairobi', continent: 'Africa', coordinates: [36.82, -1.29], layer: 'community', focus: 'Planning inclusive local projects', url: 'https://www.mygov.go.ke/' },
  { id: 'za', name: 'South Africa', city: 'Pretoria', continent: 'Africa', coordinates: [28.19, -25.75], layer: 'services', focus: 'Locating official service guidance', url: 'https://www.gov.za/' },
  { id: 'br', name: 'Brazil', city: 'Brasilia', continent: 'South America', coordinates: [-47.88, -15.79], layer: 'community', focus: 'Community project planning', url: 'https://www.gov.br/' },
  { id: 'ca', name: 'Canada', city: 'Ottawa', continent: 'North America', coordinates: [-75.70, 45.42], layer: 'services', focus: 'Official information and privacy awareness', url: 'https://www.canada.ca/' },
  { id: 'au', name: 'Australia', city: 'Canberra', continent: 'Oceania', coordinates: [149.13, -35.28], layer: 'learning', focus: 'Learning resources and digital access', url: 'https://www.australia.gov.au/' },
  { id: 'nz', name: 'New Zealand', city: 'Wellington', continent: 'Oceania', coordinates: [174.78, -41.29], layer: 'services', focus: 'Clear and accessible public information', url: 'https://www.govt.nz/' },
];

export function projectCoordinate([longitude, latitude]) {
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude) ||
    longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    throw new Error('Invalid map coordinate.');
  }
  return [(longitude + 180) * 2.5, (90 - latitude) * 2.5];
}

export function filterRegions(query, layers) {
  const search = query.trim().toLocaleLowerCase('en-US');
  return CIVIC_REGIONS.filter((region) => layers.includes(region.layer) &&
    `${region.name} ${region.city} ${region.continent}`.toLocaleLowerCase('en-US').includes(search));
}

export function mapViewport(zoom, center) {
  const scale = Math.max(1, Math.min(4, zoom));
  const width = 900 / scale;
  const height = 450 / scale;
  const x = Math.max(width / 2, Math.min(900 - width / 2, center[0]));
  const y = Math.max(height / 2, Math.min(450 - height / 2, center[1]));
  return [x - width / 2, y - height / 2, width, height];
}

export const CIVIC_MISSIONS = [
  { id: 'source', title: 'Check the source', text: 'Find the official homepage below. Before trusting a page, check the hostname and independently confirm the publisher.', answer: 'An official destination is a starting point, not proof that every linked claim is current.' },
  { id: 'access', title: 'Design for access', text: 'Imagine a local learning page. Name one way you could make it easier to use on a small screen or with a keyboard.', answer: 'Examples include labeled controls, readable text, visible focus, and layouts without horizontal overflow.' },
];
