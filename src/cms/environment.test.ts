// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readCmsEnvironment } from "./environment";
import { SITE_ORIGIN } from "../data/goodman-group";

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "postgresql://user:password@localhost:5432/goodman_test");
  vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test-blob-token");
  vi.stubEnv("PAYLOAD_SECRET", "a-high-entropy-test-only-secret-of-at-least-32-characters");
});
afterEach(() => { vi.unstubAllEnvs(); });

describe("CMS configuration", () => {
  it.each(["DATABASE_URL", "BLOB_READ_WRITE_TOKEN", "PAYLOAD_SECRET"])("rejects missing %s rather than using transient storage", (name) => {
    vi.stubEnv(name, "");
    expect(readCmsEnvironment).toThrow("CMS requires");
  });
  it.each(["https://example.com/database", "file:relative.sqlite", "sqlite::memory:"])("rejects non-PostgreSQL database %s", (url) => {
    vi.stubEnv("DATABASE_URL", url);
    expect(readCmsEnvironment).toThrow();
  });
  it("does not allow development origins in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(readCmsEnvironment().origins).toEqual([SITE_ORIGIN]);
  });
  it("allows only the validated Vercel deployment origin in preview", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "goodman-preview.vercel.app");
    expect(readCmsEnvironment().origins).toEqual([SITE_ORIGIN, "https://goodman-preview.vercel.app"]);
    vi.stubEnv("VERCEL_URL", "goodman.vercel.app.attacker.example");
    expect(readCmsEnvironment().origins).toEqual([SITE_ORIGIN]);
    vi.stubEnv("VERCEL_URL", "goodman-preview.vercel.app");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(readCmsEnvironment().origins).toEqual([SITE_ORIGIN]);
  });
});
