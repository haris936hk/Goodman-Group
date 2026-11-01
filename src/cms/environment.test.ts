// @vitest-environment node
import path from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readCmsEnvironment } from "./environment";
import { SITE_ORIGIN } from "../data/goodman-group";

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", `file:${path.join(tmpdir(), "goodman-private", "blog.sqlite")}`);
  vi.stubEnv("UPLOAD_DIR", path.join(tmpdir(), "goodman-private", "uploads"));
  vi.stubEnv("PAYLOAD_SECRET", "a-high-entropy-test-only-secret-of-at-least-32-characters");
});
afterEach(() => { vi.unstubAllEnvs(); });

describe("CMS configuration", () => {
  it.each(["DATABASE_URL", "UPLOAD_DIR", "PAYLOAD_SECRET"])("rejects missing %s rather than using transient storage", (name) => {
    vi.stubEnv(name, "");
    expect(readCmsEnvironment).toThrow("CMS requires");
  });
  it.each(["https://example.com/database", "file:relative.sqlite", "sqlite::memory:"])("rejects nonpersistent or nonlocal database %s", (url) => {
    vi.stubEnv("DATABASE_URL", url);
    expect(readCmsEnvironment).toThrow();
  });
  it("rejects paths inside the replaceable release and relative upload paths", () => {
    vi.stubEnv("DATABASE_URL", `file:${process.cwd()}/public/blog.sqlite`);
    expect(readCmsEnvironment).toThrow("outside the release");
    vi.stubEnv("DATABASE_URL", `file:${tmpdir()}/blog.sqlite`);
    vi.stubEnv("UPLOAD_DIR", "uploads");
    expect(readCmsEnvironment).toThrow("absolute");
    vi.stubEnv("UPLOAD_DIR", path.join(process.cwd(), "public", "uploads"));
    expect(readCmsEnvironment).toThrow("outside the release");
  });
  it("does not allow development origins in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(readCmsEnvironment().origins).toEqual([SITE_ORIGIN]);
  });
  it("allows loopback origins only for an explicitly matched temporary browser fixture", () => {
    vi.stubEnv("NODE_ENV", "production");
    const root = path.join(tmpdir(), "goodman-browser-fixture");
    vi.stubEnv("CMS_TEST_ROOT", root);
    expect(readCmsEnvironment().origins).toEqual([SITE_ORIGIN]);
    vi.stubEnv("DATABASE_URL", `file:${root}/blog.sqlite`);
    vi.stubEnv("UPLOAD_DIR", `${root}/uploads`);
    expect(readCmsEnvironment().origins).toContain("http://localhost:3000");
    vi.stubEnv("CMS_TEST_ROOT", "/not-a-system-temporary-directory");
    expect(readCmsEnvironment().origins).toEqual([SITE_ORIGIN]);
  });
});
