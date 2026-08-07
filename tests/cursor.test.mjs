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

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("the custom cursor only replaces the native one once it exists", async () => {
  const [styles, mainScript] = await Promise.all([
    readProjectFile("css/style.css").then(stripComments),
    readProjectFile("js/main.js"),
  ]);

  // The native cursor must be hidden by a class, never by a bare media query:
  // a visitor who never gets the replacement must keep their pointer.
  assert.ok(
    !/(?:^|[;{@\s])body\s*\{[^}]*cursor\s*:\s*none/is.test(styles),
    "css must not hide the native cursor on a bare body selector",
  );
  assert.match(
    styles,
    /body\.cursor-custom[^{]*\{[^}]*cursor\s*:\s*none/is,
    "the native cursor must only be hidden under body.cursor-custom",
  );
  assert.match(
    mainScript,
    /document\.body\.classList\.add\(\s*["']cursor-custom["']\s*\)/,
    "js/main.js must add cursor-custom only after building the cursor",
  );

  // Text fields keep a usable insertion point.
  assert.match(
    styles,
    /body\.cursor-custom\s+input\s*,\s*body\.cursor-custom\s+textarea\s*\{[^}]*cursor\s*:\s*auto/is,
    "text fields must keep a usable cursor",
  );

  // Guarded to fine-pointer, non-reduced-motion visitors.
  assert.match(
    mainScript,
    /!REDUCED\s*&&\s*window\.matchMedia\(\s*["']\(hover: hover\) and \(pointer: fine\)["']\s*\)\.matches/,
    "the cursor must be gated on reduced motion and a fine pointer",
  );
});

test("the cursor ring swells and labels itself over data-cursor targets", async () => {
  const styles = stripComments(await readProjectFile("css/style.css"));

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
  assert.match(grown, /(?:^|[;{])\s*width\s*:\s*92px\s*(?:;|})/i);
  assert.match(grown, /(?:^|[;{])\s*margin\s*:\s*-46px 0 0 -46px\s*(?:;|})/i);

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
  const bgVar = grown.match(/background\s*:\s*var\(\s*(--[\w-]+)\s*\)/i)?.[1];
  assert.ok(bgVar, ".cursor-ring.grown must fill from a palette variable");

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

  const ratio = contrast(valueOf(bgVar), valueOf(fgVar));
  assert.ok(
    ratio >= 4.5,
    `the 9px cursor label needs 4.5:1; ${fgVar} on ${bgVar} is ${ratio.toFixed(2)}:1`,
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
  for (const expected of ["Enquire", "See work", "Watch", "WhatsApp", "Send"]) {
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

  // Labels stay short enough to sit inside the 92px disc without wrapping.
  for (const label of indexLabels.concat(labels(storyHtml))) {
    assert.ok(
      label.length <= 12,
      `"${label}" is too long for the cursor disc`,
    );
  }
});
