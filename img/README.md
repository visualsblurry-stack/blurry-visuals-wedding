# Blurry Visuals Weddings photo swap guide

Site currently uses stock photos from the Unsplash CDN (temporary, for client demo)
plus four sample YouTube wedding films. To go live with the studio's real work, add
files using this structure, then follow the swap notes below.

## Folder structure

```
img/
  hero/          01.jpg 02.jpg 03.jpg        (landscape, ≥1920px wide)
  work/          <category>-<name>.jpg        (portfolio grid)
  films/         <slug>-poster.jpg            (16:9, ≥1280px wide)
  stories/
    <couple-slug>/  cover.jpg 01.jpg 02.jpg…  (per-wedding gallery)
  about/         photographer.jpg             (portrait 4:5)
```

Category prefixes for `work/`: `wedding-` `prewedding-` `engagement-` `haldi-`
`reception-` `celebration-`. Example: `wedding-pheras-canopy.jpg`.

Prefer `.webp` or compressed `.jpg` (target < 400 KB each; hero < 700 KB).

## How to swap (real photos in, stock out)

Every image is a `background-image:url('…')` on a `.ph.ph-img` element or a URL in
`js/stories-data.js`. Swapping = replacing URLs, nothing else.

1. **Hero** (`index.html`): 3 `.hero-slide` divs — change each URL to
   `img/hero/01.jpg` etc.
2. **Portfolio** (`index.html`): 12 `.tile` frames — change each URL to
   `img/work/<category>-<name>.jpg` and update the `aria-label`.
3. **Films** (`index.html`): posters currently auto-pull from YouTube
   (`img.youtube.com/vi/<id>/hqdefault.jpg`). Replace `data-video` with the studio's
   own film URLs — posters follow automatically, or point them at `img/films/*.jpg`.
4. **Stories** (`js/stories-data.js`): replace sample couples, `cover` URLs, and each
   gallery item's `img` URL with `img/stories/<slug>/NN.jpg`. The renderer already
   handles both real images and placeholder fallback (no `img` field = styled frame).
5. **About** (`index.html`): photographer portrait frame — same URL swap.

## Homepage hero gallery

Production hero derivatives live in `img/hero/` as optimized WebP files. The
high-resolution source JPGs are preserved separately and must not be served
directly because each source is several megabytes.

## Also update when real handles exist

- Email `visualsblurry@gmail.com` and Instagram `@theblurryvisuals` are listed in
  `index.html` (contact section + JSON-LD).
- WhatsApp number lives in `js/main.js` (`WHATSAPP` constant) and the contact link.
