import { SITE_ORIGIN } from "../data/goodman-group";

// The project's Vercel production alias is also used for administrator access.
const VERCEL_PRODUCTION_ORIGIN = "https://goodman-group.vercel.app";

export function readCmsEnvironment() {
  const { DATABASE_URL, BLOB_READ_WRITE_TOKEN, PAYLOAD_SECRET } = process.env;
  let databaseUrl: URL;
  try {
    databaseUrl = new URL(DATABASE_URL ?? "");
  } catch {
    throw new Error("CMS requires a PostgreSQL DATABASE_URL, BLOB_READ_WRITE_TOKEN and PAYLOAD_SECRET of at least 32 characters.");
  }
  if (!DATABASE_URL || !["postgres:", "postgresql:"].includes(databaseUrl.protocol) || !databaseUrl.hostname ||
      !BLOB_READ_WRITE_TOKEN || !PAYLOAD_SECRET || PAYLOAD_SECRET.length < 32) {
    throw new Error("CMS requires a PostgreSQL DATABASE_URL, BLOB_READ_WRITE_TOKEN and PAYLOAD_SECRET of at least 32 characters.");
  }
  const previewHost = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_URL : undefined;
  const previewOrigin = previewHost && /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+vercel\.app$/i.test(previewHost)
    ? `https://${previewHost}`
    : undefined;
  return {
    databaseUrl: DATABASE_URL,
    blobToken: BLOB_READ_WRITE_TOKEN,
    secret: PAYLOAD_SECRET,
    origins: process.env.NODE_ENV === "production"
      ? [SITE_ORIGIN, VERCEL_PRODUCTION_ORIGIN, ...(previewOrigin ? [previewOrigin] : [])]
      : [SITE_ORIGIN, VERCEL_PRODUCTION_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:4173", "http://127.0.0.1:4173", ...(previewOrigin ? [previewOrigin] : [])],
  };
}
