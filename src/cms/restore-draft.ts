import type { DataFromCollectionSlug, Endpoint, PayloadRequest, TypeWithVersion } from "payload";
import { readCmsEnvironment } from "./environment";
import { assertCmsMutationScope, withCmsMutation } from "./mutation-gate";

type VersionRecord = TypeWithVersion<DataFromCollectionSlug<"announcements">>;
type AnnouncementRecord = DataFromCollectionSlug<"announcements">;


function errorResponse(message: string, status: number): Response {
  return Response.json({ errors: [{ message }] }, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function isSameOriginAdminRequest(req: PayloadRequest): boolean {
  const origin = req.headers.get("origin");
  // The canonical public origin is configured; a reverse proxy can give req.url an internal origin.
  return origin !== null && readCmsEnvironment().origins.includes(origin);
}

export const restoreDraftEndpoint: Endpoint = {
  method: "post",
  path: "/:id/restore-as-draft",
  handler: async (req) => {
    if (!isSameOriginAdminRequest(req)) return errorResponse("Origin denied.", 403);
    if (req.user?.collection !== "administrators") return errorResponse("Administrator authentication is required.", 401);
    if (req.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() !== "application/json") {
      return errorResponse("Expected an application/json request.", 415);
    }

    let requestBody: unknown;
    if (!req.json) return errorResponse("Request body must be valid JSON.", 400);
    try {
      requestBody = await req.json();
    } catch {
      return errorResponse("Request body must be valid JSON.", 400);
    }

    let versionId: unknown;
    if (requestBody && typeof requestBody === "object" && "versionId" in requestBody) {
      versionId = requestBody.versionId;
    }
    const id = req.routeParams?.id;
    if ((typeof id !== "string" && typeof id !== "number") || (typeof versionId !== "string" && typeof versionId !== "number") || String(versionId).length === 0) {
      return errorResponse("A document ID and versionId are required.", 400);
    }

    const saved = await withCmsMutation<{ response: Response } | { id: number | string; _status: "draft" }>(async () => {
      assertCmsMutationScope();
      const version = await req.payload.findVersionByID({
        collection: "announcements",
        id: String(versionId),
        depth: 0,
        overrideAccess: false,
        req,
        user: req.user,
        disableErrors: true,
      }) as VersionRecord | null;

      if (!version || String(version.parent) !== String(id)) {
        return { response: errorResponse("The selected version was not found for this announcement.", 404) };
      }

      const main = await req.payload.findByID({
        collection: "announcements",
        id,
        draft: false,
        depth: 0,
        overrideAccess: false,
        req,
        user: req.user,
        disableErrors: true,
      }) as AnnouncementRecord | null;
      if (!main) return { response: errorResponse("Announcement not found.", 404) };

      const historical = version.version;
      const savedDraft = await req.payload.update({
        collection: "announcements",
        id,
        data: {
          title: historical.title ?? null,
          summary: historical.summary ?? null,
          body: historical.body ?? null,
          coverImage: historical.coverImage ?? null,
          relatedCompanies: historical.relatedCompanies ?? [],
          slug: main.slug ?? null,
          publishedAt: main.publishedAt ?? null,
          _status: "draft",
        },
        depth: 0,
        draft: true,
        overrideAccess: false,
        req,
        user: req.user,
      });

      return { id: savedDraft.id, _status: "draft" as const };
    });

    if ("response" in saved) return saved.response;
    return Response.json(saved, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  },
};
