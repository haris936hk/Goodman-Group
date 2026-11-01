import { SITE_ORIGIN } from "@/data/goodman-group";

export function GET() {
  return new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "Allow: /api/cms/media/file/",
      "Disallow: /api/",
      "Disallow: /blog/preview/",
      `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
      "",
    ].join("\n"),
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
}
