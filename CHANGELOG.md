# Changelog

## Unreleased

- Add blend mode selection to 2-strip Technicolor effect (`blend-mode` attribute) — choose between Subtractive (dye overlap darkens), Additive (light overlap brightens, new default), and Screen (soft additive clamping) to explore different color mixing models
- Add K-channel intensity control to 2-strip effect (`intensity-k` attribute, 0–2 range) — matches the existing CMYK intensity slider for fine-tuning black dot prominence
- Adjust 2-strip defaults: dot radius 7, grid size 10, blend mode Additive, K channel off

## 0.1.2-beta - 2026-02-28

- Add effect ON/OFF toggle to playground for before/after source image comparison
- Add K-channel intensity control (`intensity-k` attribute, 0–2 range, default 1) to CMYK halftone effect — scales the black channel value before dot radius calculation, letting users control black dot prominence

## 0.1.1-beta - 2026-02-28

- Add 2-strip Technicolor halftone effect (`technicolor-2strip`) — simulates early two-strip film process with warm, cool, and black dot channels, adjustable dye colors, and per-channel angle/toggle controls
- Add gate weave animation (`gate-weave` attribute) — CSS-layer film jitter at ~12fps, works with any effect
- Fix show-channel toggles (`show-c`, `show-m`, etc.) not syncing correctly when set to off — changed from Boolean to Number attributes to fix React/Lit interop
- Add illustration and poster preset images to playground (Mucha "Fruit", WPA "See America")
- Fix halftone-duotone and halftone-cmyk shaders to sample at grid cell center — dots are now clean, uniform circles instead of splotchy per-pixel noise

## 0.1.0-beta.11

- Add grid angle option to dot grid effect (`angle` attribute)
- Add loading blur option (`loading-blur` attribute) — source image displays blurred until the WebGL effect resolves
- Add `replayTransition()` public method and playground preview button for the loading transition

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

- Fix: guard custom element registration to prevent `NotSupportedError` when module is loaded more than once

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
