# Founder Portrait Frames Design

## Goal

Replace the generic wedding photograph in the homepage About section with clear, individual portraits of founders Akash and Gautam, using the approved Option A twin-frame layout.

## Content

- Use `Akash.jpeg` for Akash and `Gautam.jpg` for Gautam.
- Display the portraits in this order: Akash, then Gautam.
- Label each portrait with the founder's name.
- Change every visible `Aakash` reference on the website to `Akash`, including the About copy, founder biography, and WhatsApp contact label.
- Keep the existing About heading, biographies, studio description, and facts otherwise unchanged.

## Visual Treatment

- Replace the About section's existing wedding image with two equal portrait frames placed side by side on desktop and tablet widths.
- Give each portrait its own crop and focal position so both faces remain unobstructed and visually clear despite the source photos having different compositions.
- Use the restrained framed treatment approved in Option A, aligned with the site's existing typography, secondary color, border weight, and square editorial geometry.
- Place each founder's name directly below the corresponding image without adding decorative copy or new biography text.
- Avoid overlapping portraits, heavy effects, or a composite image so each founder receives equal visual weight.

## Responsive Behavior

- Preserve the existing two-column About layout on desktop, with the portrait pair occupying the current media column and the About copy occupying the text column.
- Keep the two founder frames side by side while there is enough width for legible labels and clear faces.
- Stack the frames into a single column on narrow phones to prevent cramped crops or clipped names.
- Reserve stable image dimensions with an explicit portrait aspect ratio so image loading does not shift surrounding content.

## Image Delivery And Accessibility

- Create optimized WebP copies under `img/founders/`; keep the supplied original files unchanged.
- Use semantic `<figure>` and `<img>` elements rather than CSS background images.
- Give each image concise alt text that identifies the pictured founder.
- Provide responsive image sizing and lazy loading while preserving natural image sharpness.

## Verification

- Add automated checks for both founder images, labels, alt text, the `Akash` spelling, and responsive frame behavior.
- Confirm there are no remaining visible `Aakash` references.
- Run the complete Node test suite.
- Inspect the live About section at desktop and narrow mobile widths, confirming that both faces, labels, biographies, and facts remain clear and stable.
