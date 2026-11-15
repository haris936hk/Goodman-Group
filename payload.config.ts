import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { lexicalEditor, ParagraphFeature, HeadingFeature, BoldFeature, ItalicFeature, OrderedListFeature, UnorderedListFeature, BlockquoteFeature, LinkFeature, UploadFeature, FixedToolbarFeature } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Administrators } from "./src/cms/collections/administrators";
import { Announcements } from "./src/cms/collections/announcements";
import { Media } from "./src/cms/collections/media";
import { cmsDatabasePoolConfig } from "./src/cms/database-connection";
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
  db: postgresAdapter({ pool: cmsDatabasePoolConfig(environment.databaseUrl), push: false, migrationDir: path.resolve(directory, "src/migrations") }),
  plugins: [vercelBlobStorage({ collections: { media: true }, token: environment.blobToken })],
  editor: lexicalEditor({ features: () => [ParagraphFeature(), HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }), BoldFeature(), ItalicFeature(), OrderedListFeature(), UnorderedListFeature(), BlockquoteFeature(), LinkFeature({ enabledCollections: [] }), UploadFeature({ collections: { media: { fields: [] } } }), FixedToolbarFeature()] }),
  sharp,
  graphQL: { disable: true },
  telemetry: false,
  cors: environment.origins,
  csrf: environment.origins,
  defaultDepth: 1,
  maxDepth: 2,
  upload: {
    // Busboy marks files truncated at its limit; the early media hook enforces <= 4 MB.
    abortOnLimit: false,
    requestSizeLimit: 4_400_000,
    limits: { fileSize: 4_000_001, files: 1, fields: 20, fieldSize: 1_000_000, parts: 21 },
  },
  typescript: { outputFile: path.resolve(directory, "src/payload-types.ts") },
});
