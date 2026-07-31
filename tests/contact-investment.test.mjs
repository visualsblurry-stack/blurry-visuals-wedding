import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("contact redesign preserves the enquiry contract", async () => {
  const [html, styles, script] = await Promise.all([
    read("index.html"),
    read("css/style.css"),
    read("js/main.js"),
  ]);

  for (const name of ["names", "etype", "edate", "city", "venue", "message"]) {
    assert.match(html, new RegExp(`name=["']${name}["']`));
    assert.match(script, new RegExp(`v\\(["']${name}["']\\)`));
  }

  assert.match(html, /class="contact-panel contact-info/);
  assert.match(html, /class="contact-panel form-panel/);
  assert.match(html, /class="field-control"/);
  assert.ok((html.match(/class="lucide-icon"/g) ?? []).length >= 11);
  assert.match(html, /<button[^>]*type="submit"[^>]*>[\s\S]*?Send[\s\S]*?<\/button>/);
  assert.doesNotMatch(html, />\s*Send via WhatsApp\s*</);
  // Full-bleed asymmetric split: the old equal 50/50 columns read as an open book.
  assert.match(styles, /\.contact-grid\s*\{[^}]*grid-template-columns\s*:\s*minmax\(0,0\.86fr\)\s+minmax\(0,1\.14fr\)/s);
  assert.match(styles, /\.contact-grid\s*\{[^}]*width\s*:\s*100%/s);
  assert.doesNotMatch(styles, /\.contact-grid\s*\{[^}]*box-shadow/s);
  // Deeper teal: white text on the original --teal measured only 2.98:1.
  assert.match(styles, /\.form-panel\s*\{[^}]*background\s*:\s*var\(--teal-deep\)/s);
  assert.match(styles, /--teal-deep\s*:\s*#547c7f/);
  // Native select options must not inherit the teal panel background.
  assert.match(styles, /\.field select option\s*\{[^}]*background\s*:\s*var\(--white\)/s);
  assert.match(html, /id="f-edate"[^>]*type="date"/);
  assert.match(script, /var WHATSAPP = "917032390419"/);
  assert.match(script, /https:\/\/wa\.me\//);
});

test("investment and FAQ content is an accessible shareable modal", async () => {
  const [indexHtml, storyHtml, styles, script] = await Promise.all([
    read("index.html"),
    read("story.html"),
    read("css/style.css"),
    read("js/main.js"),
  ]);

  assert.ok((indexHtml.match(/href="#investment"/g) ?? []).length >= 3);
  assert.ok((storyHtml.match(/href="index\.html#investment"/g) ?? []).length >= 3);
  assert.match(indexHtml, /id="investment-modal"/);
  assert.match(indexHtml, /role="dialog"/);
  assert.match(indexHtml, /aria-modal="true"/);
  assert.match(indexHtml, /aria-labelledby="investment-title"/);
  // Collections renamed per the 26-27 brochure.
  assert.match(indexHtml, /<h2>Intimate<\/h2>/);
  assert.match(indexHtml, /<h2>Signature<\/h2>/);
  assert.doesNotMatch(indexHtml, /<h2>Basic<\/h2>/);
  assert.match(indexHtml, /₹1,25,000/);
  assert.match(indexHtml, /₹2,25,000/);
  assert.equal((indexHtml.match(/class="faq-question"/g) ?? []).length, 9);
  assert.equal((indexHtml.match(/class="faq-answer"/g) ?? []).length, 9);
  assert.equal(
    (indexHtml.match(/<button class="faq-question"[^>]*aria-expanded="false"/g) ?? []).length,
    9,
  );
  assert.match(styles, /\.investment-modal/);
  assert.match(styles, /body\.investment-open\s*\{[^}]*overflow\s*:\s*hidden/s);
  assert.match(script, /location\.hash\s*===\s*["']#investment["']/);
  assert.match(script, /hashchange/);
  assert.match(script, /aria-expanded/);
  assert.match(script, /e\.key\s*===\s*["']Escape["']/);
  assert.match(script, /e\.key\s*===\s*["']Tab["']/);
});
