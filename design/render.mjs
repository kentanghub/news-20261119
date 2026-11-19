// render.mjs — renders design/news.html → entry.png via Playwright (headless, no root).
//
// The design is deterministic (no network, no clock, fixed 1024x1024 viewport), so
// re-rendering it writes the same bytes every time. Run it from a directory that
// has `playwright` in its node_modules (this box: ~/.hermes/cache/scratch/makefun/shots),
// and on a no-root box prefix LD_LIBRARY_PATH=$HOME/chromelibs for the GUI libs.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.argv[2] ?? join(here, '..', 'entry.png');

const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
const pageErrors = [];
p.on('pageerror', (e) => pageErrors.push(String(e)));
await p.goto('file://' + join(here, 'news.html'), { waitUntil: 'load' });
await p.waitForTimeout(500);

// Report exactly how close the content sits to the 1024px canvas edge so a clipped
// footer is caught before the screenshot is trusted (target footBottom <= ~1015).
const measure = await p.evaluate(() => {
  const page = document.querySelector('.page');
  const foot = document.querySelector('.foot');
  return {
    pageH: page ? page.scrollHeight : null,
    footBottom: foot ? foot.getBoundingClientRect().bottom : null,
  };
});
console.log('measure', JSON.stringify(measure));

await p.screenshot({ path: out, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
await b.close();
if (pageErrors.length) {
  console.error('page errors:', pageErrors.join('; '));
  process.exit(1);
}
console.log('written', out);