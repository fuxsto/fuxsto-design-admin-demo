<!-- Thanks for contributing! Keep the PR focused on one change. -->

## Summary

<!-- What changed and why. Link the issue if one exists: Closes #123 -->

## Type of change

- [ ] Bug fix (non-breaking)
- [ ] New feature (non-breaking)
- [ ] Breaking change
- [ ] Documentation only
- [ ] Tooling / audit script

## Affected pages / files

<!-- e.g. src/pages/Dashboard.vue, scripts/fallthrough-audit.cjs -->

## Checklist

- [ ] `npm run verify` passes (type-check + coverage + prop-legality + fallthrough)
- [ ] `npm run build` succeeds
- [ ] Component coverage is still **84/84** (`npm run audit` reports 0 missing)
- [ ] No `class` / `style` passed to Fragment-root components (`Image`, `Table`, `Pagination`, `Slider`)
- [ ] Any `Carousel` slide is a plain element, not a component with a Fragment root
- [ ] Verified at a 375px-wide viewport
- [ ] Docs updated if behaviour or the component list changed

## Screenshots / recording

<!-- For visual changes, before & after. Drag images here. -->
