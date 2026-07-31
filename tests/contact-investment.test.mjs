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
  assert.match(styles, /\.contact-grid\s*\{[^}]*grid-template-columns\s*:\s*repeat\(2,minmax\(0,1fr\)\)/s);
  assert.match(styles, /\.form-panel\s*\{[^}]*background\s*:\s*var\(--teal\)/s);
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
  assert.match(indexHtml, /₹1,75,000/);
  assert.match(indexHtml, /₹2,55,000/);
  assert.equal((indexHtml.match(/class="faq-question"/g) ?? []).length, 7);
  assert.equal((indexHtml.match(/class="faq-answer"/g) ?? []).length, 7);
  assert.equal(
    (indexHtml.match(/<button class="faq-question"[^>]*aria-expanded="false"/g) ?? []).length,
    7,
  );
  assert.match(styles, /\.investment-modal/);
  assert.match(styles, /body\.investment-open\s*\{[^}]*overflow\s*:\s*hidden/s);
  assert.match(script, /location\.hash\s*===\s*["']#investment["']/);
  assert.match(script, /hashchange/);
  assert.match(script, /aria-expanded/);
  assert.match(script, /e\.key\s*===\s*["']Escape["']/);
  assert.match(script, /e\.key\s*===\s*["']Tab["']/);
});
