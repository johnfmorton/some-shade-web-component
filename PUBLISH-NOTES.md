# Publishing @johnfmorton/some-shade

## Prerequisites

- Logged into npm: `npm login`
- Logged into GitHub CLI: `gh auth status` (used to create the GitHub Release)
- On a clean git working tree (all changes committed)

## Beta Release

1. Bump the version in `packages/web-component/package.json`
   - e.g. `0.1.0-beta.4` → `0.1.0-beta.5`
2. Build: `pnpm build`
3. Commit and push
4. Publish: `pnpm publish:beta`
   - This publishes to npm and creates a git tag (e.g. `v0.1.0-beta.5`) on GitHub
5. Tag as latest: `pnpm latest`

## Stable Release

1. Set the version in `packages/web-component/package.json`
   - e.g. `0.1.0-beta.5` → `0.1.0`
2. Build: `pnpm build`
3. Commit and push
4. Publish: `pnpm publish:release`
   - This publishes to npm, tags as `latest`, and creates a git tag on GitHub

## Available Scripts (run from project root)

| Script | What it does |
|---|---|
| `pnpm publish:beta` | Publish with the `beta` dist-tag, create a git tag, and create a GitHub pre-release |
| `pnpm publish:release` | Publish with the `latest` dist-tag, create a git tag, and create a GitHub Release |
| `pnpm latest` | Point the `latest` dist-tag to the current version |
| `pnpm tag` | Create and push a git tag for the current version |
| `pnpm gh-release` | Create a GitHub Release for the current version (notes pulled from `packages/web-component/CHANGELOG.md`) |
| `pnpm gh-release:beta` | Same, but marked as a GitHub pre-release |

## Notes

- The publishable package is `packages/web-component/package.json` — that's where the version lives. The root `package.json` is the monorepo workspace config and is never published.
- npm requires a clean git state to publish. If you see a git-checks error, commit your changes first.
- You cannot republish the same version number. If npm rejects with a 403, you need to bump the version.
- After a beta publish, run `pnpm latest` if you want `npm i @johnfmorton/some-shade` to install that version. Otherwise only `npm i @johnfmorton/some-shade@beta` will get it.
- **GitHub Pages deployment** is triggered automatically when a version tag (e.g. `v0.1.0-beta.6`) is pushed. It does not run on every push to `main`.
