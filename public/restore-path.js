// Preserve existing GitHub Pages deep links; Cloudflare uses its native SPA rewrite.
const params = new URLSearchParams(window.location.search);
const redirectedPath = params.get('p');
if (redirectedPath !== null) {
  params.delete('p');
  const rest = params.toString();
  const newUrl = window.location.pathname.replace(/\/$/, '') +
    '/' + redirectedPath + (rest ? '?' + rest : '') + window.location.hash;
  window.history.replaceState(null, '', newUrl);
}
