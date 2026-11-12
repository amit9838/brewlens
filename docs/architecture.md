# BrewLens — Architecture Overview

## High-Level Architecture

BrewLens is a fully client-side React SPA hosted on GitHub Pages under `/brewlens/`. There is no backend: all data is fetched directly from Homebrew's public API and rendered in the browser. A post-build step prerenders a static HTML file for every route so pages are served with HTTP 200 and are crawlable.

```
┌──────────────────────────────────────────────────────────────┐
│                           Browser                            │
│                                                              │
│  ┌───────────────┐   ┌──────────────────┐   ┌─────────────┐  │
│  │ BrowserRouter │──▶│    App shell     │──▶│    Pages    │  │
│  │ basename      │   │ QueryClient      │   │ Discover    │  │
│  │ /brewlens/    │   │ Modal            │   │ BrewList    │  │
│  └───────────────┘   │ Bookmarks        │   │ CaskDetail  │  │
│                      │ RecentlyViewed   │   │ FormulaeDet.│  │
│                      │ SearchPalette    │   │ Analytics   │  │
│                      │ Header + Drawer  │   │ Installation│  │
│                      └──────────────────┘   │ About       │  │
│                                             └──────┬──────┘  │
│                                                    ▼         │
│              ┌─────────────────────────────────────────┐     │
│              │               Hooks                     │     │
│              │ useBrewData  useAnalytics  useDetailItem│     │
│              │ usePagination useStorage useDocumentMeta│     │
│              └────────────────────┬────────────────────┘     │
│                                   ▼                          │
│              ┌─────────────────────────────────────────┐     │
│              │  lib/utils.ts: fetchBrewData,           │     │
│              │  normalizeItem, getSourceCodeStatus     │     │
│              └────────────────────┬────────────────────┘     │
└───────────────────────────────────┼──────────────────────────┘
                                    │ fetch()
                                    ▼
                  ┌─────────────────────────────────┐
                  │      formulae.brew.sh API       │
                  │  /api/cask.json                 │
                  │  /api/formula.json              │
                  │  /api/cask/:token.json          │
                  │  /api/formula/:token.json       │
                  │  /api/analytics/...             │
                  └─────────────────────────────────┘
```

Icons for packages come from Google's favicon service; their colour is sampled through the wsrv.nl image proxy (see `src/lib/iconTone.ts`).

## Data Flow

1. `main.tsx` mounts `App` inside `BrowserRouter` (basename `import.meta.env.BASE_URL`, i.e. `/brewlens/`).
2. `App` wraps the shell in `PersistQueryClientProvider` (React Query + the IndexedDB cache from `lib/queryPersister.ts`), `ModalProvider`, `BookmarksProvider`, `RecentlyViewedProvider` and `SearchPaletteProvider`.
3. A page calls `useBrewData(type)` (or `useAnalytics`), which fetches through React Query. On a repeat visit the package lists and analytics are restored from IndexedDB first and refetched in the background once older than 10 minutes.
   Discover's featured carousel and Editor's Picks use `useBrewItems`, which fetches just those packages in parallel, so the home page doesn't wait for the full lists.
4. Raw API objects (`RawBrewData`) are normalized by `normalizeItem()` into `BrewItem[]`.
5. `BrewList` reads type, search and category from the URL search params, filters with `useMemo` on the precomputed `_searchString`, and paginates with `usePagination`.
6. `AppCard` / `AppRow` / `CompactRow` render each item; the whole card is a link to `/cask/:token` or `/formula/:token`.
7. Detail pages use `useDetailItem(type)`, which reads the token from the route, fetches `/api/{type}/:token.json` and records the view in recently viewed.

## State Management

| State | Location | Persistence |
|---|---|---|
| Brew type, search query, category on `/all` | URL search params (`?type=`, `?q=`, `?category=`) | URL (shareable) |
| Explore filters, view mode, fonts toggle | `BrewList` via `useStorage` | sessionStorage |
| Current page | `usePagination` | localStorage (`cp_cask`, `cp_formula`) |
| Bookmarks | `BookmarksContext` via `useStorage` | localStorage |
| Recently viewed | `RecentlyViewedContext` | localStorage (with TTL) |
| Theme | `useTheme` | localStorage (`theme`), falls back to the OS preference |
| Modal state | `ModalContext` | None |
| API data cache | React Query | In memory (10 min stale, analytics 1 h); list items drop `raw` |
| Package lists + analytics between visits | `lib/queryPersister.ts` | IndexedDB (`brewlens_query_cache`, 7-day max age, versioned by `CACHE_VERSION`) |

## Routing

Routes use clean URLs (`BrowserRouter`).

| Route | Component |
|---|---|
| `/` | `Discover` |
| `/all` | `BrewList` |
| `/cask/:token` | `CaskDetail` |
| `/formula/:token` | `FormulaeDetail` |
| `/analytics` | `Analytics` |
| `/installation` | `Installation` |
| `/about` | `About` |

### Static hosting on GitHub Pages

GitHub Pages has no SPA fallback, so three pieces work together:

1. **Prerendered pages** — `scripts/prerender.mjs` runs after `vite build`. It writes `<route>.html` for every static page and every cask and formula (GitHub Pages serves `/cask/firefox` from `cask/firefox.html` without a redirect), each with its own title, description, social tags, canonical URL and crawlable body content. It also writes `sitemap.xml`. React mounts and replaces `#root` as usual.
2. **404 fallback** — for any other URL, `public/404.html` stores the URL in `sessionStorage.redirect` and redirects to `/brewlens/`.
3. **Restore** — a script in `index.html` reads `sessionStorage.redirect` and restores it with `history.replaceState` before React Router starts.

`vite.config.ts` `base`, the router `basename`, `404.html` and the restore script must stay in sync.

## SEO

- Every page calls `useDocumentMeta({ title, description })`, which sets the title, meta description, Open Graph / Twitter tags and canonical URL, and restores the defaults on unmount.
- `prerender.mjs` mirrors those titles and descriptions in the static HTML.
- `public/robots.txt`, `public/llms.txt` and `public/manifest.webmanifest` describe the site for crawlers, AI agents and installable-app support.

## Styling

- Tailwind CSS 4, configured in `src/index.css` (no JS config).
- Design tokens (`--canvas`, `--surface`, `--ink`, `--accent`, …) are defined on `:root` and `.dark` and exposed as Tailwind colours through `@theme inline`, so `bg-surface` / `text-ink` flip with the theme.
- Dark mode is the `.dark` class on `<html>`, toggled by `useTheme`.
- Shared primitives (`Chip`, `Segmented`, `PillButton`, `Card`, …) live in `src/components/ui/kit.tsx`.

## Key Design Decisions

- **No backend** — all data from Homebrew's public API, no auth, no API keys
- **React Query** — handles caching, deduplication, and stale-while-revalidate
- **Shareable URLs** — view state on `/all` lives in search params; every package has its own prerendered page
- **Factory pattern for modals** — `openModal(() => <Component />)` prevents re-render loops from JSX stored in context state
- **`_searchString` pre-computation** — search string is built once at normalization time, not on every filter pass
- **Typed raw data** — `RawBrewData` types the API fields BrewLens reads; everything else is `unknown`
- **Font exclusion by default** — 2,500+ font casks are hidden unless explicitly toggled, keeping the list clean

---
*Updated: Nov 11, 2026*
