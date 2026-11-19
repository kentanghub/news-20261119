// news-image-20261119 entry point.
// Verifies entry.png is a valid 1024x1024 PNG under 1 MiB, then copies it to /output.
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const SOURCE_PNG = new URL('./entry.png', import.meta.url);

// Ensure the output directory exists.
mkdirSync(OUTPUT_DIR, { recursive: true });

// Read the entry image bytes.
const png = readFileSync(SOURCE_PNG);

// --- Validation: PNG signature ---
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];
for (let i = 0; i < PNG_MAGIC.length; i++) {
  if (png[i] !== PNG_MAGIC[i]) {
    throw new Error(`Not a PNG: byte ${i} is 0x${png[i]?.toString(16)} (expected 0x${PNG_MAGIC[i].toString(16)})`);
  }
}

// --- Validation: size cap (1 MiB) ---
const ONE_MIB = 1024 * 1024;
if (png.length > ONE_MIB) {
  throw new Error(`entry.png is ${png.length} bytes — exceeds the ${ONE_MIB} byte (1 MiB) limit`);
}

// --- Validation: dimensions from IHDR chunk ---
// PNG: 8-byte sig | 4-byte length | "IHDR" | width(4) | height(4) | ...
if (png.length < 24 || png.toString('latin1', 12, 16) !== 'IHDR') {
  throw new Error('PNG IHDR chunk not found — file may be truncated or corrupt');
}

const imgWidth = png.readUInt32BE(16);
const imgHeight = png.readUInt32BE(20);

if (imgWidth !== 1024 || imgHeight !== 1024) {
  throw new Error(`Image is ${imgWidth}x${imgHeight} — must be exactly 1024x1024`);
}

// --- Deliver: copy to output ---
const dest = join(OUTPUT_DIR, 'entry.png');
try {
  copyFileSync(SOURCE_PNG, dest);
} catch (err) {
  throw new Error(`Failed to write to ${dest}: ${err instanceof Error ? err.message : String(err)}`);
}

console.log(`OK: ${png.length} bytes, ${imgWidth}x${imgHeight} → ${dest}`);
