# BrewLens — Module Reference


## `src/types.ts`

Central TypeScript type definitions shared across the entire app.

### `BrewType`
```ts
type BrewType = 'cask' | 'formula'
```
Discriminates between Homebrew GUI apps (casks) and CLI tools (formulae).

### `BrewPackage`
```ts
interface BrewPackage {
  verified: boolean   // Whether a source URL was found
  isFoss: boolean     // Whether the source is on a known OSS host
  fossUrl: string | null  // Direct link to source repository
}
```

### `BrewItem`
The normalized representation of any Homebrew package. All page components and cards consume this type.

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier (full_token for casks, name for formulae) |
| `type` | BrewType | 'cask' or 'formula' |
| `name` | string | Display name |
| `token` | string | Homebrew token used in install commands |
| `desc` | string | Package description |
| `version` | string | Current stable version |
| `homepage` | string? | Package homepage URL |
| `deprecated` | boolean? | Whether the package is deprecated |
| `disabled` | boolean? | Whether the package is disabled |
| `installCmd` | string | Ready-to-run install command |
| `package` | BrewPackage | Open source status info |
| `raw` | any | Full unmodified API response |
| `_searchString` | string | Pre-computed lowercase search index |

---

## `src/lib/utils.ts`

Core utility functions for API interaction and data transformation.

### `cn(...inputs)`
Merges Tailwind CSS class names using `clsx` + `tailwind-merge`. Handles conditional classes and deduplication.

### `normalizeItem(rawData, type)`
Transforms a raw Homebrew API object into a typed `BrewItem`. Called for every item in the list and detail fetches.

- Extracts the correct `id` and `name` based on type (casks use `full_token`, formulae use `name`)
- Builds `installCmd` from the type-specific prefix
- Calls `getSourceCodeStatus` to populate `package`
- Pre-computes `_searchString` for fast filtering

### `fetchBrewData(type, url?)`
Fetches and normalizes Homebrew data. Handles both list endpoints (returns array) and individual item endpoints (returns single object wrapped in array).

### `getSourceCodeStatus(rawData, type)`
Determines open-source status by scanning URL fields for known OSS hosting domains (`github.com`, `gitlab.com`, `bitbucket.org`, `codeberg.org`).

- For casks: checks `url_specs` values and `homepage`
- For formulae: additionally checks `urls.head.url`

---

## `src/hooks/useBrewData.ts`

React Query wrapper for all Homebrew API fetches.

```ts
useBrewData(type: BrewType, url?: string)
```

- Cache key includes both `type` and `url` so list and detail fetches are cached independently
- `staleTime: 10 minutes` — data won't refetch unless older than 10 minutes
- `refetchOnWindowFocus: false` — prevents unnecessary refetches when switching tabs

---

## `src/hooks/usePagination.ts`

Generic pagination hook with localStorage persistence.

```ts
usePagination<T>(data: T[], itemsPerPage: number, storageKey?: string)
```

Returns `{ currentPage, setCurrentPage, totalPages, currentData }`.

- Reads saved page from `localStorage` on mount (keyed by `storageKey`)
- Clamps page to valid range when `data.length` changes (skips clamp when data is empty to avoid overwriting saved page before data loads)
- Writes current page to `localStorage` on every change

---

## `src/hooks/useStorage.ts`

Generic hook for `localStorage` or `sessionStorage` with JSON serialization.

```ts
useStorage<T>(key: string, defaultValue: T, type?: 'local' | 'session')
```

- Defaults to `sessionStorage` (persists within tab session, clears on close)
- Auto-removes the key when value equals `defaultValue` or is empty (avoids stale entries)
- Handles JSON parse errors gracefully by falling back to `defaultValue`

---

## `src/components/contexts/ModalContexts.tsx`

Global modal state via React Context.

### Why factory pattern?
`openModal` accepts `() => ReactNode` (a factory function) rather than `ReactNode` directly. This prevents an infinite re-render loop: if JSX were stored directly in context state, every parent re-render would create new JSX, update context, trigger re-renders, and loop.

```ts
// Correct usage
openModal(() => <MyModal prop={value} />, options)

// NOT this — causes re-render loop
openModal(<MyModal prop={value} />, options)
```

### `ModalOptions`
| Option | Default | Description |
|---|---|---|
| `size` | — | Modal size class (unused in current layout) |
| `closeOnBackdropClick` | `true` | Close when clicking outside |
| `showCloseButton` | `true` | Show X button in top-right |

---

## `src/components/ui/Button.tsx`

Polymorphic button component built with `@radix-ui/react-slot`.

### Variants
| Variant | Use case |
|---|---|
| `primary` | Main actions (green) |
| `secondary` | Secondary actions (zinc) |
| `destructive` | Dangerous actions (red) |
| `outline` | Bordered, transparent background |
| `ghost` | No border, subtle hover |
| `blue` | OSS filter tag |
| `glass` | Frosted glass, used on dark hero sections |
| `link` | Inline text link style |
| `black` / `white` | High contrast variants |

### Props
- `isPill` — applies `rounded-full` instead of `rounded-md`
- `isLoading` — shows spinner, disables interaction
- `asChild` — renders as child element via Radix Slot (useful for wrapping `<a>` tags)

---

## `src/components/page/BrewList.tsx`

Main browse/search page. The most complex component in the app.

### Filter system
Filters are stored as a `Set<string>` (serialized to array in sessionStorage via `useStorage`). Two filter groups are defined:

```ts
const groups = {
  foss: ['oss', 'proprietary'],   // mutually exclusive
  status: ['active', 'inactive'], // mutually exclusive
}
```

`toggleFilter(f)` clears siblings in the same group before adding the new filter, enforcing single-selection per group.

### Search
Uses `useDeferredValue` to keep the input responsive while filtering large lists. The actual filter runs against `_searchString` (pre-computed at normalization time).

### A-Z Index
`SearchIndexModal` sets `newChar` state. A `useEffect` watches `newChar`, finds the first item starting with that letter in the sorted data, calculates its page, and navigates there.

### Font exclusion
Cask tokens starting with `font-` are filtered out by default. The `showFonts` toggle (persisted in sessionStorage) re-includes them.

---

## `src/components/page/Analytics.tsx`

Install analytics leaderboard using Homebrew's analytics API.

- Fetches `cask-install/{period}.json` for 30d / 90d / 365d
- Separately fetches `cask.json` to get homepage URLs for favicon lookup
- Bar width is proportional to the top item's count (`barWidth = count / maxCount * 100`)
- Each row links to `/cask/:token` for the detail page
- Shows top 25 by default with a "View All" button

---

## `src/components/page/CaskDetail.tsx` & `FormulaeDetail.tsx`

Detail pages for individual packages. Both:
- Extract `token` and `type` from the URL path
- Fetch individual item data via `useBrewData(type, specificUrl)`
- Display install analytics (30d / 90d / 365d) from `item.raw.analytics`
- Show source code link if `getSourceCodeStatus` returns `verified: true`
- Copy-to-clipboard for install command and API URL

---

## `src/components/ui/Pagination.tsx`

Pagination controls with page jump and items-per-page selector.

- Shows a sliding window of ±2 pages around the current page
- "Go to" form for jumping to arbitrary pages
- Items per page: 12 / 24 / 48

---

## `src/components/ui/QuickSearchModal.tsx`

Pre-defined search term shortcuts. Clicking a term calls `onSelect(term)` and closes the modal. Terms cover common app categories: browsers, dev tools, productivity, media, communication, system utilities.

---

## `src/components/ui/SearchIndexModal.tsx`

A-Z character grid for jumping to alphabetical sections of the list. Generates A–Z plus `#` for non-alphabetic entries.

---
*Updated: Mar 23, 2026*
