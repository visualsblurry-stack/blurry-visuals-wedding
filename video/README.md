# Wedding films

Put each couple's cinematic highlight film here:

```
video/stories/<slug>.mp4
```

The `<slug>` must match the `slug` field in `js/stories-data.js`. Current slugs:

| Couple | File to add |
| --- | --- |
| Anaya & Rohan | `video/stories/anaya-rohan.mp4` |
| Meher & Zain | `video/stories/meher-zain.mp4` |

Run this to list every slug the site expects:

```bash
grep -o 'slug: "[a-z-]*"' js/stories-data.js
```

## Turning a file on

A story only uses a local film once its entry in `js/stories-data.js` names one:

```js
filmFile: "video/stories/anaya-rohan.mp4",
filmPoster: "img/hero/hero-sachi-vedant-184.webp",
```

`filmPoster` is the still shown before playback; it is optional but worth setting,
because without it the browser shows a black rectangle until the film loads.

Until `filmFile` is set, the page falls back to the `film` YouTube link and shows a
click-to-play cover, so nothing is embedded until a visitor actually asks for it.

## Encoding

Keep films web-friendly, roughly:

- H.264 MP4, AAC audio, 1920x1080
- 6-10 Mbps, which lands a 90-second highlight around 60-100 MB
- Faststart enabled so playback can begin before the whole file arrives

```bash
ffmpeg -i source.mov -c:v libx264 -crf 21 -preset slow -vf scale=1920:-2 \
  -c:a aac -b:a 160k -movflags +faststart video/stories/anaya-rohan.mp4
```

Large films are better served from Vimeo, YouTube, or a CDN than committed here —
`.gitignore` excludes `video/stories/` for that reason.
