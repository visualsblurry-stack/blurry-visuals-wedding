import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path, encoding = "utf8") =>
  readFile(new URL(path, root), encoding);

const heroAssets = [
  "img/hero/hero-abhi-isha.webp",
  "img/hero/hero-sachi-vedant-embrace.webp",
  "img/hero/hero-sachi-vedant-ceremony.webp",
  "img/hero/hero-wedding-portrait-couple.webp",
  "img/hero/hero-wedding-portrait-walk.webp",
  "img/hero/hero-wedding-portrait-hands.webp",
  "img/hero/hero-sachi-vedant-184.webp",
  "img/hero/hero-sushmita-harsh-151.webp",
];

test("hero is an eight-image gallery of the studio's own photographs", async () => {
  const html = await read("index.html");
  assert.equal((html.match(/class="hero-slide(?: act)?"/g) ?? []).length, 8);
  assert.equal((html.match(/class="hero-dot(?: act)?"/g) ?? []).length, 8);

  // Every slide needs its own tagline for the typewriter line.
  assert.equal((html.match(/data-tagline="[^"]+"/g) ?? []).length, 8);

  // No stock imagery in the hero: every slide must be a local studio asset.
  const heroBlock = html.match(/<div class="hero-slides"[\s\S]*?<\/div>\s*<\/div>/)[0];
  assert.doesNotMatch(heroBlock, /unsplash\.com/);
  assert.equal((heroBlock.match(/img\/hero\/[a-z0-9-]+\.webp/g) ?? []).length, 8);
  for (const path of heroAssets) assert.ok(heroBlock.includes(path), `${path} missing from hero`);
  assert.match(
    html,
    /<h1>Love,<br><em>beautifully<\/em> remembered\.<\/h1>/,
  );
  // The hero carries an eyebrow, a headline, and two actions. The old
  // subheading only restated the eyebrow and covered the photograph.
  assert.doesNotMatch(html, /class="hero-sub"/);
  assert.match(html, /<p class="hero-eyebrow">Wedding photography &amp; films · Mumbai<\/p>/);
  assert.match(html, />Check availability<\/a>/);
  assert.match(html, />View stories<\/a>/);
  assert.doesNotMatch(html, /class="ring"|class="hero-marker"/);
  assert.match(html, /aria-label="Choose a hero photograph"/);
  assert.match(html, /aria-current="true"/);
});

test("new hero photographs are optimized WebP assets", async () => {
  for (const path of heroAssets) {
    const [buffer, info] = await Promise.all([
      read(path, null),
      stat(new URL(path, root)),
    ]);
    assert.equal(
      buffer.subarray(0, 4).toString("ascii"),
      "RIFF",
      `${path} is not RIFF`,
    );
    assert.equal(
      buffer.subarray(8, 12).toString("ascii"),
      "WEBP",
      `${path} is not WebP`,
    );
    assert.ok(info.size > 10_000, `${path} appears empty`);
    assert.ok(info.size < 800_000, `${path} is too large for the hero`);
  }
});

test("hero script supports dots, lazy loading, and mobile swipe", async () => {
  const script = await read("js/main.js");
  assert.match(script, /dataset\.bg/);
  assert.match(script, /aria-current/);
  assert.match(script, /hero-dot/);
  assert.match(script, /pointerdown/);
  assert.match(script, /pointerup/);
  assert.match(script, /Math\.abs\(deltaX\)\s*>=\s*48/);
  assert.match(script, /REDUCED/);
});
