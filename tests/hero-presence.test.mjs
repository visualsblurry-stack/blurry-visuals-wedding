import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const readProjectFile = (path) => readFile(new URL(path, projectRoot), "utf8");
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

const declarationsFor = (styles, selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = styles.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "s"));
  assert.ok(block, `${selector} style block is missing`);
  return block[1];
};

test("the live photograph drifts, and holds still under reduced motion", async () => {
  const styles = stripComments(await readProjectFile("css/style.css"));

  const act = declarationsFor(styles, ".hero-slide.act");
  assert.match(act, /animation\s*:\s*heroDrift/i, "the active slide must drift");
  assert.match(
    act,
    /animation\s*:\s*heroDrift\s+\d+s[^;]*\bforwards\b/i,
    "the drift must hold its end frame rather than snapping back",
  );

  const frames = styles.match(/@keyframes heroDrift\s*\{([^}]*\}[^}]*)\}/s);
  assert.ok(frames, "@keyframes heroDrift is missing");
  const scales = [...frames[1].matchAll(/scale\(([\d.]+)\)/g)].map((m) => Number(m[1]));
  assert.equal(scales.length, 2, "the drift needs a start and an end");
  assert.ok(
    scales.every((s) => s >= 1),
    `scaling below 1 would uncover the frame: ${scales.join(" → ")}`,
  );
  assert.ok(scales[1] > scales[0], "the drift must widen, not shrink");
  assert.ok(
    scales[1] - scales[0] <= 0.15,
    "a drift this large reads as a zoom, not a held shot",
  );

  // The blanket reduced-motion override would otherwise snap it to the end.
  const reduce = styles.match(
    /@media \(prefers-reduced-motion:reduce\)\s*\{([\s\S]*?)\n\}/,
  );
  assert.ok(reduce, "the reduced-motion block is missing");
  assert.match(
    reduce[1],
    /\.hero-slide\.act\s*\{[^}]*animation\s*:\s*none/is,
    "reduced motion must stop the drift outright",
  );
});

test("the preview strip is a shortcut, never the only way through", async () => {
  const [indexHtml, mainScript, styles] = await Promise.all([
    readProjectFile("index.html"),
    readProjectFile("js/main.js"),
    readProjectFile("css/style.css").then(stripComments),
  ]);

  const strip = indexHtml.match(/<div class="hero-thumbs"[^>]*>/);
  assert.ok(strip, "index.html is missing the preview strip");
  assert.match(
    strip[0],
    /aria-hidden\s*=\s*"true"/,
    "the strip duplicates the dots and must not announce them twice",
  );

  // Hidden from assistive tech means nothing inside may take focus.
  assert.match(
    mainScript,
    /thumb\.tabIndex = -1;/,
    "an aria-hidden strip must contain nothing focusable",
  );

  // Every photograph stays reachable from the dots regardless.
  const dots = [...indexHtml.matchAll(/class="hero-dot[^"]*"[^>]*data-slide="(\d+)"/g)];
  // Anchored so the .hero-slides container is not counted as a slide.
  const slides = [...indexHtml.matchAll(/class="hero-slide(?:\s[^"]*)?"/g)];
  assert.equal(
    dots.length,
    slides.length,
    "the dots must reach every slide, since the strip cannot be focused",
  );

  // Built after load: populating it fetches images the slideshow has not
  // needed yet, and the first slide is the largest paint on the page.
  assert.match(
    mainScript,
    /addEventListener\("load", buildHeroThumbs, \{ once: true \}\)/,
    "the strip must be built after load, not during it",
  );
  assert.match(
    mainScript,
    /document\.readyState === "complete"/,
    "a page that has already loaded must still build the strip",
  );

  // It retargets as the slideshow moves.
  assert.match(mainScript, /updateHeroThumbs\(\);/, "the strip must follow the slideshow");
  assert.match(
    mainScript,
    /\(slideIndex \+ offset \+ 1\) % slides\.length/,
    "the strip must preview what is coming, not what is showing",
  );

  // No previews on a phone; there is no room beside the copy.
  assert.match(
    styles,
    /@media \(max-width:640px\)\s*\{[\s\S]*?\.hero-thumbs\s*\{[^}]*display\s*:\s*none/s,
    "the strip must be dropped on narrow screens",
  );
});

test("the proof bar is flagged as unverified and clears the copy", async () => {
  const [indexHtml, styles, mainScript] = await Promise.all([
    readProjectFile("index.html"),
    readProjectFile("css/style.css").then(stripComments),
    readProjectFile("js/main.js"),
  ]);

  const bar = indexHtml.match(/<dl class="hero-proof">([\s\S]*?)<\/dl>/);
  assert.ok(bar, "index.html is missing the proof bar");

  const figures = [...bar[1].matchAll(/<dt([^>]*)>([^<]+)<\/dt>\s*<dd>([^<]+)<\/dd>/g)];
  assert.ok(figures.length >= 3, "the proof bar needs at least three figures");
  for (const [, attrs, value, label] of figures) {
    assert.match(
      attrs,
      /\bdata-placeholder\b/,
      `"${value} ${label}" is an unverified claim and must be flagged`,
    );
  }

  // And the block has to say so in plain words for whoever ships this.
  assert.match(
    indexHtml,
    /PLACEHOLDER FIGURES[\s\S]{0,200}?Replace all three before launch/i,
    "the placeholder figures must carry a visible warning in the source",
  );

  // The bar is measured, not guessed, so wrapped rows never cover the copy.
  assert.match(
    mainScript,
    /hero\.style\.setProperty\("--hero-foot-h"/,
    "the bar's height must be measured into a custom property",
  );
  assert.match(
    declarationsFor(styles, ".hero-in"),
    /padding\s*:[^;]*var\(--hero-foot-h/,
    "the copy must clear the measured bar height",
  );
  assert.match(
    mainScript,
    /addEventListener\("resize", measureHeroFoot/,
    "the measurement must be refreshed when the bar rewraps",
  );
});
