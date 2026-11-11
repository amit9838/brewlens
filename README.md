<div align="center">
  <a href="https://amit9838.github.io/brewlens/" title="Visit Website" target="_blank" rel="noopener noreferrer">
    <img style="border-radius:1rem" src="docs/screenshots/banner.png" alt="BrewLens">
  </a>

  <h1><strong>Brew</strong>Lens</h1>
  <p><strong>The missing visual interface for Homebrew.</strong></p>
  <p>Browse, search, and inspect every cask and formula — right in your browser, no terminal required.</p>

  <p>
    <a href="https://amit9838.github.io/brewlens/">Website</a>
    ·
    <a href="https://amit9838.github.io/brewlens/installation">Installation Guide</a>
    ·
    <a href="https://github.com/amit9838/brewlens/issues">Report Bug</a>
    ·
    <a href="https://github.com/amit9838/brewlens/issues">Request Feature</a>
  </p>

  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/github/stars/amit9838/brewlens?style=social" alt="GitHub stars">
  <img src="https://img.shields.io/github/languages/top/amit9838/brewlens" alt="Top language">
  <br/>
  <img src="https://hitscounter.dev/api/hit?url=https%3A%2F%2Fgithub.com%2Famit9838%2Fbrewlens&label=Github&icon=github&color=%230a58ca&message=&style=flat&tz=UTC">
  <img src="https://hitscounter.dev/api/hit?url=https%3A%2F%2Famit9838.github.io%2Fbrewlens%2F&label=Web&icon=person-walking&color=%23198754&message=&style=flat&tz=UTC">
</div>

<br>

Homebrew is brilliant — but `brew search` and formula pages weren't built for browsing. BrewLens turns the entire Homebrew ecosystem into a fast, searchable app store: trending apps, rich package details, checksums for auditing, and one-click install commands you can copy and run yourself.

![BrewLens Discover page in dark mode](docs/screenshots/discover-dark.png)

## Features

**Discover**
- A featured app carousel and Editor's Picks, drawn fresh on every visit from a hand-picked list
- Instant, keyboard-first search across every cask and formula — press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> anywhere
- Category browsing — dev tools, AI & LLM, design, databases, networking, and more
- Top charts ranked by Homebrew's official 30-day install analytics
- Step-by-step [installation guide](https://amit9838.github.io/brewlens/installation) for macOS, Linux, and Windows (WSL)

**Inspect**
- Version, description, homepage, and the exact `brew install` command for every package, one click to copy
- Screenshots for many apps, from the Mac App Store or Flathub when available
- Open-source and GUI-app tags, plus more apps from the same category
- Download URLs, SHA-256 checksums, dependencies, and cask artifacts
- Deprecation/disable status plus the full raw JSON for power users

**Manage**
- Bookmarks and recently viewed history, stored locally in your browser
- Brewfile import and export to reproduce your setup anywhere
- Dark mode, responsive layout, and clean shareable URLs
- Fast repeat visits: the package lists are cached in your browser and refreshed in the background

## Explore the Site

| Page | What you'll find |
| --- | --- |
| [Discover](https://amit9838.github.io/brewlens/) | Featured app, Editor's Picks, your shelf (bookmarks and recently viewed), top charts, and categories |
| [Explore](https://amit9838.github.io/brewlens/all) | Every cask and formula with search, categories, filters, grid or list view, and an A–Z jump index |
| [Charts](https://amit9838.github.io/brewlens/analytics) | Most-installed packages over 30, 90, and 365 days |
| [Installation Guide](https://amit9838.github.io/brewlens/installation) | Copy-paste Homebrew setup, platform by platform |
| [About](https://amit9838.github.io/brewlens/about) | The project, its data sources, and how to contribute |

## Who it's For

Developers debugging casks and formulae, security teams verifying checksums and download URLs, sysadmins auditing packages before deployment, Homebrew contributors reviewing structure before a PR — and anyone who'd rather discover great macOS apps without opening a terminal.

## Built With

<p>
  <img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript_5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 7">
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
  <br/>
  <img src="https://img.shields.io/badge/TanStack_Query_5-FF4154?style=flat-square" alt="TanStack Query">
  <img src="https://img.shields.io/badge/React_Router_7-CA4245?style=flat-square" alt="React Router">
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=flat-square" alt="Radix UI">
  <img src="https://img.shields.io/badge/lucide--react-000?style=flat-square" alt="lucide-react">
</p>

## Getting Started

> **Prerequisite:** [Node.js](https://nodejs.org) ≥ 20.19 (required by Vite 7)

```bash
git clone https://github.com/amit9838/brewlens.git
cd brewlens
npm install
npm run dev
```

Then open `http://localhost:5173/brewlens/`. For the project layout and guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md) and the [docs](docs/).

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check, build for production (`dist/`), and prerender a static page for every route (needs network access to the Homebrew API) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the codebase |
| `npm run deploy` | Build and publish to GitHub Pages (maintainers) |

## Deployment

BrewLens deploys to GitHub Pages from `dist/` via [`gh-pages`](https://github.com/tschaub/gh-pages):

```bash
npm run deploy
```

The app is hosted under a sub-path (`/brewlens/`) with clean URLs. After the Vite build, `scripts/prerender.mjs` writes a static HTML file for every page and every package (plus `sitemap.xml`), so links like `/brewlens/cask/firefox` load directly with their own title and description for search engines. Any other URL falls back to `public/404.html`, which hands the requested path back to the router — no server configuration needed.

## Data & Privacy

- All package metadata and analytics come client-side from the official [Homebrew API](https://formulae.brew.sh). BrewLens is **read-only** — it never installs or modifies anything on your machine.
- A few other public services are used for visuals only. They receive the app being looked up (its homepage domain or identifier) and, like any web request, your IP address — nothing about you or your bookmarks:
  - app icons from Google's favicon service (and the [wsrv.nl](https://wsrv.nl) image proxy, to adapt dark icons to dark mode)
  - screenshots on package pages from Apple's [iTunes Search API](https://performance-partners.apple.com/search-api) and [Flathub](https://flathub.org)
- Bookmarks, history, and theme preference live in **your browser's local storage**; cached package data lives in its IndexedDB. No accounts, no tracking.

## Contributing

Bug reports, feature ideas, and pull requests are all welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md), then check [open issues](https://github.com/amit9838/brewlens/issues). If you work with an AI coding agent, point it at [AGENTS.md](AGENTS.md) for the project's conventions.

## License

Distributed under the MIT License — see [`LICENSE`](LICENSE).

## Acknowledgements

- [Homebrew](https://docs.brew.sh/) — the package manager that makes this all possible
- [Mac App Store](https://apps.apple.com/) and [Flathub](https://flathub.org) — app screenshots
- [lucide](https://lucide.dev/) and [Shields.io](https://shields.io/) — icons and badges
- [visit count](https://hitscounter.dev/)

---

<p align="center">Made with ❤️ for the Homebrew community</p>
