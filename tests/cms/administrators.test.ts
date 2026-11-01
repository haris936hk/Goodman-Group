// @vitest-environment node
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createLocalReq, getPayload, registerFirstUserOperation, type Payload } from "payload";
import { withAdministratorMaintenance } from "../../src/cms/administrator-maintenance";

const primaryEmail = "administrator@example.test";
const primaryPassword = "Disposable-admin-password-42!";
const resetPassword = "Disposable-admin-password-43!";
const origin = "http://localhost:3000";
const environmentKeys = ["DATABASE_URL", "UPLOAD_DIR", "PAYLOAD_SECRET"] as const;
type RouteHandler = (request: Request, context: { params: Promise<{ slug?: string[] }> }) => Promise<Response>;
type RouteHandlers = { GET: RouteHandler; POST: RouteHandler };
type AdministratorState = { loginAttempts?: number | null; lockUntil?: string | null; sessions?: Array<{ id: string }> };

let payload: Payload;
let directory: string;
let routeHandlers: RouteHandlers;
const previousEnvironment = new Map<string, string | undefined>();

async function cmsRequest(method: "GET" | "POST", slug: string[], options: { data?: Record<string, unknown>; cookie?: string } = {}) {
  const headers = new Headers({ origin });
  if (method === "POST") headers.set("content-type", "application/json");
  if (options.cookie) headers.set("cookie", options.cookie);
  const request = new Request(`${origin}/api/cms/${slug.join("/")}`, {
    method,
    headers,
    ...(options.data ? { body: JSON.stringify(options.data) } : {}),
  });
  return routeHandlers[method](request, { params: Promise.resolve({ slug }) });
}

async function administrator(id: number | string) {
  const doc = await payload.findByID({
    collection: "administrators",
    id,
    overrideAccess: true,
    showHiddenFields: true,
  });
  return doc as typeof doc & AdministratorState;
}


beforeAll(async () => {
  for (const key of environmentKeys) previousEnvironment.set(key, process.env[key]);
  vi.stubEnv("NODE_ENV", "test");
  directory = await mkdtemp(path.join(tmpdir(), "goodman-cms-admin-test-"));
  process.env.DATABASE_URL = `file:${path.join(directory, "blog.sqlite")}`;
  process.env.UPLOAD_DIR = path.join(directory, "uploads");
  process.env.PAYLOAD_SECRET = "isolated-admin-test-secret-not-a-production-credential-123456";
  await mkdir(process.env.UPLOAD_DIR);

  // Load the Payload config only after temporary database paths are installed.
  const { default: config } = await import("../../payload.config");
  payload = await getPayload({ config });
  await payload.db.migrate();
  // The route module captures that same isolated config while creating its REST handlers.
  routeHandlers = await import("../../src/app/(payload)/api/cms/[...slug]/route");
});

afterAll(async () => {
  await payload?.destroy();
  if (directory) await rm(directory, { recursive: true, force: true });
  for (const key of environmentKeys) {
    const value = previousEnvironment.get(key);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  vi.unstubAllEnvs();
});

describe("SQLite-backed administrator security and lifecycle", () => {
  it("enforces sole-account bootstrap, self-access, lockout and session-revoking recovery", async () => {
    expect((await payload.find({ collection: "administrators", overrideAccess: true, limit: 2 })).totalDocs).toBe(0);

    const publicAccount = { email: "public@example.test", password: "Not-a-real-password-42!" };
    await expect(payload.create({ collection: "administrators", data: publicAccount, overrideAccess: false })).rejects.toThrow();
    await expect(payload.create({ collection: "administrators", data: publicAccount, overrideAccess: true })).rejects.toThrow();
    expect((await cmsRequest("POST", ["administrators"], { data: publicAccount })).status).toBe(403);
    expect((await cmsRequest("POST", ["administrators", "first-register"], { data: publicAccount })).status).toBe(403);
    const firstRegisterReq = await createLocalReq({}, payload);
    await expect(registerFirstUserOperation({
      collection: payload.collections.administrators,
      data: publicAccount,
      req: firstRegisterReq,
    })).rejects.toMatchObject({ status: 403 });
    expect((await payload.find({ collection: "administrators", overrideAccess: true, limit: 2 })).totalDocs).toBe(0);

    const first = await withAdministratorMaintenance(() => payload.create({
      collection: "administrators",
      data: { email: primaryEmail, password: primaryPassword },
      overrideAccess: true,
    }));
    expect(first.email).toBe(primaryEmail);

    expect((await payload.find({ collection: "administrators", overrideAccess: true, limit: 2 })).totalDocs).toBe(1);

    for (const [slug, data] of [
      [["administrators", "first-register"], publicAccount],
      [["administrators", "forgot-password"], { email: primaryEmail }],
      [["administrators", "reset-password"], { token: "invalid", password: primaryPassword }],
    ] as const) {
      expect((await cmsRequest("POST", [...slug], { data })).status).toBe(403);
    }
    await expect(payload.create({ collection: "administrators", data: publicAccount, overrideAccess: true })).rejects.toThrow();
    expect((await cmsRequest("POST", ["administrators"], { data: publicAccount })).status).toBe(403);
    expect((await cmsRequest("POST", ["administrators", "first-register"], { data: publicAccount })).status).toBe(403);
    expect((await cmsRequest("GET", ["administrators"])).status).toBe(403);
    await expect(payload.find({ collection: "administrators", overrideAccess: false })).rejects.toThrow();

    await expect(withAdministratorMaintenance(() => payload.create({
      collection: "administrators",
      data: { email: "second-administrator@example.test", password: primaryPassword },
      overrideAccess: true,
    }))).rejects.toMatchObject({ status: 403 });
    const owner = { ...first, collection: "administrators" as const };
    const selfResults = await payload.find({ collection: "administrators", user: owner, overrideAccess: false, limit: 10 });
    expect(selfResults.docs.map(({ id }) => String(id))).toEqual([String(first.id)]);
    expect((await payload.findByID({ collection: "administrators", id: first.id, user: owner, overrideAccess: false })).id).toBe(first.id);
    const outsider = { ...owner, id: first.id + 1000 };
    await expect(payload.findByID({ collection: "administrators", id: first.id, user: outsider, overrideAccess: false })).rejects.toThrow();

    await payload.update({
      collection: "administrators",
      id: first.id,
      data: { email: "self-updated@example.test" },
      user: owner,
      overrideAccess: false,
    });
    await payload.update({
      collection: "administrators",
      id: first.id,
      data: { email: primaryEmail },
      user: owner,
      overrideAccess: false,
    });
    await expect(payload.update({
      collection: "administrators",
      id: first.id,
      data: { email: "changed-by-someone-else@example.test" },
      user: outsider,
      overrideAccess: false,
    })).rejects.toThrow();

    await expect(payload.delete({ collection: "administrators", id: first.id, overrideAccess: true })).rejects.toThrow();
    expect((await payload.findByID({ collection: "administrators", id: first.id, overrideAccess: true })).email).toBe(primaryEmail);

    for (let attempt = 0; attempt < 5; attempt++) {
      const response = await cmsRequest("POST", ["administrators", "login"], {
        data: { email: primaryEmail, password: "Incorrect-password-42!" },
      });
      expect(response.status).toBe(401);
    }
    const primary = await payload.find({
      collection: "administrators",
      where: { email: { equals: primaryEmail } },
      overrideAccess: true,
      limit: 1,
    });
    expect(primary.docs).toHaveLength(1);
    const locked = await administrator(primary.docs[0].id);
    expect(locked.loginAttempts).toBe(5);
    expect(Date.parse(String(locked.lockUntil))).toBeGreaterThan(Date.now());
    expect((await cmsRequest("POST", ["administrators", "login"], { data: { email: primaryEmail, password: primaryPassword } })).status).toBe(401);
    await expect(payload.unlock({ collection: "administrators", data: { email: primaryEmail, password: primaryPassword }, overrideAccess: true })).rejects.toMatchObject({ status: 403 });

    const unlocked = await withAdministratorMaintenance(() => payload.unlock({
      collection: "administrators",
      data: { email: primaryEmail, password: primaryPassword },
      overrideAccess: true,
    }));
    expect(unlocked).toBe(true);
    const clearedLock = await administrator(locked.id);
    expect(clearedLock.loginAttempts).toBe(0);
    expect(clearedLock.lockUntil).toBeFalsy();

    await expect(payload.forgotPassword({
      collection: "administrators",
      data: { email: primaryEmail },
      disableEmail: true,
      overrideAccess: true,
    })).rejects.toMatchObject({ status: 403 });
    const protectedResetToken = await withAdministratorMaintenance(() => payload.forgotPassword({
      collection: "administrators",
      data: { email: primaryEmail },
      disableEmail: true,
      overrideAccess: true,
    }));
    expect(protectedResetToken).toBeTruthy();
    await expect(payload.resetPassword({
      collection: "administrators",
      data: { token: protectedResetToken!, password: resetPassword },
      overrideAccess: true,
    })).rejects.toMatchObject({ status: 403 });
    for (const [slug, data] of [
      [["administrators", "forgot-password"], { email: primaryEmail }],
      [["administrators", "reset-password"], { token: "invalid", password: resetPassword }],
    ] as const) {
      expect((await cmsRequest("POST", [...slug], { data })).status).toBe(403);
    }

    const login = await cmsRequest("POST", ["administrators", "login"], { data: { email: primaryEmail, password: primaryPassword } });
    expect(login.status).toBe(200);
    const setCookie = login.headers.get("set-cookie");
    expect(setCookie).toBeTruthy();
    const cookie = setCookie!.split(";")[0];
    expect(cookie).toMatch(new RegExp(`^${payload.config.cookiePrefix}-token=`));
    expect(setCookie).toMatch(/HttpOnly(?:=true)?/i);
    expect(setCookie).toMatch(/Path=\//i);
    expect(setCookie).toMatch(/SameSite=Lax/i);
    expect(setCookie).not.toMatch(/Domain=/i);
    const expiration = Date.parse(setCookie!.match(/Expires=([^;]+)/i)?.[1] ?? "");
    expect(expiration).toBeGreaterThan(Date.now() + 7_140_000);
    expect(expiration).toBeLessThan(Date.now() + 7_260_000);

    const me = await cmsRequest("GET", ["administrators", "me"], { cookie });
    expect(me.status).toBe(200);
    const sessionState = await administrator(locked.id);
    expect(sessionState.sessions?.length).toBeGreaterThan(0);

    await withAdministratorMaintenance(async () => {
      expect(await payload.unlock({ collection: "administrators", data: { email: primaryEmail, password: primaryPassword }, overrideAccess: true })).toBe(true);
      const token = await payload.forgotPassword({
        collection: "administrators",
        data: { email: primaryEmail },
        disableEmail: true,
        overrideAccess: true,
      });
      expect(token).toBeTruthy();
      await payload.resetPassword({
        collection: "administrators",
        data: { token: token!, password: resetPassword },
        overrideAccess: true,
      });
      await payload.update({
        collection: "administrators",
        id: locked.id,
        data: { sessions: [] },
        overrideAccess: true,
      });
    });

    expect((await administrator(locked.id)).sessions).toEqual([]);
    const revokedSession = await cmsRequest("GET", ["administrators", "me"], { cookie });
    expect((await revokedSession.json()).user).toBeNull();
    expect((await cmsRequest("GET", ["administrators"], { cookie })).status).toBe(403);
    expect((await cmsRequest("POST", ["administrators", "login"], { data: { email: primaryEmail, password: primaryPassword } })).status).toBe(401);
    const freshLogin = await cmsRequest("POST", ["administrators", "login"], { data: { email: primaryEmail, password: resetPassword } });
    expect(freshLogin.status).toBe(200);
  });
});
