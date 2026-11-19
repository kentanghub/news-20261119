// news-image-20261119: the day's world news, drawn once and handed in as pixels.
//
// The image beside this file is the entry — designed and fact-checked at build time
// (the HTML source lives in design/news.html, rendered to entry.png) — and this
// program simply hands it to the grader: verify the PNG is whole and within the
// gate's limits, then copy it to /output/entry.png. No network, no clock, no
// randomness: two runs write the same bytes by construction.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = new URL('./entry.png', import.meta.url);
mkdirSync(out, { recursive: true });

const bytes = readFileSync(src);

// Gate 1 — it has to be a PNG (magic) and under 1 MiB.
if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4e || bytes[3] !== 0x47) {
  throw new Error('entry.png is not a PNG (bad magic bytes)');
}
if (bytes.length > 1048576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
}

// Gate 2 — exactly 1024 x 1024, read straight from the IHDR chunk.
// PNG layout: 8-byte signature, then the IHDR chunk (4-byte length, "IHDR",
// then width u32, height u32, bit depth, colour type, ...).
if (bytes.length < 24 || bytes.toString('latin1', 12, 16) !== 'IHDR') {
  throw new Error('entry.png has no IHDR chunk');
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  throw new Error(`entry.png is ${width}x${height}, must be 1024x1024`);
}

copyFileSync(src, join(out, 'entry.png'));
console.log(`entry: copied ${bytes.length} bytes (${width}x${height}) to ${join(out, 'entry.png')}`);
