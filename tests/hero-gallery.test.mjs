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
];

test("hero is a concise nine-image gallery", async () => {
  const html = await read("index.html");
  assert.equal((html.match(/class="hero-slide(?: act)?"/g) ?? []).length, 9);
  assert.equal((html.match(/class="hero-dot(?: act)?"/g) ?? []).length, 9);
  assert.match(
    html,
    /<h1>Love,<br><em>beautifully<\/em> remembered\.<\/h1>/,
  );
  assert.match(
    html,
    /Honest photographs and cinematic films, wherever your story takes us\./,
  );
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
