// @vitest-environment node
import { describe, expect, it } from "vitest";
import { assertCmsMutationScope, withCmsMutation } from "./mutation-gate";

describe("CMS mutation gate", () => {
  it("rejects unscoped writes and permits nested awaited writes", async () => {
    expect(assertCmsMutationScope).toThrow("require withCmsMutation");
    await withCmsMutation(async () => {
      assertCmsMutationScope();
      await withCmsMutation(async () => { assertCmsMutationScope(); });
    });
    expect(assertCmsMutationScope).toThrow();
  });

  it("preserves FIFO order through failure without overlapping mutations", async () => {
    const barrier = Promise.withResolvers<void>();
    const entered = Promise.withResolvers<void>();
    const events: string[] = [];
    const first = withCmsMutation(async () => {
      events.push("first:start");
      entered.resolve();
      await barrier.promise;
      events.push("first:end");
      throw new Error("injected failure");
    });
    const rejected = expect(first).rejects.toThrow("injected failure");
    await entered.promise;
    const second = withCmsMutation(async () => { events.push("second"); });
    const third = withCmsMutation(async () => { events.push("third"); });
    expect(events).toEqual(["first:start"]);
    barrier.resolve();
    await Promise.all([rejected, second, third]);
    expect(events).toEqual(["first:start", "first:end", "second", "third"]);
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
