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

// index.html keeps the portfolio grid inside an HTML comment. Anything that
// asks "does the visitor see this?" has to look at the live markup only.
const liveMarkup = (html) => html.replace(/<!--[\s\S]*?-->/g, "");

test("both pages ship the photograph viewer", async () => {
  const [indexHtml, storyHtml] = await Promise.all([
    readProjectFile("index.html"),
    readProjectFile("story.html"),
  ]);

  for (const [name, html] of [["index.html", indexHtml], ["story.html", storyHtml]]) {
    const live = liveMarkup(html);
    // The viewer holds no nested div, so the first closing tag is its own.
    const box = live.match(/<div class="photobox"[^>]*>[\s\S]*?<\/div>/);
    assert.ok(box, `${name} is missing a live photobox`);

    const opening = box[0].match(/<div class="photobox"[^>]*>/)[0];
    assert.match(opening, /\shidden\b/, `${name} photobox must start hidden`);
    assert.match(opening, /role\s*=\s*"dialog"/, `${name} photobox must be a dialog`);
    assert.match(opening, /aria-modal\s*=\s*"true"/, `${name} photobox must be modal`);

    for (const cls of ["photobox-close", "photobox-step prev", "photobox-step next", "photobox-img"]) {
      assert.ok(box[0].includes(cls), `${name} photobox is missing .${cls}`);
    }
    assert.ok(
      box[0].includes("data-photobox-count") && box[0].includes("data-photobox-label"),
      `${name} photobox must show a counter and a caption`,
    );
  }
});

test("expandable photographs are buttons, not decorative divs", async () => {
  const [indexHtml, mainScript] = await Promise.all([
    readProjectFile("index.html"),
    readProjectFile("js/main.js"),
  ]);

  // A click target has to be reachable by keyboard.
  const tiles = [...indexHtml.matchAll(/<(\w+)[^>]*\sdata-expand\b[^>]*>/g)];
  assert.ok(tiles.length > 0, "index.html declares no expandable photographs");
  for (const [tag, name] of tiles.map((m) => [m[0], m[1]])) {
    assert.equal(name, "button", `an expandable photograph is a <${name}>, not a button`);
    assert.match(tag, /data-cursor="Expand"/, "an expandable photograph is missing its hover label");
    assert.match(tag, /data-caption="[^"]+"/, "an expandable photograph is missing its caption");
    assert.match(tag, /aria-label="Expand photograph: [^"]+"/, "an expandable photograph is unlabelled");
  }

  // The story gallery is rendered from data and must follow the same shape.
  assert.match(
    mainScript,
    /'<button class="ph ph-img'[\s\S]{0,400}?data-expand data-cursor="Expand"/,
    "js/main.js must render gallery photographs as expandable buttons",
  );
  assert.ok(
    !/<figure class="ph ph-img'/.test(mainScript),
    "the old non-interactive figure markup must be gone",
  );
});

test("the viewer steps, wraps, and closes", async () => {
  const mainScript = await readProjectFile("js/main.js");

  // Wrapping arithmetic in both directions.
  assert.match(
    mainScript,
    /pbIndex\s*=\s*\(i \+ pbSet\.length\)\s*%\s*pbSet\.length/,
    "stepping must wrap in both directions",
  );

  // Keyboard: escape and both arrows.
  for (const key of ["Escape", "ArrowLeft", "ArrowRight"]) {
    assert.ok(
      new RegExp(`e\\.key === "${key}"`).test(mainScript),
      `the viewer must handle ${key}`,
    );
  }

  // Backdrop closes, the photograph itself does not.
  assert.match(
    mainScript,
    /photobox\.addEventListener\("click", function \(e\) \{\s*if \(e\.target === photobox\) closePhotobox\(\);/,
    "only a click on the backdrop itself may close the viewer",
  );

  // Focus goes to the close button and comes back to the tile.
  assert.match(mainScript, /pbClose\.focus\(\)/, "opening must move focus into the dialog");
  assert.match(
    mainScript,
    /pbLastFocus = el;/,
    "closing must return focus to the photograph that was opened",
  );

  // Scroll lock, and the source is dropped so a closed viewer holds no image.
  assert.match(mainScript, /classList\.add\("photobox-open"\)/);
  assert.match(mainScript, /classList\.remove\("photobox-open"\)/);
  assert.match(mainScript, /pbImg\.removeAttribute\("src"\)/);

  // Hidden tiles must not appear in the set the visitor steps through.
  assert.match(
    mainScript,
    /n\.offsetParent !== null/,
    "filtered-out tiles must be excluded from the viewer's set",
  );
});

test("the viewer asks the CDN for a bigger file than the tile did", async () => {
  const mainScript = await readProjectFile("js/main.js");

  const fn = mainScript.match(/function fullSize\(url\) \{([\s\S]*?)\n    \}/);
  assert.ok(fn, "js/main.js is missing the fullSize helper");

  // Reproduce the helper's substitutions against a real tile URL.
  const sample =
    "https://images.unsplash.com/photo-1587271636175-90d58cdad458?auto=format&fit=crop&w=900&q=70";
  const upgraded = sample
    .replace(/([?&]w=)\d+/, "$12000")
    .replace(/([?&]q=)\d+/, "$180");
  assert.equal(
    upgraded,
    "https://images.unsplash.com/photo-1587271636175-90d58cdad458?auto=format&fit=crop&w=2000&q=80",
  );
  assert.ok(
    fn[1].includes('"$12000"') && fn[1].includes('"$180"'),
    "fullSize must raise both the width and the quality",
  );
});

test("photobox styling keeps the picture whole and above the page", async () => {
  const styles = stripComments(await readProjectFile("css/style.css"));

  const box = declarationsFor(styles, ".photobox");
  assert.match(box, /(?:^|[;{])\s*position\s*:\s*fixed\s*(?:;|})/i);
  const boxZ = Number(box.match(/z-index\s*:\s*(\d+)/i)?.[1]);
  const cursorZ = Number(
    declarationsFor(styles, ".cursor-ring").match(/z-index\s*:\s*(\d+)/i)?.[1],
  );
  assert.ok(
    boxZ > 50 && boxZ < cursorZ,
    `the viewer (${boxZ}) must clear the header but stay under the cursor (${cursorZ})`,
  );

  const img = declarationsFor(styles, ".photobox-img");
  assert.match(
    img,
    /object-fit\s*:\s*contain/i,
    "the photograph must never be cropped",
  );
  assert.match(img, /max-height\s*:\s*100%/i);
  assert.match(img, /max-width\s*:\s*100%/i);

  // The hidden attribute has to win against the display rules.
  assert.match(styles, /\.photobox\[hidden\]\s*\{[^}]*display\s*:\s*none/is);
  assert.match(styles, /\.photobox-step\[hidden\]\s*\{[^}]*display\s*:\s*none/is);

  // A button standing in for a photo tile needs its chrome removed.
  const phButton = declarationsFor(styles, "button.ph");
  assert.match(phButton, /padding\s*:\s*0/i);
  assert.match(phButton, /width\s*:\s*100%/i);
});
