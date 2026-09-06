import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);

test("optimized founder portraits are shipped as compact WebP files", async () => {
  const portraits = [
    "img/founders/akash.webp",
    "img/founders/gautam.webp",
  ];

  for (const path of portraits) {
    const url = new URL(path, projectRoot);
    const [stats, bytes] = await Promise.all([stat(url), readFile(url)]);

    assert.ok(stats.size > 10 * 1024, path + " must contain a real portrait");
    assert.ok(stats.size < 300 * 1024, path + " must remain below 300 KB");
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF");
    assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP");
  }
});

const readProjectFile = (path) =>
  readFile(new URL(path, projectRoot), "utf8");

test("the About section presents Akash and Gautam in accessible portrait frames", async () => {
  const html = await readProjectFile("index.html");
  const about = html.match(
    /<section class="sec" id="about">([\s\S]*?)<\/section>/i,
  )?.[1];

  assert.ok(about, "index.html is missing the About section");
  assert.ok(
    about.indexOf("founder-portrait-akash") <
      about.indexOf("founder-portrait-gautam"),
    "Akash must appear before Gautam to match the biography order",
  );

  const images = about.match(/<img\b[^>]*>/gi) ?? [];
  const expected = [
    {
      src: "img/founders/akash.webp",
      alt: "Akash, co-founder of Blurry Visuals",
      width: "1023",
      height: "1537",
      label: "Akash",
    },
    {
      src: "img/founders/gautam.webp",
      alt: "Gautam, co-founder of Blurry Visuals",
      width: "651",
      height: "1112",
      label: "Gautam",
    },
  ];

  for (const founder of expected) {
    const image = images.find((tag) =>
      tag.includes('src="' + founder.src + '"'),
    );
    assert.ok(image, "missing portrait " + founder.src);
    assert.ok(image.includes('alt="' + founder.alt + '"'));
    assert.ok(image.includes('width="' + founder.width + '"'));
    assert.ok(image.includes('height="' + founder.height + '"'));
    assert.ok(image.includes('loading="lazy"'));
    assert.ok(image.includes('decoding="async"'));
    assert.ok(
      about.includes("<figcaption>" + founder.label + "</figcaption>"),
      "missing visible label for " + founder.label,
    );
  }

  assert.doesNotMatch(html, /\bAakash\b/, "the old spelling must not remain");
  assert.match(html, /Akash · WhatsApp/);
});
