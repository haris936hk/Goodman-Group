(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/company-theme-sync.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CompanyThemeSync",
    ()=>CompanyThemeSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/site-theme.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const palettes = [
    {
        className: "wal-green-page",
        light: "#faf8f5",
        dark: "#111b16"
    },
    {
        className: "geron-page",
        light: "#f8f5ff",
        dark: "#0c0817"
    },
    {
        className: "laboratories-page",
        light: "#fcfaf7",
        dark: "#191416"
    },
    {
        className: "billing-page",
        light: "#fafbf8",
        dark: "#101c19"
    },
    {
        className: "medical-equipment-page",
        light: "#fafbfc",
        dark: "#101c26"
    }
];
function CompanyThemeSync() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "fb24b6ed4b493f4ddcc60407b69e2d9f2a305fb8f4b33dc79d6f45188c7e619a") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "fb24b6ed4b493f4ddcc60407b69e2d9f2a305fb8f4b33dc79d6f45188c7e619a";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = [];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_CompanyThemeSyncUseEffect, t0);
    return null;
}
_s(CompanyThemeSync, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = CompanyThemeSync;
function _CompanyThemeSyncUseEffect() {
    const shell = document.querySelector(".company-group-frame");
    const palette = palettes.find({
        "CompanyThemeSync[useEffect() > palettes.find()]": (t0)=>{
            const { className } = t0;
            return shell?.classList.contains(className);
        }
    }["CompanyThemeSync[useEffect() > palettes.find()]"]);
    if (!shell || !palette) {
        return;
    }
    const apply = {
        "CompanyThemeSync[useEffect() > apply]": ()=>{
            if (!shell.isConnected) {
                return;
            }
            const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readSiteTheme"])();
            shell.dataset.theme = theme;
            document.querySelectorAll("meta[name=\"theme-color\"]").forEach({
                "CompanyThemeSync[useEffect() > apply > (anonymous)()]": (meta)=>{
                    meta.content = palette[theme];
                }
            }["CompanyThemeSync[useEffect() > apply > (anonymous)()]"]);
        }
    }["CompanyThemeSync[useEffect() > apply]"];
    apply();
    const themeObserver = new MutationObserver(apply);
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [
            "data-theme"
        ]
    });
    const headObserver = new MutationObserver(apply);
    headObserver.observe(document.head, {
        childList: true
    });
    return ()=>{
        themeObserver.disconnect();
        headObserver.disconnect();
    };
}
var _c;
__turbopack_context__.k.register(_c, "CompanyThemeSync");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/site-theme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initializeGroupTheme",
    ()=>initializeGroupTheme,
    "readSiteTheme",
    ()=>readSiteTheme,
    "setSiteTheme",
    ()=>setSiteTheme,
    "syncDocumentTheme",
    ()=>syncDocumentTheme
]);
function readSiteTheme() {
    if (typeof document !== "undefined") {
        const current = document.documentElement.dataset.theme;
        if (current === "light" || current === "dark") return current;
    }
    try {
        const stored = localStorage.getItem("goodman-group-theme");
        if (stored === "light" || stored === "dark") return stored;
    } catch  {
    // Storage inaccessible or denied
    }
    if (("TURBOPACK compile-time value", "object") !== "undefined" && typeof window.matchMedia === "function") {
        try {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        } catch  {
            return "dark";
        }
    }
    return "dark";
}
function setSiteTheme(theme) {
    if (typeof document !== "undefined") {
        document.documentElement.dataset.theme = theme;
        document.documentElement.dataset.themeExplicit = "true";
    }
    try {
        localStorage.setItem("goodman-group-theme", theme);
    } catch  {
    // The document retains the current preference when storage is unavailable.
    }
}
const initializeGroupTheme = `(function () {
  var theme = "dark";
  var hasExplicit = false;
  try {
    var stored = localStorage.getItem("goodman-group-theme");
    if (stored === "light" || stored === "dark") {
      theme = stored;
      hasExplicit = true;
    }
  } catch (error) {}

  if (!hasExplicit) {
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
      } else if (window.matchMedia) {
        theme = "light";
      }
    } catch (error) {
      theme = "dark";
    }
  } else {
    document.documentElement.dataset.themeExplicit = "true";
  }

  document.documentElement.dataset.theme = theme;

  function apply(activeTheme) {
    var companyShell = document.querySelector(".wal-green-page, .geron-page, .laboratories-page, .billing-page, .medical-equipment-page");
    if (companyShell) {
      var isBilling = companyShell.classList.contains("billing-page");
      var isGeron = companyShell.classList.contains("geron-page");
      var isLaboratories = companyShell.classList.contains("laboratories-page");
      var isMedical = companyShell.classList.contains("medical-equipment-page");
      companyShell.dataset.theme = activeTheme;
      document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
        meta.content = isBilling
          ? (activeTheme === "dark" ? "#101c19" : "#fafbf8")
          : isGeron
            ? (activeTheme === "dark" ? "#0c0817" : "#f8f5ff")
            : isLaboratories
              ? (activeTheme === "dark" ? "#191416" : "#fcfaf7")
              : isMedical
                ? (activeTheme === "dark" ? "#101c26" : "#fafbfc")
                : (activeTheme === "dark" ? "#111b16" : "#faf8f5");
      });
      return true;
    }
    var shell = document.querySelector(".site-shell");
    if (!shell) return false;
    shell.dataset.theme = activeTheme;
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      meta.content = activeTheme === "light" ? "#ffffff" : "#06111f";
    });
    return true;
  }

  if (!apply(theme)) {
    var observer = new MutationObserver(function () {
      if (apply(document.documentElement.dataset.theme || theme)) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener("DOMContentLoaded", function () {
      observer.disconnect();
    }, { once: true });
  }

  try {
    var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    function onMediaChange(e) {
      var explicit = false;
      try {
        var val = localStorage.getItem("goodman-group-theme");
        if (val === "light" || val === "dark") explicit = true;
      } catch (err) {}
      if (document.documentElement.dataset.themeExplicit === "true") explicit = true;
      if (explicit) return;

      var nextTheme = e.matches ? "dark" : "light";
      document.documentElement.dataset.theme = nextTheme;
      apply(nextTheme);
    }
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", onMediaChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(onMediaChange);
    }
  } catch (err) {}
})()`;
function syncDocumentTheme() {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    let theme = "dark";
    let hasExplicit = false;
    try {
        const stored = localStorage.getItem("goodman-group-theme");
        if (stored === "light" || stored === "dark") {
            theme = stored;
            hasExplicit = true;
        }
    } catch  {
    // Storage inaccessible or denied
    }
    const current = root.dataset.theme;
    if (!hasExplicit && root.dataset.themeExplicit === "true" && (current === "light" || current === "dark")) {
        theme = current;
        hasExplicit = true;
    }
    if (!hasExplicit) {
        if (("TURBOPACK compile-time value", "object") !== "undefined" && typeof window.matchMedia === "function") {
            try {
                theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            } catch  {
                theme = "dark";
            }
        }
    } else {
        root.dataset.themeExplicit = "true";
    }
    root.dataset.theme = theme;
    const shell = document.querySelector(".site-shell");
    if (shell) {
        shell.dataset.theme = theme;
    }
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta)=>{
        meta.content = theme === "light" ? "#ffffff" : "#06111f";
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=src_1sf-yboojg6tv._.js.map