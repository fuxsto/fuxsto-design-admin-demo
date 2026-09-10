# Changelog

All notable changes to this template are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-09-10

First public release.

### Added

- Full admin surface built on `fuxsto-design@0.2.0`: login, dashboard, users, roles, orders,
  forms, lists, detail, feedback, data-display, AI streaming, settings, profile and 404.
- **84 / 84** component-library exports exercised — every component ships with at least one
  realistic usage in the template.
- Responsive layout down to 375px: collapsible drawer navigation, responsive grids and
  horizontally scrollable tables.
- Five verification gates wired into `npm run verify`:
  - `vue-tsc --noEmit` type-check
  - `scripts/coverage-audit.cjs` — component coverage against the library export list
  - `scripts/prop-legality-audit.cjs` — every prop checked against the `.d.ts` baseline
  - `scripts/fallthrough-audit.cjs` — detects non-prop attributes on Fragment-root components
  - production `vite build`
- `docs/component-inventory.md` — inventory of the component library with the template's usage.
- Light / dark theme with persisted preference, and a local SVG placeholder-media pipeline
  (no external image hosts, works offline).

### Fixed

- **Blank images.** Placeholder SVG data URIs used the space-separated `hsl(H S% L%)` colour
  syntax, which SVG rendering engines do not reliably honour when the SVG is loaded through
  `<img src>`. Switched to `rgb(r, g, b)` with explicit `width`/`height`.
- **`[Vue warn] Extraneous non-props attributes (class) ... renders fragment`.** `Image` renders
  a Fragment root, so `class` could not be inherited and was silently dropped, collapsing the
  component. All `Image` usages now size via the `width` / `height` props.
- **Carousel slide sizing.** Slides are now plain wrapper elements so the page width/height that
  `Carousel` injects as inline `style` has a node to land on.

[Unreleased]: https://github.com/fuxsto/fuxsto-design-admin-demo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/fuxsto/fuxsto-design-admin-demo/releases/tag/v1.0.0
