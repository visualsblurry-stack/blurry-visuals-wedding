# Film Section Cinematic Frame Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make each homepage film card unmistakably playable with the approved cinematic secondary-color treatment.

**Architecture:** Keep the existing link and thumbnail structure. Add a small semantic watch cue in each card and implement the visual treatment entirely in the film component's CSS, including hover, focus, responsive, and reduced-motion states.

**Tech Stack:** Static HTML, CSS, Node test runner

---

### Task 1: Cinematic Film Cards

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `tests/cursor.test.mjs`
- Modify: `tests/story-return.test.mjs`

- [x] **Step 1: Write the failing structural test**

Add assertions that every film card contains `<span class="film-watch">Watch film</span>` and that the CSS provides a secondary gray-teal card frame and metadata strip, high-contrast play button, deeper offset shadow, hover/focus lift, and reduced-motion override.

- [x] **Step 2: Run the focused test to verify it fails**

Run: `node --test tests/cursor.test.mjs`

Expected: FAIL because `.film-watch` and the cinematic frame declarations are absent.

- [x] **Step 3: Implement the approved treatment**

Add the watch cue inside every `.film-play`, then update the film CSS so `.film` owns the secondary border, background, offset shadow, and transition; `.film-meta` becomes the secondary title strip; and the play icon uses the deeper companion shade with a white icon and outline. Add hover/focus and reduced-motion rules without changing link destinations or click handling.

- [x] **Step 4: Bump the cache stamp**

Change the shared asset stamp in `index.html`, `story.html`, and `tests/story-return.test.mjs`. The current stamp is `20260906f` after the follow-up hero-copy update.

- [x] **Step 5: Verify focused and full tests**

Run: `node --test tests/cursor.test.mjs`

Expected: all focused tests pass.

Run: `node --test tests`

Expected: all tests pass with zero failures.

- [x] **Step 6: Verify in the browser**

Open `http://127.0.0.1:8011/?fresh=20260906f`, inspect desktop and narrow layouts, and confirm each card has a visible secondary frame, watch cue, metadata strip, and working YouTube link.
