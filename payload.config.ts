import path from "node:path";
import { fileURLToPath } from "node:url";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor, ParagraphFeature, HeadingFeature, BoldFeature, ItalicFeature, OrderedListFeature, UnorderedListFeature, BlockquoteFeature, LinkFeature, UploadFeature, FixedToolbarFeature } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Administrators } from "./src/cms/collections/administrators";
import { Announcements } from "./src/cms/collections/announcements";
import { Media } from "./src/cms/collections/media";
import { readCmsEnvironment } from "./src/cms/environment";

const directory = path.dirname(fileURLToPath(import.meta.url));
const environment = readCmsEnvironment();

export default buildConfig({
  secret: environment.secret,
  routes: { admin: "/admin", api: "/api/cms" },
  admin: {
    user: "administrators",
    importMap: { baseDir: directory },
    components: {
      views: {
        login: { Component: "/src/cms/admin/login-view#AdministratorLoginView" },
      },
    },
  },
  collections: [Announcements, Media, Administrators],
  db: sqliteAdapter({ client: { url: environment.databaseUrl }, push: false, busyTimeout: 5000, migrationDir: path.resolve(directory, "src/migrations") }),
  editor: lexicalEditor({ features: () => [ParagraphFeature(), HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }), BoldFeature(), ItalicFeature(), OrderedListFeature(), UnorderedListFeature(), BlockquoteFeature(), LinkFeature({ enabledCollections: [] }), UploadFeature({ collections: { media: { fields: [] } } }), FixedToolbarFeature()] }),
  sharp,
  graphQL: { disable: true },
  telemetry: false,
  cors: environment.origins,
  csrf: environment.origins,
  defaultDepth: 1,
  maxDepth: 2,
  upload: {
    // Busboy marks files truncated at its limit; the early media hook enforces <= 5 MB.
    abortOnLimit: false,
    requestSizeLimit: 6_000_000,
    limits: { fileSize: 5_000_001, files: 1, fields: 20, fieldSize: 1_000_000, parts: 21 },
  },
  typescript: { outputFile: path.resolve(directory, "src/payload-types.ts") },
});
