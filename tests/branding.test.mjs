import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const officialLogoSha256 =
  "d6b30fd1b111acc1a6b63ef5718685c7fa283f60fcb77962337f79aaebc16912";
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const optimizedLogoPath = "img/blurry-visuals-logo-web.png";

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
  assert.equal(
    logoTag.match(/\ssrcset\s*=\s*(["'])(.*?)\1/i)?.[2],
    `${optimizedLogoPath} 126w`,
    `${path} logo image is missing the optimized 126w srcset`,
  );
  assert.equal(
    logoTag.match(/\ssizes\s*=\s*(["'])(.*?)\1/i)?.[2],
    "42px",
    `${path} logo image must declare sizes="42px"`,
  );
};

const assertBrandFavicon = (path, html) => {
  const faviconTag = (html.match(/<link\b[^>]*>/gi) ?? []).find((tag) => {
    const rel = tag.match(/\srel\s*=\s*(["'])(.*?)\1/i)?.[2];
    return rel?.trim().split(/\s+/).includes("icon");
  });

  assert.ok(faviconTag, `${path} is missing a favicon link`);
  assert.equal(
    faviconTag.match(/\stype\s*=\s*(["'])(.*?)\1/i)?.[2],
    "image/png",
    `${path} favicon must declare type="image/png"`,
  );
  assert.equal(
    faviconTag.match(/\shref\s*=\s*(["'])(.*?)\1/i)?.[2],
    optimizedLogoPath,
    `${path} favicon must reference ${optimizedLogoPath}`,
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
  assertBrandFavicon("index.html", indexHtml);
  assertBrandFavicon("story.html", storyHtml);

  const optimizedLogoUrl = new URL(optimizedLogoPath, projectRoot);
  const [optimizedLogoStats, optimizedLogo] = await Promise.all([
    stat(optimizedLogoUrl),
    readFile(optimizedLogoUrl),
  ]);

  assert.ok(
    optimizedLogoStats.size < 60 * 1024,
    `${optimizedLogoPath} must be smaller than 60 KB`,
  );
  assert.deepEqual(
    optimizedLogo.subarray(0, pngSignature.length),
    pngSignature,
    `${optimizedLogoPath} must have a valid PNG signature`,
  );
  assert.equal(
    optimizedLogo.subarray(12, 16).toString("ascii"),
    "IHDR",
    `${optimizedLogoPath} must start with a PNG IHDR chunk`,
  );
  assert.equal(
    optimizedLogo.readUInt32BE(16),
    126,
    `${optimizedLogoPath} must be 126 pixels wide`,
  );
  assert.equal(
    optimizedLogo.readUInt32BE(20),
    126,
    `${optimizedLogoPath} must be 126 pixels high`,
  );
  assert.equal(
    optimizedLogo[25],
    6,
    `${optimizedLogoPath} must use PNG color type 6 (RGBA)`,
  );
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

  const indexHtml = files.find(([path]) => path === "index.html")[1];
  const jsonLd = indexHtml.match(
    /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/i,
  );
  assert.ok(jsonLd, "index.html is missing JSON-LD");
  const schema = JSON.parse(jsonLd[1]);
  assert.equal(schema["@type"], "Organization");
  assert.notEqual(schema["@type"], "ProfessionalService");
});

test("story scripts use the Blurry Visuals namespace and titles", async () => {
  const files = await readProjectFiles(["js/main.js", "js/stories-data.js"]);

  for (const [path, content] of files) {
    assertIdentity(path, content, [
      "BLURRY_WEDDING_STORIES",
      "Blurry Visuals Weddings",
    ]);
  }

  const mainScript = files.find(([path]) => path === "js/main.js")[1];
  const initialSolidCapture = mainScript.match(
    /\bvar\s+([\w$]*(?:initial|start)[\w$]*solid[\w$]*)\s*=\s*hdr\s*\?\s*hdr\.classList\.contains\(\s*["']solid["']\s*\)\s*:\s*false\s*;/i,
  );
  assert.ok(
    initialSolidCapture,
    "js/main.js must capture whether the header initially has the solid class",
  );

  const initialSolidName = initialSolidCapture[1];
  assert.match(
    mainScript,
    new RegExp(
      `hdr\\.classList\\.toggle\\(\\s*["']solid["']\\s*,\\s*${initialSolidName}\\s*\\|\\|\\s*window\\.scrollY\\s*>\\s*40\\s*\\)`,
    ),
    "js/main.js must preserve the initial solid state in the header toggle condition",
  );
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

test("text buttons use teal backgrounds with white labels", async () => {
  const styles = (await readProjectFile("css/style.css")).replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  const declarationsFor = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const block = styles.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "s"));
    assert.ok(block, `${selector} style block is missing`);
    return block[1];
  };

  assert.match(styles, /--teal\s*:\s*#789c9f\s*;/i);
  for (const selector of [
    ".nav a.cta",
    ".hdr:not(.solid) .nav a.cta",
    ".btn-gold,.btn-line",
    ".filters button",
    ".lightbox-close",
  ]) {
    const declarations = declarationsFor(selector);
    assert.match(
      declarations,
      /background\s*:\s*var\(--teal\)\s*;/i,
      `${selector} must use the teal button background`,
    );
    assert.match(
      declarations,
      /color\s*:\s*var\(--white\)\s*;/i,
      `${selector} must use white button text`,
    );
  }

  assert.doesNotMatch(
    styles,
    /\.hero\s+\.btn-(?:gold|line)\s*\{[^}]*background\s*:\s*var\(--white\)/is,
    "hero button overrides must not restore a white background",
  );
});
