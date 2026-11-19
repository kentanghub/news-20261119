// news-image-20261119 entry point.
// Validates entry.png (PNG magic, ≤1 MiB, 1024×1024 IHDR) and copies it to /output.
// Local: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const SRC = new URL('./entry.png', import.meta.url);
mkdirSync(OUT, { recursive: true });

const buf = readFileSync(SRC);

// PNG magic bytes
if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47)
  throw new Error('not a PNG');

// 1 MiB cap
if (buf.length > 1048576)
  throw new Error(`${buf.length} bytes > 1 MiB`);

// IHDR dimensions
if (buf.length < 24 || buf.toString('latin1', 12, 16) !== 'IHDR')
  throw new Error('no IHDR');
const w = buf.readUInt32BE(16);
const h = buf.readUInt32BE(20);
if (w !== 1024 || h !== 1024)
  throw new Error(`${w}x${h} != 1024x1024`);

const dst = join(OUT, 'entry.png');
try { copyFileSync(SRC, dst); }
catch (e) { throw new Error(`write failed: ${e instanceof Error ? e.message : e}`); }
console.log(`OK ${buf.length}B ${w}x${h} → ${dst}`);
