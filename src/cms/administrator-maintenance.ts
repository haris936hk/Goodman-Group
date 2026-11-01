import { AsyncLocalStorage } from "node:async_hooks";

interface MaintenanceScope {
  active: boolean;
}

const maintenanceKey = Symbol.for("goodman.cms.administrator-maintenance");
const globals = globalThis as typeof globalThis & {
  [maintenanceKey]?: AsyncLocalStorage<MaintenanceScope>;
};
const maintenance = globals[maintenanceKey] ??= new AsyncLocalStorage<MaintenanceScope>();

/** True only while trusted offline tooling is performing administrator maintenance. */
export function isAdministratorMaintenance(): boolean {
  return maintenance.getStore()?.active === true;
}

/** Grant a server-owned, non-request-forgeable scope to one trusted maintenance operation. */
export async function withAdministratorMaintenance<T>(operation: () => Promise<T>): Promise<T> {
  const current = maintenance.getStore();
  if (current?.active) return operation();

  const scope: MaintenanceScope = { active: true };
  try {
    return await maintenance.run(scope, operation);
  } finally {
    scope.active = false;
  }
}
