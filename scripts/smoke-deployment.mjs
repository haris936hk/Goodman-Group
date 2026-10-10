import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";

const canonicalOrigin = "https://goodmangoc.com";
const legacyAssetReferences = [
  "/main-GBURFNCS.js",
  "/styles-6M3QOQLO.css",
];
const requestTimeoutMs = 15_000;

const deploymentRoutes = JSON.parse(
  await readFile(new URL("./deployment-routes.json", import.meta.url), "utf8"),
);

function fail(url, reason) {
  throw new Error(`${url}: ${reason}`);
}

function normalizedText(element) {
  const copy = element.cloneNode(true);
  copy.querySelectorAll("br").forEach((lineBreak) => lineBreak.replaceWith(" "));
  return (copy.textContent ?? "").replace(/\s+/g, " ").trim();
}

async function getResponse(url) {
  let response;
  try {
    response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
  } catch (error) {
    fail(url, `request failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (response.status !== 200) {
    const location = response.headers.get("location");
    fail(
      url,
      `expected HTTP 200, received ${response.status}${location ? ` (redirect to ${location})` : ""}`,
    );
  }

  return response;
}

function requireContentType(response, url, expected) {
  const contentType = response.headers.get("content-type") ?? "";
  const isExpected = expected === "html"
    ? /^text\/html(?:\s*;|$)/i.test(contentType)
    : expected === "javascript"
      ? /^(?:application|text)\/(?:x-)?(?:java|ecma)script(?:\s*;|$)/i.test(contentType)
      : /^text\/css(?:\s*;|$)/i.test(contentType);

  if (!isExpected) {
    fail(url, `expected ${expected} content type, received ${contentType || "no content type"}`);
  }
}

function getExpectedAssetType(element, assetUrl) {
  if (element.tagName.toLowerCase() === "script") return "javascript";
  if (assetUrl.pathname.endsWith(".css")) return "css";
  if (assetUrl.pathname.endsWith(".js")) return "javascript";
  return null;
}

async function smoke(baseUrlArgument) {
  let baseUrl;
  try {
    baseUrl = new URL(baseUrlArgument);
  } catch {
    fail(baseUrlArgument, "base URL must be an absolute HTTP(S) URL");
  }

  if (!/^https?:$/.test(baseUrl.protocol) || baseUrl.pathname !== "/" || baseUrl.search || baseUrl.hash || baseUrl.username || baseUrl.password) {
    fail(baseUrlArgument, "base URL must be an HTTP(S) origin without credentials, path, query, or fragment");
  }

  const checkedRoutes = [];
  const staticAssets = new Map();

  for (const route of deploymentRoutes) {
    const routeUrl = new URL(route.path, baseUrl);
    const response = await getResponse(routeUrl);
    requireContentType(response, routeUrl, "html");

    const html = await response.text();
    for (const legacyReference of legacyAssetReferences) {
      if (html.includes(legacyReference)) {
        fail(routeUrl, `legacy asset reference found: ${legacyReference}`);
      }
    }

    const document = new JSDOM(html).window.document;
    const heading = [...document.querySelectorAll("h1")]
      .find((candidate) => normalizedText(candidate) === route.heading);
    if (!heading) {
      fail(routeUrl, `expected an h1 with text ${JSON.stringify(route.heading)}`);
    }

    if (route.title && document.title.trim() !== route.title) {
      fail(routeUrl, `expected title ${JSON.stringify(route.title)}, received ${JSON.stringify(document.title.trim())}`);
    }

    const canonicals = document.querySelectorAll('link[rel~="canonical"][href]');
    if (canonicals.length !== 1) {
      fail(routeUrl, `expected exactly one canonical link, found ${canonicals.length}`);
    }
    const canonicalUrl = new URL(canonicals[0].getAttribute("href"), routeUrl);
    const expectedCanonical = new URL(route.path, canonicalOrigin);
    if (canonicalUrl.href !== expectedCanonical.href) {
      fail(routeUrl, `expected canonical ${expectedCanonical.href}, received ${canonicalUrl.href}`);
    }

    let routeAssetCount = 0;
    for (const element of document.querySelectorAll("script[src], link[rel~='stylesheet'][href]")) {
      const source = element.getAttribute(element.tagName.toLowerCase() === "script" ? "src" : "href");
      let assetUrl;
      try {
        assetUrl = new URL(source, routeUrl);
      } catch {
        fail(routeUrl, `invalid static asset URL: ${source}`);
      }
      if (assetUrl.origin !== baseUrl.origin || !assetUrl.pathname.startsWith("/_next/static/")) continue;

      const assetType = getExpectedAssetType(element, assetUrl);
      if (!assetType) continue;
      assetUrl.hash = "";
      staticAssets.set(assetUrl.href, assetType);
      routeAssetCount += 1;
    }

    if (routeAssetCount === 0) {
      fail(routeUrl, "no first-party /_next/static/ JavaScript or stylesheet reference found");
    }
    checkedRoutes.push({ url: routeUrl, assetCount: routeAssetCount });
  }

  for (const [assetUrl, assetType] of staticAssets) {
    const response = await getResponse(assetUrl);
    requireContentType(response, assetUrl, assetType);
    const cacheControl = response.headers.get("cache-control") ?? "";
    if (!cacheControl.includes("max-age=") && !cacheControl.includes("immutable")) {
      fail(assetUrl, `expected cache-control header, received ${JSON.stringify(cacheControl)}`);
    }
    const assetBytes = await response.arrayBuffer();
    if (assetBytes.byteLength === 0) {
      fail(assetUrl, "asset response was empty");
    }
  }

  const samplePublicAssets = [
    new URL("/assets/billing/benefits/clipboard-check.svg", baseUrl),
    new URL("/assets/logos/GG-white.png", baseUrl),
    new URL("/favicon.ico", baseUrl),
  ];
  for (const assetUrl of samplePublicAssets) {
    const response = await getResponse(assetUrl.href);
    const cacheControl = response.headers.get("cache-control") ?? "";
    if (!cacheControl.includes("max-age=86400")) {
      fail(assetUrl.href, `expected cache-control with max-age=86400, received ${JSON.stringify(cacheControl)}`);
    }
  }

  const compressionCheck = await fetch(new URL("/", baseUrl), {
    headers: { "Accept-Encoding": "gzip" },
  });
  if (compressionCheck.headers.get("content-encoding") !== "gzip") {
    fail(baseUrl.href, "expected Content-Encoding: gzip when requested with Accept-Encoding: gzip");
  }
  const notFoundUrl = new URL("/_smoke_non_existent_page", baseUrl);
  const notFoundResponse = await fetch(notFoundUrl, { redirect: "manual", signal: AbortSignal.timeout(requestTimeoutMs) });
  if (notFoundResponse.status !== 404) {
    fail(notFoundUrl, `expected HTTP 404 on unmapped route, received ${notFoundResponse.status}`);
  }
  const notFoundHtml = await notFoundResponse.text();
  if (!notFoundHtml.includes("This route has moved beyond the map.")) {
    fail(notFoundUrl, "expected 404 page heading in response body");
  }
  console.log(`PASS ${notFoundUrl.href} (HTTP 404 verified)`);

  const robotsUrl = new URL("/robots.txt", baseUrl);
  const robotsResponse = await fetch(robotsUrl, { redirect: "manual", signal: AbortSignal.timeout(requestTimeoutMs) });
  if (robotsResponse.status !== 200) {
    fail(robotsUrl, `expected HTTP 200 for robots.txt, received ${robotsResponse.status}`);
  }
  const robotsText = await robotsResponse.text();
  if (!robotsText.includes("Sitemap: https://goodmangoc.com/sitemap.xml")) {
    fail(robotsUrl, "expected canonical sitemap directive in robots.txt");
  }
  console.log(`PASS ${robotsUrl.href} (robots.txt verified)`);

  const sitemapUrl = new URL("/sitemap.xml", baseUrl);
  const sitemapResponse = await fetch(sitemapUrl, { redirect: "manual", signal: AbortSignal.timeout(requestTimeoutMs) });
  if (sitemapResponse.status !== 200) {
    fail(sitemapUrl, `expected HTTP 200 for sitemap.xml, received ${sitemapResponse.status}`);
  }
  const sitemapContentType = sitemapResponse.headers.get("content-type") ?? "";
  if (!sitemapContentType.includes("xml")) {
    fail(sitemapUrl, `expected XML content-type, received ${sitemapContentType}`);
  }
  const sitemapXml = await sitemapResponse.text();
  if (!sitemapXml.includes("<loc>https://goodmangoc.com/</loc>") || !sitemapXml.includes("<loc>https://goodmangoc.com/companies</loc>")) {
    fail(sitemapUrl, "expected canonical origin URLs in sitemap.xml");
  }
  console.log(`PASS ${sitemapUrl.href} (sitemap.xml verified)`);
  for (const route of checkedRoutes) {
    console.log(`PASS ${route.url.href} (${route.assetCount} static references)`);
  }
  console.log(`PASS ${staticAssets.size} distinct first-party static assets from ${baseUrl.origin}`);
}

const isEntrypoint = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntrypoint) {
  const baseUrlArgument = process.argv[2];
  if (!baseUrlArgument || process.argv.length !== 3) {
    console.error(`${baseUrlArgument ?? "<missing base URL>"}: provide exactly one deployment origin URL`);
    process.exitCode = 1;
  } else {
    try {
      await smoke(baseUrlArgument);
    } catch (error) {
      console.error(`Deployment smoke failed: ${error instanceof Error ? error.message : String(error)}`);
      process.exitCode = 1;
    }
  }
}
