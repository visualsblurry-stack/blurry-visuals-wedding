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

// sRGB relative luminance, WCAG 2.1
const luminance = ([r, g, b]) => {
  const lin = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};

const rgbOverWhite = ([r, g, b, a = 1]) =>
  [r, g, b].map((v) => Math.round(v * a + 255 * (1 - a)));

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("the custom cursor only replaces the native one over labelled targets", async () => {
  const [styles, mainScript] = await Promise.all([
    readProjectFile("css/style.css").then(stripComments),
    readProjectFile("js/main.js"),
  ]);

  // The native cursor must not be hidden globally: away from photographs,
  // films and links, the regular OS pointer should remain visible.
  assert.ok(
    !/(?:^|[;{@\s])body\s*\{[^}]*cursor\s*:\s*none/is.test(styles),
    "css must not hide the native cursor on a bare body selector",
  );
  assert.doesNotMatch(
    styles,
    /body\.cursor-custom\s*,[\s\S]{0,160}?cursor\s*:\s*none/i,
    "body.cursor-custom must not hide the native cursor across the whole page",
  );
  assert.match(
    styles,
    /body\.cursor-custom\s+\[data-cursor\]\s*,\s*body\.cursor-custom\s+\[data-cursor\] \*\s*\{[^}]*cursor\s*:\s*none/is,
    "the native cursor should be hidden only while hovering labelled targets",
  );
  assert.match(
    mainScript,
    /document\.body\.classList\.add\(\s*["']cursor-custom["']\s*\)/,
    "js/main.js must add cursor-custom only after building the cursor",
  );

  // Guarded to fine-pointer, non-reduced-motion visitors.
  assert.match(
    mainScript,
    /!REDUCED\s*&&\s*window\.matchMedia\(\s*["']\(hover: hover\) and \(pointer: fine\)["']\s*\)\.matches/,
    "the cursor must be gated on reduced motion and a fine pointer",
  );
});

test("the cursor ring swells and labels itself over data-cursor targets", async () => {
  const [styles, mainScript] = await Promise.all([
    readProjectFile("css/style.css").then(stripComments),
    readProjectFile("js/main.js"),
  ]);

  // Position and pointer-events are shared by the ring and the dot.
  const shared = declarationsFor(styles, ".cursor-ring,.cursor-dot");
  assert.match(
    shared,
    /(?:^|[;{])\s*position\s*:\s*fixed\s*(?:;|})/i,
    "the cursor layers must be fixed",
  );

  const rest = declarationsFor(styles, ".cursor-ring");
  assert.match(rest, /(?:^|[;{])\s*width\s*:\s*46px\s*(?:;|})/i);

  const grown = declarationsFor(styles, ".cursor-ring.grown");
  assert.match(grown, /(?:^|[;{])\s*width\s*:\s*66px\s*(?:;|})/i);
  assert.match(grown, /(?:^|[;{])\s*margin\s*:\s*-33px 0 0 -33px\s*(?:;|})/i);

  assert.doesNotMatch(
    mainScript,
    /mousemove[\s\S]{0,180}?ring\.classList\.add\(\s*["']on["']\s*\)/,
    "plain mouse movement must not show the custom cursor away from hover targets",
  );
  assert.match(
    mainScript,
    /mouseover[\s\S]{0,260}?ring\.classList\.add\(\s*["']on["'][\s\S]{0,80}?dot\.classList\.add\(\s*["']on["']\s*\)/,
    "the custom cursor should appear only after entering a labelled target",
  );
  assert.match(
    mainScript,
    /mouseout[\s\S]{0,260}?ring\.classList\.remove\(\s*["']on["'][\s\S]{0,80}?dot\.classList\.remove\(\s*["']on["']\s*\)/,
    "the custom cursor should hide after leaving a labelled target",
  );

  // The ring and dot must clear every other fixed layer on the site.
  const ringZ = Number(rest.match(/z-index\s*:\s*(\d+)/i)?.[1]);
  // Anchored to a rule boundary: a bare ".cursor-dot{" search would otherwise
  // land on the shared ".cursor-ring,.cursor-dot" block, which carries no
  // z-index at all.
  const dotBlock = styles.match(/(?:^|\})\s*\.cursor-dot\s*\{([^}]*)\}/s);
  assert.ok(dotBlock, ".cursor-dot needs a rule of its own");
  const dotZ = Number(dotBlock[1].match(/z-index\s*:\s*(\d+)/i)?.[1]);
  const modalZ = Number(
    declarationsFor(styles, ".investment-modal").match(/z-index\s*:\s*(\d+)/i)?.[1],
  );
  assert.ok(
    ringZ > modalZ && dotZ > modalZ,
    `cursor layers (${ringZ}/${dotZ}) must sit above the investment modal (${modalZ})`,
  );

  // Pointer events must never be swallowed by the cursor itself.
  for (const sel of [".cursor-ring,.cursor-dot"]) {
    assert.match(
      declarationsFor(styles, sel),
      /pointer-events\s*:\s*none/i,
      `${sel} must not intercept clicks`,
    );
  }
});

test("the cursor label meets AA contrast on the grown disc", async () => {
  const styles = stripComments(await readProjectFile("css/style.css"));

  const grown = declarationsFor(styles, ".cursor-ring.grown");
  const bgRgba = grown.match(
    /background\s*:\s*rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/i,
  );
  assert.ok(bgRgba, ".cursor-ring.grown must use the tested translucent fill");

  const label = declarationsFor(styles, ".cursor-label");
  const fgVar = label.match(/color\s*:\s*var\(\s*(--[\w-]+)\s*\)/i)?.[1];
  assert.ok(fgVar, ".cursor-label must colour from a palette variable");

  const valueOf = (name) => {
    const v = styles.match(
      new RegExp(`${name}\\s*:\\s*(#[0-9a-f]{3,8})\\s*;`, "i"),
    )?.[1];
    assert.ok(v, `${name} must resolve to a hex colour`);
    return hexToRgb(v);
  };

  const bg = rgbOverWhite([
    Number(bgRgba[1]),
    Number(bgRgba[2]),
    Number(bgRgba[3]),
    Number(bgRgba[4]),
  ]);
  const ratio = contrast(bg, valueOf(fgVar));
  assert.ok(
    ratio >= 4.5,
    `the 10px cursor label needs 4.5:1; ${fgVar} on the cursor fill is ${ratio.toFixed(2)}:1`,
  );
});

test("hover targets are delegated so rendered cards are covered", async () => {
  const mainScript = await readProjectFile("js/main.js");

  assert.match(
    mainScript,
    /document\.addEventListener\(\s*["']mouseover["']/,
    "hover must be delegated from the document, not bound per element",
  );
  assert.ok(
    !/querySelectorAll\(\s*["']\[data-cursor\]["']\s*\)/.test(mainScript),
    "binding [data-cursor] once at load would miss the cards rendered later",
  );
  assert.match(
    mainScript,
    /target\.contains\(\s*e\.relatedTarget\s*\)/,
    "moving between a target's own children must not collapse the ring",
  );

  // The cards and story pages built from data must carry their labels. The
  // markup is assembled by concatenation, so quotes fall between the two.
  assert.match(
    mainScript,
    /class="story-card rv"[\s\S]{0,120}?data-cursor="View story"/,
    "the rendered story cards must carry a hover label",
  );
  assert.match(
    mainScript,
    /class="story-close-next"[\s\S]{0,160}?data-cursor="Next story"/,
    "the next-story panel must carry a hover label",
  );
});

test("the static pages label their own hover targets", async () => {
  const [indexHtml, storyHtml] = await Promise.all([
    readProjectFile("index.html"),
    readProjectFile("story.html"),
  ]);

  const labels = (html) =>
    [...html.matchAll(/data-cursor\s*=\s*(["'])(.*?)\1/g)].map((m) => m[2]);

  const indexLabels = labels(indexHtml);
  for (const expected of ["Enquire", "Watch", "WhatsApp", "Send"]) {
    assert.ok(
      indexLabels.includes(expected),
      `index.html is missing a "${expected}" hover label`,
    );
  }
  assert.equal(
    indexLabels.filter((l) => l === "Watch").length,
    4,
    "every film tile must announce Watch",
  );

  const storyLabels = labels(storyHtml);
  for (const expected of ["Home", "Weddings", "Close", "Previous", "Next"]) {
    assert.ok(
      storyLabels.includes(expected),
      `story.html is missing a "${expected}" hover label`,
    );
  }

  // Labels stay short enough to sit inside the 66px disc without awkward wraps.
  for (const label of indexLabels.concat(labels(storyHtml))) {
    assert.ok(
      label.length <= 12,
      `"${label}" is too long for the cursor disc`,
    );
  }
});

test("the films section uses the studio YouTube links", async () => {
  const indexHtml = await readProjectFile("index.html");
  const filmSection = indexHtml.match(/<section class="sec" id="films">([\s\S]*?)<\/section>/)?.[1] || "";
  const expected = [
    "dEK0R24OtOY",
    "HifM4Hz1Dkk",
    "oHgVZTg8r-w",
    "JmFURAqSwHg",
  ];

  assert.ok(filmSection, "index.html is missing the films section");
  const cards = [...filmSection.matchAll(/<a class="film rv"[\s\S]*?<\/a>/g)].map((match) => match[0]);
  assert.equal(cards.length, 4, "the films section should keep four video cards");

  expected.forEach((id, index) => {
    const card = cards[index];
    assert.ok(card.includes(`watch?v=${id}`), `film card ${index + 1} is missing YouTube id ${id}`);
    assert.ok(card.includes(`img.youtube.com/vi/${id}/hqdefault.jpg`), `film card ${index + 1} is missing its poster`);
    assert.ok(card.includes('data-cursor="Watch"'), `film card ${index + 1} must keep the Watch hover label`);
  });

  for (const oldId of ["a9uRfuujFY8", "UpZI5dOFGM0", "64VrMb17-zc", "Pm3NfZDC48k"]) {
    assert.ok(!filmSection.includes(oldId), `dummy YouTube id ${oldId} should not remain`);
  }
});
