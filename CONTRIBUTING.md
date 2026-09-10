# Contributing

Thanks for wanting to improve **fuxsto-design-admin-demo**. This document covers how to set up,
what the project's hard rules are, and what a mergeable PR looks like.

## Getting started

```bash
git clone https://github.com/fuxsto/fuxsto-design-admin-demo.git
cd fuxsto-design-admin-demo
npm install
npm run dev      # http://localhost:5173
```

Requires **Node >= 22.18** (see `.nvmrc`).

## Hard rules

These are not style preferences — breaking them causes real, visible defects. Each one was
hit and fixed at least once while building the template.

1. **Never pass `class` or `style` to a Fragment-root component.**
   `Image`, `Table`, `Pagination` and `Slider` render a Fragment root (multiple root nodes),
   so Vue cannot auto-inherit non-prop attributes. The attribute is **silently dropped** and
   Vue logs `Extraneous non-props attributes ... renders fragment`.
   - For `Image`, size it with the `width` / `height` props instead:
     `<Image src="..." fit="cover" width="100%" height="100%" />`
   - Enforced by `scripts/fallthrough-audit.cjs`.

2. **Every `Carousel` slide must be a plain element.**
   `Carousel` injects the page width/height as an inline `style` on each slide's root node, so a
   slide must be something that can receive it — use `<div class="h-full w-full">`.
   Do not make `<Image>` (or any Fragment-root component) a direct child of `Carousel`.
   Do not use `v-for` inside the default slot: it compiles to a single Fragment and the
   carousel treats it as one slide.

3. **Local media must use `rgb()` colours.**
   Placeholder images are generated as SVG data URIs in `src/utils/media.ts`. SVG loaded through
   an `<img src>` does not reliably honour the modern space-separated `hsl(H S% L%)` syntax —
   the image renders blank. Always emit `rgb(r, g, b)`.

4. **Use the library's documented API.**
   `node_modules/fuxsto-design/dist/**/*.d.ts` is the source of truth for props, events and slots —
   not memory, not the existing template code.

## Before opening a PR

```bash
npm run verify   # type-check + coverage + prop-legality + fallthrough audits
npm run build    # production build must succeed
```

All five gates must be green:

| Gate | Command | Expected |
|------|---------|----------|
| Type safety | `npm run type-check` | 0 errors |
| Build | `npm run build` | succeeds |
| Component coverage | `scripts/coverage-audit.cjs` | 84 / 84, 0 missing |
| Prop legality | `scripts/prop-legality-audit.cjs` | 0 unknown props |
| Attribute fallthrough | `scripts/fallthrough-audit.cjs` | 0 violations |

If you add a page or change which components are used, also update the component table in
`README.md` and the entry in `docs/component-inventory.md`.

## Conventions

- **TypeScript** everywhere; `<script setup lang="ts">` in SFCs.
- **2-space** indentation, LF line endings, UTF-8 (see `.editorconfig`).
- Prefer **hard-coded demo data** in `src/mock/data.ts` over inventing fake API calls.
- Keep pages **responsive down to 375px** — this is part of the definition of done.

## Regenerating screenshots

The README gallery is captured from the **production build**, so it matches what users actually get.

```bash
npm run build
npm run preview -- --port 4173        # serves dist/ on http://127.0.0.1:4173
```

Then drive a headless Chromium with [agent-browser](https://github.com/vercel-labs/agent-browser):

```bash
agent-browser set viewport 1440 900 2     # 1440x900 at 2x for crisp images
agent-browser open http://127.0.0.1:4173/#/dashboard
agent-browser wait 2200                   # let the entry animations settle
agent-browser screenshot docs/screenshots/dashboard.png
agent-browser close                       # always close, even on failure
```

Routes are hash-based, so every page is `http://127.0.0.1:4173/#/<route>`:

| File | Route / setting |
|------|-----------------|
| `dashboard.png` | `#/dashboard` |
| `data-display.png` | `#/data` |
| `users.png` | `#/users` |
| `form-demo.png` | `#/form-demo` |
| `detail.png` | `#/detail/1` |
| `roles.png` | `#/roles` |
| `feedback.png` | `#/feedback` |
| `login.png` | `#/login` |
| `mobile-dashboard.png` | `#/dashboard` after `set viewport 390 844 2` |
| `mobile-users.png` | `#/users` after `set viewport 390 844 2` |
| `dashboard-dark.png` | `#/dashboard`, then `eval "localStorage.setItem('fuxsto-admin-theme','dark')"` and `reload` |

Two things to watch:

- **Wait ~2.2s after each navigation.** Pages use entry animations and will otherwise be captured mid-fade.
- **There is no route guard**, so every page is reachable directly — no login step needed.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/) are appreciated:

```
feat(dashboard): add KPI trend sparkline
fix(image): size via width/height props instead of class
docs(readme): document the Fragment-root constraint
```

## Reporting security issues

Please **do not** open a public issue for security problems — see [SECURITY.md](./SECURITY.md).

## Code of conduct

By taking part you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).
