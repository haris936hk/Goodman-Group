import config from "@payload-config";
import { REST_GET, REST_POST, REST_DELETE, REST_PATCH, REST_PUT, REST_OPTIONS } from "@payloadcms/next/routes";
import { withCmsMutation } from "@/cms/mutation-gate";
import { readCmsEnvironment } from "@/cms/environment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ slug?: string[] }> };
type Handler = (request: Request, context: Context) => Promise<Response>;

function protect(handler: Handler, mutation = false): Handler {
  return async (request, context) => {
    const { slug = [] } = await context.params;
    const limit = new URL(request.url).searchParams.get("limit");
    if (limit !== null && (!/^[1-9]\d*$/.test(limit) || Number(limit) > 100)) {
      return Response.json({ errors: [{ message: "Pagination limit must be between 1 and 100." }] }, { status: 400 });
    }
    const forbiddenAuth = slug[0] === "administrators" && slug.some((part) => ["first-register", "forgot-password", "reset-password"].includes(part));
    const nativeRestore = mutation && slug[0] === "announcements" && slug[1] === "versions";
    if (forbiddenAuth || nativeRestore) return Response.json({ errors: [{ message: "This operation is available only through the approved maintenance or Restore as draft interface." }] }, { status: 403 });
    if (mutation) {
      const origin = request.headers.get("origin");
      if (origin && !readCmsEnvironment().origins.includes(origin)) return Response.json({ errors: [{ message: "Origin denied." }] }, { status: 403 });
    }
    const response = mutation ? await withCmsMutation(() => handler(request, context)) : await handler(request, context);
    const isPublicMediaFile = request.method === "GET" && slug[0] === "media" && slug[1] === "file";
    if (!isPublicMediaFile) {
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      response.headers.set("Cache-Control", "private, no-store");
    }
    return response;
  };
}

export const GET = protect(REST_GET(config));
export const OPTIONS = protect(REST_OPTIONS(config));
export const POST = protect(REST_POST(config), true);
export const DELETE = protect(REST_DELETE(config), true);
export const PATCH = protect(REST_PATCH(config), true);
export const PUT = protect(REST_PUT(config), true);
