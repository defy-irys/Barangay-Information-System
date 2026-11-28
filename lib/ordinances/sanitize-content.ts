import DOMPurify from "isomorphic-dompurify";

const issuanceContentOptions = {
  ALLOWED_TAGS: [
    "a",
    "b",
    "blockquote",
    "br",
    "div",
    "em",
    "h2",
    "i",
    "li",
    "ol",
    "p",
    "span",
    "strong",
    "u",
    "ul",
  ],
  ALLOWED_ATTR: ["href", "title"],
  ALLOWED_URI_REGEXP: /^(?:(?:https?:\/\/|mailto:)|\/(?!\/)|#|\.{1,2}\/)/i,
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  FORBID_ATTR: ["style"],
  FORBID_TAGS: ["embed", "iframe", "math", "object", "script", "style", "svg"],
  SAFE_FOR_TEMPLATES: true,
};

export function sanitizeIssuanceContent(content: string): string {
  return DOMPurify.sanitize(content, issuanceContentOptions);
}
