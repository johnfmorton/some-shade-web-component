# Changelog

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
