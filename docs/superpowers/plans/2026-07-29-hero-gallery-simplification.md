# Hero Gallery Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add all six supplied photographs to the existing hero rotation, simplify the hero copy, and provide accessible dot navigation plus mobile swipe controls.

**Architecture:** Keep the static HTML/CSS/JavaScript structure. Generate six optimized WebP derivatives under `img/hero/`, represent all nine slides in `index.html`, and enhance the existing hero block in `js/main.js` with lazy background loading, synchronized dots, autoplay, and touch-safe horizontal swipe detection. Node tests enforce asset and markup contracts; Playwright verifies real interaction and responsive framing.

**Tech Stack:** Static HTML5, CSS, classic browser JavaScript, Node `node:test`, Pillow WebP conversion, Playwright/Chrome for browser QA.

---

## File Structure

- Create `tests/hero-gallery.test.mjs`: hero-specific asset, content, markup, and behavior-contract checks.
- Create six `img/hero/*.webp` files: compressed derivatives of the supplied JPG originals.
- Modify `index.html`: nine slides, concise content, and nine accessible dots.
- Modify `css/style.css`: focal positions, compact typography, dot controls, and removal of obsolete ring/marker styles.
- Modify `js/main.js`: lazy slide loading, dot selection, autoplay synchronization, hover/focus pause, and touch swipe.
- Modify `img/README.md`: document the final hero asset directory and source-preservation rule.

### Task 1: Define Hero Gallery Regression Tests

**Files:**
- Create: `tests/hero-gallery.test.mjs`
- Test: `tests/hero-gallery.test.mjs`

- [ ] **Step 1: Write the failing tests**

Create `tests/hero-gallery.test.mjs`:

```javascript
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
  assert.match(html, /<h1>Love,<br><em>beautifully<\/em> remembered\.<\/h1>/);
  assert.match(html, /Honest photographs and cinematic films, wherever your story takes us\./);
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
    assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF", `${path} is not RIFF`);
    assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP", `${path} is not WebP`);
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
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```powershell
node --test tests/hero-gallery.test.mjs
```

Expected: three failures because the hero still has three slides, the WebP assets do not exist, and the gallery controls are not implemented.

- [ ] **Step 3: Commit the failing tests**

```powershell
git add tests/hero-gallery.test.mjs
git commit -m "test: define interactive hero gallery"
```

### Task 2: Generate Optimized Hero Assets

**Files:**
- Create: `img/hero/hero-abhi-isha.webp`
- Create: `img/hero/hero-sachi-vedant-embrace.webp`
- Create: `img/hero/hero-sachi-vedant-ceremony.webp`
- Create: `img/hero/hero-wedding-portrait-couple.webp`
- Create: `img/hero/hero-wedding-portrait-walk.webp`
- Create: `img/hero/hero-wedding-portrait-hands.webp`
- Modify: `img/README.md`
- Test: `tests/hero-gallery.test.mjs`

- [ ] **Step 1: Confirm Pillow WebP support**

Run with the bundled workspace Python:

```powershell
@'
from PIL import features
assert features.check("webp"), "Pillow WebP support is unavailable"
print("WEBP_SUPPORT=ready")
'@ | python -
```

Expected: `WEBP_SUPPORT=ready`.

- [ ] **Step 2: Convert the six source JPGs without modifying them**

Run this deterministic conversion from the worktree root:

```powershell
New-Item -ItemType Directory -Force -Path img\hero | Out-Null
@'
from pathlib import Path
from PIL import Image, ImageOps

source = Path(r"D:\BlurryVisuals-Wedding-publish\.worktrees\wedding-rebrand\img\weddingHeroPhotos")
target = Path("img/hero")
mapping = {
    "Abhi & Isha-48.jpg": "hero-abhi-isha.webp",
    "Sachi & Vedant-154.jpg": "hero-sachi-vedant-embrace.webp",
    "sachi vedant-229.jpg": "hero-sachi-vedant-ceremony.webp",
    "Wedding Portraits-144.jpg": "hero-wedding-portrait-couple.webp",
    "Wedding Portraits-41.jpg": "hero-wedding-portrait-walk.webp",
    "Wedding Portraits-46.jpg": "hero-wedding-portrait-hands.webp",
}

for source_name, target_name in mapping.items():
    with Image.open(source / source_name) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        image.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
        image.save(target / target_name, "WEBP", quality=82, method=6, exif=b"")
        print(f"{target_name}: {image.width}x{image.height}")
'@ | python -
```

Expected: six WebP files, each with a long edge no greater than 1920 pixels. The source JPG timestamps and hashes remain unchanged.

- [ ] **Step 3: Update the image guide**

Add this section to `img/README.md`:

```markdown
## Homepage hero gallery

Production hero derivatives live in `img/hero/` as optimized WebP files. The high-resolution source JPGs are preserved separately and must not be served directly because each source is several megabytes.
```

- [ ] **Step 4: Run the focused asset test**

```powershell
node --test --test-name-pattern="optimized WebP" tests/hero-gallery.test.mjs
```

Expected: one pass and two skipped tests.

- [ ] **Step 5: Commit the optimized assets**

```powershell
git add img/hero/*.webp img/README.md
git commit -m "Add optimized wedding hero photographs"
```

### Task 3: Build the Compact Hero Markup and Styling

**Files:**
- Modify: `index.html:57-91`
- Modify: `css/style.css:125-183`
- Test: `tests/hero-gallery.test.mjs`

- [ ] **Step 1: Replace the hero markup**

Use nine slides, retaining all three existing URLs and interleaving the six local images. Only the first slide receives an immediate background image; other slides use `data-bg`:

```html
<section class="hero">
  <div class="hero-slides" aria-hidden="true">
    <div class="hero-slide act" style="--hero-position:50% 50%;background-image:url('https://images.unsplash.com/photo-1722952934708-749c22eb2e58?auto=format&fit=crop&w=1920&q=75')"></div>
    <div class="hero-slide" data-bg="img/hero/hero-wedding-portrait-couple.webp" style="--hero-position:58% 58%"></div>
    <div class="hero-slide" data-bg="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=75" style="--hero-position:50% 50%"></div>
    <div class="hero-slide" data-bg="img/hero/hero-sachi-vedant-embrace.webp" style="--hero-position:52% 45%"></div>
    <div class="hero-slide" data-bg="img/hero/hero-abhi-isha.webp" style="--hero-position:50% 66%"></div>
    <div class="hero-slide" data-bg="https://images.unsplash.com/photo-1587271636175-90d58cdad458?auto=format&fit=crop&w=1920&q=75" style="--hero-position:50% 50%"></div>
    <div class="hero-slide" data-bg="img/hero/hero-sachi-vedant-ceremony.webp" style="--hero-position:50% 54%"></div>
    <div class="hero-slide" data-bg="img/hero/hero-wedding-portrait-walk.webp" style="--hero-position:50% 58%"></div>
    <div class="hero-slide" data-bg="img/hero/hero-wedding-portrait-hands.webp" style="--hero-position:50% 50%"></div>
  </div>

  <div class="hero-in">
    <p class="hero-eyebrow">Wedding photography &amp; films</p>
    <h1>Love,<br><em>beautifully</em> remembered.</h1>
    <p class="hero-sub">Honest photographs and cinematic films, wherever your story takes us.</p>
    <div class="hero-cta">
      <a class="btn btn-gold" href="#contact">Check availability</a>
      <a class="btn btn-line" href="#stories">View stories</a>
    </div>
  </div>

  <div class="hero-dots" role="group" aria-label="Choose a hero photograph">
    <button class="hero-dot act" type="button" data-slide="0" aria-label="Show hero image 1" aria-current="true"></button>
    <button class="hero-dot" type="button" data-slide="1" aria-label="Show hero image 2"></button>
    <button class="hero-dot" type="button" data-slide="2" aria-label="Show hero image 3"></button>
    <button class="hero-dot" type="button" data-slide="3" aria-label="Show hero image 4"></button>
    <button class="hero-dot" type="button" data-slide="4" aria-label="Show hero image 5"></button>
    <button class="hero-dot" type="button" data-slide="5" aria-label="Show hero image 6"></button>
    <button class="hero-dot" type="button" data-slide="6" aria-label="Show hero image 7"></button>
    <button class="hero-dot" type="button" data-slide="7" aria-label="Show hero image 8"></button>
    <button class="hero-dot" type="button" data-slide="8" aria-label="Show hero image 9"></button>
  </div>
</section>
```

- [ ] **Step 2: Replace obsolete hero styles with dot styles**

Keep existing button styles. Update/add these hero rules and remove `.ring`, `.ring-core`, `@keyframes spin`, `.hero-marker`, and their responsive overrides:

```css
.hero{min-height:100svh;display:flex;align-items:flex-end;position:relative;overflow:hidden;touch-action:pan-y;}
.hero-slide{
  position:absolute;inset:0;opacity:0;transition:opacity 1.2s ease;
  background-size:cover;background-position:var(--hero-position,50% 50%);
}
.hero-in{position:relative;z-index:3;padding:0 0 112px;width:min(1180px,92vw);margin:0 auto;text-shadow:0 2px 22px rgba(8,28,31,0.28);}
.hero h1{font-size:clamp(48px,7vw,96px);max-width:12ch;}
.hero-sub{margin:22px 0 0;max-width:48ch;color:rgba(255,255,255,0.9);font-size:17px;}
.hero-cta{display:flex;gap:16px;margin-top:32px;flex-wrap:wrap;}
.hero-dots{
  position:absolute;right:max(4vw,24px);bottom:20px;z-index:4;
  display:flex;align-items:center;justify-content:center;
}
.hero-dot{width:44px;height:44px;display:grid;place-items:center;padding:0;}
.hero-dot::before{
  content:"";width:6px;height:6px;border-radius:999px;
  background:rgba(255,255,255,0.58);transition:width .2s ease,background .2s ease;
}
.hero-dot:hover::before,.hero-dot:focus-visible::before{background:var(--white);}
.hero-dot.act::before{width:20px;background:var(--white);}
```

In the mobile media query, add:

```css
.hero-in{padding-bottom:118px;}
.hero h1{font-size:clamp(46px,14vw,68px);}
.hero-sub{font-size:16px;max-width:34ch;}
.hero-dots{left:50%;right:auto;bottom:12px;transform:translateX(-50%);}
.hero-dot{width:40px;height:44px;}
```

- [ ] **Step 3: Run the concise-gallery test**

```powershell
node --test --test-name-pattern="concise nine-image" tests/hero-gallery.test.mjs
```

Expected: one pass and two skipped tests.

- [ ] **Step 4: Commit markup and styling**

```powershell
git add index.html css/style.css
git commit -m "Simplify wedding hero presentation"
```

### Task 4: Add Dots, Lazy Loading, and Swipe Behavior

**Files:**
- Modify: `js/main.js:39-48`
- Test: `tests/hero-gallery.test.mjs`

- [ ] **Step 1: Replace the existing slideshow block**

Replace the current interval-only hero code with:

```javascript
  /* ---------- hero gallery ---------- */
  var hero = document.querySelector(".hero");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var heroDots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var slideIndex = 0;
  var autoplayId = 0;
  var autoplayPaused = false;
  var pendingSlides = Object.create(null);

  function loadHeroSlide(index) {
    var slide = slides[index];
    if (!slide || !slide.dataset.bg || slide.dataset.loaded === "true") {
      return Promise.resolve(true);
    }
    var source = slide.dataset.bg;
    if (pendingSlides[source]) return pendingSlides[source];
    pendingSlides[source] = new Promise(function (resolve) {
      var image = new Image();
      image.onload = function () {
        slide.style.backgroundImage = 'url("' + source.replace(/"/g, "%22") + '")';
        slide.dataset.loaded = "true";
        resolve(true);
      };
      image.onerror = function () { resolve(false); };
      image.src = source;
    });
    return pendingSlides[source];
  }

  function updateHeroDots() {
    heroDots.forEach(function (dot, index) {
      var active = index === slideIndex;
      dot.classList.toggle("act", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function showHeroSlide(index) {
    var nextIndex = (index + slides.length) % slides.length;
    return loadHeroSlide(nextIndex).then(function (loaded) {
      if (!loaded) return false;
      slides[slideIndex].classList.remove("act");
      slideIndex = nextIndex;
      slides[slideIndex].classList.add("act");
      updateHeroDots();
      loadHeroSlide((slideIndex + 1) % slides.length);
      return true;
    });
  }

  function stopHeroAutoplay() {
    window.clearTimeout(autoplayId);
    autoplayId = 0;
  }

  function scheduleHeroAutoplay() {
    stopHeroAutoplay();
    if (REDUCED || autoplayPaused || slides.length < 2) return;
    autoplayId = window.setTimeout(function () {
      showHeroSlide(slideIndex + 1).then(scheduleHeroAutoplay);
    }, 5200);
  }

  heroDots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showHeroSlide(Number(dot.dataset.slide)).then(scheduleHeroAutoplay);
    });
  });

  if (hero) {
    hero.addEventListener("mouseenter", function () {
      autoplayPaused = true;
      stopHeroAutoplay();
    });
    hero.addEventListener("mouseleave", function () {
      autoplayPaused = false;
      scheduleHeroAutoplay();
    });
    hero.addEventListener("focusin", function () {
      autoplayPaused = true;
      stopHeroAutoplay();
    });
    hero.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!hero.contains(document.activeElement)) {
          autoplayPaused = false;
          scheduleHeroAutoplay();
        }
      }, 0);
    });

    var swipeX = 0;
    var swipeY = 0;
    hero.addEventListener("pointerdown", function (event) {
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      swipeX = event.clientX;
      swipeY = event.clientY;
    });
    hero.addEventListener("pointerup", function (event) {
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      var deltaX = event.clientX - swipeX;
      var deltaY = event.clientY - swipeY;
      if (Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
        showHeroSlide(slideIndex + (deltaX < 0 ? 1 : -1)).then(scheduleHeroAutoplay);
      }
    });
  }

  if (slides.length) {
    loadHeroSlide(1 % slides.length);
    updateHeroDots();
    scheduleHeroAutoplay();
  }
```

- [ ] **Step 2: Run the script-contract test**

```powershell
node --test --test-name-pattern="dots, lazy loading, and mobile swipe" tests/hero-gallery.test.mjs
```

Expected: one pass and two skipped tests.

- [ ] **Step 3: Run all Node and syntax checks**

```powershell
node --test tests/branding.test.mjs tests/hero-gallery.test.mjs
node --check js/main.js
git diff --check
```

Expected: seven tests pass, JavaScript syntax exits zero, and diff check is clean.

- [ ] **Step 4: Commit gallery behavior**

```powershell
git add js/main.js tests/hero-gallery.test.mjs
git commit -m "Add interactive wedding hero controls"
```

### Task 5: Browser Verification and Integration

**Files:**
- Verify: `index.html`
- Verify: `css/style.css`
- Verify: `js/main.js`
- Verify: `img/hero/*.webp`

- [ ] **Step 1: Start a worktree server**

```powershell
python -m http.server 8012 --bind 127.0.0.1
```

Expected: homepage and all six WebP assets return HTTP 200.

- [ ] **Step 2: Verify gallery behavior in Chrome**

At 1440x900, 768x1024, and 390x844, verify:

- Hero copy is concise and does not obscure primary subjects.
- All nine dots are visible and clickable.
- Selecting dots 1, 5, and 9 activates the corresponding slide and moves `aria-current`.
- At 390x844, a left swipe advances and a right swipe returns.
- Vertical movement does not change slides.
- Reduced-motion emulation keeps dots working and prevents autoplay.
- All nine slides load without a blank state.
- There is no overlap, horizontal overflow, console error, page error, or local request failure.

- [ ] **Step 3: Inspect screenshots**

Capture homepage screenshots at each viewport and inspect focal crops for every local image. Adjust only `--hero-position` values when a face or gesture is cropped; do not alter the source photographs.

- [ ] **Step 4: Verify source originals are unchanged**

Compare hashes for all six files in `img/weddingHeroPhotos/` against hashes recorded before conversion. Expected: all match.

- [ ] **Step 5: Merge locally and reverify main**

From `D:\BlurryVisuals-Wedding-publish`, fast-forward `main` to `agent/wedding-rebrand`, run both Node test files again, and rerun the responsive Chrome checks against the main local server. Do not push without an explicit request.
