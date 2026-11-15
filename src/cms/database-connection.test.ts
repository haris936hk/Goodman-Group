// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { cmsDatabasePoolConfig } from "./database-connection";

describe("CMS PostgreSQL transport", () => {
  it("requires verified TLS for Supabase even without a URL SSL parameter", () => {
    const config = cmsDatabasePoolConfig("postgresql://user:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres");
    expect(config.ssl).toMatchObject({ rejectUnauthorized: true, ca: expect.stringContaining("BEGIN CERTIFICATE") });
  });

  it("does not allow connection-string TLS overrides to disable verification", () => {
    expect(() => cmsDatabasePoolConfig("postgresql://user:pass@db.example.com/database?sslmode=disable")).toThrow("TLS parameter");
    const config = cmsDatabasePoolConfig("postgresql://user:pass@db.example.com/database?sslmode=require");
    expect(config.ssl).toEqual({ rejectUnauthorized: true });
    expect(config.connectionString).not.toContain("sslmode");
  });

  it("permits non-TLS connections only to a loopback database", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(cmsDatabasePoolConfig("postgresql://localhost/test").ssl).toBe(false);
    expect(cmsDatabasePoolConfig("postgresql://database.example/test").ssl).toEqual({ rejectUnauthorized: true });
  });
});
