# Blurry Visuals Weddings Redesign

Date: 2026-07-29
Status: Approved for implementation planning

## Goal

Redesign the existing wedding website as a polished public portfolio and enquiry experience for prospective wedding clients. The site should feel cinematic and editorial, softened by candid documentary warmth. It must work reliably across phones, tablets, laptops, and wide desktop displays, provide clear package information, and turn enquiries into email notifications.

The redesign will migrate the current static HTML/CSS/JavaScript site to React and Vite with maintainable `src/` and `public/` directories.

## Backup Baseline

Before any repository change, a complete backup was created at:

`D:\BlurryVisuals-Wedding-backup-2026-07-29-145510`

The backup contains 47 files, matches the source copy by SHA-256, includes the full `.git` directory, and points to baseline commit `fbb3ed87e5c5bb0865ea39fe3751b09bd7bacb2b`.

## Product Scope

### In scope

- A public Blurry Visuals Weddings portfolio for prospective clients
- A redesigned homepage
- A dedicated, shareable Investment & FAQs page
- Shareable real-wedding story experiences
- A working enquiry form that sends email notifications
- Responsive, accessible interactions and graceful error states
- Temporary demo imagery that is straightforward to replace with original work
- GitHub Pages-compatible production output

### Out of scope

- Private or password-protected client galleries
- Client login, image downloads, favourites, proofing, or album selection
- A CMS or photographer admin dashboard
- Payment collection or package checkout
- Changes to the existing corporate site in `D:\BlurryVisuals-publish`

## Brand And Contact Details

- Public name: **Blurry Visuals Weddings**
- Identity: reuse the official Blurry Visuals logo and add a restrained `Weddings` descriptor
- Logo source for migration: `D:\BlurryVisuals-publish\src\assets\blurry-visuals-logo-cropped.png`
- Primary email and form notification recipient: `visualsblurry@gmail.com`
- Phone and WhatsApp: `+91 70323 90419`
- Instagram: use the existing Blurry Visuals account, `https://www.instagram.com/theblurryvisuals/`
- Location language: based in Mumbai and available for destination weddings

All Pheraa names, metadata, social handles, and contact references will be removed from the redesigned project.

## Information Architecture

### Homepage

1. Full-bleed cinematic hero with the brand as a first-viewport signal
2. Curated photography portfolio with lightweight category filtering
3. Featured wedding films
4. Selected real-wedding stories
5. Photographer approach and credibility
6. Client testimonials
7. Working Get in Touch form
8. Contact details and footer

The hero must leave a visible hint of the next section at common mobile and desktop viewport heights.

### Investment & FAQs

The dedicated page will use the clean shareable path `investment-faqs/` and contain:

1. Editorial introduction to coverage and investment
2. Basic package
3. Signature package
4. Outstation travel and accommodation note
5. Explanation that coverage can be tailored to event scope
6. Accessible FAQ accordion
7. Final CTA linking to the homepage enquiry form

### Wedding stories

Existing stories remain shareable through `story/?s=<slug>`, preserving the current slug-based links without requiring a server router. Each story includes the couple, date, venue, location, short narrative, responsive image gallery, optional film, and previous/next story navigation. Story data remains separate from page components.

## Visual Direction

The selected direction is **Editorial Wedding Journal** with occasional film-led moments.

### Palette

- Signature teal: `#789c9f`
- Main canvas: `#ffffff`
- Deep teal ink for readable text and dark surfaces
- Soft mist gray for secondary section bands and dividers
- Ceremonial gold used only as a restrained detail, never as a competing dominant hue

All colors will be represented by semantic CSS custom properties rather than repeated raw values inside components.

### Typography

- Official logo image for the primary brand mark
- An elegant editorial display face for headings and story titles
- A highly readable body face for navigation, copy, forms, and metadata
- TAN Angelton remains an optional licensed enhancement; the website must not request a missing font file
- Type sizes use bounded responsive values and never scale directly with viewport width

### Composition

- Full-bleed photography with natural colour and minimal image veils
- Localised hero contrast behind text instead of a page-wide colour wash
- Asymmetric editorial grids on large screens
- Single-column narrative flow on small screens
- Generous whitespace and full-width section bands
- No nested cards, decorative gradient orbs, or generic marketing-card layouts
- Stable image aspect ratios to prevent cumulative layout shift

### Motion

- Slow hero crossfade with readable stationary content
- Short scroll reveals using opacity and transform only
- Subtle image and control feedback on hover or press
- Content is visible by default so failed or delayed observers cannot create blank sections
- `prefers-reduced-motion` disables autoplaying and decorative transitions

## Investment Content

### Package 1: Basic

- Price: ₹1,75,000 for a single day
- Positioning: ideal for an intimate or small wedding gathering
- Photography team: 1 traditional photographer and 1 candid photographer
- Cinematography team: 1 traditional cinematographer and 1 lead cinematographer
- Deliverables:
  - 800 to 1,000 edited images
  - 4 to 5 minute storytelling highlight
  - 2 vertical reels from any two events
  - Cinematic documentary and raw cut of separate events

### Package 2: Signature

- Price: ₹2,55,000 for a single day
- Positioning: ideal for a destination or large wedding gathering
- Photography team: 1 traditional photographer and 2 candid photographers
- Cinematography team: 1 traditional cinematographer and 2 lead cinematographers
- Deliverables:
  - 1,200 to 1,500 edited images
  - 1 minute teaser
  - 4 to 5 minute storytelling highlight
  - 20 minute cinematic documentary and raw-cut wedding film

Travel and accommodation are additional for outstation locations. The page must state that final scope and timelines are confirmed in the proposal for each wedding.

## FAQ Content Strategy

The reference topics will be retained, but every answer will be rewritten for Blurry Visuals Weddings. The page must not reproduce unverified claims about a 15-person team, simultaneous wedding capacity, Mumbai and Udaipur offices, or investment beginning at ₹3,50,000.

FAQ topics:

1. What services do you offer?
2. What are your packages?
3. How is the crew selected for a wedding?
4. Where are you based, and do you travel?
5. How many pictures will we receive, and when?
6. How do you photograph weddings?
7. What is the difference between cinematography and traditional videography?

Package and image-count answers must match the published Basic and Signature package details. Delivery timing will be described as proposal-specific rather than promising an unconfirmed universal turnaround.

## Interactions

### Navigation

- Shared header and footer across all pages
- Desktop navigation with one visually dominant enquiry action
- Compact mobile menu with correct expanded state, Escape support, focus return, and body-scroll management
- Investment & FAQs has a persistent navigation link and clean shareable URL

### Portfolio

- Category filters update the visible work without a page reload
- Active filter is communicated visually and with accessible state
- Images preserve dimensions while filtering to avoid layout jumps

### Films

- Film cards use clear play controls rather than decorative text buttons
- Videos open in an accessible lightbox
- The lightbox supports close button, overlay close, Escape, focus trapping, and focus return
- Unavailable embeds provide a direct external video link instead of an empty frame

### FAQs

- Questions are semantic buttons with `aria-expanded` and associated answer regions
- Keyboard and touch operation are equivalent
- On small screens, opening a question closes the previously opened answer
- Motion uses a short opacity/transform transition and respects reduced-motion settings

## Get In Touch Flow

### Fields

- Couple's names, required
- Email address, required
- Phone or WhatsApp number, required
- Event type, required
- Package interest, optional
- Wedding date or date range
- City
- Venue
- Wedding details, required
- Off-screen honeypot field for basic spam filtering

### Submission

- Reuse the working Formspree endpoint from `blurryvisuals.in`: `https://formspree.io/f/mdavbyze`
- Submit JSON with an explicit source value of `blurryvisuals-wedding contact form`
- Disable the submit control and show `Sending...` while the request is active
- Reset the form only after a successful response
- Announce sending, success, and error states through an `aria-live` status region
- Success message: `Inquiry sent. We will reply within two working days.`
- Error recovery offers a prefilled email to `visualsblurry@gmail.com` and a prefilled WhatsApp message to `+91 70323 90419`
- User-entered information remains available after a failed network submission

A single live test enquiry, clearly labelled as a website test, will be sent during verification. The user will confirm receipt in Gmail.

## React And Vite Architecture

The site will use a Vite multi-page build rather than a client-side SPA router. This produces clean static URLs and reliable direct loads on GitHub Pages.

```text
BlurryVisuals-Wedding-publish/
  index.html
  investment-faqs/
    index.html
  story/
    index.html
  public/
    robots.txt
  src/
    assets/
    components/
    data/
    pages/
    styles/
    entries/
  package.json
  vite.config.js
```

### Boundaries

- `assets/`: logo, photographs, posters, and other visual files imported through Vite so emitted paths work from nested pages
- `components/`: shared header, footer, buttons, filters, lightbox, package presentation, FAQ accordion, enquiry form, and image fallbacks
- `data/`: packages, FAQs, portfolio items, films, testimonials, stories, and contact constants
- `pages/`: page-level composition only
- `entries/`: one small React mount per static page
- `styles/`: semantic tokens, global rules, layout primitives, components, and responsive overrides
- `public/`: root-level deployment files that do not participate in page layout, such as `robots.txt`

No component should own business content that belongs in structured data. Form submission will be isolated in a small service/helper so it can be tested without rendering the whole site.

Vite will use `base: './'`, and page visuals will be imported from `src/assets/`. This keeps emitted asset references relative so the same production build can run from a GitHub Pages project subdirectory or a standard web root. Page components must not depend on root-absolute `/public-file` URLs.

## Responsive And Accessibility Requirements

- Validate at 375px, 768px, 1024px, and 1440px widths
- Include small-phone and tablet landscape checks
- No horizontal page scrolling at any supported size
- Minimum 16px form input text on mobile
- Minimum 44px touch targets and at least 8px between adjacent targets
- Visible keyboard focus states on every interactive element
- Sequential heading hierarchy and a skip-to-content link
- Descriptive alternative text or accessible labels for meaningful photography
- Decorative imagery remains hidden from assistive technology
- Body text contrast meets WCAG AA at 4.5:1
- Large display text and interface boundaries meet at least 3:1
- Layout remains usable at 200% zoom
- Reduced-motion mode keeps all content and controls fully available

## Performance And Resilience

- Hero imagery is prioritised; below-fold images are lazy loaded
- Responsive image sizes and stable aspect ratios reduce bandwidth and layout shift
- Temporary Unsplash and YouTube assets remain isolated in data for later replacement
- Avoid a heavy animation framework unless browser verification shows CSS and small JavaScript helpers cannot meet the approved design
- Missing images show a branded neutral fallback without collapsing layout
- Missing story slugs show a useful not-found state and route back to real weddings
- Failed video embeds show a direct link
- Failed form submissions retain all fields and expose email and WhatsApp recovery actions

## SEO And Sharing

- Unique title and description for the homepage, Investment & FAQs, and wedding stories
- Open Graph title, description, image, and page type
- Professional service structured data updated to Blurry Visuals Weddings
- Social image uses an actual wedding photograph with readable brand placement
- Canonical and absolute Open Graph URLs will be added when the final production domain is selected; the build will not publish guessed production URLs

## Verification And Acceptance Criteria

Implementation is complete only when all of the following pass:

1. Dependency installation and Vite production build exit successfully.
2. Unit tests cover FAQ state, portfolio filtering, form validation, successful submission, failed submission, and story-not-found behaviour.
3. Browser tests load every static page directly from production output.
4. Desktop and mobile screenshots show no overlap, clipping, blank reveal sections, or horizontal overflow.
5. Keyboard testing covers navigation, filters, lightbox, FAQs, form fields, and close behaviour.
6. Reduced-motion testing confirms content remains visible and usable.
7. Browser console contains no errors and local resources return no 404 responses.
8. Theme computation confirms `#789c9f` as the signature teal.
9. Contact links use `visualsblurry@gmail.com` and `+91 70323 90419`.
10. Formspree returns a successful response for the labelled live test enquiry, followed by user confirmation that Gmail received it.
11. The final Git diff contains only the approved wedding-site migration and documentation.

## Version Control Strategy

Implementation will occur in the existing `BlurryVisuals-Wedding-publish` repository after the approved specification and implementation plan. The backup remains untouched. Changes will be committed in reviewable stages, and no push will occur unless the user requests it after reviewing the finished local site.
