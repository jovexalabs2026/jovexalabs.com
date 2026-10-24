# Jovexa Labs Official Website

Official website: https://jovexalabs.com

## About

The official website for Jovexa Labs (Jovexa Software Development Services) — a Philippine
software development business building mobile apps, games, web platforms, developer tools, and
open-source software. Dash Rush: Endless Run & Jump is a Jovexa Labs product.

## Tech Stack

- [Vite](https://vite.dev/)
- [React](https://react.dev/) + [React Router](https://reactrouter.com/)
- Plain CSS (no CSS framework/build dependency)

## Development

### Local Setup

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

Output is written to `dist/`.

### Preview production build

```bash
npm run preview
```

## Deployment

Deployment to GitHub Pages is automated via [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
on every push to `main`. The custom domain is configured via `public/CNAME` (`jovexalabs.com`),
which is copied into the build output automatically.

## Limited Digital 2030 public release

The `release/digital2030-static` branch adds public education links, an official-agency directory,
local message-warning heuristics, and browser-only business drafts. It preserves corporate pages,
products, and existing Jovexa Learn resources. Live AI, accounts, authoritative completion
certificates, private PHBIN operations, document uploads, and administration are unavailable.
This is not the production launch of the separate authenticated PHBIN/Next.js application.

Validate with `npm run lint`, `npm test`, `npm run build:pages`, and `npm run test:e2e`.
The browser suite requires `npx playwright install chromium`. To repeat smoke tests against a
deployed preview, set `STATIC_BASE_URL` to its HTTPS origin before running `npm run test:e2e`.

Cloudflare Pages direct upload uses only the **contents of `dist`**, after `npm run build:pages`.
On Windows, use `powershell -NoProfile -File tool\package-pages.ps1 -Destination <absolute-zip-path>`
to create the upload ZIP. Do not use `Compress-Archive`: its backslash entry names are interpreted
as literal asset names by the dashboard uploader, breaking nested JavaScript/image URLs.
The preparation removes GitHub-only CNAME/404 files from output, without editing their source.
Native Pages SPA fallback preserves deep links; there is no catch-all `_redirects` rule, which
would override existing JavaScript assets. `_headers` applies main-app restrictions and a
separate opaque-origin, no-network Code Lab sandbox. Do not deploy the code-preview response to
a host that ignores these headers without equivalent sandbox/CSP configuration. HTML meta CSP
now provides portable script/network restrictions on GitHub Pages, and the iframe retains its
opaque-origin sandbox. Meta CSP cannot supply frame-ancestors, HSTS, nosniff, or Permissions-Policy;
Cloudflare's response-header protections remain stronger. Do not claim those headers on GitHub Pages.
The main app disallows inline scripts; inline styles remain allowed for the preserved React
components and lesson UI. Only the sandboxed Code Lab permits learner-written inline scripts.
The preview is marked noindex; existing canonical URLs still identify jovexalabs.com.
Browser-only inputs are not sent or saved; existing learning progress and Code Lab autosave
remain localStorage-based, device-only, and removable by clearing browser data.
Pure tool logic is adapted from the existing unified platform implementation.

The Pages preview does not connect a custom domain or change nameservers, MX, SPF, DKIM, or DMARC.
No paid resource is required for this static upload. Free-tier limitations and provider account
terms still apply. Deployment is manual; GitHub CI validates the branch but does not release it.
Merging to `main` releases to the existing GitHub Pages corporate domain, not just the preview.
The main deployment runs lint, unit tests, build, and browser tests in `STATIC_HOST=github`
mode before uploading. That mode exercises 404-to-index deep-link restoration without
Cloudflare headers. Both host modes are also tested in pull-request CI.

Rollback: use the prior Pages deployment if available, or redeploy a previously validated
static build. The unchanged corporate `main` / GitHub Pages deployment is independent.
There is no production database or private-document storage in this static release to restore.
No disaster-recovery claim is made for the separate backend. Domain cutover requires a full DNS
backup and explicit approval, preserving mail records. Legal/privacy/retention and Philippine
professional review remain required; technical deployment is not legal compliance.

## Atlas civic-explorer prototype

`/prototype/explorer` is an original worldwide civilian map workspace, linked only from the
Orbit prototype rather than the main product navigation or sitemap. It has 2D/3D mode selection,
pan/zoom/reset, mouse/touch drag and keyboard globe rotation, day/night styling,
country/capital/continent search, three example layers, region dossiers,
official-homepage links, original sample editorial prompts, and learning-answer reveals.
It is not a live news, emergency, navigation, intelligence, or financial product.
Only ten curated capital markers are interactive; they do not imply active local projects.
No accounts, geolocation, map-tile requests, tracking, or external data feeds are used.
Selection and answers live only in page memory, not Orbit points or localStorage.

Worldwide land geometry is Natural Earth public-domain data from the ISC-licensed
`world-atlas` package, decoded by ISC-licensed `topojson-client` and projected with `d3-geo`.
National flag SVGs from MIT-licensed `flag-icons` identify existing example countries in the
list, dossier, and map markers, without remote flag requests. They do not imply endorsement.
Mapping and flag dependency license notices ship in `public/atlas-licenses.txt`.
The 2D equirectangular projection distorts high latitudes. The 3D globe is an orthographic
spherical projection with far-side clipping, SVG rendering and shading, not a satellite
or terrain model. Region selection turns the globe to that capital; pan controls rotate it.
Hidden-hemisphere markers are excluded from keyboard navigation. Neither mode supplies political borders.
Capital coordinates are approximate. External official links need independent current
verification; they are not partnerships, integrations, or service-availability guarantees.
The interface and example text are original; no Sible artwork, code, or news text is reused.
Run `node --test tests/civic-explorer.test.js` and
`npx playwright test e2e/civic-explorer.spec.js` for focused checks.
The new route is not deployed merely by a local build; main publication remains separate.

## Repository Structure

```
public/          Static assets copied as-is (CNAME, robots.txt, sitemap.xml, favicon)
src/
  components/    Shared layout components (Header, Footer, Layout, Seo)
  pages/         Route-level page components
  data/          Structured content (e.g. products list)
```

## Contributing

This is the official Jovexa Labs website repository. Open an issue or pull request on GitHub for
suggestions.

## Public developer resources

The public documentation at `/developers/docs` explains learning progress, Code Lab isolation,
local business/safety tools, feedback, and licensing. `/developers/projects` links to the existing
Dash Rush page plus `/products/jovexa-learn` and `/products/digital2030`. Product summaries and
web-project limitations share `src/data/products.js`; unknown product slugs render the existing
not-found page. These routes are included in the sitemap and browser regression suite.
The roadmap identifies this documentation milestone in the preview without claiming other
milestones are complete. No repository visibility or license is changed. Keep public status
and limitation text aligned with the deployed features before releasing either hosting target.

## Jovexa Orbit concept prototype (not published on main)

The `feature/jovexa-community-prototype` branch adds `/prototype/community`, an original,
non-financial community concept. It provides an accelerated one-minute session, fictional
points, three self-reported daily activities (UTC), a shared untracked sample invitation,
and responsive navigation. It is not affiliated with Sible Network; no third-party code,
branding, images, or text is reused.

There is no token, real mining/AI computation, wallet, deposit, payment, withdrawal, referral
tracking, user-count claim, reward entitlement, or account system. Points have no value.
The demo stores only its timer/counts/claims under `jovexa-community-demo-v1`; reset removes
only that key. Storage failures are shown and invalid data requires explicit reset.
Progress depends on the device clock/storage and is editable; it is not a trustworthy ledger
or a cross-tab/concurrent anti-fraud mechanism. An inactive tab accrues no extra sessions;
each completed session must be claimed before another can begin.

Run `npm test`, `npm run build`, and `npm run test:e2e` to validate, including the isolated
prototype tests. Launch `npm run dev -- --host 127.0.0.1` and visit `/prototype/community`
for local review. It is deliberately absent from main navigation, public project listings,
and the sitemap until a separate publication decision. No production auth or database is used.

## Security

Do not commit secrets, API keys, or credentials. Report security concerns to
admin@jovexalabs.com.

## License

&copy; Jovexa Software Development Services. All rights reserved.
