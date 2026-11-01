import { Fragment, type ReactNode } from "react";

import { SITE_ORIGIN } from "@/data/goodman-group";

type LexicalNode = {
  type?: unknown;
  text?: unknown;
  format?: unknown;
  tag?: unknown;
  listType?: unknown;
  children?: unknown;
  fields?: unknown;
  value?: unknown;
  relationTo?: unknown;
  url?: unknown;
  newTab?: unknown;
};

type MediaVariant = {
  url?: unknown;
  width?: unknown;
  height?: unknown;
};

type MediaImageData = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  small?: MediaVariant;
  medium?: MediaVariant;
  large?: MediaVariant;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPositiveDimension(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function safeImageURL(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return null;
  try {
    const url = new URL(value, SITE_ORIGIN);
    if (url.origin !== SITE_ORIGIN || url.username || url.password) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function readMediaImage(value: unknown): MediaImageData | null {
  if (!isRecord(value)) return null;
  const url = safeImageURL(value.url);
  if (!url) return null;

  const image: MediaImageData = {
    url,
    alt: typeof value.alt === "string" ? value.alt : "",
  };
  if (isPositiveDimension(value.width)) image.width = value.width;
  if (isPositiveDimension(value.height)) image.height = value.height;
  if (typeof value.caption === "string" && value.caption.trim()) {
    image.caption = value.caption.trim();
  }

  for (const size of ["small", "medium", "large"] as const) {
    const variant = value.sizes && isRecord(value.sizes) ? value.sizes[size] : undefined;
    if (isRecord(variant)) {
      image[size] = {
        url: safeImageURL(variant.url),
        ...(isPositiveDimension(variant.width) ? { width: variant.width } : {}),
        ...(isPositiveDimension(variant.height) ? { height: variant.height } : {}),
      };
    }
  }
  return image;
}

function getChildren(node: LexicalNode): unknown[] {
  return Array.isArray(node.children) ? node.children : [];
}

function linkURL(node: LexicalNode): string | null {
  const fields = isRecord(node.fields) ? node.fields : undefined;
  const raw = typeof node.url === "string" ? node.url : fields?.url;
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const value = raw.trim();
  try {
    const parsed = new URL(value, SITE_ORIGIN);
    if (!["https:", "http:", "mailto:", "tel:"].includes(parsed.protocol)) {
      return null;
    }
    if ((parsed.protocol === "https:" || parsed.protocol === "http:") && (parsed.username || parsed.password)) {
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

function newTab(node: LexicalNode): boolean {
  const fields = isRecord(node.fields) ? node.fields : undefined;
  return node.newTab === true || fields?.newTab === true || fields?.target === "_blank";
}


function sourceSet(image: MediaImageData): string | undefined {
  const candidates = [image.small, image.medium, image.large]
    .filter((variant): variant is MediaVariant => isRecord(variant))
    .map((variant) => ({
      url: safeImageURL(variant.url),
      width: isPositiveDimension(variant.width) ? variant.width : undefined,
    }))
    .filter((variant): variant is { url: string; width: number } => Boolean(variant.url && variant.width));
  if (image.width) candidates.push({ url: image.url, width: image.width });
  const distinct = new Map(candidates.map((variant) => [variant.width, variant]));
  const result = [...distinct.values()].sort((left, right) => left.width - right.width);
  return result.length ? result.map(({ url, width }) => `${url} ${width}w`).join(", ") : undefined;
}

export function ResponsiveBlogImage({
  image,
  sizes,
  priority = false,
}: {
  image: MediaImageData;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <img
      src={image.url}
      srcSet={sourceSet(image)}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}

function renderUpload(node: LexicalNode, key: number): ReactNode {
  const image = node.relationTo === "media" ? readMediaImage(node.value) : null;
  if (!image) return null;
  return (
    <figure className="blog-rich-image" key={key}>
      <ResponsiveBlogImage image={image} sizes="(max-width: 48rem) calc(100vw - 2.5rem), 54rem" />
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  );
}

function renderNode(
  node: unknown,
  key: number,
  previousHeading: { level: number },
): ReactNode {
  if (!isRecord(node)) return null;
  const lexicalNode = node as LexicalNode;
  const type = typeof lexicalNode.type === "string" ? lexicalNode.type : "";
  const children = getChildren(lexicalNode);
  const renderedChildren = children.map((child, index) => renderNode(child, index, previousHeading));

  switch (type) {
    case "text": {
      const text = typeof lexicalNode.text === "string" ? lexicalNode.text : "";
      const format = typeof lexicalNode.format === "number" ? lexicalNode.format : 0;
      let content: ReactNode = text;
      if (format & 1) content = <strong>{content}</strong>;
      if (format & 2) content = <em>{content}</em>;
      return <Fragment key={key}>{content}</Fragment>;
    }
    case "linebreak":
      return <br key={key} />;
    case "paragraph":
      return <p key={key}>{renderedChildren}</p>;
    case "heading": {
      const requestedLevel = lexicalNode.tag === "h3" ? 3 : lexicalNode.tag === "h2" ? 2 : 2;
      const level = Math.min(requestedLevel, previousHeading.level + 1);
      previousHeading.level = level;
      if (level === 3) return <h3 key={key}>{renderedChildren}</h3>;
      return <h2 key={key}>{renderedChildren}</h2>;
    }
    case "list":
      return lexicalNode.listType === "number" || lexicalNode.listType === "ordered" ? (
        <ol key={key}>{renderedChildren}</ol>
      ) : (
        <ul key={key}>{renderedChildren}</ul>
      );
    case "listitem":
      return <li key={key}>{renderedChildren}</li>;
    case "quote":
      return <blockquote key={key}>{renderedChildren}</blockquote>;
    case "link":
    case "autolink": {
      const href = linkURL(lexicalNode);
      if (!href) return <span key={key}>{renderedChildren}</span>;
      const opensNewTab = newTab(lexicalNode);
      return (
        <a
          key={key}
          href={href}
          target={opensNewTab ? "_blank" : undefined}
          rel={opensNewTab ? "noopener noreferrer" : undefined}
        >
          {renderedChildren}
          {opensNewTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </a>
      );
    }
    case "upload":
      return renderUpload(lexicalNode, key);
    default:
      return renderedChildren.length ? <Fragment key={key}>{renderedChildren}</Fragment> : null;
  }
}

export function RichText({ value }: { value: unknown }) {
  if (!isRecord(value) || !isRecord(value.root) || !Array.isArray(value.root.children)) {
    return null;
  }
  const previousHeading = { level: 1 };
  return (
    <div className="blog-rich-text">
      {value.root.children.map((node, index) => renderNode(node, index, previousHeading))}
    </div>
  );
}
