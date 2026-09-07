import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);

const readProjectFile = (path) => readFile(new URL(path, projectRoot), "utf8");

// stories-data.js hangs its payload off window; give it one and run it.
const loadStories = async () => {
  const src = await readProjectFile("js/stories-data.js");
  const scope = { window: {} };
  new Function("window", src)(scope.window);
  return scope.window.BLURRY_WEDDING_STORIES;
};

// The order the day actually happens in. The renderer must agree with this.
const EVENT_ORDER = [
  "haldi",
  "mehndi",
  "sangeet",
  "baraat",
  "nikah",
  "pheras",
  "vidaai",
  "reception",
  "portraits",
];
const CORE = ["haldi", "mehndi", "sangeet", "pheras", "reception"];

test("every photograph is filed under a known event", async () => {
  const stories = await loadStories();
  assert.ok(stories.length > 0, "no stories loaded");

  for (const story of stories) {
    for (const shot of story.gallery) {
      assert.ok(
        shot.event,
        `${story.slug}: "${shot.label}" carries no event`,
      );
      assert.ok(
        EVENT_ORDER.includes(shot.event),
        `${story.slug}: "${shot.label}" is filed under unknown event "${shot.event}"`,
      );
    }
  }
});

test("the renderer lists events in the order the day runs", async () => {
  const mainScript = await readProjectFile("js/main.js");

  const block = mainScript.match(/var STORY_EVENTS = \[([\s\S]*?)\n    \];/);
  assert.ok(block, "js/main.js is missing STORY_EVENTS");

  const rows = [...block[1].matchAll(/\{\s*key:\s*"(\w+)"[^}]*?core:\s*(true|false)\s*\}/g)];
  assert.equal(rows.length, EVENT_ORDER.length, "unexpected number of events");

  assert.deepEqual(
    rows.map((r) => r[1]),
    EVENT_ORDER,
    "events are not in chronological order",
  );

  const core = rows.filter((r) => r[2] === "true").map((r) => r[1]);
  assert.deepEqual(
    core,
    CORE,
    "the five rituals that always show must be exactly haldi, mehndi, sangeet, pheras, reception",
  );

  // Each event needs a human name for its fallback heading and rail label.
  for (const row of block[1].split("\n").filter((l) => l.includes("key:"))) {
    assert.match(row, /name:\s*"[^"]+"/, `event row has no name: ${row.trim()}`);
  }
});

test("chapters alternate ground and lay photographs on rows of twelve", async () => {
  const mainScript = await readProjectFile("js/main.js");

  const tones = mainScript.match(/var CHAPTER_TONES = \[([^\]]*)\]/);
  assert.ok(tones, "js/main.js is missing CHAPTER_TONES");
  const list = [...tones[1].matchAll(/"(\w+)"/g)].map((m) => m[1]);
  assert.ok(list.length >= 3, "too few tones to establish a rhythm");
  assert.ok(
    list.some((t) => t === "dark") && list.some((t) => t === "light"),
    "chapters must alternate between light and dark ground",
  );
  for (let i = 1; i < list.length; i += 1) {
    assert.notEqual(
      list[i],
      list[i - 1],
      `two chapters in a row share the ${list[i]} ground`,
    );
  }

  // Every rhythm must pair into rows that fill the twelve-column grid.
  const rhythms = mainScript.match(/var GRID_RHYTHMS = \[([\s\S]*?)\n    \];/);
  assert.ok(rhythms, "js/main.js is missing GRID_RHYTHMS");
  // One rhythm per line; each cell reads [span, "ratio"].
  const rows = rhythms[1].split("\n").filter((line) => line.includes("[["));
  assert.ok(
    rows.length >= 4,
    `only ${rows.length} layouts — chapters need their own look, not two alternating`,
  );
  for (const row of rows) {
    const spans = [...row.matchAll(/(\d+),\s*"/g)].map((m) => Number(m[1]));
    assert.equal(spans.length % 2, 0, "a rhythm must pair its photographs");
    for (let i = 0; i < spans.length; i += 2) {
      assert.equal(
        spans[i] + spans[i + 1],
        12,
        `spans ${spans[i]} + ${spans[i + 1]} do not fill a row`,
      );
    }
  }

  // The odd photograph out runs the full width rather than leaving a hole.
  assert.match(
    mainScript,
    /if \(total % 2 === 1 && i === total - 1\)/,
    "an odd trailing photograph must be widened",
  );
  assert.match(
    mainScript,
    /ratio = total === 1 \? "16\/9" : "21\/9";/,
    "a lone photograph should be a feature frame, not a letterbox strip",
  );
});

test("a chapter carries its number, time, headline and note", async () => {
  const mainScript = await readProjectFile("js/main.js");

  for (const [needle, why] of [
    ['class="chapter-eyebrow"', "the eyebrow"],
    ["copy.time", "the time of day"],
    ["copy.title || ev.name", "a headline that falls back to the ritual name"],
    ['class="chapter-note"', "the note beside the headline"],
    ['class="chapter-quote"', "the optional pull-quote"],
    ['class="chapter-shot-cap"', "a caption on each photograph"],
  ]) {
    assert.ok(mainScript.includes(needle), `a chapter is missing ${why}`);
  }

  // The rail still lists every chapter when chaptered layout is enabled.
  assert.match(
    mainScript,
    /function chapterRailHtml\(\)[\s\S]{0,120}?if \(chapters\.length < 2\) return "";/,
    "the rail must be built from the chapters actually rendered",
  );
});

test("the opening note, client words and credits render from data", async () => {
  const [mainScript, styles] = await Promise.all([
    readProjectFile("js/main.js"),
    readProjectFile("css/style.css"),
  ]);

  assert.match(
    mainScript,
    /var showStoryText = !st\.textlessStory;/,
    "real gallery pages must be able to suppress the copy-heavy story sections",
  );

  // Each optional block is skipped rather than rendered empty.
  for (const [guard, cls] of [
    ["showStoryText && st.brief", "story-brief"],
    ["st.stats && !st.hideHeroStats", "story-stats"],
    ["showStoryText && st.words", "story-words"],
  ]) {
    assert.ok(
      new RegExp(`${guard.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\n?\\s*\\?`).test(mainScript),
      `${cls} must be skipped when its data is missing`,
    );
  }

  // The rail parks below the fixed header instead of hiding behind it.
  const rail = styles.match(/\.chapter-rail\s*\{([^}]*)\}/s);
  assert.ok(rail, ".chapter-rail style block is missing");
  const railTop = Number(rail[1].match(/top\s*:\s*(\d+)px/)?.[1]);
  const headerHeight = Number(
    styles.match(/\.hdr-in\s*\{[^}]*height\s*:\s*(\d+)px/s)?.[1],
  );
  assert.ok(
    Number.isFinite(railTop) && Number.isFinite(headerHeight) && railTop >= headerHeight,
    `the rail parks at ${railTop}px, under a ${headerHeight}px header`,
  );

  // And a jump has to clear both bars.
  const scrollMargin = Number(
    styles.match(/\.chapter\s*\{[^}]*scroll-margin-top\s*:\s*(\d+)px/s)?.[1],
  );
  assert.ok(
    scrollMargin > headerHeight,
    `scroll-margin-top ${scrollMargin}px does not clear the header`,
  );
});

test("story heroes use each couple cover unless a real film file is provided", async () => {
  const [mainScript, styles] = await Promise.all([
    readProjectFile("js/main.js"),
    readProjectFile("css/style.css"),
  ]);

  assert.doesNotMatch(
    mainScript,
    /placeholder-highlight\.mp4/,
    "a shared placeholder video must not override the couple-specific cover",
  );
  assert.match(
    mainScript,
    /if \(st\.filmFile\) \{/,
    "story hero video should be opt-in via a self-hosted filmFile",
  );
  assert.match(
    mainScript,
    /heroMedia \+= '<img src="' \+ esc\(heroPoster\) \+ '" alt="">';/,
    "story hero must fall back to the couple cover image",
  );
  assert.match(
    styles,
    /\.story-hero-media video,\.story-hero-media img\{[^}]*object-fit\s*:\s*cover/s,
    "story hero images and videos must fill the hero frame",
  );
});

test("minimal real story heroes keep only the couple name and photo count", async () => {
  const [mainScript, styles] = await Promise.all([
    readProjectFile("js/main.js"),
    readProjectFile("css/style.css"),
  ]);

  assert.match(
    mainScript,
    /var minimalHero = !!st\.textlessStory;/,
    "minimal hero mode must be opt-in from story data",
  );
  assert.match(
    mainScript,
    /var crumbsHtml = minimalHero \? "" :/,
    "minimal real story heroes must remove the Home and All weddings buttons",
  );
  assert.match(
    mainScript,
    /var storyKickerHtml = minimalHero \? "" :/,
    "minimal real story heroes must remove the Real wedding label",
  );
  assert.match(
    mainScript,
    /var storyMetaHtml = minimalHero \? "" :/,
    "minimal real story heroes must remove date, venue, city and coverage metadata",
  );
  assert.match(
    mainScript,
    /story-hero' \+ \(minimalHero \? " story-hero-minimal" : ""\)/,
    "minimal real story heroes must carry a styling hook",
  );
  assert.match(
    styles,
    /body\.story-minimal\s+\.story-return\s*\{[^}]*display\s*:\s*none/s,
    "minimal real story pages must also hide the floating Home and All weddings return buttons",
  );
});

test("Shachi hero plays ten selected stills while the full gallery remains intact", async () => {
  const [stories, mainScript, styles] = await Promise.all([
    loadStories(),
    readProjectFile("js/main.js"),
    readProjectFile("css/style.css"),
  ]);

  const sachi = stories.find((story) => story.slug === "shachi-vedant");
  assert.ok(sachi, "Shachi & Vedant story is missing");
  assert.equal(sachi.gallery.length, 484, "the full Shachi gallery must remain on the page");
  assert.deepEqual(
    sachi.heroSequence,
    [
      "img/stories/shachi-vedant/257.webp",
      "img/stories/shachi-vedant/264.webp",
      "img/stories/shachi-vedant/268.webp",
      "img/stories/shachi-vedant/303.webp",
      "img/stories/shachi-vedant/304.webp",
      "img/stories/shachi-vedant/306.webp",
      "img/stories/shachi-vedant/307.webp",
      "img/stories/shachi-vedant/356.webp",
      "img/stories/shachi-vedant/369.webp",
      "img/stories/shachi-vedant/418.webp",
    ],
    "Shachi hero must use the selected close/couple frames",
  );

  assert.match(
    mainScript,
    /st\.heroSequence && st\.heroSequence\.length/,
    "story hero must detect a still-photo hero sequence",
  );
  assert.match(
    mainScript,
    /story-hero-sequence/,
    "story hero must render a layered still-photo sequence",
  );
  assert.match(
    styles,
    /@keyframes storyHeroKenburns/,
    "hero stills need a slow video-like pan and zoom",
  );
  assert.match(
    styles,
    /\.story-hero-slide\.is-active/,
    "the active hero still must be crossfaded in",
  );
});

test("Vedin and Megha hero plays ten selected stills while the full gallery remains intact", async () => {
  const stories = await loadStories();

  const vedin = stories.find((story) => story.slug === "vedin-megha");
  assert.ok(vedin, "Vedin & Megha story is missing");
  assert.equal(vedin.gallery.length, 278, "the full Vedin & Megha gallery must remain on the page");
  assert.deepEqual(
    vedin.heroSequence,
    [
      "img/stories/vedin-megha/081.webp",
      "img/stories/vedin-megha/084.webp",
      "img/stories/vedin-megha/124.webp",
      "img/stories/vedin-megha/125.webp",
      "img/stories/vedin-megha/195.webp",
      "img/stories/vedin-megha/196.webp",
      "img/stories/vedin-megha/208.webp",
      "img/stories/vedin-megha/209.webp",
      "img/stories/vedin-megha/224.webp",
      "img/stories/vedin-megha/238.webp",
    ],
    "Vedin & Megha hero must use selected couple and close frames",
  );
  assert.deepEqual(
    vedin.heroFocalPoints,
    [
      "center 43%",
      "center 43%",
      "center 45%",
      "center 45%",
      "center 44%",
      "center 43%",
      "center 45%",
      "center 45%",
      "center 44%",
      "center 44%",
    ],
    "Vedin & Megha hero stills need tuned desktop focal points",
  );
});

test("Shachi hero stills carry desktop-safe focal points", async () => {
  const [stories, mainScript, styles] = await Promise.all([
    loadStories(),
    readProjectFile("js/main.js"),
    readProjectFile("css/style.css"),
  ]);

  const sachi = stories.find((story) => story.slug === "shachi-vedant");
  assert.ok(sachi, "Shachi & Vedant story is missing");
  assert.deepEqual(
    sachi.heroFocalPoints,
    [
      "center 42%",
      "center 43%",
      "center 44%",
      "center 43%",
      "center 43%",
      "center 43%",
      "center 43%",
      "center 43%",
      "center 44%",
      "center 44%",
    ],
    "each selected hero still needs a tuned desktop focal point",
  );

  assert.match(
    mainScript,
    /var heroFocalPoints = st\.heroFocalPoints \|\| \[\];/,
    "renderer must read focal points from story data",
  );
  assert.match(
    mainScript,
    /--hero-focus:/,
    "renderer must pass the focal point to each hero still",
  );
  assert.match(
    styles,
    /object-position:var\(--hero-focus,center 45%\)/,
    "hero stills must use the tuned focal point instead of browser-center cropping",
  );
  assert.doesNotMatch(
    styles,
    /storyHeroKenburns[\s\S]{0,180}?scale\(1\.11\)/,
    "desktop hero motion must not zoom so far that faces are cropped",
  );
});

test("minimal hero copy sits lower and farther left on desktop", async () => {
  const styles = await readProjectFile("css/style.css");

  assert.match(
    styles,
    /@media \(min-width:961px\)\{[\s\S]*?\.story-hero-minimal\{[^}]*padding-bottom:42px/s,
    "desktop minimal heroes should anchor the couple copy closer to the bottom edge",
  );
  assert.match(
    styles,
    /\.story-hero-minimal \.wrap\{[^}]*left:clamp\(-44px,-2\.8vw,-18px\)/,
    "desktop minimal hero copy should sit a little farther left",
  );
});

test("Shachi's minimal hero can show only the couple name", async () => {
  const [stories, mainScript, styles] = await Promise.all([
    loadStories(),
    readProjectFile("js/main.js"),
    readProjectFile("css/style.css"),
  ]);

  const sachi = stories.find((story) => story.slug === "shachi-vedant");
  assert.ok(sachi, "Shachi & Vedant story is missing");
  assert.equal(sachi.hideHeroStats, true, "Shachi's hero count should be opt-out");
  assert.match(
    mainScript,
    /var statsHtml = st\.stats && !st\.hideHeroStats\s*\?/,
    "the hero stats row must be optional for name-only story heroes",
  );
  assert.match(
    styles,
    /\.story-hero-minimal\{padding-bottom:42px;\}/,
    "the name-only desktop hero should sit a little lower",
  );
});

test("every story uses the clean name-only gallery treatment", async () => {
  const stories = await loadStories();

  for (const story of stories) {
    assert.equal(
      story.textlessStory,
      true,
      `${story.slug}: story pages should use the clean photo-first layout`,
    );
    assert.equal(
      story.hideHeroStats,
      true,
      `${story.slug}: the hero should show only the couple name`,
    );
  }
});

test("core rituals always render, the rest only when photographed", async () => {
  const mainScript = await readProjectFile("js/main.js");

  // A non-core event with nothing in it never becomes a chapter.
  assert.match(
    mainScript,
    /return ev\.core \|\| \(byEvent\[ev\.key\] \|\| \[\]\)\.length > 0;/,
    "non-core events must be dropped when empty",
  );

  // An empty core event still renders, with a note instead of a grid.
  assert.match(
    mainScript,
    /shots\.length\s*\?\s*'<div class="chapter-grid">'[\s\S]{0,220}?:\s*'<p class="chapter-empty">/,
    "an empty core event must fall back to the placeholder note",
  );
  assert.match(
    mainScript,
    /is-empty/,
    "an empty chapter must be marked so it can be shown quietly",
  );

  // Every photograph lands somewhere even without a tag.
  assert.match(
    mainScript,
    /var key = g\.event \|\| "portraits";/,
    "an untagged photograph must still be filed somewhere",
  );

  // The rail mirrors the page only when the chaptered layout is active.
  assert.match(
    mainScript,
    /var chapterNavHtml = useChapters \? chapterRailHtml\(\) : "";/,
    "the flat gallery must suppress the chapter rail without deleting it",
  );
});

test("real stories produce sections that add up", async () => {
  const stories = await loadStories();

  for (const story of stories) {
    const byEvent = {};
    for (const shot of story.gallery) {
      (byEvent[shot.event] ??= []).push(shot);
    }

    // Nothing is lost or duplicated in the grouping.
    const grouped = Object.values(byEvent).reduce((n, a) => n + a.length, 0);
    assert.equal(
      grouped,
      story.gallery.length,
      `${story.slug}: grouping lost photographs`,
    );

    // Every story renders at least the five core sections.
    const rendered = EVENT_ORDER.filter(
      (key) => CORE.includes(key) || (byEvent[key] || []).length > 0,
    );
    assert.ok(
      rendered.length >= CORE.length,
      `${story.slug}: fewer than five sections`,
    );
    for (const key of CORE) {
      assert.ok(rendered.includes(key), `${story.slug}: missing core section ${key}`);
    }
  }

  assert.ok(EVENT_ORDER.includes("nikah"), "the renderer must keep nikah as a supported event");
});

test("the first three story cards use real local wedding galleries", async () => {
  const stories = await loadStories();
  const expected = [
    ["shachi-vedant", "Shachi", "Vedant", 484],
    ["vedin-megha", "Vedin", "Megha", 278],
    ["niki-swapnesh", "Niki", "Swapnesh", 243],
  ];

  for (const [index, slug, first, second, count] of expected.map((row, i) => [i, ...row])) {
    const story = stories[index];
    assert.equal(story.slug, slug);
    assert.deepEqual(story.couple, [first, second]);
    assert.equal(story.gallery.length, count);
    assert.equal(story.noPlaceholders, true);
    assert.equal(story.textlessStory, true);
    assert.match(story.cover, new RegExp(`^img/stories/${slug}/cover\\.webp\\?v=20260907h$`));

    story.gallery.forEach((shot, shotIndex) => {
      const frame = String(shotIndex + 1).padStart(3, "0");
      assert.equal(
        shot.img,
        `img/stories/${slug}/${frame}.webp`,
        `${slug}: expected full gallery frame ${frame}`,
      );
      assert.match(
        shot.img,
        new RegExp(`^img/stories/${slug}/\\d{3}\\.webp$`),
        `${slug}: ${shot.img} is not a generated local WebP`,
      );
      assert.notEqual(shot.placeholder, true, `${slug}: real gallery contains a placeholder`);
    });

    assert.deepEqual(story.stats, [[String(count), "Photographs"]]);
  }
});

test("the homepage story grid shows three real covers and no coming-soon teaser", async () => {
  const [stories, mainScript] = await Promise.all([
    loadStories(),
    readProjectFile("js/main.js"),
  ]);

  const homepageStories = stories.filter((story) => story.noPlaceholders || story.homepageTeaser);
  assert.deepEqual(
    homepageStories.map((story) => story.slug),
    ["shachi-vedant", "vedin-megha", "niki-swapnesh"],
    "the homepage should show all three real galleries, none of them a teaser",
  );
  assert.ok(
    homepageStories.every((story) => !story.homepageTeaser),
    "no current story should render as a coming-soon teaser",
  );

  // The coming-soon rendering path stays in main.js even though nothing
  // uses it today - a future placeholder story can still opt in.
  assert.match(
    mainScript,
    /BLURRY_WEDDING_STORIES\.filter\(function \(st\) \{\s*return st\.noPlaceholders \|\| st\.homepageTeaser;\s*\}\)\.map/,
    "homepage story cards must filter out second-row placeholders",
  );
  assert.match(
    mainScript,
    /st\.homepageTeaser[\s\S]{0,240}?data-cursor="Coming soon"/,
    "the coming-soon rendering path must still exist for a future teaser story",
  );
  assert.match(
    mainScript,
    /st\.homepageTeaser[\s\S]{0,360}?<article class="story-card rv story-card-soon"/,
    "teaser cards must render as non-link cards so clicks cannot open the inner page",
  );
});

test("placeholder-backed stories have copy and four frames per chapter", async () => {
  const stories = await loadStories();

  for (const story of stories) {
    if (story.noPlaceholders) continue;

    const byEvent = {};
    for (const shot of story.gallery) {
      (byEvent[shot.event] ??= []).push(shot);
    }

    // Every chapter the renderer will draw for this wedding.
    const rendered = EVENT_ORDER.filter(
      (key) => CORE.includes(key) || (byEvent[key] || []).length > 0,
    );

    for (const key of rendered) {
      const shots = byEvent[key] || [];
      assert.ok(
        shots.length >= 4,
        `${story.slug}: ${key} has ${shots.length} frames, needs at least 4`,
      );
      assert.ok(
        story.chapters[key] && story.chapters[key].title,
        `${story.slug}: ${key} has no chapter copy`,
      );
      assert.ok(
        story.chapters[key].note,
        `${story.slug}: ${key} has no note`,
      );

      // A chapter must not show the same frame twice.
      const srcs = shots.map((s) => s.img);
      assert.equal(
        new Set(srcs).size,
        srcs.length,
        `${story.slug}: ${key} repeats a photograph`,
      );
    }

    for (const shot of story.gallery) {
      assert.ok(shot.label, `${story.slug}: a photograph has no caption`);
      assert.ok(shot.img, `${story.slug}: "${shot.label}" has no image`);
    }
  }
});

test("placeholder photographs are flagged so they can be swapped out", async () => {
  const [stories, src] = await Promise.all([
    loadStories(),
    readProjectFile("js/stories-data.js"),
  ]);

  const placeholders = stories.flatMap((s) =>
    s.gallery.filter((g) => g.placeholder),
  );
  assert.ok(placeholders.length > 0, "no photographs are marked as placeholders");

  for (const shot of placeholders) {
    assert.match(
      shot.img,
      /^https:\/\/images\.(pexels|unsplash)\.com\//,
      `placeholder "${shot.label}" is not a known stock CDN URL`,
    );
  }

  // The block has to be removable in one piece when real galleries arrive.
  assert.match(
    src,
    /PLACEHOLDER PHOTOGRAPHS[\s\S]{0,400}?delete this whole block/i,
    "the placeholder block must say plainly that it is disposable",
  );
});

test("the story closes by inviting the reader", async () => {
  const [mainScript, styles] = await Promise.all([
    readProjectFile("js/main.js"),
    readProjectFile("css/style.css"),
  ]);

  assert.match(
    mainScript,
    /Your story could be<br><em>next<\/em>/,
    "the closing panel must carry the invitation",
  );

  const close = mainScript.match(/'<section class="story-close">[\s\S]*?"<\/section>";/);
  assert.ok(close, "the closing section is missing");
  assert.match(
    close[0],
    /href="index\.html#contact"[^>]*data-cursor="Enquire"[^>]*>Get in touch</,
    "the closing button must reach the enquiry form",
  );
  // The other half of the panel carries the reader on to the next wedding.
  assert.match(
    close[0],
    /class="story-close-next" href="story\.html\?s='/,
    "the closing panel must offer the next story",
  );

  // It is the last thing rendered.
  assert.match(
    mainScript,
    /'<section class="story-close">[\s\S]*?"<\/section>";\s*\n/,
    "the closing panel must terminate the rendered markup",
  );

  // Legible: white copy over a darkened cover photograph, not bare over it.
  assert.match(
    styles,
    /\.story-close-next::after\s*\{[^}]*linear-gradient\([^)]*rgba\(12,\s*35,\s*38/is,
    "the next-story panel needs a scrim over its photograph",
  );
});
