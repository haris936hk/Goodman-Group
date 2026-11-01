import { companies } from "@/data/companies";
import { SITE_ORIGIN } from "@/data/goodman-group";
import { getPublishedAnnouncementSlugs } from "@/lib/blog/queries";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value.replace(
    /[<>&'\"]/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '\"': "&quot;",
      })[character] ?? character,
  );
}

export async function GET() {
  try {
    const articleRoutes = (await getPublishedAnnouncementSlugs()).map(
      (slug) => `/blog/${encodeURIComponent(slug)}`,
    );
    const routes = [
      "/",
      "/companies",
      ...companies.map((company) => `/companies/${company.slug}`),
      "/blog",
      ...articleRoutes,
    ];
    const entries = routes
      .map((route) => `<url><loc>${escapeXml(`${SITE_ORIGIN}${route}`)}</loc></url>`)
      .join("");

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`,
      {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/xml; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("Sitemap generation failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorDetail: error instanceof Error ? error.message.slice(0, 300) : "Unknown error",
    });
    return new Response("Sitemap temporarily unavailable.", {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": "60",
      },
    });
  }
}
