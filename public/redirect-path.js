// Preserve query parameters inside the encoded path until the app restores the URL.
const locationToRestore = window.location;
locationToRestore.replace(
  locationToRestore.origin + '/?p=' +
  encodeURIComponent(locationToRestore.pathname.slice(1) + locationToRestore.search) +
  locationToRestore.hash
);
