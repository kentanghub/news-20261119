// render.mjs — renders design/news.html to entry.png at exactly 1024x1024.
// Uses Playwright's Chromium; needs LD_LIBRARY_PATH for shared libs on this box.
import { chromium } from 'playwright';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, 'news.html');
const outPath = resolve(__dirname, '..', 'entry.png');

const browser = await chromium.launch({
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});

try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  // Measure the actual content height to detect overflow or clipping.
  const dims = await page.evaluate(() => {
    const el = document.querySelector('.page') || document.body;
    const r = el.getBoundingClientRect();
    return { pageH: r.height, footBottom: r.bottom };
  });
  console.log('measure', JSON.stringify(dims));

  await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width: 1024, height: 1024 } });
  console.log(`written ${outPath}`);
} finally {
  await browser.close();
}
