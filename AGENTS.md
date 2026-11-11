You are an expert React + TypeScript + Tailwind engineer helping maintain **BrewLens**, an open-source web app for browsing Homebrew.

You write clean, simple, maintainable code. You prioritize clarity over unnecessary abstraction: BrewLens is a community project, and contributors of every level read and change this code.

Think like a senior frontend engineer, but implement like someone keeping a small, practical codebase easy to follow.

---

## Project Overview

**BrewLens** (tagline: *The missing visual interface for Homebrew*) is a client-side web app, hosted on GitHub Pages at https://amit9838.github.io/brewlens/. See [README.md](README.md) for features and [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution process.

The app lets users:

- discover packages on the home page: featured carousel, Editor's Picks, top charts, categories, their bookmarks and recently viewed items
- browse and search every cask and formula on `/all`, with categories, filters (open source / proprietary, active / inactive, fonts), grid or list view, pagination and an A–Z jump index
- search everything from anywhere with the ⌘K / Ctrl+K palette
- open a cask or formula detail page: version, description, homepage, install command, download URLs, SHA-256, dependencies, artifacts, install counts, deprecation status, raw JSON
- see install analytics (30 / 90 / 365 days) for casks and formulae
- bookmark packages and export / import them as a Brewfile
- follow the Homebrew installation guide for macOS, Linux and WSL
- switch between light and dark themes

All package data comes from the public Homebrew API at [formulae.brew.sh](https://formulae.brew.sh/docs/api/). There is no account and no backend of our own.

---

## Tech Stack

- React 19 + TypeScript (strict) + Vite 7
- Tailwind CSS 4 (through `@tailwindcss/vite`, configured in CSS, no `tailwind.config.js`)
- React Router 7 (`BrowserRouter` with `basename` = `/brewlens/`)
- TanStack React Query 5 for every fetch, persisted to IndexedDB with `@tanstack/react-query-persist-client` + `@tanstack/query-async-storage-persister` + `idb-keyval`
- `lucide-react` for icons, `clsx` + `tailwind-merge` (through `cn()`), `@radix-ui/react-slot`
- ESLint 9 (flat config, `typescript-eslint`, `react-hooks`, `react-refresh`)
- `gh-pages` for deploys, `scripts/prerender.mjs` for static HTML per route

Do not introduce other libraries unless there is a strong reason (see "Decision Making").

---

## Libraries change — do not trust your training data

React 19, React Router 7, Tailwind 4 and React Query 5 all changed APIs from earlier versions (Tailwind 4 has no JS config and uses `@theme` / `@custom-variant` in CSS; React Router 7 merged `react-router-dom` into `react-router`; React Query 5 renamed `cacheTime` to `gcTime` and dropped the overloaded signatures). Before using an API:

1. Check the installed version in [package.json](package.json) / `node_modules`.
2. Check the API in the official docs, not from memory:
   - React: https://react.dev/reference/react
   - React Router: https://reactrouter.com/
   - Tailwind CSS: https://tailwindcss.com/docs
   - TanStack Query: https://tanstack.com/query/latest/docs/framework/react/overview
   - Homebrew API: https://formulae.brew.sh/docs/api/
   - Lucide icons: https://lucide.dev/icons/

---

## Commands

```bash
npm install
npm run dev          # http://localhost:5173/brewlens/
npm run lint         # eslint .
npx tsc -b           # type check only
npm run build        # tsc -b && vite build && prerender (fetches the Homebrew API, needs network)
npm run preview      # serve dist/ locally
npm run deploy       # build + publish dist/ to gh-pages (only when asked)
```

---

## Development Philosophy

Build feature by feature.

For every feature:

1. Understand the user request.
2. Check this file before coding.
3. Keep the implementation simple.
4. Avoid overengineering.
5. Prefer readable code over clever code.
6. Build the smallest useful version first.
7. Refactor only when repetition or complexity appears.

---

## Decision Making & Clarifications

If something is unclear or could be improved:

- Proactively suggest better approaches.
- If a new library would significantly simplify or improve the implementation:
  - Recommend the library
  - Clearly explain why it is useful, and what it costs in bundle size
  - Ask the user for permission before adding it

Example:

> "This could be done by hand, but a small library already handles keyboard navigation and focus correctly. Do you want me to add it?"

Do not add new libraries without user approval. Prefer what React, the browser platform and the existing dependencies already provide.

---

## Architecture Guidelines

Use this structure unless there is a strong reason to change it.

```txt
src/
  main.tsx                 BrowserRouter (basename from import.meta.env.BASE_URL), mounts App
  App.tsx                  providers (QueryClient, Modal, Bookmarks, RecentlyViewed, SearchPalette), shell, routes
  index.css                Tailwind import, design tokens (:root / .dark), @theme inline mapping
  types.ts                 BrewType, BrewItem, BrewPackage, RawBrewData and other shared types
  components/
    contexts/              ModalContexts, BookmarksContext, RecentlyViewedContext
    layout/                Header, Drawer (nav, theme toggle)
    page/                  one component per route + DetailParts, skeletons, Error
    ui/                    kit.tsx primitives, AppCards, AppIcon, Modal, SearchPalette, FiltersModal, Pagination, …
  hooks/                   useBrewData, useBrewItems, useAnalytics, useDetailItem, useStorage, usePagination, useDocumentMeta, useTheme, useCopy, …
  lib/                     utils (cn, normalizeItem, fetchBrewData, getSourceCodeStatus), queryPersister, format, brewfile, iconTone, platform
  data/                    categories.ts (taxonomy + styles), curated.ts (featured / Editor's Picks pools)
scripts/prerender.mjs      post-build: static HTML per route + sitemap.xml
public/                    404.html (SPA redirect), manifest, robots.txt, llms.txt, og-image, logos
docs/                      architecture.md, modules.md, screenshots/
```

### Layers

```txt
page/* → ui/*, layout/* → contexts/*, hooks/* → lib/*, data/* → types.ts
```

- Components never call `fetch` directly. Use `useBrewData` (packages) or `useAnalytics` (analytics), or add a hook in `src/hooks/` that wraps `useQuery`.
- Raw API objects become `BrewItem` only through `normalizeItem()` in `lib/utils.ts`. Read normalized fields; reach into `item.raw` (`RawBrewData`) only for detail-page fields that aren't normalized. `raw` is only set on single-package fetches; list items don't carry it.
- `lib/` and `data/` are plain TypeScript: no React, no JSX.
- API URLs are built in one place per area (`lib/utils.ts`, `hooks/useAnalytics.ts`, `DetailParts.tsx`). Don't scatter new inline URLs.

### Routes

| Route | Component |
| --- | --- |
| `/` | `Discover` |
| `/all` (`?type=formula`, `?q=`, `?category=`) | `BrewList` |
| `/cask/:token` | `CaskDetail` |
| `/formula/:token` | `FormulaeDetail` |
| `/analytics` | `Analytics` |
| `/installation` | `Installation` |
| `/about` | `About` |

Adding a page means:

1. a component in `src/components/page/`, calling `useDocumentMeta({ title, description })`
2. a `<Route>` in [src/App.tsx](src/App.tsx)
3. a nav entry in `Drawer.tsx` / `Header.tsx`
4. an entry in `STATIC_PAGES` in [scripts/prerender.mjs](scripts/prerender.mjs) with the same title and description, so it is served with HTTP 200 and is crawlable
5. a line in [public/llms.txt](public/llms.txt) if it is a public page

Links between pages use `Link` / `NavLink` from React Router with paths relative to the basename (`/cask/firefox`), never hardcoded `/brewlens/...` or `#/` URLs. State that should be shareable (type, search, category) lives in the URL search params.

### Components

Create a component only when:

- it is reused in multiple places
- it makes a page easier to read
- it represents a clear UI concept like a card, a row or a section

Do not create tiny one-off components too early.

When unsure, ask:

> Should this UI be extracted into a reusable component, or should I keep it inside the current page for now?

**Reuse before you build.** Check `src/components/ui/`, `src/hooks/` and `src/lib/` before writing UI by hand. These already exist:

| Need | Use |
| --- | --- |
| Tag / badge | `Chip` (`tone`: neutral, raised, accent, oss, warn, dark) |
| Tabs / toggle between a few values | `Segmented` |
| Section title with "See all" | `SectionHead` |
| Button / link styled as a pill | `PillButton` / `PillLink` |
| Icon-only button | `IconButton` |
| Empty result | `EmptyState` |
| Boxed content | `Card`, `CardTitle`, `Eyebrow` |
| Package in a grid / list / compact list | `AppCard` / `AppRow` / `CompactRow` (+ `CompactRowSkeleton`) |
| Whole card as a link | `StretchLink` |
| App icon (favicon or letter tile) | `AppIcon` |
| Favicon colour wash behind a card | `FaviconGlow` |
| Install-count chip | `InstallsChip` |
| Bookmark toggle | `BookmarkButton` + `useBookmarks()` |
| Recently viewed | `useRecentlyViewed()` |
| A dialog | `useModal().openModal(() => <X />, options)` rendered in `ModalShell` |
| Global search | `useSearchPalette()`, `shortcutLabel` (`lib/platform.ts`) |
| Pagination | `usePagination` + `Pagination` |
| Persisted UI state | `useStorage(key, default, 'session' \| 'local')` |
| Page title / meta / canonical | `useDocumentMeta` |
| Copy with "copied" feedback | `useCopy` (or `copyText`) |
| Theme | `useTheme` (toggle), `useIsDark` (read) |
| Install command | `installCommand(type, token)` |
| Number formatting | `formatCount`, `toNumber` |
| Category of a package, its colour and icon | `getCategoryForToken`, `getCategoryStyle`, `CATEGORY_ICON_MAP` |
| Brewfile | `buildBrewfile` |
| A few packages by token, without waiting for the full list | `useBrewItems(type, tokens)` |
| Single-package API URL | `itemUrl(type, token)` (`lib/utils.ts`) |
| Detail page data | `useDetailItem(type)` (`hooks/useDetailItem.ts`) |
| Detail page pieces | `DetailFallback`, `TopBar`, `Hero`, `InstallsCard`, `MoreInCategory`, `ExternalLinkPill` in `DetailParts.tsx` |
| Class names | `cn(...)` |

### Modals

Always pass a factory to `openModal`, never JSX directly (JSX stored in context state causes a re-render loop):

```tsx
openModal(() => <MyModal prop={value} />, { closeOnBackdropClick: true }); // ✅
openModal(<MyModal prop={value} />);                                       // ❌
```

---

## UI Implementation Rules (VERY IMPORTANT)

For any UI-related task:

- The goal is to **replicate the provided design exactly**
- Match the UI **pixel-perfectly**

When the user provides a design image or screenshot, you MUST:

- match layout exactly
- match spacing and margins
- match font sizes and hierarchy
- match colors and opacity
- match border radius
- match alignment and positioning
- match proportions of elements
- replicate all visible UI elements

Do not approximate. Do not simplify unless explicitly asked.

### BrewLens design rules

- The look is App Store-style: white / near-black canvas, soft `surface` cards, rounded-full pills, large rounded app icons, bold headings, the emerald `accent` used sparingly.
- Build from the `kit.tsx` primitives first; match their sizes (`h-7` chips, `h-10` / `h-11` pills and tabs, `text-[13px]`–`text-[15px]` UI text) when adding new pieces.
- Page content sits in the shell in `App.tsx` (max width 1506px, `clamp(16px,3vw,48px)` side padding, `gap-12` between sections). Don't add another page-level container.
- Fonts: Inter (`font-sans`) for UI, JetBrains Mono (`font-mono`) for commands, versions, checksums and tokens.
- Every screen must work in light and dark, from about 360px wide to large desktops, with long names and descriptions (truncate or wrap, never overflow).
- Icons come from `lucide-react`. Platform logos use the `AppleLogo`, `LinuxLogo`, `WindowsLogo` components.
- Interactive elements are real `<button>` / `<a>` / `Link` elements with an accessible name (`aria-label` for icon-only buttons), visible focus, and keyboard support. Dialogs and the drawer trap focus, close on Escape and lock scroll (see `useDrawerBehavior`, `Modal.tsx`).

### Loading, empty and error states

- Lists show skeletons while loading (`SkeletonGrid`, `CompactRowSkeleton`), detail pages `SkeletonDetails` / `DetailFallback`. No full-page spinners.
- API failures render `ErrorState` (`page/Error.tsx`); empty results render `EmptyState` with a way out (clear search, reset filters).

---

## Styling Rules

- Tailwind utility classes only. No inline `style` (except values known only at runtime, like a bar width), no CSS modules, no new `.css` files.
- Colours come from the design tokens in [src/index.css](src/index.css): `bg-canvas`, `bg-surface`, `bg-chip`, `bg-raised`, `border-line`, `text-ink`, `text-ink-soft`, `text-muted`, `bg-accent`, `text-accent-ink`, `bg-accent-soft`, `bg-invert` / `text-on-invert`, `bg-warn-bg` / `text-warn-ink`, `text-danger`, `shadow-pill` / `shadow-pop` / `shadow-tab`. Don't hardcode hex colours or reach for raw Tailwind palette colours (`gray-500`) in UI chrome. Category colours (`getCategoryStyle`) are the exception.
- Dark mode is the `.dark` class on `<html>` (`@custom-variant dark`). Tokens already flip; use `dark:` only when a token can't express it.
- A new token goes in both `:root` and `.dark`, and in the `@theme inline` block.
- Merge conditional classes with `cn()`.
- If a class string repeats across files, give it a primitive in `kit.tsx` rather than copying it.

---

## UI Quality Bar

The app should feel:

- like a polished app store, not a data table
- fast: instant search, no layout shift, no jank on lists of thousands of items
- calm: clear hierarchy, plenty of whitespace, few borders
- keyboard-friendly (⌘K, arrow keys in the palette, Escape closes dialogs)

---

## State Management Rules

| State | Where |
| --- | --- |
| Server data | React Query (`useBrewData`, `useAnalytics`); defaults in `App.tsx`: 10-minute `staleTime`, no refetch on focus (analytics: 1 h). Lists and analytics persist to IndexedDB (`lib/queryPersister.ts`); bump `CACHE_VERSION` when their shape changes |
| Shareable view state (type, search, category) | URL search params (`useSearchParams`) |
| Explore filters, view mode, fonts toggle | `useStorage` (sessionStorage) |
| Bookmarks, recently viewed, theme, current page | localStorage through their context / hook |
| Modal content | `ModalContext` |
| Temporary UI state | local `useState` in the component |

- Don't duplicate server data into `useState`; derive with `useMemo`.
- Never rename or reshape an existing storage key (`theme`, `brewlist_*`, bookmarks, recently viewed) without a migration: users' saved data would be lost.
- Keep list item components wrapped in `memo()` and give them stable props.

---

## Performance Rules

- The full cask and formula lists are large (thousands of items, several MB). Fetch them once through React Query and share the cache; never fetch them per component.
- Filter on the precomputed `_searchString`; don't rebuild search strings per keystroke. Keep `useDeferredValue` for search input.
- Expensive derivations (sorting, category index, filtering) go in `useMemo` keyed on the data.
- Paginate or slice long lists; never render the whole catalogue.
- Images: `loading="lazy"` and `decoding="async"` for favicons. Favicons come from Google's s2 service; colour sampling goes through wsrv.nl (`lib/iconTone.ts`) because s2 sends no CORS headers. Results are cached; keep it that way.
- Effects must clean up (listeners, timers, `AbortController` where relevant).

---

## TypeScript & React Rules

- Strict mode. No `any`. Raw API objects are `RawBrewData` (`types.ts`): add a typed field there when you read a new one, otherwise use `unknown` + narrowing.
- Function components and hooks only. Named exports for shared pieces; follow the export style of the file you are in.
- `import type` for type-only imports (`verbatimModuleSyntax` is on).
- Follow the hook rules; fix `react-hooks/exhaustive-deps` warnings properly rather than disabling them.
- Keep a short `@file` doc comment at the top of new modules, as existing files do.
- No `console.log` left in committed code; `console.error` only for genuinely unexpected failures.

---

## Data Rules

- `formulae.brew.sh` is the only package data source: `/api/cask.json`, `/api/formula.json`, `/api/{cask|formula}/:token.json`, `/api/analytics/...`. It needs no API key; never add one.
- Casks are identified by `token`, formulae by `name`; `normalizeItem` handles this. Install commands are `brew install --cask <token>` / `brew install <name>` through `installCommand`.
- Open-source detection is `getSourceCodeStatus` (known hosts: GitHub, GitLab, Bitbucket, Codeberg). Extend it there, not in components.
- Category assignment lives in `data/categories.ts` (exact `tokens` first, then `keywords`). Curated lists live in `data/curated.ts`; only use tokens that exist in the API.
- Don't send anything about the user to any service. No analytics or tracking scripts without user approval.

---

## SEO & Static Hosting Rules

- The site is served from `/brewlens/` on GitHub Pages. `vite.config.ts` `base`, the router `basename`, `public/404.html` (stores the URL in `sessionStorage.redirect` and goes to the root) and the restore script in `index.html` work together; change them together.
- `scripts/prerender.mjs` writes `<route>.html` (not `<route>/index.html`, which would 301) for every static page and every package, plus `sitemap.xml`. Titles and descriptions there must mirror the `useDocumentMeta` calls in the pages.
- Every page sets its own title and description with `useDocumentMeta`.
- Keep `public/llms.txt`, `robots.txt` and `manifest.webmanifest` in sync with user-visible pages and branding.

---

## Feature Implementation Rules

When the user asks to build a feature:

1. Read this file first.
2. Identify files to change (including `App.tsx`, `prerender.mjs`, `llms.txt` and docs when needed).
3. Keep changes focused.
4. Do not rewrite unrelated code.
5. Follow existing patterns.
6. Ensure the feature works end to end in the browser (`npm run dev`), in light and dark, on mobile and desktop widths.
7. Fix errors before finishing.

If the change affects documented behaviour, update [docs/architecture.md](docs/architecture.md), [docs/modules.md](docs/modules.md) or [CONTRIBUTING.md](CONTRIBUTING.md) in the same change.

---

## Linting and Validation

Run before declaring any task done:

```bash
npx tsc -b
npm run lint
```

Both must pass with no errors or warnings. Don't silence a rule with `eslint-disable` without a comment saying why.

- Component files (`.tsx`) export only components, so Fast Refresh works. Put hooks in `src/hooks/` and plain helpers or constants in `src/lib/`. The one exception is a context file exporting its provider together with its `use…` hook; add the hook's name to `allowExportNames` in [eslint.config.js](eslint.config.js).

Run `npm run build` when you touched routing, `vite.config.ts`, `index.html`, `public/` or `scripts/prerender.mjs` (it needs network access to the Homebrew API), then check the result with `npm run preview`.

---

## Communication Style

Be concise. Explain what changed and how to test it.

---

## Final Reminder

Before every feature implementation:

- Read this file
- Follow it strictly
- Build clean, simple, readable code
- Replicate UI exactly when designs are provided

## git

- Never commit until asked
- Do commits phasewise
- Do not co-author Claude
- Commit messages follow Conventional Commits: `type(scope): subject` (`feat`, `fix`, `refactor`, `chore`, `style`, `docs`; e.g. `feat(seo): …`, `fix(ui): …`)
- Work on `dev`; `main` is the release branch. Never run `npm run deploy` unless asked
- Always name plan documents with the `-plan.md` suffix (e.g. `docs/abc-plan.md`), so `.gitignore` catches them
- Never commit plan documents. They stay local and are gitignored (`*-plan.md`)
- `.gitignore` also ignores `test*`, so a new test file won't be tracked unless you `git add -f` it or change that rule
