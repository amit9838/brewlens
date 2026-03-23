# Contributing to BrewLens

Thanks for your interest in contributing. Here's everything you need to get started.

## Development Setup

```bash
git clone https://github.com/amit9838/brewlens.git
cd brewlens
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
src/
├── components/
│   ├── contexts/     # React context providers
│   ├── layout/       # Header, Drawer
│   ├── page/         # Full-page route components
│   └── ui/           # Reusable UI primitives
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── types.ts          # Shared TypeScript types
docs/                 # Developer documentation
```

## Coding Standards

- TypeScript strict mode — no `any` unless interfacing with raw API data
- Functional components only, no class components
- Use `memo()` for list-item components that receive stable props
- Tailwind for all styling — no inline styles, no CSS modules
- Use the existing `Button` component rather than raw `<button>` elements
- Use `useStorage` for any state that needs to persist across navigation
- Use `useBrewData` (React Query) for all API calls — no raw `fetch` in components

## Adding a New Page

1. Create `src/components/page/YourPage.tsx`
2. Add a route in `src/App.tsx`:
   ```tsx
   <Route path="/your-path" element={<YourPage />} />
   ```
3. Add a nav link in `src/components/layout/Drawer.tsx` or `Header.tsx`

## Adding a New Filter

Filters in `BrewList` are driven by a `Set<string>`. To add a new filter:

1. Add the filter key to the appropriate group in `groups` (or create a new group):
   ```ts
   const groups = {
     foss: ['oss', 'proprietary'],
     status: ['active', 'inactive'],
     yourGroup: ['optionA', 'optionB'], // new
   }
   ```
2. Add the filter logic in the `filtered` useMemo:
   ```ts
   if (activeFilters.has('optionA')) result = result.filter(i => /* condition */);
   ```
3. Add the UI button in the filter tags section

## Adding a New Button Variant

In `src/components/ui/Button.tsx`, add to the `variants` object and the `ButtonProps` variant union type:

```ts
variant?: '...' | 'yourVariant';

const variants = {
  // ...
  yourVariant: "bg-purple-600 text-white hover:bg-purple-700 ...",
};
```

## Modal Usage

Always pass a factory function to `openModal`, not JSX directly:

```tsx
// ✅ Correct
openModal(() => <MyModal prop={value} />, { closeOnBackdropClick: true });

// ❌ Wrong — causes re-render loop
openModal(<MyModal prop={value} />);
```

## Pull Request Process

1. Fork the repo and create a branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run `npm run build` to check for TypeScript errors
4. Open a PR with a clear description of what changed and why

## Reporting Bugs

Open an issue at https://github.com/amit9838/brewlens/issues with:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS

---
*Updated: Mar 23, 2026*
