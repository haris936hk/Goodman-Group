import { APIError } from "payload";

const allowedNodes: Record<string, true> = { root: true, paragraph: true, heading: true, text: true, linebreak: true, list: true, listitem: true, quote: true, link: true, autolink: true, upload: true };

export function validateRichText(body: unknown): void {
  if (body == null) return;
  const fail = () => { throw new APIError("The article contains unsupported rich text or an unsafe link.", 400); };
  const walk = (value: unknown, depth: number): void => {
    if (!value || typeof value !== "object" || depth > 64) return fail();
    const node = value as Record<string, unknown>;
    if (typeof node.type !== "string" || !Object.hasOwn(allowedNodes, node.type)) return fail();
    if (node.type === "heading" && node.tag !== "h2" && node.tag !== "h3") return fail();
    if (node.type === "link" || node.type === "autolink") {
      const fields = node.fields as Record<string, unknown> | undefined;
      const url = fields?.url;
      if (typeof url !== "string" || /[\u0000-\u0020\u007f\\]/.test(url) || !/^(?:https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(url)) return fail();
    }
    if (node.type === "upload" && node.relationTo !== "media") return fail();
    if (node.children !== undefined) {
      if (!Array.isArray(node.children)) return fail();
      for (const child of node.children) walk(child, depth + 1);
    }
  };
  if (typeof body !== "object" || !("root" in body)) return fail();
  walk(body.root, 0);
}
