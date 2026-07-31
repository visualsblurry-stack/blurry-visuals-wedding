# Contact And Investment Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the live wedding enquiry section and add a shareable, accessible Investment & FAQs modal to the existing static website.

**Architecture:** Keep the current dependency-free HTML/CSS/JavaScript structure. Add semantic markup to `index.html`, shared navigation links to both HTML pages, component styles to the existing stylesheet, and isolated modal/accordion behavior to `main.js` while preserving the WhatsApp form handler.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, Node.js `node:test`, Python HTTP server, Playwright browser QA

---

## File Map

- Create `tests/contact-investment.test.mjs`: regression checks for preserved form behavior, modal content, and accessibility hooks.
- Modify `index.html`: equal-panel contact markup, inline Lucide icons, investment packages, FAQ accordion, and dialog markup.
- Modify `story.html`: shared Investment navigation links pointing to `index.html#investment`.
- Modify `css/style.css`: contact backdrop/panels/fields and responsive modal/package/FAQ presentation.
- Modify `js/main.js`: shareable hash state, accessible dialog lifecycle, focus trap, accordions, and contact routing.

### Task 1: Lock The Contract With Tests

- [ ] Create `tests/contact-investment.test.mjs` asserting all six existing form names, the visible `Send` label, inline icon markup, both package prices, seven FAQ controls, dialog semantics, `#investment` links, and the unchanged WhatsApp number/message fields.
- [ ] Run `node --test tests/contact-investment.test.mjs`; expect failures because the redesigned markup and modal are not yet present.
- [ ] Commit the failing contract test with `git commit -m "test: define contact and investment modal contract"`.

### Task 2: Build The Contact Experience

- [ ] Replace the contact markup in `index.html` with equal information and enquiry panels while preserving `names`, `etype`, `edate`, `city`, `venue`, and `message` controls.
- [ ] Add local inline Lucide SVG icons for contact methods, every field, and the Send action.
- [ ] Replace the contact CSS with a veiled local wedding photograph, a white information panel, a `#789c9f` form panel, framed 48px controls, and stacked tablet/mobile layouts.
- [ ] Run `node --test tests/contact-investment.test.mjs`; expect the contact assertions to pass.
- [ ] Commit with `git commit -m "feat: redesign wedding enquiry form"`.

### Task 3: Build The Investment & FAQs Modal

- [ ] Add `Investment` links to desktop, drawer, and footer navigation in `index.html` and `story.html`.
- [ ] Add the dialog, Basic and Signature packages, travel note, seven semantic FAQ button/panel pairs, close action, and availability actions to `index.html`.
- [ ] Add full-screen dialog, package, accordion, sticky header, and responsive CSS to `css/style.css`.
- [ ] Add open/close/hashchange, Escape/backdrop dismissal, focus trapping/restoration, body scroll lock, accordion toggling, and contact-routing behavior to `js/main.js`.
- [ ] Run `node --test tests/*.test.mjs`; expect all tests to pass.
- [ ] Commit with `git commit -m "feat: add investment and FAQ modal"`.

### Task 4: Verify The Real Website

- [ ] Open `http://127.0.0.1:8011/` at desktop and mobile sizes and confirm equal desktop contact panels, stacked mobile panels, visible icons, 48px controls, and no horizontal overflow.
- [ ] Submit representative form values with `window.open` intercepted and confirm the WhatsApp URL contains all values.
- [ ] Open Investment from navigation and directly via `#investment`; expand FAQ answers; verify focus trap, Escape/backdrop/close behavior, focus restoration, and the availability route to `#contact`.
- [ ] Check console, page errors, and local failed requests; run `node --test tests/*.test.mjs` once more.
- [ ] Commit any verification fixes with `git commit -m "fix: polish contact and investment interactions"`.
