# Wedding films

Each story page plays a silent, looping cinematic highlight **behind the couple's
name** in the hero. Nothing is embedded from YouTube; the file is served from this
site.

## Where to put a couple's film

```
video/stories/<slug>.mp4
```

The `<slug>` must match the `slug` field in `js/stories-data.js`:

| Couple | File to add |
| --- | --- |
| Anaya & Rohan | `video/stories/anaya-rohan.mp4` |
| Meher & Zain | `video/stories/meher-zain.mp4` |

List every slug the site expects:

```bash
grep -o 'slug: "[a-z-]*"' js/stories-data.js
```

## Turning a film on

A story uses its own film once its entry in `js/stories-data.js` names one:

```js
filmFile: "video/stories/anaya-rohan.mp4",
filmPoster: "img/hero/hero-sachi-vedant-184.webp",
```

`filmPoster` is the still shown while the film loads. Without it the story's
`cover` image is used instead.

Until `filmFile` is set, the hero falls back to `video/placeholder-highlight.mp4`
— a slow pan across three of the studio's own photographs, generated so the
effect can be seen before real films arrive. Delete it once every story has its
own film.

## Encoding

The film is a muted background loop, so it should be small and start fast. Aim
for a 10-20 second cut rather than the full highlight reel:

- H.264 MP4, 1920x1080, no audio track
- CRF 24-28; a 15-second loop should land under 5 MB
- Faststart, so playback begins before the whole file arrives

```bash
ffmpeg -i source.mov -t 15 -an -c:v libx264 -crf 26 -preset slow \
  -vf scale=1920:-2 -pix_fmt yuv420p -movflags +faststart \
  video/stories/anaya-rohan.mp4
```

Trim so the last frame resembles the first — the loop is seamless only if the
cut is.

## Notes

- Autoplay requires the video to be muted. Do not add an audio track; browsers
  will refuse to start it.
- Visitors who ask for reduced motion get the poster image and no playback.
- `video/stories/` is gitignored. Films are large binaries and do not belong in
  the repository; if one grows past ~20 MB, host it on Vimeo or a CDN and point
  `filmFile` at that URL instead.
