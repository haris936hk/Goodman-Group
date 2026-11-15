import "server-only";

import { SITE_ORIGIN } from "@/data/goodman-group";

/** Accept only website images and images from this deployment's Blob store. */
export function trustedMediaURL(value: unknown): URL | null {
  if (typeof value !== "string" || !value) return null;
  try {
    const url = new URL(value, SITE_ORIGIN);
    if (url.username || url.password) return null;
    if (url.origin === SITE_ORIGIN) return url;
    const storeId = process.env.BLOB_READ_WRITE_TOKEN?.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase();
    if (storeId && url.origin === `https://${storeId}.public.blob.vercel-storage.com`) return url;
  } catch {
    return null;
  }
  return null;
}
