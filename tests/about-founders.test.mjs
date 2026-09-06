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
