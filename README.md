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
The preparation removes GitHub-only CNAME/404 files from output, without editing their source.
Native Pages SPA fallback preserves deep links; there is no catch-all `_redirects` rule, which
would override existing JavaScript assets. `_headers` applies main-app restrictions and a
separate opaque-origin, no-network Code Lab sandbox. Do not deploy the code-preview response to
a host that ignores these headers without equivalent sandbox/CSP configuration.
The main app disallows inline scripts; inline styles remain allowed for the preserved React
components and lesson UI. Only the sandboxed Code Lab permits learner-written inline scripts.
The preview is marked noindex; existing canonical URLs still identify jovexalabs.com.
Browser-only inputs are not sent or saved; existing learning progress and Code Lab autosave
remain localStorage-based, device-only, and removable by clearing browser data.
Pure tool logic is adapted from the existing unified platform implementation.

The Pages preview does not connect a custom domain or change nameservers, MX, SPF, DKIM, or DMARC.
No paid resource is required for this static upload. Free-tier limitations and provider account
terms still apply. Deployment is manual; GitHub CI validates the branch but does not release it.
Do not push/merge to `main` to deploy the preview: that would trigger the existing GitHub Pages
workflow for the live corporate domain.

Rollback: use the prior Pages deployment if available, or redeploy a previously validated
static build. The unchanged corporate `main` / GitHub Pages deployment is independent.
There is no production database or private-document storage in this static release to restore.
No disaster-recovery claim is made for the separate backend. Domain cutover requires a full DNS
backup and explicit approval, preserving mail records. Legal/privacy/retention and Philippine
professional review remain required; technical deployment is not legal compliance.

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

## Security

Do not commit secrets, API keys, or credentials. Report security concerns to
admin@jovexalabs.com.

## License

&copy; Jovexa Software Development Services. All rights reserved.
