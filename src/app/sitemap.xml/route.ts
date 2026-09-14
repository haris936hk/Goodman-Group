import { companies } from "@/data/companies";

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

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
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
