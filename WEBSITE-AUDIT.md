# Jovexa Labs Website Audit and Local Launch Report

**Review date:** 28 October 2026

**Repository:** `Jovexa Labs Website`

**Branch at review:** `feature/jovexa-community-prototype`

## Current architecture

- **Frontend:** React 19, React Router 7, Vite 8, plain CSS, JavaScript ES modules.
- **Hosting and deployment:** Static build published to GitHub Pages by `.github/workflows/deploy.yml` after pushes to `main` or a manual workflow dispatch. The project also documents a separate manual Cloudflare Pages preview process.
- **Domain:** `jovexalabs.com` is declared in the repository's CNAME, canonical URLs, and sitemap. DNS records were not inspected or changed.
- **Production backend/database/authentication:** None is configured. The only API in this repository is an opt-in developer-local simulation; it is not deployed or connected to production.
- **Email/payments/analytics:** No email delivery service, live payment integration, or active website analytics/Meta Pixel is configured. Simulation outbox entries and `local-sandbox` payment events are fictional local records.
- **Existing product areas:** Corporate pages, Jovexa Learn courses and Code Lab, Digital 2030 pages, product pages, developer resources, open-source information, and prototypes are client-side routes. Existing content and browser-only learning state are preserved.
- **Security controls:** The static app sets a restrictive HTML Content Security Policy. The Pages `_headers` file adds hosting response-header policies where supported; repository documentation correctly notes GitHub Pages cannot supply all of them. The Code Lab uses a separate sandboxed preview document.

## Baseline before this change

- `npm run lint`: completed with four existing warnings in `Lesson.jsx`, `Playground.jsx`, `LearnLayout.jsx`, and `Practice.jsx`.
- `npm test`: 30 tests passed, 0 failed.
- `npm run build`: succeeded; the static output checker inspected 35 files.
- The build reported a roughly 495 kB main JavaScript chunk and a roughly 906 kB Civic Explorer chunk. These are build warnings, not Lighthouse measurements.
- No baseline Lighthouse, cross-browser, accessibility-audit, or production checks were available or claimed.

## Findings and constraints

1. The repository is a static client application. It cannot safely provide server-side inquiry validation, rate limiting, spam control, durable inquiry/customer records, administrator authorization, audit logging, or verified email delivery without a separately approved backend.
2. There is no payment provider or merchant configuration. Live checkout, payment status, tax calculation, and provider-event verification are not implemented and must remain disabled.
3. Package amounts and scope require review before publication. Static prices remain in source configuration; local simulation edits do not change production prices or silently convert them to PHP.
4. Existing contact channels use email links. In static mode, the form prepares an email draft; only the explicitly started local simulation records an inquiry, and it does not claim delivery.
5. The site has existing public legal pages, but they do not substitute for Philippine legal and tax review of a commercial service agreement, privacy disclosures, refund terms, or invoicing.
6. Existing CI deploys on `main`; merging changes to that branch could publish them. No commit, push, production workflow, DNS change, or deployment was performed.

## Implemented in this local change

- Added service, pricing, template marketplace, individual demo, and website-development inquiry routes.
- Added four configured package starting prices ($149, $399, $799, and $1,499 USD) and a $29/month maintenance scope; e-commerce examples are limited to 20 initial products.
- Added ten original, CSS-illustrated website demos with industry filtering, search, responsive preview switching, sample-only interactions, individual canonical routes, and sitemap entries.
- Added a browser-validated quote form that prepares an email draft in static mode and submits to the local JSON API only when simulation mode is explicitly enabled.
- Added a loopback-only simulation API and `npm run simulate` runner. The local admin supports one-time setup, sign-in, inquiry review, quotations and customer responses, project progression, package/demo edits, permission-confirmed portfolio entries, audit history, and local notification records.
- Added fictional sandbox invoice events for deposits, balances, refunds, and disputes. No card data, provider integration, real transaction, or email delivery is involved.
- Added `npm run test:simulation`, which starts isolated API and Vite processes, uses temporary test state, exercises the full browser workflow, and removes that state afterward. `.simulation-data/` is Git-ignored.
- Documented that local state is test data only and that the simulator is not a production security boundary or administrative service.
- Updated the homepage, navigation, footer, roadmap, privacy/terms disclosures, and README for the service direction while retaining existing product, learning, developer, and Digital 2030 routes.
- Added automated configuration, route, sitemap, and browser coverage.

## Explicitly not implemented

No **production** inquiry workflow, delivery acknowledgment, administrator service, customer database, payment integration, invoice collection, analytics/Meta Pixel, formal project-agreement generator, or production deployment is present. Local simulation authentication and data are developer-only and must not be used for real customer data. Portfolio permission is a recorded administrator assertion, not an independently verified consent record. The interactive demos are original visual demonstrations, not full production stores, booking platforms, or client commissions.

## Post-change verification

- `npm run lint`: completed with the same four pre-existing warnings in `Lesson.jsx`, `LearnLayout.jsx`, `Playground.jsx`, and `Practice.jsx`; no new-file warning remains.
- `npm test`: 38 passed, 0 failed, including inquiry validation, password hashing, workflow consistency, payment milestones, and event idempotency.
- `npm run build`: succeeded; the static output checker inspected 35 files. The existing large-chunk warning remains (main bundle about 547 kB; Civic Explorer about 906 kB).
- `npm run test:simulation`: 1 full local browser workflow passed. It covered inquiry validation and recording, administrator setup and authorization, quote acceptance, invoices, duplicate/refund/dispute events, project progression, portfolio publishing, and local catalog updates.
- `npm run test:e2e -- --grep-invert "actual World Bank and leadership requests"`: 41 passed, including the responsive service pages and static-mode email draft. The excluded live World Bank and leadership probe previously timed out at its third-party request; no application assertion was implicated.
- The simulation browser test ran independently with temporary state and stopped its API/Vite processes on completion.
- Local review screenshots were captured for the desktop homepage, pricing page, template marketplace, restaurant demo, and mobile quote page.
- `git diff --check`: clean. No commit, push, deployment, DNS change, live payment, or production-data change was performed.

## Release status and next steps

### Authorized static publication checks (28 October 2026)

The owner authorized publishing all current branch updates, including the earlier Orbit/Atlas
prototype commits, to the existing GitHub Pages site. This authorization does not activate a
production backend or real payments.

- Release validation: 38 unit tests passed, the complete 42-test browser suite passed in
  `STATIC_HOST=github` mode (including the live World Bank/leadership probe), and the isolated
  simulation workflow passed.
- Lint completed with the same four pre-existing warnings; the production build and static
  output check passed. Large-bundle warnings remain.
- The public build keeps local simulation disabled: inquiries prepare email drafts, and no
  live admin, email delivery, or checkout service is enabled.
- DNS, mail records, and payment-provider settings are outside this static publication.

This static publication is not a production-backend-readiness or legal-compliance
certification. Obtain qualified legal/tax review, design and independently assess a production
backend if durable lead management is required, and verify merchant eligibility and provider
integration before enabling real payment collection. Preserve the existing GitHub Pages
deployment and use its prior validated artifact for rollback if an approved release fails.
