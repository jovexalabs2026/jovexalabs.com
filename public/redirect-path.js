// Bypass a cached root fallback so new deep links load the current app bundle.
const locationToRestore = window.location;
const redirectURL = new URL('/', locationToRestore.origin);
redirectURL.searchParams.set(
  'p',
  locationToRestore.pathname.slice(1) + locationToRestore.search,
);
redirectURL.searchParams.set('_redirect', Date.now().toString());
redirectURL.hash = locationToRestore.hash;
locationToRestore.replace(redirectURL);
