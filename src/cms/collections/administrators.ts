import { Forbidden } from "payload";
import type { AccessArgs, CollectionConfig } from "payload";
import { isAdministratorMaintenance } from "../administrator-maintenance";

const ownAdministrator = ({ req, id }: AccessArgs) => {
  const user = req.user;
  if (user?.collection !== "administrators") return false;
  if (id !== undefined) return String(id) === String(user.id);
  return { id: { equals: user.id } };
};

export const Administrators: CollectionConfig = {
  slug: "administrators",
  auth: {
    cookies: {
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
    lockTime: 10 * 60 * 1000,
    maxLoginAttempts: 5,
    tokenExpiration: 2 * 60 * 60,
    useAPIKey: false,
    useSessions: true,
    verify: false,
  },
  admin: {
    defaultColumns: ["email"],
    useAsTitle: "email",
  },
  access: {
    admin: ({ req }) => req.user?.collection === "administrators",
    create: () => false,
    delete: () => false,
    read: ownAdministrator,
    unlock: () => false,
    update: ownAdministrator,
  },
  disableBulkDelete: true,
  disableDuplicate: true,
  fields: [],
  graphQL: false,
  hooks: {
    beforeOperation: [async ({ operation, req }) => {
      if (operation === "delete" || operation === "deleteByID") {
        throw new Forbidden(req.t);
      }
      if (operation === "create" && !isAdministratorMaintenance()) {
        throw new Forbidden(req.t);
      }
      if (operation === "create") {
        const existing = await req.payload.find({ collection: "administrators", limit: 1, depth: 0, overrideAccess: true, req });
        if (existing.totalDocs !== 0) throw new Forbidden(req.t);
      }
      if (
        (operation === "forgotPassword" || operation === "resetPassword" || operation === "unlock") &&
        !isAdministratorMaintenance()
      ) {
        throw new Forbidden(req.t);
      }
    }],
  },
};
