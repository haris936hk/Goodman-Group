// @vitest-environment node
import { describe, expect, it } from "vitest";
import { validateRichText } from "./rich-text-validation";

const document = (node: unknown) => ({ root: { type: "root", children: [node] } });

describe("rich-text input validation", () => {
  it.each([
    { type: "html", html: "<img src=x onerror=alert(1)>" },
    { type: "embed", url: "https://example.com/video" },
    { type: "table", children: [] },
    { type: "heading", tag: "h1", children: [] },
    { type: "upload", relationTo: "administrators", value: 1 },
    { type: "paragraph", children: "not a node list" },
  ])("rejects unsupported article node $type", (node) => {
    expect(() => validateRichText(document(node))).toThrow("unsupported rich text");
  });
  it.each(["javascript:alert(1)", "data:text/html,unsafe", "//external.example/", "https://example.com/\nunsafe", "https:\\example.com/"])("rejects unsafe link input %s", (url) => {
    expect(() => validateRichText(document({ type: "link", fields: { url }, children: [] }))).toThrow("unsafe link");
  });
  it("rejects malformed and excessively nested document trees", () => {
    expect(() => validateRichText({ root: null })).toThrow("unsupported rich text");
    let node: unknown = { type: "text", text: "Deep leaf" };
    for (let depth = 0; depth < 70; depth++) node = { type: "paragraph", children: [node] };
    expect(() => validateRichText(document(node))).toThrow("unsupported rich text");
  });
});
