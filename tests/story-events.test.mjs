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

  // Each event needs a human name and a line of copy under it.
  for (const row of block[1].split("\n").filter((l) => l.includes("key:"))) {
    assert.match(row, /name:\s*"[^"]+"/, `event row has no name: ${row.trim()}`);
    assert.match(row, /note:\s*"[^"]+"/, `event row has no note: ${row.trim()}`);
  }
});

test("core rituals always render, the rest only when photographed", async () => {
  const mainScript = await readProjectFile("js/main.js");

  // A non-core event with nothing in it produces no markup at all.
  assert.match(
    mainScript,
    /if \(!shots\.length && !ev\.core\) return "";/,
    "non-core events must be dropped when empty",
  );

  // An empty core event still renders, with a note instead of a grid.
  assert.match(
    mainScript,
    /shots\.length\s*\?\s*'<div class="story-gallery">'[\s\S]{0,160}?:\s*'<p class="story-event-empty">/,
    "an empty core event must fall back to the placeholder note",
  );
  assert.match(
    mainScript,
    /"Coming soon"/,
    "an empty event must say so in its count",
  );

  // Every photograph lands somewhere even without a tag.
  assert.match(
    mainScript,
    /var key = g\.event \|\| "portraits";/,
    "an untagged photograph must still be filed somewhere",
  );

  // The jump list only offers events that exist on the page.
  assert.match(
    mainScript,
    /return \(byEvent\[ev\.key\] \|\| \[\]\)\.length > 0;/,
    "the jump list must skip empty events",
  );
  assert.match(
    mainScript,
    /eventNavHtml\.length > 1/,
    "a jump list with one destination is not worth showing",
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

  // A nikah wedding must surface its nikah rather than dropping it.
  const nikah = stories.find((s) => s.gallery.some((g) => g.event === "nikah"));
  assert.ok(nikah, "no story exercises the nikah path");
});

test("the story closes by inviting the reader", async () => {
  const [mainScript, styles] = await Promise.all([
    readProjectFile("js/main.js"),
    readProjectFile("css/style.css"),
  ]);

  assert.match(
    mainScript,
    /Your story could be <em>next<\/em>/,
    "the closing section must carry the invitation",
  );

  const cta = mainScript.match(/'<section class="story-cta">[\s\S]*?"<\/section>";/);
  assert.ok(cta, "the closing section is missing");
  assert.match(
    cta[0],
    /href="index\.html#contact"[^>]*data-cursor="Enquire"[^>]*>Get in touch</,
    "the closing button must reach the enquiry form",
  );

  // It has to be the last thing rendered, after the previous/next links.
  const ctaAt = mainScript.indexOf('<section class="story-cta">');
  const navAt = mainScript.indexOf('<section class="story-nav">');
  assert.ok(ctaAt > navAt, "the invitation must come after the story navigation");

  // Legible: white copy over a darkened cover photograph, not bare over it.
  assert.match(
    styles,
    /\.story-cta::after\s*\{[^}]*linear-gradient\([^)]*rgba\(12,\s*35,\s*38/is,
    "the closing section needs a scrim over its photograph",
  );
});
