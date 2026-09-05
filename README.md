# Blurry Visuals Weddings

A static wedding photography and films website for Blurry Visuals Weddings, Mumbai.

## Run locally

From this folder, start a local web server:

```powershell
python -m http.server 8000
```

Then open <http://127.0.0.1:8000/>.

## Project structure

- `index.html` - main wedding website
- `story.html` - individual wedding story page
- `css/style.css` - layout, colors, typography, and responsive styles
- `js/main.js` - navigation, galleries, forms, films, and story rendering
- `js/stories-data.js` - wedding story content and image URLs
- `fonts/` - optional licensed TAN Angelton font files
- `img/` - optimized studio photography, story galleries, and social preview assets

The homepage hero and the first two wedding stories use optimized local studio photographs. Remaining coming-soon stories may still use placeholder imagery, film previews are loaded from YouTube, and fallback web fonts are loaded from Google Fonts. TAN Angelton is not bundled because its licensed font file is not currently available; add it to `fonts/` using the filenames documented there.

## Publish

This is a static site and can be deployed directly with GitHub Pages, Netlify, Vercel, or any standard web server.
