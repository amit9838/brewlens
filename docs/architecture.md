# BrewLens — Architecture Overview

## High-Level Architecture

BrewLens is a fully client-side React SPA. There is no backend — all data is fetched directly from Homebrew's public API and rendered in the browser.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│  ┌──────────┐   ┌──────────────┐   ┌─────────────────┐ │
│  │  Router  │──▶│  App Shell   │──▶│  Page Components│ │
│  │(HashRouter)  │(QueryClient, │   │  BrewList       │ │
│  └──────────┘   │ ModalProvider│   │  CaskDetail     │ │
│                 └──────────────┘   │  FormulaeDetail │ │
│                                    │  Analytics      │ │
│                                    └────────┬────────┘ │
│                                             │           │
│                        ┌────────────────────┘           │
│                        ▼                                │
│              ┌──────────────────┐                       │
│              │   Custom Hooks   │                       │
│              │  useBrewData     │                       │
│              │  usePagination   │                       │
│              │  useStorage      │                       │
│              └────────┬─────────┘                       │
│                       │                                 │
│                       ▼                                 │
│              ┌──────────────────┐                       │
│              │   lib/utils.ts   │                       │
│              │  normalizeItem   │                       │
│              │  fetchBrewData   │                       │
│              │  getSourceCode   │                       │
│              │  Status          │                       │
│              └────────┬─────────┘                       │
└───────────────────────┼─────────────────────────────────┘
                        │ fetch()
                        ▼
          ┌─────────────────────────────┐
          │   formulae.brew.sh API      │
          │  /api/cask.json             │
          │  /api/formula.json          │
          │  /api/cask/:token.json      │
          │  /api/formula/:token.json   │
          │  /api/analytics/...         │
          └─────────────────────────────┘
```

## Data Flow

1. User opens the app → `HashRouter` renders `App`
2. `App` wraps everything in `QueryClientProvider` and `ModalProvider`
3. `BrewList` mounts → `useBrewData('cask')` fires a fetch via React Query
4. Raw API response is normalized by `normalizeItem()` into `BrewItem[]`
5. `BrewList` applies filters/search via `useMemo`, paginates via `usePagination`
6. `ItemCard` renders each item; clicking navigates to `/cask/:token` or `/formula/:token`
7. Detail pages fetch individual item data via `useBrewData(type, specificUrl)`

## State Management

| State | Location | Persistence |
|---|---|---|
| Current brew type (cask/formula) | `App.tsx` useState | None (resets on reload) |
| Search query | `App.tsx` useState | None |
| Active filters | `BrewList` via `useStorage` | sessionStorage |
| Show fonts toggle | `BrewList` via `useStorage` | sessionStorage |
| Current page | `usePagination` via localStorage | localStorage (per type) |
| Modal state | `ModalContext` | None |
| API data cache | React Query | In-memory (10 min stale) |

## Routing

All routes are hash-based (`/#/path`) for static hosting compatibility (GitHub Pages).

| Route | Component |
|---|---|
| `/#/` | `BrewList` |
| `/#/cask/:token` | `CaskDetail` |
| `/#/formula/:token` | `FormulaeDetail` |
| `/#/analytics` | `Analytics` |
| `/#/installation` | `Installation` |
| `/#/about` | `About` |

## Key Design Decisions

- **No backend** — all data from Homebrew's public API, no auth, no rate limits
- **React Query** — handles caching, deduplication, and stale-while-revalidate
- **Factory pattern for modals** — `openModal(() => <Component />)` prevents re-render loops from JSX stored in context state
- **`_searchString` pre-computation** — search string is built once at normalization time, not on every filter pass
- **Font exclusion by default** — 2,500+ font casks are hidden unless explicitly toggled, keeping the list clean
