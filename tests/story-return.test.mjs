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

test("story pages carry a floating way back out of the gallery", async () => {
  const storyHtml = await readProjectFile("story.html");

  const nav = storyHtml.match(
    /<nav\b[^>]*\bid\s*=\s*(["'])story-return\1[^>]*>([\s\S]*?)<\/nav>/i,
  );
  assert.ok(nav, "story.html is missing the #story-return control");

  const openingTag = nav[0].match(/<nav\b[^>]*>/i)[0];
  const classTokens =
    openingTag.match(/\sclass\s*=\s*(["'])(.*?)\1/i)?.[2].trim().split(/\s+/) ??
    [];
  assert.ok(
    classTokens.includes("story-return"),
    "#story-return must carry the story-return class",
  );
  assert.ok(
    /\saria-label\s*=\s*(["']).+?\1/i.test(openingTag),
    "#story-return must be a labelled landmark",
  );

  const links = [...nav[2].matchAll(/<a\b[^>]*\shref\s*=\s*(["'])(.*?)\1/gi)].map(
    (match) => match[2],
  );
  assert.deepEqual(
    links,
    ["index.html", "index.html#stories"],
    "#story-return must offer the homepage and the weddings listing, in that order",
  );

  // The index page has its own navigation; the floating control is story-only.
  const indexHtml = await readProjectFile("index.html");
  assert.ok(
    !/id\s*=\s*(["'])story-return\1/i.test(indexHtml),
    "index.html must not carry the story-only return control",
  );
});

test("the floating return control is fixed, hidden by default, and tappable", async () => {
  const styles = stripComments(await readProjectFile("css/style.css"));

  const base = declarationsFor(styles, ".story-return");
  assert.match(
    base,
    /(?:^|[;{])\s*position\s*:\s*fixed\s*(?:;|})/i,
    ".story-return must be fixed so it survives scrolling",
  );
  assert.match(
    base,
    /(?:^|[;{])\s*opacity\s*:\s*0\s*(?:;|})/i,
    ".story-return must start hidden",
  );
  assert.match(
    base,
    /(?:^|[;{])\s*visibility\s*:\s*hidden\s*(?:;|})/i,
    ".story-return must start unfocusable",
  );

  const zIndex = Number(base.match(/(?:^|[;{])\s*z-index\s*:\s*(\d+)/i)?.[1]);
  const drawerZ = Number(
    declarationsFor(styles, ".drawer").match(
      /(?:^|[;{])\s*z-index\s*:\s*(\d+)/i,
    )?.[1],
  );
  assert.ok(
    Number.isFinite(zIndex) && Number.isFinite(drawerZ) && zIndex < drawerZ,
    `.story-return (z-index ${zIndex}) must sit below the drawer (z-index ${drawerZ})`,
  );

  const shown = declarationsFor(styles, ".story-return.in");
  assert.match(shown, /(?:^|[;{])\s*opacity\s*:\s*1\s*(?:;|})/i);
  assert.match(shown, /(?:^|[;{])\s*visibility\s*:\s*visible\s*(?:;|})/i);

  assert.ok(
    /body\.menu-open\s+\.story-return\s*\{[^}]*visibility\s*:\s*hidden/is.test(
      styles,
    ),
    "an open drawer must hide the floating return control",
  );

  const link = declarationsFor(styles, ".story-return-link");
  assert.match(
    link,
    /(?:^|[;{])\s*min-height\s*:\s*44px\s*(?:;|})/i,
    ".story-return-link must meet the 44px minimum tap target",
  );
  assert.match(
    link,
    /background\s*:\s*var\(--teal-deep\)\s*;/i,
    ".story-return-link must use the AA-contrast teal",
  );
  assert.match(
    link,
    /color\s*:\s*var\(--white\)\s*;/i,
    ".story-return-link must use white labels",
  );
});

test("the return control appears past the breadcrumb and yields to the footer", async () => {
  const mainScript = await readProjectFile("js/main.js");

  assert.match(
    mainScript,
    /document\.getElementById\(\s*["']story-return["']\s*\)/,
    "js/main.js must look up the floating return control",
  );
  assert.match(
    mainScript,
    /document\.querySelector\(\s*["']\.story-crumbs["']\s*\)/,
    "js/main.js must measure against the hero breadcrumb",
  );
  assert.match(
    mainScript,
    /document\.querySelector\(\s*["']\.ftr["']\s*\)/,
    "js/main.js must measure against the footer",
  );

  const toggle = mainScript.match(
    /storyReturn\.classList\.toggle\(\s*["']in["']\s*,([^)]*)\)/,
  );
  assert.ok(toggle, "js/main.js must toggle the in class on the return control");
  assert.match(
    toggle[1],
    />\s*returnAt/,
    "the control must only appear once the breadcrumb has scrolled past",
  );
  assert.match(
    toggle[1],
    /innerHeight\s*<\s*returnUntil/,
    "the control must retire once the footer enters the viewport",
  );

  // Scroll drives the toggle, matching the header. IntersectionObserver would
  // be silent in a tab that never composites a frame.
  assert.match(
    mainScript,
    /addEventListener\(\s*["']scroll["']\s*,\s*onReturnScroll\s*,\s*\{\s*passive:\s*true\s*\}\s*\)/,
    "the scroll listener must be registered passively",
  );
  assert.match(
    mainScript,
    /addEventListener\(\s*["']resize["']/,
    "the measurements must be refreshed on resize",
  );
});

test("story pages ship the current cache-busting stamp", async () => {
  const currentStamp = "20260907a";
  const [indexHtml, storyHtml] = await Promise.all([
    readProjectFile("index.html"),
    readProjectFile("story.html"),
  ]);

  const stamps = new Set(
    [indexHtml, storyHtml].flatMap((html) =>
      [...html.matchAll(/(?:css\/style\.css|js\/[\w-]+\.js)\?v=([\w.-]+)/g)].map(
        (match) => match[1],
      ),
    ),
  );

  assert.equal(
    stamps.size,
    1,
    `index.html and story.html must share one ?v= stamp, found: ${[...stamps].join(", ")}`,
  );
  assert.equal(
    [...stamps][0],
    currentStamp,
    `asset cache-busting stamp must be ${currentStamp}`,
  );
});
