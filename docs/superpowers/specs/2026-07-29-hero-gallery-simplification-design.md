# Hero Gallery Simplification Design

## Goal

Make the homepage hero feel image-first rather than copy-heavy. Keep the three existing hero photographs, add all six supplied Blurry Visuals wedding photographs, and let visitors move through the nine-image gallery with dots or a horizontal swipe on mobile.

## Content Hierarchy

The hero retains the site header and two conversion paths, but removes decorative and explanatory copy that competes with the photography.

- Eyebrow: `Wedding photography & films`
- Heading: `Love, beautifully remembered.` with `beautifully` in the existing italic display treatment
- Supporting line: `Honest photographs and cinematic films, wherever your story takes us.`
- Primary action: `Check availability`
- Secondary action: `View stories`

Remove the circular text ornament and the three bottom hero labels. Navigation remains unchanged.

## Image Set

The existing three hero images remain in the rotation. Add all six source photographs from:

`D:\BlurryVisuals-Wedding-publish\.worktrees\wedding-rebrand\img\weddingHeroPhotos`

The source JPG files remain untouched. Create web-ready derivatives in the main publish repository under `img/hero/` using short ASCII filenames and WebP encoding. Limit the long edge to 1920 pixels, preserve aspect ratio and colour profile, strip unnecessary metadata, and target a quality level that keeps each image visually clean while avoiding multi-megabyte downloads.

Each slide receives an explicit focal position so `background-size: cover` keeps faces and gestures visible at desktop, tablet, and mobile aspect ratios. Portrait images use a lower vertical focal point on wide screens; landscape images use focal positions suited to their subjects.

Only the initial slide is assigned immediately. Other slides store their URL in `data-bg`; JavaScript preloads the next slide and loads any dot-selected slide before activating it. A failed preload leaves the current slide visible rather than showing a blank frame.

## Gallery Interaction

Autoplay continues at the existing approximately five-second rhythm. The active slide and active dot always move together.

- Nine dot controls appear as one compact group near the lower edge of the content area.
- Each visible dot is small, but its button has a minimum 44 by 44 pixel hit area.
- Each button has an accessible label such as `Show hero image 4` and the active button uses `aria-current="true"`.
- Selecting a dot activates that image and restarts the autoplay interval.
- Autoplay pauses while the hero is hovered or while a control has keyboard focus.
- `prefers-reduced-motion: reduce` disables autoplay and animated crossfades while preserving manual controls.
- Mobile and touch users can swipe left or right. A swipe triggers only when horizontal movement is at least 48 pixels and exceeds vertical movement, so normal page scrolling is not trapped.
- Dot controls remain keyboard operable through native buttons; no custom keyboard model is required.

## Responsive Layout

The shorter heading should occupy no more than two or three lines depending on viewport width. Supporting copy remains a single concise paragraph with a controlled line length. On mobile, the controls sit below the actions without overlapping the couple, brand header, or browser safe areas. The hero keeps stable dimensions and must not introduce horizontal scrolling.

## Accessibility

Hero photographs remain decorative because the same images are not conveying page content independently of the heading. The dot group receives an accessible gallery label, every dot names its destination, focus indicators use the existing site treatment, and colour contrast remains readable over every slide through the existing image veil, adjusted only if screenshots show a failure.

## Testing

Automated checks should verify:

- The hero contains nine slides and nine dot buttons.
- All six new WebP assets exist, decode successfully, stay within the intended dimensions, and are reasonably compressed.
- The simplified heading, supporting line, and button labels are present.
- The removed ring and bottom marker markup are absent.
- Dot selection changes the active slide and `aria-current` state.
- Mobile swipe moves forward and backward without blocking vertical scrolling.
- Reduced-motion mode keeps manual navigation and disables autoplay.

Browser QA must cover 1440x900, 768x1024, and 390x844 viewports. Confirm focal crops, readable copy, working dots, mobile swipes, no overlap, no horizontal overflow, and no console or local-resource errors.

## Non-Goals

- Do not remove or replace the existing three hero photographs.
- Do not alter the supplied source JPG files.
- Do not redesign the portfolio, story pages, investment section, contact form, or global navigation.
- Do not modify `D:\BlurryVisuals-publish`.
