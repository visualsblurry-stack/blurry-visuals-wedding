# Contact Form And Investment Modal Redesign

## Objective

Redesign the wedding-site contact section as an editorial "Get in touch" experience. The approved direction uses two equal panels over a softly veiled wedding photograph: a light information panel on the left and a branded teal enquiry panel on the right.

## Visual Direction

- Use the existing wedding palette only: pure white, `#789c9f`, and the site's established teal text tokens.
- Place a local wedding photograph behind the contact area with a strong white veil so it supports the panels without reducing readability.
- Give both panels identical width and rendered height on desktop.
- Keep corners restrained at 4px or less and use one consistent, subtle elevation shadow.
- Preserve generous spacing and editorial typography so the section feels like a photography website rather than a spreadsheet or generic hosted form.

## Left Information Panel

- Use a near-opaque white surface.
- Retain the existing heading, supporting copy, phone, email, Instagram, and studio information.
- Present contact methods as four comfortable rows with locally embedded Lucide line icons.
- Keep each row at least 64px high and allow long values to wrap safely.

## Right Enquiry Panel

- Use `#789c9f` as the panel background with white headings, labels, entered values, and icons.
- Add the hierarchy `Get in touch`, `Begin your story`, and one short supporting sentence.
- Preserve every current field and its name so the existing WhatsApp message builder continues to work:
  - Couple / client name
  - Event type
  - Event date(s)
  - City
  - Venue (if booked)
  - Wedding details
- Arrange the name field full width, event and date as a pair, city and venue as a pair, and the message full width.
- Use softly filled, individually framed field surfaces rather than underline-only inputs.
- Give every field a familiar Lucide line icon. Icons are decorative and use `aria-hidden="true"`; visible labels remain the accessible field names.
- Use locally embedded inline Lucide SVG markup so the form does not depend on a third-party icon script or network request.

## Submit Action

- Change the visible button label from `Send via WhatsApp` to `Send`.
- Add a Lucide Send icon.
- Use the approved white button with teal text so the primary action contrasts clearly against the teal panel.
- Preserve the current submit event, validation, WhatsApp destination, and pre-filled message behavior.
- Retain a concise note that submission opens WhatsApp and does not store the form data.

## Responsive Behavior

- At desktop widths, use two equal columns and matching panel heights.
- At tablet and mobile widths, stack the light panel above the teal form panel.
- Collapse the form to one column on narrow screens while preserving the approved field order.
- Keep inputs and buttons at least 48px high, prevent horizontal overflow, and allow labels and contact values to wrap.

## Interaction And Accessibility

- Preserve semantic labels, native inputs, select, textarea, and submit button.
- Use visible white focus treatment on teal field surfaces and the existing teal focus treatment on the light panel.
- Keep keyboard operation and browser validation intact.
- Maintain reduced-motion behavior and avoid decorative field animations.

## Verification

- Add a regression test for the contact hierarchy, all existing field names, local inline icons, the `Send` label, and the unchanged WhatsApp handler contract.
- Verify desktop, tablet, and mobile layouts in Chrome.
- Confirm equal desktop panel heights, one-column mobile layout, 48px touch targets, no overlap, and no horizontal overflow.
- Submit representative values and confirm the generated WhatsApp URL still includes every field.
- Check for local request failures, console errors, and page errors.

## Investment & FAQs Modal

- Add an `Investment` entry to the homepage and story-page header, mobile drawer, and footer navigation.
- Open the content as a full-screen editorial modal over the current page, never as a separate website page.
- Use `#investment` as a shareable URL state. Loading that hash opens the modal; closing it removes the hash without reloading the page.
- Present Basic (`Rs 1,75,000`, single day) and Signature (`Rs 2,55,000`, single day) collections with their approved crew and deliverables, followed by the outstation travel note.
- Include seven working FAQ accordions covering services, packages, crew selection, location and travel, image counts and timing, photographic approach, and cinematography versus traditional videography.
- Provide close-button, backdrop, and Escape dismissal; lock page scrolling while open; trap keyboard focus inside the dialog; restore focus on close; and keep `aria-expanded`, `aria-controls`, `hidden`, `role="dialog"`, and `aria-modal` states accurate.
- Make package and final availability actions close the modal and move the client to the existing enquiry form.
- Keep the modal fully responsive, with two package columns on desktop and one column on mobile, no horizontal overflow, and 44px minimum interactive targets.
