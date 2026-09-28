import { companies } from "@/data/companies";
import { SITE_ORIGIN } from "@/data/goodman-group";

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

export function GET(_request?: Request) {
  void _request;
  const origin = SITE_ORIGIN;
  const routes = [
    "/",
    "/companies",
    ...companies.map((company) => `/companies/${company.slug}`),
  ];
  const entries = routes
    .map((route) => `<url><loc>${escapeXml(`${origin}${route}`)}</loc></url>`)
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`,
    {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    },
  );
}
