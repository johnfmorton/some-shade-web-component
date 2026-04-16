# Changelog

## [Unreleased]

### Changed

- Render at display size instead of full natural resolution — a 4000 px image shown at 800 CSS px now renders at ≤1600 px (at 2× DPR) instead of 8000 px
- Replace PNG blob round-trip with direct canvas copy (`drawImage`) — eliminates PNG encoding and decoding overhead entirely

## 1.1.0 - 2026-03-01

- Add `reference-width` attribute (default 1024) — normalizes `u_gridSize` and `u_dotRadius` by source image width so the dot pattern looks visually consistent regardless of image resolution

## 0.1.1-beta

- Fix halftone-duotone and halftone-cmyk shaders to sample at grid cell center — dots are now clean, uniform circles instead of splotchy per-pixel noise

## 0.1.0-beta.11

- Add grid angle option to dot grid effect (`angle` attribute)
- Add loading blur option (`loading-blur` attribute) — source image displays blurred until the WebGL effect resolves
- Add `replayTransition()` public method for programmatically replaying the loading transition

## 0.1.0-beta.10

- **BREAKING:** Remove pixel sort effect (`pixel-sort`, `threshold`, `sort-direction`, `sort-span` attributes removed)

## 0.1.0-beta.9

- Fade transition when processed snapshot replaces the source image on scroll

## 0.1.0-beta.8

- Fix mobile crashes when using multiple instances on one page
- Render-then-snapshot architecture: WebGL context is created, used, and torn down per render instead of held persistently
- Cap devicePixelRatio at 2 to reduce canvas memory on 3×+ mobile screens
- Global render queue serialises WebGL across all instances (at most one context at a time)
- IntersectionObserver defers rendering for off-screen instances until they scroll into view

## 0.1.0-beta.7

- Guard custom element registration against double-define

## 0.1.0-beta.6

- Publish as `latest` dist-tag to fix missing sidebar links (Repository, Homepage, Issues) on npmjs.com

## 0.1.0-beta.5

- Add license, repository, homepage, and bugs fields to package.json
- Add CHANGELOG.md and LICENSE to published package

## 0.1.0-beta.4

- Add publish scripts to monorepo root
- Add license field to package.json (pending)

## 0.1.0-beta.3

- Include README in published npm package
- Update all docs to use scoped package name `@johnfmorton/some-shade`

## 0.1.0-beta.1

- Rename package to `@johnfmorton/some-shade`
- Display package name and version in playground header
- Initial publish to npm

## 0.1.0 (unpublished)

- CMYK halftone shader effect with per-channel angle control
- Duotone halftone shader effect with custom color
- Pixel sort shader effect with configurable direction and threshold
- Dot grid shader effect with customizable background color
- Custom effect registration API (`register`, `get`, `list`)
- WebGL fallback to plain `<img>` when unavailable
- React playground with live controls and code export
- GitHub Pages deployment for playground
