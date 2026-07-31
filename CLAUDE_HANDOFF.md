# Blurry Visuals Weddings - Claude Handoff

## Start Here

Work only in:

`D:\BlurryVisuals-Wedding-publish`

Do not modify:

`D:\BlurryVisuals-publish`

That second folder is a different corporate website that is already hosted.

## Current State

- Branch: `main`
- Remote: `https://github.com/visualsblurry-stack/blurry-visuals-wedding.git`
- Architecture: static HTML, CSS, and vanilla JavaScript; there is no build step.
- Local URL: `http://127.0.0.1:8011/`
- Investment modal URL: `http://127.0.0.1:8011/#investment`
- Contact email: `visualsblurry@gmail.com`
- WhatsApp: `+91 70323 90419`
- Brand color: `#789c9f`
- Font stack begins with locally installed `TAN Angelton`, then falls back to Fraunces and Georgia.

The working tree was clean when this handoff was written. Local `main` was 27 commits ahead of `origin/main` before this handoff commit. Do not push until the owner explicitly requests it.

## Run Locally

The current server command is:

```powershell
"C:\Python314\python.exe" -m http.server 8011 --bind 127.0.0.1 --directory D:\BlurryVisuals-Wedding-publish
```

If port 8011 is already serving the correct directory, reuse it. Verify with:

```powershell
(Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8011/).StatusCode
```

Expected result: `200`.

## Implemented Features

### Hero

- Nine-image hero gallery.
- Dot navigation and automatic rotation.
- Touch swipe support on mobile.
- Local optimized WebP wedding photographs mixed with existing remote images.

### Contact

- Equal-width and equal-height desktop panels.
- White information panel and `#789c9f` enquiry panel.
- Locally embedded inline Lucide-style SVG icons.
- Responsive stacked mobile layout with no horizontal overflow.
- Existing fields and field names are contractual and must remain unchanged:
  - `names`
  - `etype`
  - `edate`
  - `city`
  - `venue`
  - `message`
- Submit button is labelled `Send`.
- Submission opens WhatsApp with all enquiry values pre-filled. No data is stored by the site.

### Investment & FAQs

- This is a full-screen modal within `index.html`, not a separate page.
- Header, mobile drawer, and footer include an Investment link.
- `#investment` is shareable and opens the modal on page load.
- Basic package: `₹1,75,000`, single day.
- Signature package: `₹2,55,000`, single day.
- Seven FAQ accordions are included and functional.
- Supports close button, backdrop click, Escape, body scroll lock, focus trap, and focus restoration.
- Package and availability actions close the modal and route to `#contact`.
- Story-page Investment links route to `index.html#investment`.

## Important Files

- `index.html`: homepage, contact form, packages, FAQs, and modal markup.
- `story.html`: shared story-page navigation.
- `css/style.css`: all visual styles and responsive rules.
- `js/main.js`: hero, drawer, lightbox, WhatsApp form, modal, and FAQ behavior.
- `js/stories-data.js`: real-wedding story data.
- `tests/contact-investment.test.mjs`: contact/modal regression contract.
- `tests/branding.test.mjs`: branding and button-color checks.
- `tests/hero-gallery.test.mjs`: hero gallery and asset checks.
- `docs/superpowers/specs/2026-07-30-contact-form-redesign-design.md`: approved contact/modal design.
- `docs/superpowers/plans/2026-07-31-contact-investment-modal.md`: implementation plan.

## Verification Checkpoint

Run:

```powershell
node --test tests
git diff --check
git status --short
```

At the last implementation checkpoint:

- 10 tests passed, 0 failed.
- Local server returned HTTP 200.
- Desktop contact panels measured exactly equal at 590px wide and 844.140625px high.
- The form panel computed to `rgb(120, 156, 159)`.
- Form controls measured at least 50px high.
- Desktop and mobile horizontal overflow measured 0px after the footer fix.
- WhatsApp payload included representative values from every field.
- Two packages and seven FAQs were present.
- FAQ answers expanded correctly on desktop and mobile.
- Direct `#investment` opening, Escape closing, focus trapping/restoration, and the availability handoff to `#contact` passed.
- No browser console or page errors were observed.

## Recent Commits

```text
ca96029 feat: add investment and FAQ modal
4eb5e14 feat: redesign wedding enquiry form
bb84fa6 test: define contact and investment modal contract
c292e8c docs: plan contact and investment modal
9bc5504 Document contact form redesign
11090eb Standardize wedding site button colors
```

## Safety And Editing Rules

- Create a dated backup on `D:\` before substantial visual changes.
- Preserve existing user work and do not revert unrelated changes.
- Use `apply_patch` for manual edits.
- Keep the site dependency-free unless the owner explicitly approves an architecture change.
- Preserve the form field names and WhatsApp behavior.
- Keep buttons `#789c9f` with clean white text, except the approved white call-to-action on a teal panel.
- Verify desktop and mobile layouts in a real browser before declaring completion.
- Do not create more standalone preview pages; change the real site and verify it at port 8011.
- Do not push to GitHub without explicit approval.

## Suggested Claude Opening Prompt

```text
Continue work on the Blurry Visuals Weddings website using the checkpoint in
D:\BlurryVisuals-Wedding-publish\CLAUDE_HANDOFF.md.

Work only in D:\BlurryVisuals-Wedding-publish. Do not touch
D:\BlurryVisuals-publish because it is a different hosted corporate site.
Inspect git status and run node --test tests before editing. Make changes directly
in the real website, preserve the working WhatsApp form and #investment modal,
run desktop/mobile browser verification, and do not push without my approval.
```
