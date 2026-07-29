# Blurry Visuals Wedding Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Pheraa identity with Blurry Visuals Weddings and use the official Blurry Visuals logo consistently on the currently hosted static site.

**Architecture:** Keep the existing static HTML/CSS/JavaScript architecture for this focused rebrand. Add one logo asset, update shared identity content across both HTML pages and the story renderer, and protect the result with Node's built-in test runner before browser verification.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, Node.js `node:test`, Python HTTP server, Playwright

---

## File Map

- Create `tests/branding.test.mjs`: branding, contact, and asset regression checks
- Create `img/blurry-visuals-logo.png`: copied official Blurry Visuals logo
- Modify `index.html`: metadata, structured data, header, visible copy, contact identity, and footer
- Modify `story.html`: metadata, header, and footer
- Modify `css/style.css`: responsive logo lockup
- Modify `js/main.js`: enquiry greeting, story titles, and story-data namespace usage
- Modify `js/stories-data.js`: story-data namespace and comments
- Modify `README.md`: project identity
- Modify `img/README.md`: photo guide identity and contact references

### Task 1: Add Failing Rebrand Tests

**Files:**
- Create: `tests/branding.test.mjs`

- [ ] **Step 1: Write the failing tests**

```javascript
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("official Blurry Visuals logo is used on both pages", async () => {
  const [index, story, logo] = await Promise.all([
    read("index.html"),
    read("story.html"),
    stat(new URL("img/blurry-visuals-logo.png", root)),
  ]);
  assert.ok(logo.size > 10000);
  assert.match(index, /class="brand-logo"[^>]+src="img\/blurry-visuals-logo\.png"/);
  assert.match(story, /class="brand-logo"[^>]+src="img\/blurry-visuals-logo\.png"/);
});

test("public pages use only the Blurry Visuals Weddings identity", async () => {
  const content = (await Promise.all([
    read("index.html"),
    read("story.html"),
    read("README.md"),
    read("img/README.md"),
    read("css/style.css"),
  ])).join("\n");
  assert.doesNotMatch(content, /pheraa/i);
  assert.match(content, /Blurry Visuals Weddings/);
  assert.match(content, /visualsblurry@gmail\.com/);
  assert.match(content, /instagram\.com\/theblurryvisuals/);
});

test("story scripts use the Blurry Visuals namespace and titles", async () => {
  const content = (await Promise.all([
    read("js/main.js"),
    read("js/stories-data.js"),
  ])).join("\n");
  assert.doesNotMatch(content, /PHERAA|Pheraa/);
  assert.match(content, /BLURRY_WEDDING_STORIES/);
  assert.match(content, /Blurry Visuals Weddings/);
});

test("logo lockup has stable styles", async () => {
  const css = await read("css/style.css");
  assert.match(css, /\.brand-logo\s*\{/);
  assert.match(css, /\.brand-name\s*\{/);
  assert.match(css, /width:42px/);
  assert.match(css, /height:42px/);
});
```

- [ ] **Step 2: Verify the tests fail for the expected reasons**

Run: `node --test tests/branding.test.mjs`

Expected: FAIL because the logo file, logo classes, new namespace, and new identity do not exist yet.

### Task 2: Add The Official Header Logo

**Files:**
- Create: `img/blurry-visuals-logo.png`
- Modify: `index.html`
- Modify: `story.html`
- Modify: `css/style.css`
- Test: `tests/branding.test.mjs`

- [ ] **Step 1: Copy the approved logo**

```powershell
Copy-Item -LiteralPath 'D:\BlurryVisuals-publish\src\assets\blurry-visuals-logo-cropped.png' -Destination 'D:\BlurryVisuals-Wedding-publish\img\blurry-visuals-logo.png'
```

- [ ] **Step 2: Replace each text-only header brand**

Use `href="#top"` in `index.html` and `href="index.html"` in `story.html`:

```html
<a class="brand" href="#top" aria-label="Blurry Visuals Weddings home">
  <img class="brand-logo" src="img/blurry-visuals-logo.png" alt="" width="42" height="42">
  <span class="brand-copy">
    <b class="brand-name">Blurry Visuals</b>
    <small>Weddings · Mumbai</small>
  </span>
</a>
```

- [ ] **Step 3: Replace current brand styles**

```css
.brand{display:inline-flex;align-items:center;gap:10px;color:var(--ivory);}
.brand-logo{display:block;width:42px;height:42px;object-fit:contain;flex:0 0 42px;}
.brand-copy{display:grid;gap:1px;min-width:0;}
.brand-name{font-family:var(--ff-display);font-size:21px;font-weight:500;line-height:1;letter-spacing:0;color:inherit;white-space:nowrap;}
.brand small{display:block;font-family:var(--ff-body);font-size:8px;font-weight:700;letter-spacing:0.32em;text-transform:uppercase;color:var(--ash);}
.hdr:not(.solid) .brand{color:var(--white);}
.hdr:not(.solid) .brand small{color:rgba(255,255,255,0.78);}
```

Change the stylesheet banner comment from Pheraa to Blurry Visuals Weddings.

- [ ] **Step 4: Verify the focused logo tests pass**

Run: `node --test --test-name-pattern="official Blurry Visuals logo|logo lockup" tests/branding.test.mjs`

Expected: 2 PASS, 0 FAIL.

- [ ] **Step 5: Commit**

```powershell
git add img/blurry-visuals-logo.png index.html story.html css/style.css tests/branding.test.mjs
git commit -m "Rebrand wedding header"
```

### Task 3: Replace Public Identity And Contact Copy

**Files:**
- Modify: `index.html`
- Modify: `story.html`
- Modify: `README.md`
- Modify: `img/README.md`
- Test: `tests/branding.test.mjs`

- [ ] **Step 1: Update homepage metadata**

```html
<title>Blurry Visuals Weddings | Wedding Photography &amp; Films, Mumbai</title>
<meta name="description" content="Blurry Visuals Weddings is a Mumbai wedding photography and film studio documenting intimate celebrations, destination weddings, and every ritual in between.">
<meta name="theme-color" content="#789c9f">
<meta property="og:site_name" content="Blurry Visuals Weddings">
<meta property="og:title" content="Blurry Visuals Weddings | Wedding Photography &amp; Films">
<meta property="og:description" content="Wedding stories photographed with an editorial eye and documentary warmth.">
```

Use this JSON-LD identity:

```html
<script type="application/ld+json">
{ "@context":"https://schema.org","@type":"ProfessionalService","name":"Blurry Visuals Weddings","description":"Wedding photography and films studio based in Mumbai.","telephone":"+917032390419","email":"visualsblurry@gmail.com","address":{"@type":"PostalAddress","addressLocality":"Mumbai","addressRegion":"Maharashtra","addressCountry":"IN"},"areaServed":["Mumbai","India"],"sameAs":["https://www.instagram.com/theblurryvisuals/"] }
</script>
```

- [ ] **Step 2: Update homepage copy and contacts**

Use `Blurry Visuals Weddings photographs and films weddings the way they are lived` in the hero introduction and `Blurry Visuals Weddings is a Mumbai studio built for that pressure` in the photographer section. Change the film-demo comment to refer to Blurry Visuals Weddings, the email to `visualsblurry@gmail.com`, and Instagram to `https://www.instagram.com/theblurryvisuals/` with label `@theblurryvisuals`. Change the footer to:

```html
<p>© <span id="yr"></span> Blurry Visuals Weddings · Photography &amp; Films, Mumbai.</p>
```

- [ ] **Step 3: Update story metadata and footer**

```html
<title>Real Wedding | Blurry Visuals Weddings</title>
<meta name="description" content="A real wedding photographed and filmed by Blurry Visuals Weddings, Mumbai.">
<meta name="theme-color" content="#789c9f">
```

- [ ] **Step 4: Update README**

Use: `A static wedding photography and films website for Blurry Visuals Weddings, Mumbai.`

Change the image guide heading to `# Blurry Visuals Weddings photo swap guide`, and change its contact reminder to `visualsblurry@gmail.com` and `@theblurryvisuals`.

- [ ] **Step 5: Verify the public identity test passes**

Run: `node --test --test-name-pattern="public pages" tests/branding.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add index.html story.html README.md img/README.md tests/branding.test.mjs
git commit -m "Update wedding brand identity"
```

### Task 4: Rebrand Story JavaScript

**Files:**
- Modify: `js/main.js`
- Modify: `js/stories-data.js`
- Test: `tests/branding.test.mjs`

- [ ] **Step 1: Rename the story namespace**

Replace `window.PHERAA_STORIES` with `window.BLURRY_WEDDING_STORIES` in both JavaScript files.

- [ ] **Step 2: Update generated strings**

Use `Hello Blurry Visuals Weddings! Wedding inquiry —` for the WhatsApp greeting and:

```javascript
document.title = st.couple[0] + " & " + st.couple[1] + " | Blurry Visuals Weddings";
```

Change file-header comments from Pheraa to Blurry Visuals Weddings.

- [ ] **Step 3: Verify script identity**

Run: `node --test --test-name-pattern="story scripts" tests/branding.test.mjs`

Expected: PASS.

- [ ] **Step 4: Run all tests**

Run: `node --test tests/branding.test.mjs`

Expected: 4 PASS, 0 FAIL.

- [ ] **Step 5: Commit**

```powershell
git add js/main.js js/stories-data.js tests/branding.test.mjs
git commit -m "Rebrand wedding story scripts"
```

### Task 5: Browser And Repository Verification

**Files:**
- Verify: `index.html`
- Verify: `story.html`
- Verify: `css/style.css`
- Verify: `js/main.js`
- Verify: `js/stories-data.js`

- [ ] **Step 1: Confirm old runtime identity is absent**

Run: `rg -n -i "pheraa|pheraa\.in" index.html story.html css js README.md img/README.md`

Expected: no matches and exit code 1.

- [ ] **Step 2: Verify local HTTP resources**

At `http://127.0.0.1:8011/`, verify the homepage, `story.html?s=anaya-rohan`, CSS, both JavaScript files, and `img/blurry-visuals-logo.png` return HTTP 200.

- [ ] **Step 3: Verify browser rendering**

Use Playwright with Chrome at 1440x900, 768x1024, and 390x844. Confirm the logo is visible and uncropped, the lockup does not overlap navigation, mobile navigation remains reachable, the story title contains Blurry Visuals Weddings, horizontal overflow is zero, and the browser console has no errors.

- [ ] **Step 4: Review Git state**

Run:

```powershell
git status -sb
git log --oneline --decorate -5
```

Expected: clean `main` worktree ahead of `origin/main`. Do not push without user approval.
