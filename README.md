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
