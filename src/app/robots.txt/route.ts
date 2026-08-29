export function GET(request: Request) {
  const origin = new URL(request.url).origin;

  return new Response(
    [`User-agent: *`, `Allow: /`, `Sitemap: ${origin}/sitemap.xml`, ``].join(
      "\n",
    ),
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
}
