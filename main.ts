// news-image-20261119: the day's world news, drawn once and handed in as pixels.
// The image beside this file is the entry — designed and fact-checked at build time
// (the HTML source lives in design/news.html) — and this program simply hands it to
// the grader: copy entry.png to /output/entry.png, nothing more. No network, no clock,
// no randomness: two runs write the same bytes by construction.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = new URL('./entry.png', import.meta.url);
mkdirSync(out, { recursive: true });

// Keep the hand honest: refuse to ship an image that breaks the gate (1 MiB, whole PNG).
const bytes = readFileSync(src);
if (bytes.length > 1048576) throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
if (bytes[0] !== 0x89 || bytes[1] !== 0x50) throw new Error('entry.png is not a PNG');

copyFileSync(src, join(out, 'entry.png'));
console.log(`entry: copied ${bytes.length} bytes to ${join(out, 'entry.png')}`);