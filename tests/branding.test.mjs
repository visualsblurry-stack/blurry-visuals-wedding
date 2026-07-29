import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);

const readProjectFile = (path) =>
  readFile(new URL(path, projectRoot), "utf8");

test("official Blurry Visuals logo is used on both pages", async () => {
  const [indexHtml, storyHtml, logoStats] = await Promise.all([
    readProjectFile("index.html"),
    readProjectFile("story.html"),
    stat(new URL("img/blurry-visuals-logo.png", projectRoot)),
  ]);

  assert.ok(logoStats.size > 10000);
  assert.match(
    indexHtml,
    /class="brand-logo"[^>]*src="img\/blurry-visuals-logo\.png"/,
  );
  assert.match(
    storyHtml,
    /class="brand-logo"[^>]*src="img\/blurry-visuals-logo\.png"/,
  );
});

test("public pages use only the Blurry Visuals Weddings identity", async () => {
  const content = (
    await Promise.all(
      ["index.html", "story.html", "README.md", "img/README.md", "css/style.css"].map(
        readProjectFile,
      ),
    )
  ).join("\n");

  assert.doesNotMatch(content, /pheraa/i);
  assert.match(content, /Blurry Visuals Weddings/);
  assert.match(content, /visualsblurry@gmail\.com/);
  assert.match(content, /https:\/\/www\.instagram\.com\/theblurryvisuals\//);
});

test("story scripts use the Blurry Visuals namespace and titles", async () => {
  const content = (
    await Promise.all(["js/main.js", "js/stories-data.js"].map(readProjectFile))
  ).join("\n");

  assert.doesNotMatch(content, /pheraa/i);
  assert.match(content, /BLURRY_WEDDING_STORIES/);
  assert.match(content, /Blurry Visuals Weddings/);
});

test("logo lockup has stable styles", async () => {
  const styles = await readProjectFile("css/style.css");
  const logoBlock = styles.match(/\.brand-logo\s*\{[^}]*\}/s)?.[0];
  const nameBlock = styles.match(/\.brand-name\s*\{[^}]*\}/s)?.[0];

  assert.ok(logoBlock, ".brand-logo block is missing");
  assert.ok(nameBlock, ".brand-name block is missing");
  assert.match(logoBlock, /width:\s*42px/);
  assert.match(logoBlock, /height:\s*42px/);
});
