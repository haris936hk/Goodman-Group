import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const OBSERVER_SCRIPT = `
window.__layoutShifts = [];
window.__cls = 0;
let sessionValue = 0;
let sessionEntries = [];
let maxSessionValue = 0;

try {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        const sources = (entry.sources || []).map(s => {
          let nodeDesc = null;
          if (s.node) {
            nodeDesc = {
              nodeName: s.node.nodeName,
              className: typeof s.node.className === 'string' ? s.node.className : (s.node.className ? String(s.node.className) : ''),
              id: s.node.id || '',
              textSnippet: (s.node.textContent || '').trim().slice(0, 80)
            };
          }
          return {
            node: nodeDesc,
            previousRect: s.previousRect ? {
              x: Math.round(s.previousRect.x),
              y: Math.round(s.previousRect.y),
              width: Math.round(s.previousRect.width),
              height: Math.round(s.previousRect.height)
            } : null,
            currentRect: s.currentRect ? {
              x: Math.round(s.currentRect.x),
              y: Math.round(s.currentRect.y),
              width: Math.round(s.currentRect.width),
              height: Math.round(s.currentRect.height)
            } : null
          };
        });

        window.__layoutShifts.push({
          value: entry.value,
          startTime: entry.startTime,
          sources
        });

        // 5000ms max session duration, 1000ms gap
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
        window.__cls = maxSessionValue;
      }
    }
  });
  observer.observe({ type: 'layout-shift', buffered: true });
} catch (e) {
  console.error('Observer error:', e);
}
`;

async function runMeasurement(name, options = {}) {
  const {
    viewport = { width: 1440, height: 900 },
    deviceScaleFactor = 1,
    hasTouch = false,
    cpuThrottle = 1,
    network = null,
    reuseContext = null,
    saveTrace = false,
  } = options;

  let browser;
  let context = reuseContext;
  let closeBrowserOnEnd = false;

  if (!context) {
    browser = await chromium.launch({
      headless: true,
      args: ["--enable-blink-features=LayoutShiftRegions"],
    });
    context = await browser.newContext({
      viewport,
      deviceScaleFactor,
      hasTouch,
      isMobile: hasTouch,
    });
    closeBrowserOnEnd = true;
  }

  const page = await context.newPage();
  await page.addInitScript(OBSERVER_SCRIPT);

  const client = await context.newCDPSession(page);

  if (cpuThrottle > 1) {
    await client.send("Emulation.setCPUThrottlingRate", { rate: cpuThrottle });
  }

  if (network) {
    await client.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: network.latency,
      downloadThroughput: network.downloadThroughput,
      uploadThroughput: network.uploadThroughput,
    });
  }

  let tracePath = null;
  if (saveTrace) {
    tracePath = path.resolve(`/tmp/trace-${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.json`);
    await client.send("Tracing.start", {
      traceConfig: {
        includedCategories: [
          "-*",
          "blink.console",
          "devtools.timeline",
          "loading",
          "latencyInfo",
          "layout_shift",
          "blink.user_timing",
          "disabled-by-default-devtools.timeline",
          "disabled-by-default-devtools.timeline.frame",
          "disabled-by-default-devtools.screenshot",
        ],
      },
      screenshots: true,
    });
  }

  console.log(`Starting ${name}...`);
  const startTime = Date.now();
  await page.goto("https://goodmangoc.com/", { waitUntil: "load", timeout: 30000 });

  // Wait for post-load transitions and Angular rendering / scripts to settle
  await page.waitForTimeout(6000);

  const footerGeometry = await page.evaluate(() => {
    const f = document.querySelector("footer");
    if (!f) return null;
    const r = f.getBoundingClientRect();
    const style = window.getComputedStyle(f);
    return {
      tag: f.tagName,
      className: f.className,
      rect: { x: r.x, y: r.y, width: r.width, height: r.height },
      display: style.display,
      position: style.position,
      height: style.height,
      childCount: f.children.length,
    };
  });

  const shifts = await page.evaluate(() => ({
    cls: window.__cls,
    shifts: window.__layoutShifts,
  }));

  if (saveTrace && tracePath) {
    const traceStreamChunks = [];
    client.on("Tracing.dataCollected", (event) => {
      traceStreamChunks.push(...event.value);
    });
    await new Promise((resolve) => {
      client.on("Tracing.tracingComplete", resolve);
      client.send("Tracing.end");
    });
    await fs.writeFile(tracePath, JSON.stringify({ traceEvents: traceStreamChunks }));
    console.log(`Trace saved to ${tracePath}`);
  }

  console.log(`Finished ${name} in ${Date.now() - startTime}ms`);
  console.log(`CLS: ${shifts.cls}`);
  console.log(`Shifts recorded: ${shifts.shifts.length}`);
  for (const [idx, s] of shifts.shifts.entries()) {
    console.log(`  [Shift ${idx + 1}] value: ${s.value.toFixed(6)}, startTime: ${s.startTime.toFixed(1)}ms`);
    for (const src of s.sources) {
      console.log(`    Node: <${src.node?.nodeName} class="${src.node?.className}" id="${src.node?.id}"> "${src.node?.textSnippet}"`);
      console.log(`    Prev Rect:`, src.previousRect);
      console.log(`    Curr Rect:`, src.currentRect);
    }
  }
  console.log(`Footer geometry:`, footerGeometry);

  await page.close();

  if (closeBrowserOnEnd) {
    await browser.close();
  }

  return { name, shifts, footerGeometry, context, browser };
}

async function main() {
  const results = [];

  // 1. Desktop Cold
  console.log("=== 1. DESKTOP COLD ===");
  const desktopCold = await runMeasurement("Desktop_Cold", {
    viewport: { width: 1440, height: 900 },
    saveTrace: true,
  });
  results.push(desktopCold);

  // 2. Desktop Warm (reuse context from desktop cold if possible, or same browser)
  console.log("\n=== 2. DESKTOP WARM ===");
  const desktopBrowser = await chromium.launch({ headless: true });
  const desktopContext = await desktopBrowser.newContext({ viewport: { width: 1440, height: 900 } });
  // First visit to populate cache
  const warmupPage = await desktopContext.newPage();
  await warmupPage.goto("https://goodmangoc.com/", { waitUntil: "load", timeout: 30000 });
  await warmupPage.waitForTimeout(3000);
  await warmupPage.close();

  // Now measure warm
  const desktopWarm = await runMeasurement("Desktop_Warm", {
    viewport: { width: 1440, height: 900 },
    reuseContext: desktopContext,
    saveTrace: true,
  });
  await desktopBrowser.close();
  results.push(desktopWarm);

  // 3. Mobile Cold Run 1 (390x844, DPR 3, touch, 4x CPU throttle, 150ms RTT, 6 Mbps down = 750 KB/s down)
  const mobileNetwork = {
    latency: 150,
    downloadThroughput: (6 * 1024 * 1024) / 8,
    uploadThroughput: (1.5 * 1024 * 1024) / 8,
  };
  console.log("\n=== 3. MOBILE COLD RUN 1 ===");
  const mobileCold1 = await runMeasurement("Mobile_Cold_1", {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    cpuThrottle: 4,
    network: mobileNetwork,
    saveTrace: true,
  });
  results.push(mobileCold1);

  // 4. Mobile Cold Run 2
  console.log("\n=== 4. MOBILE COLD RUN 2 ===");
  const mobileCold2 = await runMeasurement("Mobile_Cold_2", {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    cpuThrottle: 4,
    network: mobileNetwork,
    saveTrace: true,
  });
  results.push(mobileCold2);

  console.log("\n================ SUMMARY ================");
  for (const r of results) {
    console.log(`${r.name}: CLS = ${r.shifts.cls.toFixed(6)} (${r.shifts.shifts.length} shifts)`);
  }
}

main().catch(console.error);
