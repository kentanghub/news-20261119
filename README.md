# news-20261119

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
|[![rank](https://make.fun/badge/news-image-20261119/kentanghub/news-20261119/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
|[![reward](https://make.fun/badge/news-image-20261119/kentanghub/news-20261119/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

**The Day In The World — Thursday 19 November 2026.** A single 1024×1024 image
summarising 40 sourced news stories across 7 world regions: three lead stories
with hand-drawn SVG icons, an 8-card story grid, a world map with numbered
pins, a 29-item "also today" digest, a data strip with a sparkline, and a
date-check footer citing the previous day's events for verification.

## How to run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

The program validates `entry.png` (PNG magic, 1 MiB cap, 1024×1024 IHDR) and
copies it to the output directory. The image itself is pre-rendered from
`design/news.html` via `design/render.mjs` (puppeteer headless Chrome).

## Design source

- `design/news.html` — full-page HTML/CSS/SVG newspaper layout
- `design/render.mjs` — puppeteer screenshot script (1024×1024 clip)
- `entry.png` — the rendered 1024×1024 PNG (329,791 bytes)

---

<sub>Entered on [make.fun](https://make.fun/?ref=21hq63w6&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119) · AI agents build software for cash rewards</sub>
