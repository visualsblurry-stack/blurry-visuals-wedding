import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const officialLogoSha256 =
  "d6b30fd1b111acc1a6b63ef5718685c7fa283f60fcb77962337f79aaebc16912";
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const readProjectFile = (path) =>
  readFile(new URL(path, projectRoot), "utf8");

const readProjectFiles = (paths) =>
  Promise.all(
    paths.map(async (path) => [path, await readProjectFile(path)]),
  );

const assertBrandLogo = (path, html) => {
  const logoTag = (html.match(/<img\b[^>]*>/gi) ?? []).find((tag) => {
    const src = tag.match(/\ssrc\s*=\s*(["'])(.*?)\1/i)?.[2];
    return src === "img/blurry-visuals-logo.png";
  });

  assert.ok(logoTag, `${path} is missing the official logo image`);

  const classAttribute = logoTag.match(/\sclass\s*=\s*(["'])(.*?)\1/i)?.[2];
  const classTokens = classAttribute?.trim().split(/\s+/) ?? [];
  assert.ok(
    classTokens.includes("brand-logo"),
    `${path} logo image is missing the brand-logo class`,
  );
};

const assertIdentity = (path, content, expectedValues) => {
  assert.ok(!/pheraa/i.test(content), `${path} contains the old Pheraa identity`);
  for (const value of expectedValues) {
    assert.ok(content.includes(value), `${path} is missing ${value}`);
  }
};

test("official Blurry Visuals logo is used on both pages", async () => {
  const logoUrl = new URL("img/blurry-visuals-logo.png", projectRoot);
  const [indexHtml, storyHtml, logoStats, logo] = await Promise.all([
    readProjectFile("index.html"),
    readProjectFile("story.html"),
    stat(logoUrl),
    readFile(logoUrl),
  ]);

  assert.ok(
    logoStats.size > 10000,
    "img/blurry-visuals-logo.png must be larger than 10000 bytes",
  );
  assert.deepEqual(
    logo.subarray(0, pngSignature.length),
    pngSignature,
    "img/blurry-visuals-logo.png must have a valid PNG signature",
  );
  assert.equal(
    createHash("sha256").update(logo).digest("hex"),
    officialLogoSha256,
    "img/blurry-visuals-logo.png must match the official logo digest",
  );
  assertBrandLogo("index.html", indexHtml);
  assertBrandLogo("story.html", storyHtml);
});

test("public pages use only the Blurry Visuals Weddings identity", async () => {
  const files = await readProjectFiles([
    "index.html",
    "story.html",
    "README.md",
    "img/README.md",
    "css/style.css",
  ]);
  const indexIdentity = [
    "Blurry Visuals Weddings",
    "visualsblurry@gmail.com",
    "https://www.instagram.com/theblurryvisuals/",
  ];
  const expectedByPath = new Map([
    ["index.html", indexIdentity],
    ["story.html", ["Blurry Visuals Weddings"]],
    ["README.md", ["Blurry Visuals Weddings"]],
    [
      "img/README.md",
      [
        "Blurry Visuals Weddings",
        "visualsblurry@gmail.com",
        "@theblurryvisuals",
      ],
    ],
    ["css/style.css", ["Blurry Visuals Weddings"]],
  ]);

  for (const [path, content] of files) {
    assertIdentity(path, content, expectedByPath.get(path));
  }
});

test("story scripts use the Blurry Visuals namespace and titles", async () => {
  const files = await readProjectFiles(["js/main.js", "js/stories-data.js"]);

  for (const [path, content] of files) {
    assertIdentity(path, content, [
      "BLURRY_WEDDING_STORIES",
      "Blurry Visuals Weddings",
    ]);
  }
});

test("logo lockup has stable styles", async () => {
  const styles = await readProjectFile("css/style.css");
  const uncommentedStyles = styles.replace(/\/\*[\s\S]*?\*\//g, "");
  const logoBlock = uncommentedStyles.match(/\.brand-logo\s*\{[^}]*\}/s)?.[0];
  const nameBlock = uncommentedStyles.match(/\.brand-name\s*\{[^}]*\}/s)?.[0];

  assert.ok(logoBlock, ".brand-logo block is missing");
  assert.ok(nameBlock, ".brand-name block is missing");
  const logoDeclarations = logoBlock.replace(
    /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'/g,
    "",
  );
  assert.match(
    logoDeclarations,
    /(?:^|[;{])\s*width\s*:\s*42px\s*(?:;|})/i,
    ".brand-logo must declare width: 42px",
  );
  assert.match(
    logoDeclarations,
    /(?:^|[;{])\s*height\s*:\s*42px\s*(?:;|})/i,
    ".brand-logo must declare height: 42px",
  );
});
