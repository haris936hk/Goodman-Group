import { APIError, type CollectionConfig } from "payload";
import { companies } from "../../data/companies";
import { enforceAnnouncementLifecycle } from "../announcement-lifecycle";
import { assertCmsMutationScope } from "../mutation-gate";
import { restoreDraftEndpoint } from "../restore-draft";

export const Announcements: CollectionConfig = {
  slug: "announcements",
  disableDuplicate: true,
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "publishedAt"],
    preview: (doc) => `/blog/preview/${doc.id}`,
    components: { views: { edit: { version: { Component: "/src/cms/admin/restore-as-draft#RestoreAsDraftView" } } } },
  },
  access: {
    admin: ({ req }) => req.user?.collection === "administrators",
    read: ({ req }) => req.user?.collection === "administrators" ? true : { _status: { equals: "published" } },
    readVersions: ({ req }) => req.user?.collection === "administrators",
    create: ({ req }) => req.user?.collection === "administrators",
    update: ({ req }) => req.user?.collection === "administrators",
    delete: ({ req }) => req.user?.collection === "administrators",
  },
  versions: { maxPerDoc: 20, drafts: { autosave: { interval: 30_000 }, schedulePublish: false } },
  endpoints: [restoreDraftEndpoint],
  hooks: {
    beforeOperation: [({ operation }) => {
      if (operation === "restoreVersion") throw new APIError("Use Restore as draft instead.", 403);
      if (["create", "update", "delete", "autosave"].includes(operation)) assertCmsMutationScope();
    }],
    beforeChange: [enforceAnnouncementLifecycle],
  },
  fields: [
    { name: "title", type: "text", maxLength: 160, admin: { description: "A clear headline for your announcement. Required to publish." } },
    { name: "slug", type: "text", unique: true, index: true, maxLength: 180, admin: { description: "Generated from the title before publication. Locked after first publication." } },
    { name: "summary", type: "textarea", maxLength: 300, admin: { description: "A short introduction shown on the Blog. Required to publish." } },
    { name: "body", type: "richText", admin: { description: "Write your announcement here. Use the toolbar to add headings, lists, links, and images." } },
    { name: "coverImage", type: "upload", relationTo: "media", admin: { description: "Optional. Choose an image for the announcement and its Blog listing." } },
    { name: "relatedCompanies", type: "select", hasMany: true, options: companies.map((company) => ({ label: company.displayName, value: company.slug })) },
    { name: "publishedAt", type: "date", admin: { readOnly: true, position: "sidebar" } },
  ],
};
