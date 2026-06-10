#!/usr/bin/env node
// Create a GitHub Release for the current packages/web-component version,
// using the matching section of packages/web-component/CHANGELOG.md as the
// release notes. Pass --prerelease for beta releases.

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(
  readFileSync('packages/web-component/package.json', 'utf8'),
);
const tag = `v${pkg.version}`;

const changelog = readFileSync('packages/web-component/CHANGELOG.md', 'utf8');
const escaped = pkg.version.replace(/[.+*?^${}()|[\]\\]/g, '\\$&');
const header = new RegExp(`^## \\[${escaped}\\][^\\n]*$`, 'm').exec(changelog);
if (!header) {
  console.error(`gh-release: no "## [${pkg.version}]" section in CHANGELOG.md`);
  process.exit(1);
}
const rest = changelog.slice(header.index + header[0].length);
const next = /^## \[/m.exec(rest);
const notes = (next ? rest.slice(0, next.index) : rest).trim();

const args = ['release', 'create', tag, '--title', tag, '--notes', notes];
if (process.argv.includes('--prerelease')) args.push('--prerelease');

const result = spawnSync('gh', args, { stdio: 'inherit' });
process.exit(result.status ?? 1);
