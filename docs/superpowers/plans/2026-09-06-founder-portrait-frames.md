# Founder Portrait Frames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage About section's generic wedding image with the approved side-by-side portraits of Akash and Gautam, while correcting Akash's name everywhere it is visible.

**Architecture:** Keep the existing About section and copy structure. Add two semantic founder figures in the existing media column, generate one optimized WebP per supplied portrait, and isolate all visual behavior in founder-specific CSS with the site's existing responsive breakpoints.

**Tech Stack:** Static HTML, CSS, Python 3 with Pillow for image optimization, Node.js built-in test runner

---

### Task 1: Optimized Founder Assets

**Files:**
- Create: `tests/about-founders.test.mjs`
- Create: `tools/build-founder-images.py`
- Create: `img/founders/akash.webp`
- Create: `img/founders/gautam.webp`

- [ ] **Step 1: Write the failing asset test**

Create `tests/about-founders.test.mjs` with:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);

test("optimized founder portraits are shipped as compact WebP files", async () => {
  const portraits = [
    "img/founders/akash.webp",
    "img/founders/gautam.webp",
  ];

  for (const path of portraits) {
    const url = new URL(path, projectRoot);
    const [stats, bytes] = await Promise.all([stat(url), readFile(url)]);

    assert.ok(stats.size > 10 * 1024, path + " must contain a real portrait");
    assert.ok(stats.size < 300 * 1024, path + " must remain below 300 KB");
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF");
    assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP");
  }
});
```

- [ ] **Step 2: Run the asset test to verify it fails**

Run: `node --test tests/about-founders.test.mjs`

Expected: FAIL with `ENOENT` for `img/founders/akash.webp`.

- [ ] **Step 3: Add the deterministic image builder**

Create `tools/build-founder-images.py` with:

```python
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path(r"D:\BlurryVisuals-Wedding-publish\img")
OUTPUT_ROOT = ROOT / "img" / "founders"
MAX_EDGE = 1600
QUALITY = 84
SOURCES = {
    "akash.webp": SOURCE_ROOT / "Akash.jpeg",
    "gautam.webp": SOURCE_ROOT / "Gautam.jpg",
}


def save_webp(source, destination):
    if not source.exists():
        raise FileNotFoundError(source)

    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        longest = max(image.size)
        if longest > MAX_EDGE:
            scale = MAX_EDGE / longest
            output_size = (
                round(image.width * scale),
                round(image.height * scale),
            )
            image = image.resize(output_size, Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=QUALITY, method=6)


def main():
    for filename, source in SOURCES.items():
        destination = OUTPUT_ROOT / filename
        save_webp(source, destination)
        print(filename + ": optimized from " + source.name)


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Generate the WebP assets**

Run: `python tools/build-founder-images.py`

Expected:

```text
akash.webp: optimized from Akash.jpeg
gautam.webp: optimized from Gautam.jpg
```

- [ ] **Step 5: Run the focused asset test**

Run: `node --test tests/about-founders.test.mjs`

Expected: PASS, 1 test passed and 0 failed.

- [ ] **Step 6: Commit the asset pipeline**

```powershell
git add tests/about-founders.test.mjs tools/build-founder-images.py img/founders/akash.webp img/founders/gautam.webp
git commit -m "feat: add optimized founder portraits"
```

---

### Task 2: Semantic Founder Markup And Name Correction

**Files:**
- Modify: `tests/about-founders.test.mjs`
- Modify: `index.html:259-274`
- Modify: `index.html:326`

- [ ] **Step 1: Write the failing About-section test**

Append this helper and test to `tests/about-founders.test.mjs`:

```js
const readProjectFile = (path) =>
  readFile(new URL(path, projectRoot), "utf8");

test("the About section presents Akash and Gautam in accessible portrait frames", async () => {
  const html = await readProjectFile("index.html");
  const about = html.match(
    /<section class="sec" id="about">([\s\S]*?)<\/section>/i,
  )?.[1];

  assert.ok(about, "index.html is missing the About section");
  assert.ok(
    about.indexOf("founder-portrait-akash") <
      about.indexOf("founder-portrait-gautam"),
    "Akash must appear before Gautam to match the biography order",
  );

  const images = about.match(/<img\b[^>]*>/gi) ?? [];
  const expected = [
    {
      src: "img/founders/akash.webp",
      alt: "Akash, co-founder of Blurry Visuals",
      width: "1023",
      height: "1537",
      label: "Akash",
    },
    {
      src: "img/founders/gautam.webp",
      alt: "Gautam, co-founder of Blurry Visuals",
      width: "651",
      height: "1112",
      label: "Gautam",
    },
  ];

  for (const founder of expected) {
    const image = images.find((tag) =>
      tag.includes('src="' + founder.src + '"'),
    );
    assert.ok(image, "missing portrait " + founder.src);
    assert.ok(image.includes('alt="' + founder.alt + '"'));
    assert.ok(image.includes('width="' + founder.width + '"'));
    assert.ok(image.includes('height="' + founder.height + '"'));
    assert.ok(image.includes('loading="lazy"'));
    assert.ok(image.includes('decoding="async"'));
    assert.ok(
      about.includes("<figcaption>" + founder.label + "</figcaption>"),
      "missing visible label for " + founder.label,
    );
  }

  assert.doesNotMatch(html, /\bAakash\b/, "the old spelling must not remain");
  assert.match(html, /Akash · WhatsApp/);
});
```

- [ ] **Step 2: Run the markup test to verify it fails**

Run: `node --test tests/about-founders.test.mjs`

Expected: FAIL because the About section still contains the wedding photograph and the old `Aakash` spelling.

- [ ] **Step 3: Replace the About media with the approved twin frames**

In `index.html`, replace the existing wedding-photo `<figure>` immediately inside `.about-grid` with:

```html
<div class="founder-portraits rv">
  <figure class="founder-portrait founder-portrait-akash">
    <div class="founder-frame">
      <img src="img/founders/akash.webp" alt="Akash, co-founder of Blurry Visuals" width="1023" height="1537" loading="lazy" decoding="async">
    </div>
    <figcaption>Akash</figcaption>
  </figure>
  <figure class="founder-portrait founder-portrait-gautam">
    <div class="founder-frame">
      <img src="img/founders/gautam.webp" alt="Gautam, co-founder of Blurry Visuals" width="651" height="1112" loading="lazy" decoding="async">
    </div>
    <figcaption>Gautam</figcaption>
  </figure>
</div>
```

- [ ] **Step 4: Correct Akash's visible name**

In `index.html`, make these exact replacements:

```text
Aakash and Gautam's  ->  Akash and Gautam's
<b>Aakash</b>        ->  <b>Akash</b>
Aakash · WhatsApp    ->  Akash · WhatsApp
```

Do not change phone numbers, biographies, About facts, or other copy.

- [ ] **Step 5: Run the focused test**

Run: `node --test tests/about-founders.test.mjs`

Expected: PASS, 2 tests passed and 0 failed.

- [ ] **Step 6: Commit the semantic markup**

```powershell
git add index.html tests/about-founders.test.mjs
git commit -m "feat: present founders in the About section"
```

---

### Task 3: Approved Option A Frame Styling

**Files:**
- Modify: `tests/about-founders.test.mjs`
- Modify: `css/style.css:360-376`
- Modify: `css/style.css:979-1017`

- [ ] **Step 1: Write the failing founder-frame CSS test**

Append this test to `tests/about-founders.test.mjs`:

```js
test("founder portraits use the approved responsive twin-frame treatment", async () => {
  const styles = (await readProjectFile("css/style.css")).replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  const declarationsFor = (selector) => {
    const escaped = selector.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
    const block = styles.match(
      new RegExp(escaped + "\\s*\\{([^}]*)\\}", "s"),
    );
    assert.ok(block, selector + " style block is missing");
    return block[1];
  };

  const pair = declarationsFor(".founder-portraits");
  assert.match(
    pair,
    /grid-template-columns\s*:\s*repeat\(2,minmax\(0,1fr\)\)/i,
  );
  assert.match(pair, /max-width\s*:\s*620px/i);

  const frame = declarationsFor(".founder-frame");
  assert.match(frame, /aspect-ratio\s*:\s*2\/3/i);
  assert.match(frame, /border\s*:\s*2px\s+solid\s+var\(--teal\)/i);
  assert.match(
    frame,
    /box-shadow\s*:\s*6px\s+6px\s+0\s+var\(--teal-deep\)/i,
  );

  const image = declarationsFor(".founder-frame img");
  assert.match(image, /object-fit\s*:\s*cover/i);
  assert.match(
    declarationsFor(".founder-portrait-akash img"),
    /object-position\s*:\s*center\s+42%/i,
  );
  assert.match(
    declarationsFor(".founder-portrait-gautam img"),
    /object-position\s*:\s*center\s+25%/i,
  );

  assert.match(
    styles,
    /@media\s*\(max-width:640px\)\s*\{[\s\S]*?\.founder-portraits\s*\{[^}]*grid-template-columns\s*:\s*1fr/is,
    "founder portraits must stack at the existing phone breakpoint",
  );
});
```

- [ ] **Step 2: Run the CSS test to verify it fails**

Run: `node --test tests/about-founders.test.mjs`

Expected: FAIL because the founder-specific style blocks do not exist.

- [ ] **Step 3: Add the desktop and tablet frame styles**

Replace the obsolete `.about-grid .ph` rule and add these declarations next to `.about-grid` in `css/style.css`:

```css
.about-grid{display:grid;grid-template-columns:0.85fr 1fr;gap:64px;align-items:center;}
.founder-portraits{
  display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;
  width:100%;max-width:620px;align-items:start;
}
.founder-portrait{min-width:0;margin:0;}
.founder-frame{
  overflow:hidden;aspect-ratio:2/3;border:2px solid var(--teal);
  background:rgba(120,156,159,.12);box-shadow:6px 6px 0 var(--teal-deep);
}
.founder-frame img{width:100%;height:100%;object-fit:cover;}
.founder-portrait-akash img{object-position:center 42%;}
.founder-portrait-gautam img{object-position:center 25%;}
.founder-portrait figcaption{
  margin-top:13px;font-size:10px;font-weight:700;letter-spacing:.18em;
  text-transform:uppercase;color:var(--ivory);
}
```

- [ ] **Step 4: Add narrow-phone stacking**

Inside the existing main `@media (max-width:640px)` block, add:

```css
.founder-portraits{grid-template-columns:1fr;max-width:320px;gap:28px;}
```

The existing `@media (max-width:960px)` About rule remains unchanged: it already stacks the media and copy columns while leaving enough width for the two portraits.

- [ ] **Step 5: Run the focused test**

Run: `node --test tests/about-founders.test.mjs`

Expected: PASS, 3 tests passed and 0 failed.

- [ ] **Step 6: Commit the responsive frame styling**

```powershell
git add css/style.css tests/about-founders.test.mjs
git commit -m "style: frame founder portraits responsively"
```

---

### Task 4: Shared Cache Stamp And Automated Verification

**Files:**
- Modify: `tests/story-return.test.mjs:165`
- Modify: `index.html:40,501-502`
- Modify: `story.html:28,106-107`

- [ ] **Step 1: Advance the cache-stamp expectation**

In `tests/story-return.test.mjs`, change:

```js
const currentStamp = "20260906f";
```

to:

```js
const currentStamp = "20260906g";
```

- [ ] **Step 2: Run the cache-stamp test to verify it fails**

Run: `node --test tests/story-return.test.mjs`

Expected: FAIL because both HTML documents still reference `20260906f`.

- [ ] **Step 3: Refresh all shared asset references**

In `index.html` and `story.html`, change every shared CSS and JavaScript query stamp from:

```text
?v=20260906f
```

to:

```text
?v=20260906g
```

- [ ] **Step 4: Run focused and full verification**

Run: `node --test tests/about-founders.test.mjs tests/story-return.test.mjs`

Expected: PASS, 0 failures.

Run: `node --test tests`

Expected: PASS, 54 tests passed and 0 failed.

Run: `rg -n "\bAakash\b" index.html story.html css js`

Expected: no output.

Run: `git diff --check`

Expected: no output.

- [ ] **Step 5: Commit the cache refresh**

```powershell
git add index.html story.html tests/story-return.test.mjs
git commit -m "chore: refresh founder portrait assets"
```

---

### Task 5: Browser QA And Existing PR Update

**Files:**
- Modify only if visual QA reveals a founder-layout defect.

- [ ] **Step 1: Verify the desktop About section**

Open `http://127.0.0.1:8011/?fresh=20260906g#about` at approximately `1440×1000`.

Confirm:

- Akash and Gautam have equal visual weight.
- Both faces are fully visible and sharp.
- The teal border and offset deep-teal edge match approved Option A.
- Labels align under their own images.
- The About copy, biographies, and facts remain readable without overlap.

- [ ] **Step 2: Verify the mobile About section**

Open the same URL at approximately `390×844`.

Confirm:

- Portraits stack into one column.
- Neither face nor label is clipped.
- There is no horizontal scrolling.
- The portrait pair, About copy, founder biographies, and facts retain a clear reading order.

- [ ] **Step 3: Check runtime health**

Confirm both founder image requests return HTTP `200` and the browser console has no new errors.

- [ ] **Step 4: Re-run final checks after any visual adjustment**

Run:

```powershell
node --test tests
git diff --check
git status --short --branch
```

Expected: all 54 tests pass, the diff check is silent, and only intentional founder-layout changes are listed.

- [ ] **Step 5: Commit any QA-only correction**

Skip this step if browser QA required no code change. Otherwise:

```powershell
git add index.html story.html css/style.css tests img/founders tools/build-founder-images.py
git commit -m "fix: refine founder portrait presentation"
```

- [ ] **Step 6: Push the existing PR branch**

Run: `git push origin claude/website-qa-testing-76db47`

Expected: Git updates the existing pull request branch without creating a second PR.

- [ ] **Step 7: Confirm pull request state**

Run: `gh pr view 2 --json url,state,mergeable,baseRefName,headRefName`

Expected: PR `#2` is open against `main`, uses head `claude/website-qa-testing-76db47`, and includes the founder portrait commits.
