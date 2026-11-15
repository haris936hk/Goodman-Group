// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => ({
  owner: null as string | null,
  failInsert: false,
  failDelete: false,
  onIdleError: undefined as (() => void) | undefined,
  closes: 0,
}));

vi.mock("pg", () => ({
  Pool: class {
    on(event: string, listener: () => void) {
      if (event === "error") database.onIdleError = listener;
      return this;
    }
    async end() { database.closes++; }
    async query(sql: string, values: string[]) {
      if (sql.startsWith("INSERT")) {
        if (database.failInsert) throw new Error("database unavailable");
        if (database.owner) return { rowCount: 0 };
        database.owner = values[0];
        return { rowCount: 1 };
      }
      if (database.failDelete) throw new Error("database unavailable");
      if (database.owner !== values[0]) return { rowCount: 0 };
      database.owner = null;
      return { rowCount: 1 };
    }
  },
}));

import { assertCmsMutationScope, closeCmsMutationGatePool, withCmsMutation } from "./mutation-gate";

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "postgresql://localhost/gate-test");
  database.owner = null;
  database.failInsert = false;
  database.failDelete = false;
});
afterEach(() => vi.useRealTimers());

describe("CMS mutation gate", () => {
  it("handles idle pool errors without exposing connection details", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      await withCmsMutation(async () => {});
      expect(database.onIdleError).toBeTypeOf("function");
      database.onIdleError!();
      expect(log).toHaveBeenCalledWith("CMS mutation gate: an idle Postgres connection failed.");
      await withCmsMutation(async () => { assertCmsMutationScope(); });
    } finally {
      log.mockRestore();
    }
  });

  it("closes the pool only after active mutations finish and recreates it on demand", async () => {
    const barrier = Promise.withResolvers<void>();
    const entered = Promise.withResolvers<void>();
    const pending = withCmsMutation(async () => {
      entered.resolve();
      await barrier.promise;
    });
    await entered.promise;
    await expect(closeCmsMutationGatePool()).rejects.toThrow("while mutations are active");
    barrier.resolve();
    await pending;
    const previousCloses = database.closes;
    await closeCmsMutationGatePool();
    expect(database.closes).toBe(previousCloses + 1);
    await withCmsMutation(async () => { assertCmsMutationScope(); });
  });

  it("rejects unscoped writes and permits nested awaited writes", async () => {
    expect(assertCmsMutationScope).toThrow("require withCmsMutation");
    await withCmsMutation(async () => {
      assertCmsMutationScope();
      await withCmsMutation(async () => { assertCmsMutationScope(); });
    });
    expect(assertCmsMutationScope).toThrow();
  });

  it("holds the shared lock through failure and protects against a concurrent duplicate slug", async () => {
    vi.useFakeTimers();
    const barrier = Promise.withResolvers<void>();
    const entered = Promise.withResolvers<void>();
    const slugs = new Set<string>();
    const first = withCmsMutation(async () => {
      expect(slugs.has("news")).toBe(false);
      entered.resolve();
      await barrier.promise;
      slugs.add("news");
      throw new Error("injected failure");
    });
    const rejected = expect(first).rejects.toThrow("injected failure");
    await entered.promise;
    const second = withCmsMutation(async () => {
      if (slugs.has("news")) throw new Error("An announcement already uses this URL.");
      slugs.add("news");
    });
    const duplicate = expect(second).rejects.toThrow("already uses this URL");
    expect(slugs.size).toBe(0);
    expect(database.owner).not.toBeNull();
    barrier.resolve();
    await rejected;
    await vi.advanceTimersByTimeAsync(100);
    await Promise.all([rejected, duplicate]);
    expect([...slugs]).toEqual(["news"]);
    expect(database.owner).toBeNull();
  });

  it("waits for a lock held by another instance before granting scope", async () => {
    vi.useFakeTimers();
    database.owner = "another-instance";
    let entered = false;
    const pending = withCmsMutation(async () => {
      assertCmsMutationScope();
      entered = true;
    });
    await Promise.resolve();
    expect(entered).toBe(false);
    database.owner = null;
    await vi.advanceTimersByTimeAsync(100);
    await pending;
    expect(entered).toBe(true);
  });

  it("fails closed if acquisition or release cannot reach the database", async () => {
    database.failInsert = true;
    const operation = vi.fn(async () => {});
    await expect(withCmsMutation(operation)).rejects.toThrow("database unavailable");
    expect(operation).not.toHaveBeenCalled();
    database.failInsert = false;
    database.failDelete = true;
    await expect(withCmsMutation(operation)).rejects.toThrow("database unavailable");
    expect(database.owner).not.toBeNull();
    expect(assertCmsMutationScope).toThrow();
  });

  it("bounds contention with a stale lock without granting authority", async () => {
    vi.useFakeTimers();
    database.owner = "stale-owner";
    const operation = vi.fn(async () => {});
    const pending = withCmsMutation(operation);
    const rejection = expect(pending).rejects.toThrow("Timed out waiting");
    await vi.advanceTimersByTimeAsync(10_000);
    await rejection;
    expect(operation).not.toHaveBeenCalled();
    expect(database.owner).toBe("stale-owner");
  });

  it("retains the lock for nested work even when its caller does not await it", async () => {
    const barrier = Promise.withResolvers<void>();
    const nestedEntered = Promise.withResolvers<void>();
    let finished = false;
    const outer = withCmsMutation(async () => {
      void withCmsMutation(async () => {
        nestedEntered.resolve();
        await barrier.promise;
        assertCmsMutationScope();
        finished = true;
      });
    });
    await nestedEntered.promise;
    await Promise.resolve();
    expect(database.owner).not.toBeNull();
    expect(finished).toBe(false);
    barrier.resolve();
    await outer;
    expect(finished).toBe(true);
    expect(database.owner).toBeNull();
  });

  it("revokes authority inherited by detached work after completion", async () => {
    const barrier = Promise.withResolvers<void>();
    let detached!: Promise<void>;
    await withCmsMutation(async () => {
      detached = (async () => {
        await barrier.promise;
        expect(assertCmsMutationScope).toThrow();
        await withCmsMutation(async () => { assertCmsMutationScope(); });
      })();
    });
    barrier.resolve();
    await detached;
  });
});
