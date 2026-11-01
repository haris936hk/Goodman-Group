import { AsyncLocalStorage } from "node:async_hooks";

interface MutationScope {
  active: boolean;
}

interface MutationGate {
  scope: AsyncLocalStorage<MutationScope>;
  tail: Promise<void>;
}

const gateKey = Symbol.for("goodman.cms.mutation-gate");
const globals = globalThis as typeof globalThis & {
  [gateKey]?: MutationGate;
};
const gate = globals[gateKey] ??= {
  scope: new AsyncLocalStorage<MutationScope>(),
  tail: Promise.resolve(),
};

/** Only server-owned async scope, never request data, grants mutation authority. */
export function assertCmsMutationScope(): void {
  if (!gate.scope.getStore()?.active) {
    throw new Error("CMS mutations require withCmsMutation.");
  }
}

/** Serialize the complete awaited operation; nested operations reuse its scope. */
export async function withCmsMutation<T>(operation: () => Promise<T>): Promise<T> {
  if (gate.scope.getStore()?.active) return operation();

  const previous = gate.tail;
  const { promise, resolve: release } = Promise.withResolvers<void>();
  gate.tail = promise;
  await previous;

  const scope: MutationScope = { active: true };
  try {
    return await gate.scope.run(scope, operation);
  } finally {
    scope.active = false;
    release();
  }
}
