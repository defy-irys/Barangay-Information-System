import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeIssuanceContent } from "../lib/ordinances/sanitize-content";

test("keeps approved formatting while removing active and unsafe markup", () => {
  const sanitized = sanitizeIssuanceContent(
    '<p onclick="run()">Safe <strong>text</strong></p>' +
      '<script>run()</script><img src="x" onerror="run()">' +
      '<iframe src="https://example.com"></iframe>' +
      '<svg><a xlink:href="javascript:run()">svg link</a></svg>' +
      '<math><mi>unsafe math markup</mi></math>' +
      '<a href="javascript:run()">unsafe link</a>' +
      '<a href="//example.com">protocol-relative link</a>' +
      '<a href="data:text/html,unsafe">data link</a>' +
      '<a href="https://example.com" title="safe">safe link</a>',
  );

  assert.match(sanitized, /<p>Safe <strong>text<\/strong><\/p>/);
  assert.match(sanitized, /href="https:\/\/example\.com"/);
  assert.doesNotMatch(sanitized, /href="(?:\/\/|data:|javascript:)/i);
  assert.doesNotMatch(
    sanitized,
    /<script|<img|<iframe|<svg|<math|onerror|onclick|javascript:/i,
  );
});
