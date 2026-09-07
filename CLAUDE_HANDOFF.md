# Blurry Visuals Weddings - Claude Handoff

## Start Here

Work only in:

`D:\BlurryVisuals-Wedding-publish`

Do not modify:

`D:\BlurryVisuals-publish`

That second folder is a different corporate website that is already hosted.

## Current State

- Branch: `claude/website-qa-testing-76db47`
- Remote: `https://github.com/visualsblurry-stack/blurry-visuals-wedding.git`
- Architecture: static HTML, CSS, and vanilla JavaScript; there is no build step.
- Local URL: `http://127.0.0.1:8011/`
- Investment modal URL: `http://127.0.0.1:8011/#investment`
- Story page URL: `http://127.0.0.1:8011/story.html?s=shachi-vedant`
- Contact email: `visualsblurry@gmail.com`
- WhatsApp: Aakash `+91 70323 90419`, Gautam `+91 98929 64884`
- Brand colour: `#789c9f` (`--teal`); `#547c7f` (`--teal-deep`) wherever white text sits on it
- Font stack begins with locally installed `TAN Angelton`, then falls back to Fraunces and Georgia.

**Do not push until the owner explicitly requests it.**

## Run Locally

```powershell
"C:\Python314\python.exe" -m http.server 8011 --bind 127.0.0.1 --directory D:\BlurryVisuals-Wedding-publish
```

Verify:

```powershell
(Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8011/).StatusCode
```

Expected: `200`. The server has died mid-session before; restart it if pages stop loading.

## Cache Busting - Read This First

`python -m http.server` sends no `Cache-Control` header, so browsers cache `style.css`
and `main.js` heuristically. A fresh `index.html` paired with a stale stylesheet has
twice looked like broken code.

CSS and JS URLs therefore carry a version query: `css/style.css?v=20260906f`.

**The stamp is fixed, not content-derived. Bump it by hand in both `index.html` and
`story.html` after every CSS or JS change**, or you will be debugging a phantom:

```bash
sed -i 's/?v=20260906f/?v=NEXT_STAMP/g' index.html story.html
```

The HTML files themselves are not stamped, so a hard refresh (`Ctrl+Shift+R`) is still
needed after markup changes.

## Page Structure

Hero -> Real weddings -> Films -> About -> Kind words -> Contact.
Phera markers run I to VI. The portfolio section is commented out in `index.html`
and its nav links removed; its tiles were stock imagery. To restore it, delete the
comment wrapper and add the `#work` links back to header, drawer, and footer.

Note: the wrapper cannot contain HTML comments. Nested comments terminate it early
and leak live markup onto the page.

## Implemented Features

### Hero

- Thirteen slides, all studio-owned WebP in `img/hero/`. No stock.
- First slide loads eagerly and is preloaded; the rest lazy-load via `data-bg`.
- Hero copy is intentionally limited to the static headline and the three proof figures.
  Photographs continue rotating without changing the text.
- Copy pinned left, capped at 620px, so the photograph keeps the right half of the frame.
- Dots, autoplay, and touch swipe.

### Story pages (`story.html?s=<slug>`)

- Real stories use selected still sequences behind the couple name, followed by a flat,
  photo-first gallery with an expandable viewer.
- Breadcrumb offers Home and All weddings; header, drawer, and footer also carry Home.
- Prev/next wedding navigation at the foot.

### Contact

- Full-bleed, asymmetric `0.86fr / 1.14fr`. Not a centred card.
- Enquiry panel is `--teal-deep`; every label, hint, and heading on it measures 4.6:1.
- Two named WhatsApp rows, each linking to its own `wa.me` thread.
- Event date is a native picker; the invisible indicator is stretched across the control
  so a click anywhere opens the calendar. Submits ISO, sent to WhatsApp as `12 Dec 2026`.
- Field names are contractual and must not change: `names`, `etype`, `edate`, `city`,
  `venue`, `message`. Submit is labelled `Send` and opens WhatsApp prefilled. Nothing is stored.

### Investment & FAQs

- Full-screen modal inside `index.html`; `#investment` is shareable and opens on load.
- Header carries the full logo lockup.
- Collections: **Intimate ₹1,25,000**, **Signature ₹2,25,000**, built from the 26-27
  brochure's crew and deliverables, laid out as spec rows.
- Nine FAQs covering booking split, delivery, revisions, working hours, travel,
  and the food policy. The add-ons price list was removed at the owner's request.
- Close button, backdrop click, Escape, scroll lock, focus trap, focus restoration.

## Important Files

- `index.html` - homepage, contact form, investment modal
- `story.html` - shared story-page shell
- `css/style.css` - all styles
- `js/main.js` - hero, drawer, lightbox, WhatsApp form, modal, FAQ, story renderer
- `js/stories-data.js` - real-wedding story data
- `video/README.md` - where films go and how to encode them
- `tests/` - Node regression tests for branding, contact, hero, films, stories, and galleries

## Verification

```powershell
node --test tests
git diff --check
git status --short
```

Run the suite rather than relying on a saved count. Recent verification covered the full
Node suite plus visual inspection in the browser at desktop and narrow widths.

Two traps when measuring in a headless tab:

- The tab is often `document.hidden`, which throttles `setTimeout` to roughly 2/sec.
  Animations will look broken when they are fine.
- Slide changes resolve through an image-load promise. Wait for the `.act` class before
  asserting, or you will read the previous slide's state.
- The pane's viewport sometimes collapses to 0 or 360px. Check `clientWidth` before
  trusting any geometry.

## Open Questions For The Owner

1. **Prices.** The brochure says Intimate 2,75,000 and Signature 3,75,000. The site uses
   the owner's stated 1,25,000 and 2,25,000. If the brochure is current, the site
   underquotes by about 1.5 lakh per booking.
2. **Aakash or Akash.** The brochure spells it *Akash*; the site uses *Aakash*.
3. **Coming-soon stories.** Shachi + Vedant, Vedin + Megha, and now Niki + Swapnesh have
   complete local galleries. The remaining story records still need final studio photography.
   Niki + Swapnesh's venue/city are still the "Real wedding · India" placeholder — supply the
   real location the same way Shachi's and Vedin's were corrected.

## Safety And Editing Rules

- Create a dated backup on `D:\` before substantial visual changes.
- Preserve existing user work; do not revert unrelated changes.
- Keep the site dependency-free unless the owner approves an architecture change.
- Preserve the form field names and the WhatsApp behaviour.
- Buttons stay `#789c9f` with white text, except the approved white CTA on a teal panel.
  Use `--teal-deep` wherever white text must meet 4.5:1.
- Never `git add -A` without checking what it picks up. A previous commit swept 25MB of
  raw JPEGs into history that way. `img/*.jpg|jpeg|png` and `video/stories/` are now
  gitignored; the old blobs remain in commit `a8fd4d5` and could still be purged before
  any push.
- Verify desktop and mobile before declaring completion.
- Do not create standalone preview pages; change the real site and verify at port 8011.
- Do not push to GitHub without explicit approval.

## Suggested Claude Opening Prompt

```text
Continue work on the Blurry Visuals Weddings website using the checkpoint in
D:\BlurryVisuals-Wedding-publish\CLAUDE_HANDOFF.md.

Work only in D:\BlurryVisuals-Wedding-publish. Do not touch D:\BlurryVisuals-publish,
it is a different hosted corporate site. Read the handoff, run node --test tests, and
check git status before editing. Bump the ?v= asset stamp after any CSS or JS change.
Make changes in the real site, preserve the WhatsApp form and #investment modal, verify
desktop and mobile, and do not push without my approval.
```
