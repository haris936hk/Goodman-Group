import config from "@payload-config";
import { getPayload } from "payload";
import { withAdministratorMaintenance } from "../src/cms/administrator-maintenance.js";
import { promptHidden, promptLine } from "../src/cms/administrator-prompts.js";
import { readCmsEnvironment } from "../src/cms/environment.js";

async function main() {
  readCmsEnvironment();
  const payload = await getPayload({ config });
  try {
    const before = await payload.find({
      collection: "administrators",
      depth: 0,
      limit: 2,
      overrideAccess: true,
    });
    if (before.totalDocs !== 0) {
      throw new Error("An administrator already exists; refusing to create another.");
    }

    const email = (await promptLine("Administrator email: ")).trim().toLowerCase();
    if (!email) throw new Error("An administrator email is required.");
    const password = await promptHidden("Administrator password: ");
    const confirmation = await promptHidden("Confirm administrator password: ");
    if (!password) throw new Error("The administrator password cannot be empty.");
    if (password !== confirmation) throw new Error("The entered passwords do not match.");

    await withAdministratorMaintenance(async () => {
      const current = await payload.find({
        collection: "administrators",
        depth: 0,
        limit: 2,
        overrideAccess: true,
      });
      if (current.totalDocs !== 0) {
        throw new Error("An administrator already exists; refusing to create another.");
      }
      await payload.create({
        collection: "administrators",
        data: { email, password },
        overrideAccess: true,
      });
      const after = await payload.find({
        collection: "administrators",
        depth: 0,
        limit: 2,
        overrideAccess: true,
      });
      if (after.totalDocs !== 1) {
        throw new Error("Administrator bootstrap did not leave exactly one account.");
      }
    });

    console.info("Administrator account created.");
  } finally {
    await payload.destroy();
  }
}

try {
  await main();
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : "Administrator creation failed.");
  // Payload's `run` dispatcher exits 0 after a resolved import; signal failure explicitly after cleanup.
  process.exit(1);
}
