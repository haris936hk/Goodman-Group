import { chromium } from "playwright";
import fs from "node:fs/promises";
const BASE_URL = "http://localhost:3000";

const ROUTES = [
  { path: "/", name: "Home" },
  { path: "/companies", name: "Directory" },
  { path: "/companies/goodman-billing", name: "Goodman Billing" },
  { path: "/companies/goodman-laboratories", name: "Goodman Laboratories" },
  { path: "/companies/goodman-medical-equipment", name: "Medical Equipment" },
  { path: "/companies/geron-pharma", name: "Geron Pharma" },
  { path: "/companies/wal-green-chemicals", name: "Wal Green Chemicals" },
  { path: "/_not-found", name: "Not Found (404)" },
];

const INIT_OBSERVER_SCRIPT = `
window.__perfData = {
  cls: 0,
  shifts: [],
  longTasks: [],
  tbt: 0,
  fcp: null,
  lcp: null,
  inp: null,
  events: [],
};

let sessionValue = 0;
let sessionEntries = [];
let maxSessionValue = 0;

try {
  // CLS Observer
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        const sources = (entry.sources || []).map(s => ({
          nodeName: s.node ? s.node.nodeName : null,
          className: s.node && typeof s.node.className === 'string' ? s.node.className : '',
          id: s.node ? s.node.id : '',
          textSnippet: s.node ? (s.node.textContent || '').trim().slice(0, 80) : '',
          previousRect: s.previousRect ? { x: Math.round(s.previousRect.x), y: Math.round(s.previousRect.y), w: Math.round(s.previousRect.width), h: Math.round(s.previousRect.height) } : null,
          currentRect: s.currentRect ? { x: Math.round(s.currentRect.x), y: Math.round(s.currentRect.y), w: Math.round(s.currentRect.width), h: Math.round(s.currentRect.height) } : null,
        }));

        window.__perfData.shifts.push({
          value: entry.value,
          startTime: entry.startTime,
          sources
        });

        if (sessionEntries.length > 0 &&
            (entry.startTime - sessionEntries[sessionEntries.length - 1].startTime > 1000 ||
             entry.startTime - sessionEntries[0].startTime > 5000)) {
          sessionValue = entry.value;
          sessionEntries = [entry];
        } else {
          sessionValue += entry.value;
          sessionEntries.push(entry);
        }
        if (sessionValue > maxSessionValue) {
          maxSessionValue = sessionValue;
        }
        window.__perfData.cls = maxSessionValue;
      }
    }
  });
  clsObserver.observe({ type: 'layout-shift', buffered: true });

  // LCP Observer
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    if (lastEntry) {
      window.__perfData.lcp = {
        startTime: lastEntry.startTime,
        renderTime: lastEntry.renderTime,
        loadTime: lastEntry.loadTime,
        size: lastEntry.size,
        id: lastEntry.id,
        url: lastEntry.url,
        element: lastEntry.element ? {
          nodeName: lastEntry.element.nodeName,
          className: typeof lastEntry.element.className === 'string' ? lastEntry.element.className : '',
          id: lastEntry.element.id,
          textSnippet: (lastEntry.element.textContent || '').trim().slice(0, 80),
        } : null
      };
    }
  });
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

  // Long Tasks (for TBT)
  const longTaskObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__perfData.longTasks.push({
        startTime: entry.startTime,
        duration: entry.duration,
        name: entry.name,
      });
      // TBT contributes duration - 50ms for tasks > 50ms
      if (entry.duration > 50) {
        window.__perfData.tbt += (entry.duration - 50);
      }
    }
  });
  longTaskObserver.observe({ entryTypes: ['longtask'] });

  // Paint Observer
  const paintObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        window.__perfData.fcp = entry.startTime;
      }
    }
  });
  paintObserver.observe({ type: 'paint', buffered: true });

  // Event Observer (for INP)
  const eventObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__perfData.events.push({
        name: entry.name,
        duration: entry.duration,
        startTime: entry.startTime,
        processingStart: entry.processingStart,
        processingEnd: entry.processingEnd,
        interactionId: entry.interactionId || 0
      });
    }
  });
  eventObserver.observe({ type: 'event', durationThreshold: 16, buffered: true });

} catch (e) {
  console.error("Observer initialization error:", e);
}
`;

async function measurePageLoad(browser, route, config, runs = 3) {
  const runResults = [];

  for (let r = 0; r < runs; r++) {
    const context = await browser.newContext({
      viewport: config.viewport,
      deviceScaleFactor: config.deviceScaleFactor || 1,
      hasTouch: config.hasTouch || false,
      isMobile: config.isMobile || false,
      userAgent: config.userAgent,
    });

    const page = await context.newPage();
    await page.addInitScript(INIT_OBSERVER_SCRIPT);

    const client = await context.newCDPSession(page);
    await client.send("Performance.enable");

    if (config.cpuThrottle > 1) {
      await client.send("Emulation.setCPUThrottlingRate", { rate: config.cpuThrottle });
    }

    if (config.network) {
      await client.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: config.network.latency,
        downloadThroughput: config.network.downloadThroughput,
        uploadThroughput: config.network.uploadThroughput,
      });
    }

    const networkRequests = [];
    page.on("request", (req) => {
      networkRequests.push({
        url: req.url(),
        resourceType: req.resourceType(),
        method: req.method(),
      });
    });

    const networkResponses = [];
    page.on("response", async (res) => {
      try {
        const headers = res.headers();
        networkResponses.push({
          url: res.url(),
          status: res.status(),
          resourceType: res.request().resourceType(),
          contentLength: parseInt(headers["content-length"] || "0", 10),
          contentType: headers["content-type"] || "",
          cacheControl: headers["cache-control"] || "",
          contentEncoding: headers["content-encoding"] || "",
          fromCache: res.fromServiceWorker() || false,
        });
      } catch {}
    });

    const response = await page.goto(`${BASE_URL}${route.path}`, {
      waitUntil: "load",
      timeout: 30000,
    });

    // Wait 1500ms for lazy hydration, dynamic imports, animations, and shifts to settle
    await page.waitForTimeout(1500);
    const navTiming = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      if (!nav) return null;
      return {
        ttfb: nav.responseStart - nav.requestStart,
        responseStart: nav.responseStart,
        responseEnd: nav.responseEnd,
        domInteractive: nav.domInteractive,
        domContentLoadedEventEnd: nav.domContentLoadedEventEnd,
        loadEventEnd: nav.loadEventEnd,
        transferSize: nav.transferSize,
        encodedBodySize: nav.encodedBodySize,
        decodedBodySize: nav.decodedBodySize,
      };
    });

    const perfMetrics = await page.evaluate(() => window.__perfData);
    const cdpMetricsRaw = await client.send("Performance.getMetrics");
    const cdpMetrics = {};
    for (const m of cdpMetricsRaw.metrics) {
      cdpMetrics[m.name] = m.value;
    }

    const domStats = await page.evaluate(() => {
      const allNodes = document.querySelectorAll("*");
      let maxDepth = 0;
      for (const node of allNodes) {
        let depth = 0;
        let parent = node;
        while (parent) {
          depth++;
          parent = parent.parentElement;
        }
        if (depth > maxDepth) maxDepth = depth;
      }
      return {
        totalNodes: allNodes.length,
        maxDepth,
      };
    });

    // Group resources by type
    const resourceSummary = {
      totalRequests: networkResponses.length,
      totalBytes: networkResponses.reduce((sum, r) => sum + r.contentLength, 0),
      byType: {},
    };

    for (const res of networkResponses) {
      const type = res.resourceType || "other";
      if (!resourceSummary.byType[type]) {
        resourceSummary.byType[type] = { count: 0, bytes: 0 };
      }
      resourceSummary.byType[type].count++;
      resourceSummary.byType[type].bytes += res.contentLength;
    }

    runResults.push({
      run: r + 1,
      status: response ? response.status() : 0,
      navTiming,
      fcp: perfMetrics.fcp,
      lcp: perfMetrics.lcp,
      cls: perfMetrics.cls,
      shifts: perfMetrics.shifts,
      tbt: perfMetrics.tbt,
      longTasks: perfMetrics.longTasks,
      cdpMetrics,
      domStats,
      resourceSummary,
      responses: networkResponses,
    });

    await page.close();
    await context.close();
  }

  // Calculate median run based on FCP / LCP
  return runResults;
}

async function measureWarmLoad(browser, route, config) {
  // Single context for warm load
  const context = await browser.newContext({
    viewport: config.viewport,
    deviceScaleFactor: config.deviceScaleFactor || 1,
    hasTouch: config.hasTouch || false,
    isMobile: config.isMobile || false,
  });

  // Priming visit
  const primePage = await context.newPage();
  await primePage.goto(`${BASE_URL}${route.path}`, { waitUntil: "load" });
  await primePage.waitForTimeout(1000);
  await primePage.close();

  // Warm visit
  const page = await context.newPage();
  await page.addInitScript(INIT_OBSERVER_SCRIPT);
  const client = await context.newCDPSession(page);
  await client.send("Performance.enable");

  if (config.cpuThrottle > 1) {
    await client.send("Emulation.setCPUThrottlingRate", { rate: config.cpuThrottle });
  }

  await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "load" });
  await page.waitForTimeout(2000);

  const navTiming = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    return nav ? {
      ttfb: nav.responseStart - nav.requestStart,
      domInteractive: nav.domInteractive,
      loadEventEnd: nav.loadEventEnd,
    } : null;
  });

  const perfMetrics = await page.evaluate(() => window.__perfData);

  await page.close();
  await context.close();

  return { navTiming, perfMetrics };
}

async function measureInteractions(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.addInitScript(INIT_OBSERVER_SCRIPT);
  await page.goto(`${BASE_URL}/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  const interactionResults = {};

  // 1. Hover / pointermove on MouseGlowCard
  const card = page.locator(".company-card").first();
  if (await card.count() > 0) {
    const box = await card.boundingBox();
    if (box) {
      const moveStart = performance.now();
      for (let i = 0; i < 50; i++) {
        await page.mouse.move(box.x + i * 2, box.y + i * 2);
      }
      const moveEnd = performance.now();
      interactionResults.cardHoverDurationMs = moveEnd - moveStart;
    }
  }

  // 2. Mobile Menu toggle latency on Mobile Viewport
  await page.close();
  await context.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.addInitScript(INIT_OBSERVER_SCRIPT);
  await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "load" });
  await mobilePage.waitForTimeout(1500);

  const menuButton = mobilePage.locator('button[aria-label="Open navigation"]');
  if (await menuButton.count() > 0) {
    const openStart = Date.now();
    await menuButton.click();
    await mobilePage.waitForSelector('[role="dialog"][aria-label="Site navigation"]');
    const openEnd = Date.now();
    interactionResults.mobileMenuOpenTimeMs = openEnd - openStart;

    const closeButton = mobilePage.locator('button[aria-label="Close navigation"]');
    const closeStart = Date.now();
    await closeButton.click();
    await mobilePage.waitForSelector('[role="dialog"][aria-label="Site navigation"]', { state: "detached" });
    const closeEnd = Date.now();
    interactionResults.mobileMenuCloseTimeMs = closeEnd - closeStart;
  }

  // 3. Client-side Navigation latency
  await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "load" });
  await mobilePage.waitForTimeout(1000);
  const cardLink = mobilePage.locator('.company-card-link, .orbit-node').first();
  if (await cardLink.count() > 0) {
    const softNavStart = Date.now();
    await cardLink.click({ timeout: 5000 });
    await mobilePage.waitForSelector("h1", { timeout: 10000 });
    interactionResults.softNavigationToCompanyMs = Date.now() - softNavStart;
  }

  await mobilePage.close();
  await mobileContext.close();

  return interactionResults;
}

async function main() {
  console.log("=== STARTING EXHAUSTIVE FRONTEND PERFORMANCE AUDIT ===");
  const browser = await chromium.launch({
    headless: true,
    args: ["--enable-blink-features=LayoutShiftRegions"],
  });

  const desktopConfig = {
    viewport: { width: 1440, height: 900 },
    cpuThrottle: 1,
  };

  const mobileConfig = {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
    cpuThrottle: 4, // 4x mobile CPU slowdown
    network: {
      latency: 40, // 40ms RTT Fast 4G
      downloadThroughput: (4 * 1024 * 1024) / 8, // 4 Mbps
      uploadThroughput: (3 * 1024 * 1024) / 8,
    },
  };

  const results = {
    timestamp: new Date().toISOString(),
    desktop: {},
    mobile: {},
    warm: {},
    interactions: {},
  };

  // 1. Desktop Cold runs for all routes
  console.log("\n--- Profiling Desktop Cold Loads (2 runs per route) ---");
  for (const route of ROUTES) {
    console.log(`Auditing Desktop: ${route.name} (${route.path})...`);
    results.desktop[route.path] = await measurePageLoad(browser, route, desktopConfig, 2);
    await fs.writeFile("scripts/audit-raw-results.json", JSON.stringify(results, null, 2));
  }

  // 2. Mobile Cold runs for all routes
  console.log("\n--- Profiling Mobile Loads (4x CPU slowdown, Fast 4G, 2 runs per route) ---");
  for (const route of ROUTES) {
    console.log(`Auditing Mobile: ${route.name} (${route.path})...`);
    results.mobile[route.path] = await measurePageLoad(browser, route, mobileConfig, 2);
    await fs.writeFile("scripts/audit-raw-results.json", JSON.stringify(results, null, 2));
  }

  // 3. Desktop Warm runs
  console.log("\n--- Profiling Desktop Warm Loads ---");
  for (const route of ROUTES) {
    console.log(`Auditing Warm: ${route.name} (${route.path})...`);
    results.warm[route.path] = await measureWarmLoad(browser, route, desktopConfig);
    await fs.writeFile("scripts/audit-raw-results.json", JSON.stringify(results, null, 2));
  }

  // 4. Interactions
  console.log("\n--- Profiling Interactions (Mobile menu, soft navigation, hover) ---");
  try {
    results.interactions = await measureInteractions(browser);
  } catch (err) {
    console.error("Interaction measurement error:", err.message);
  }
  await fs.writeFile("scripts/audit-raw-results.json", JSON.stringify(results, null, 2));
}

main().catch(console.error);
