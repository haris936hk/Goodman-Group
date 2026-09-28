import { SITE_ORIGIN } from "@/data/goodman-group";

export function GET(_request?: Request) {
  void _request;
  const origin = SITE_ORIGIN;

  return new Response(
    [`User-agent: *`, `Allow: /`, `Sitemap: ${origin}/sitemap.xml`, ``].join(
      "\n",
    ),
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
}
