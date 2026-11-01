import config from "@payload-config";
import { getPayload } from "payload";
import { withAdministratorMaintenance } from "../src/cms/administrator-maintenance.js";
import { promptHidden } from "../src/cms/administrator-prompts.js";
import { readCmsEnvironment } from "../src/cms/environment.js";

async function main() {
  readCmsEnvironment();
  const payload = await getPayload({ config });
  try {
    const result = await payload.find({
      collection: "administrators",
      depth: 0,
      limit: 2,
      overrideAccess: true,
    });
    if (result.totalDocs !== 1 || result.docs.length !== 1) {
      throw new Error("Password recovery requires exactly one administrator account.");
    }
    const administrator = result.docs[0];
    if (typeof administrator.email !== "string") {
      throw new Error("The sole administrator account has no usable email identity.");
    }

    const password = await promptHidden("New administrator password: ");
    const confirmation = await promptHidden("Confirm new administrator password: ");
    if (!password) throw new Error("The administrator password cannot be empty.");
    if (password !== confirmation) throw new Error("The entered passwords do not match.");

    await withAdministratorMaintenance(async () => {
      await payload.unlock({
        collection: "administrators",
        data: { email: administrator.email, password },
        overrideAccess: true,
      });
      const token = await payload.forgotPassword({
        collection: "administrators",
        data: { email: administrator.email },
        disableEmail: true,
        overrideAccess: true,
      });
      if (!token) throw new Error("Payload did not issue an offline password-reset token.");

      await payload.resetPassword({
        collection: "administrators",
        data: { password, token },
        overrideAccess: true,
      });
      await payload.update({
        collection: "administrators",
        id: administrator.id,
        data: { sessions: [] },
        overrideAccess: true,
      });
    });

    console.info("Administrator password updated; prior sessions were revoked.");
  } finally {
    await payload.destroy();
  }
}

try {
  await main();
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : "Administrator password recovery failed.");
  // Payload's `run` dispatcher exits 0 after a resolved import; signal failure explicitly after cleanup.
  process.exit(1);
}
