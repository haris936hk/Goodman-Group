import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { readMediaImage, RichText } from "./rich-text";

const text = (value: string, format = 0) => ({ type: "text", text: value, format });
const document = (...children: unknown[]) => ({ root: { children } });

describe("article rich text", () => {
  it("renders safe semantic content without skipped headings", () => {
    render(<RichText value={document(
      { type: "heading", tag: "h3", children: [text("First section")] },
      { type: "heading", tag: "h3", children: [text("Subsection")] },
      { type: "paragraph", children: [text("Important", 3)] },
      { type: "list", listType: "number", children: [{ type: "listitem", children: [text("First step")] }] },
      { type: "quote", children: [text("Quoted statement")] },
    )} />);
    expect(screen.getByRole("heading", { level: 2, name: "First section" })).toBeVisible();
    expect(screen.getByRole("heading", { level: 3, name: "Subsection" })).toBeVisible();
    expect(screen.getByText("Important").closest("strong")).not.toBeNull();
    expect(screen.getByRole("listitem")).toHaveTextContent("First step");
    expect(screen.getByText("Quoted statement").closest("blockquote")).not.toBeNull();
  });

  it.each(["javascript:alert(1)", "data:text/html,<script>alert(1)</script>", "https://user:password@example.com/"])("does not create an executable link for %s", (url) => {
    render(<RichText value={document({ type: "link", fields: { url }, children: [text("Untrusted link")] })} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Untrusted link")).toBeVisible();
  });

  it("announces a safe new-tab link and escapes text instead of injecting HTML", () => {
    render(<RichText value={document({ type: "paragraph", children: [
      { type: "link", fields: { url: "https://example.com/", newTab: true }, children: [text("External resource")] },
      text("<script>alert(1)</script>"),
    ] })} />);
    const link = screen.getByRole("link", { name: /External resource/ });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAccessibleName(/opens in a new tab/);
    expect(screen.getByText("<script>alert(1)</script>")).toBeVisible();
    expect(link.ownerDocument.querySelector("script")).toBeNull();
  });

  it("uses shared image alternatives and captions with responsive dimensions", () => {
    const image = {
      url: "/api/cms/media/file/photo.webp", width: 1600, height: 900,
      alt: "Medical equipment at an exhibition", caption: "Equipment demonstration",
      sizes: { small: { url: "/api/cms/media/file/photo-480.webp", width: 480, height: 270 } },
    };
    render(<RichText value={document({ type: "upload", relationTo: "media", value: image })} />);
    const rendered = screen.getByRole("img", { name: image.alt });
    expect(rendered).toHaveAttribute("width", "1600");
    expect(rendered).toHaveAttribute("height", "900");
    expect(screen.getByText(image.caption).closest("figcaption")).not.toBeNull();
    expect(readMediaImage({ ...image, url: "https://external.example/photo.jpg" })).toBeNull();
  });
});
