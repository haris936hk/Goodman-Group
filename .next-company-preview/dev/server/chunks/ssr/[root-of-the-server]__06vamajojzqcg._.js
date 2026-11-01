module.exports = [
(()=>{"use strict";return[
"[project]/src/components/blog-footer-link.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BlogFooterLink",
    ()=>BlogFooterLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function BlogFooterLink() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])() ?? "/";
    const isCurrent = pathname === "/blog" || pathname.startsWith("/blog/");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: "/blog",
        "aria-current": isCurrent ? "page" : undefined,
        children: "Blog"
    }, void 0, false, {
        fileName: "[project]/src/components/blog-footer-link.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/enquiry-section.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EnquirySection",
    ()=>EnquirySection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.mjs [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-aria-components/dist/private/Button.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$ComboBox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-aria-components/dist/private/ComboBox.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Input$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-aria-components/dist/private/Input.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Label$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-aria-components/dist/private/Label.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$ListBox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-aria-components/dist/private/ListBox.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Popover$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-aria-components/dist/private/Popover.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Select$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-aria-components/dist/private/Select.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$libphonenumber$2d$js$2f$min$2f$exports$2f$getCountries$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/libphonenumber-js/min/exports/getCountries.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$libphonenumber$2d$js$2f$min$2f$exports$2f$getCountryCallingCode$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/libphonenumber-js/min/exports/getCountryCallingCode.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$enquiry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/enquiry.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
let cachedCountryOptions = null;
let cachedCountryByLabel = null;
const regionDisplayNames = typeof Intl !== "undefined" && Intl.DisplayNames ? new Intl.DisplayNames([
    "en"
], {
    type: "region"
}) : null;
function getCountryOptions() {
    if (!cachedCountryOptions) {
        cachedCountryOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$libphonenumber$2d$js$2f$min$2f$exports$2f$getCountries$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCountries"])().map((code)=>{
            const name = regionDisplayNames?.of(code) || code;
            const callingCode = `+${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$libphonenumber$2d$js$2f$min$2f$exports$2f$getCountryCallingCode$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCountryCallingCode"])(code)}`;
            return {
                id: code,
                name,
                callingCode,
                label: `${name} (${callingCode})`
            };
        }).sort((a, b)=>a.name.localeCompare(b.name, "en"));
        cachedCountryByLabel = Object.fromEntries(cachedCountryOptions.map((item)=>[
                item.label,
                item
            ]));
    }
    return cachedCountryOptions;
}
function getCountryByLabel() {
    if (!cachedCountryByLabel) {
        getCountryOptions();
    }
    return cachedCountryByLabel;
}
const countryFilter = (textValue, inputValue)=>{
    const query = inputValue.trim().toLowerCase();
    if (!query) return true;
    if (textValue.toLowerCase().includes(query)) return true;
    const item = getCountryByLabel()[textValue];
    if (item) {
        if (item.callingCode.toLowerCase().includes(query)) return true;
        if (item.callingCode.replace("+", "").includes(query)) return true;
        if (item.id.toLowerCase() === query) return true;
    }
    return false;
};
const FIELD_ORDER = [
    {
        key: "name",
        id: "enquiry-name"
    },
    {
        key: "email",
        id: "enquiry-email"
    },
    {
        key: "organisation",
        id: "enquiry-organisation"
    },
    {
        key: "company",
        id: "enquiry-company-button"
    },
    {
        key: "enquiryType",
        id: "enquiry-type-button"
    },
    {
        key: "country",
        id: "enquiry-country-input"
    },
    {
        key: "phone",
        id: "enquiry-phone"
    },
    {
        key: "message",
        id: "enquiry-message"
    }
];
function focusFirstInvalid(errorObj) {
    for (const field of FIELD_ORDER){
        if (errorObj[field.key]) {
            const el = document.getElementById(field.id);
            if (el) {
                el.focus();
                el.scrollIntoView({
                    behavior: "instant",
                    block: "nearest"
                });
                return;
            }
        }
    }
}
function useEnquiryTheme(sectionRef) {
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("dark");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const shell = sectionRef.current?.closest(".site-shell");
        if (!shell) return;
        const update = ()=>{
            const currentTheme = shell.dataset.theme === "light" ? "light" : "dark";
            setTheme(currentTheme);
        };
        update();
        const observer = new MutationObserver((mutations)=>{
            for (const m of mutations){
                if (m.type === "attributes" && m.attributeName === "data-theme") {
                    update();
                }
            }
        });
        observer.observe(shell, {
            attributes: true,
            attributeFilter: [
                "data-theme"
            ]
        });
        return ()=>observer.disconnect();
    }, [
        sectionRef
    ]);
    return theme;
}
function EnquiryHeader() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "enquiry-intro",
        "data-reveal": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "chapter-index",
                children: "05 / Connect"
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                id: "enquiry-heading",
                className: "enquiry-heading",
                children: "Let’s start a conversation."
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "enquiry-lead",
                children: "Tell us what you’re looking for, and we’ll connect you with the right team within Goodman Group."
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "enquiry-clock-badge",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                        className: "size-4 enquiry-badge-icon",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "We’ll respond within 24 hours"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
function EnquiryNoscript() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("noscript", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "enquiry-noscript",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Online enquiries require JavaScript to be enabled. You can contact Goodman Group directly at",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "mailto:goodman@goodmangoc.com",
                        className: "enquiry-mailto-link",
                        children: "goodman@goodmangoc.com"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this),
                    "."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 172,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/enquiry-section.tsx",
            lineNumber: 171,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
function EnquirySuccessView({ name, onReset }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "enquiry-success-view",
        role: "status",
        "aria-live": "polite",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "enquiry-success-icon-wrap",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                    className: "size-12 enquiry-success-icon"
                }, void 0, false, {
                    fileName: "[project]/src/components/enquiry-section.tsx",
                    lineNumber: 195,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "enquiry-success-heading",
                children: "Enquiry Received"
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "enquiry-success-message",
                children: [
                    "Thank you",
                    name ? `, ${name}` : "",
                    ". Your enquiry has been received."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 198,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "enquiry-clock-badge enquiry-success-badge",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                        className: "size-4 enquiry-badge-icon",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "We’ll respond within 24 hours"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onReset,
                className: "enquiry-reset-btn",
                children: "Send another enquiry"
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
function EnquiryErrorAlert({ message }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "enquiry-alert enquiry-alert-error",
        role: "alert",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                className: "size-5 shrink-0",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 218,
        columnNumber: 5
    }, this);
}
function EnquiryNameField({ value, error, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "enquiry-field enquiry-field-name",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: "enquiry-name",
                className: "enquiry-label",
                children: [
                    "Full name ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "enquiry-required",
                        "aria-hidden": "true",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 237,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 236,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: "enquiry-name",
                name: "name",
                type: "text",
                required: true,
                autoComplete: "name",
                placeholder: "Your full name",
                value: value,
                onChange: (e)=>onChange(e.target.value),
                className: `enquiry-input ${error ? "enquiry-input-invalid" : ""}`,
                "aria-invalid": Boolean(error),
                "aria-describedby": error ? "enquiry-name-error" : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: "enquiry-name-error",
                className: "enquiry-error",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 253,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 235,
        columnNumber: 5
    }, this);
}
function EnquiryEmailField({ value, error, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "enquiry-field enquiry-field-email",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: "enquiry-email",
                className: "enquiry-label",
                children: [
                    "Email address ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "enquiry-required",
                        "aria-hidden": "true",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 273,
                        columnNumber: 23
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: "enquiry-email",
                name: "email",
                type: "email",
                required: true,
                autoComplete: "email",
                spellCheck: false,
                placeholder: "you@example.com",
                value: value,
                onChange: (e)=>onChange(e.target.value),
                className: `enquiry-input ${error ? "enquiry-input-invalid" : ""}`,
                "aria-invalid": Boolean(error),
                "aria-describedby": error ? "enquiry-email-error" : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 275,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: "enquiry-email-error",
                className: "enquiry-error",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 290,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 271,
        columnNumber: 5
    }, this);
}
function EnquiryOrgField({ value, error, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "enquiry-field enquiry-field-full enquiry-field-org",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: "enquiry-organisation",
                className: "enquiry-label",
                children: [
                    "Organisation ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "enquiry-optional",
                        children: "(optional)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 310,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 309,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: "enquiry-organisation",
                name: "organisation",
                type: "text",
                autoComplete: "organization",
                placeholder: "Company or institution name",
                value: value,
                onChange: (e)=>onChange(e.target.value),
                className: `enquiry-input ${error ? "enquiry-input-invalid" : ""}`,
                "aria-invalid": Boolean(error),
                "aria-describedby": error ? "enquiry-organisation-error" : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 312,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: "enquiry-organisation-error",
                className: "enquiry-error",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 325,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 308,
        columnNumber: 5
    }, this);
}
function EnquiryCompanySelect({ theme, company, error, onSelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "enquiry-field enquiry-field-company",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Select$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                name: "company",
                isRequired: true,
                selectedKey: company,
                onSelectionChange: (key)=>{
                    onSelect(key ? String(key) : null);
                },
                className: "enquiry-select-group",
                isInvalid: Boolean(error),
                "aria-describedby": error ? "enquiry-company-error" : undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Label$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                        className: "enquiry-label",
                        children: [
                            "Company of interest ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "enquiry-required",
                                "aria-hidden": "true",
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/src/components/enquiry-section.tsx",
                                lineNumber: 358,
                                columnNumber: 31
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 357,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        id: "enquiry-company-button",
                        className: `enquiry-select-trigger ${error ? "enquiry-input-invalid" : ""}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Select$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                className: "enquiry-select-value",
                                children: ({ isPlaceholder, defaultChildren })=>isPlaceholder ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "enquiry-placeholder",
                                        children: "Choose a company"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/enquiry-section.tsx",
                                        lineNumber: 367,
                                        columnNumber: 17
                                    }, this) : defaultChildren
                            }, void 0, false, {
                                fileName: "[project]/src/components/enquiry-section.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "enquiry-chevron",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/components/enquiry-section.tsx",
                                lineNumber: 373,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 360,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Popover$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popover"], {
                        className: "enquiry-popover",
                        "data-theme": theme,
                        "data-lenis-prevent": true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$ListBox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListBox"], {
                            className: "enquiry-listbox",
                            "aria-label": "Company of interest",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$enquiry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["companyOptions"].map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$ListBox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListBoxItem"], {
                                    id: opt.id,
                                    textValue: opt.label,
                                    className: "enquiry-listbox-item",
                                    children: ({ isSelected })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "enquiry-item-text",
                                                    children: opt.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/enquiry-section.tsx",
                                                    lineNumber: 386,
                                                    columnNumber: 21
                                                }, this),
                                                isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "enquiry-check",
                                                    "aria-hidden": "true"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/enquiry-section.tsx",
                                                    lineNumber: 388,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 385,
                                            columnNumber: 19
                                        }, this)
                                }, opt.id, false, {
                                    fileName: "[project]/src/components/enquiry-section.tsx",
                                    lineNumber: 378,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/enquiry-section.tsx",
                            lineNumber: 376,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 375,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 346,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: "enquiry-company-error",
                className: "enquiry-error",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 398,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 345,
        columnNumber: 5
    }, this);
}
function EnquiryTypeSelect({ theme, enquiryType, error, onSelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "enquiry-field enquiry-field-type",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Select$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                name: "enquiryType",
                isRequired: true,
                selectedKey: enquiryType,
                onSelectionChange: (key)=>{
                    onSelect(key ? String(key) : null);
                },
                className: "enquiry-select-group",
                isInvalid: Boolean(error),
                "aria-describedby": error ? "enquiry-type-error" : undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Label$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                        className: "enquiry-label",
                        children: [
                            "Enquiry type ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "enquiry-required",
                                "aria-hidden": "true",
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/src/components/enquiry-section.tsx",
                                lineNumber: 431,
                                columnNumber: 24
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        id: "enquiry-type-button",
                        className: `enquiry-select-trigger ${error ? "enquiry-input-invalid" : ""}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Select$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                className: "enquiry-select-value",
                                children: ({ isPlaceholder, defaultChildren })=>isPlaceholder ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "enquiry-placeholder",
                                        children: "Select enquiry purpose"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/enquiry-section.tsx",
                                        lineNumber: 440,
                                        columnNumber: 17
                                    }, this) : defaultChildren
                            }, void 0, false, {
                                fileName: "[project]/src/components/enquiry-section.tsx",
                                lineNumber: 437,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "enquiry-chevron",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/components/enquiry-section.tsx",
                                lineNumber: 446,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 433,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Popover$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popover"], {
                        className: "enquiry-popover",
                        "data-theme": theme,
                        "data-lenis-prevent": true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$ListBox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListBox"], {
                            className: "enquiry-listbox",
                            "aria-label": "Enquiry type",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$enquiry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enquiryTypeOptions"].map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$ListBox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListBoxItem"], {
                                    id: opt.id,
                                    textValue: opt.label,
                                    className: "enquiry-listbox-item",
                                    children: ({ isSelected })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "enquiry-item-text",
                                                    children: opt.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/enquiry-section.tsx",
                                                    lineNumber: 459,
                                                    columnNumber: 21
                                                }, this),
                                                isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "enquiry-check",
                                                    "aria-hidden": "true"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/enquiry-section.tsx",
                                                    lineNumber: 461,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 458,
                                            columnNumber: 19
                                        }, this)
                                }, opt.id, false, {
                                    fileName: "[project]/src/components/enquiry-section.tsx",
                                    lineNumber: 451,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/enquiry-section.tsx",
                            lineNumber: 449,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 448,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 419,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: "enquiry-type-error",
                className: "enquiry-error",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 471,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 418,
        columnNumber: 5
    }, this);
}
function EnquiryPhoneField({ theme, countryKey, phone, countryError, phoneError, countryOptions, onCountryChange, onPhoneChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "enquiry-field enquiry-field-full enquiry-field-phone",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                id: "enquiry-phone-label",
                className: "enquiry-label",
                children: [
                    "Phone Number ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "enquiry-optional",
                        children: "(optional)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 501,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 500,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "enquiry-phone-compound",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$ComboBox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComboBox"], {
                        "aria-label": "Country calling code",
                        selectedKey: countryKey,
                        onSelectionChange: (key)=>{
                            onCountryChange(key ? String(key) : null);
                        },
                        defaultItems: countryOptions,
                        defaultFilter: countryFilter,
                        className: "enquiry-country-combobox",
                        isInvalid: Boolean(countryError),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "enquiry-combobox-wrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Input$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                        id: "enquiry-country-input",
                                        "aria-label": "Country calling code",
                                        placeholder: "Country code",
                                        className: `enquiry-combobox-input ${countryError ? "enquiry-input-invalid" : ""}`,
                                        "aria-describedby": countryError ? "enquiry-country-error" : undefined
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/enquiry-section.tsx",
                                        lineNumber: 516,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Button$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        className: "enquiry-combobox-toggle",
                                        "aria-label": "Open country code selection",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: "enquiry-chevron",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 527,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/enquiry-section.tsx",
                                        lineNumber: 523,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/enquiry-section.tsx",
                                lineNumber: 515,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$Popover$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popover"], {
                                className: "enquiry-popover enquiry-popover-country",
                                "data-theme": theme,
                                "data-lenis-prevent": true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$ListBox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListBox"], {
                                    className: "enquiry-listbox",
                                    children: (item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aria$2d$components$2f$dist$2f$private$2f$ListBox$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListBoxItem"], {
                                            id: item.id,
                                            textValue: item.label,
                                            className: "enquiry-listbox-item",
                                            children: ({ isSelected })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "enquiry-item-country-name",
                                                            children: item.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                                            lineNumber: 540,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "enquiry-item-country-code",
                                                            children: item.callingCode
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                                            lineNumber: 541,
                                                            columnNumber: 23
                                                        }, this),
                                                        isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            className: "enquiry-check",
                                                            "aria-hidden": "true"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                                            lineNumber: 543,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/enquiry-section.tsx",
                                                    lineNumber: 539,
                                                    columnNumber: 21
                                                }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 533,
                                            columnNumber: 17
                                        }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/enquiry-section.tsx",
                                    lineNumber: 531,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/enquiry-section.tsx",
                                lineNumber: 530,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 504,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "enquiry-phone",
                        name: "phone",
                        type: "tel",
                        autoComplete: "tel-national",
                        placeholder: "e.g. 51 4455193",
                        value: phone,
                        onChange: (e)=>onPhoneChange(e.target.value),
                        className: `enquiry-input enquiry-phone-input ${phoneError ? "enquiry-input-invalid" : ""}`,
                        "aria-label": "Phone number without country code",
                        "aria-invalid": Boolean(phoneError),
                        "aria-describedby": phoneError ? "enquiry-phone-error" : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 553,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 503,
                columnNumber: 7
            }, this),
            countryError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: "enquiry-country-error",
                className: "enquiry-error",
                role: "alert",
                children: countryError
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 568,
                columnNumber: 9
            }, this),
            phoneError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: "enquiry-phone-error",
                className: "enquiry-error",
                role: "alert",
                children: phoneError
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 573,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 499,
        columnNumber: 5
    }, this);
}
function EnquiryMessageField({ value, error, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "enquiry-field enquiry-field-full enquiry-field-message",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: "enquiry-message",
                className: "enquiry-label",
                children: [
                    "Message ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "enquiry-required",
                        "aria-hidden": "true",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 593,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 592,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                id: "enquiry-message",
                name: "message",
                required: true,
                rows: 5,
                maxLength: 5000,
                placeholder: "Tell us about your requirement, proposal, or question.",
                value: value,
                onChange: (e)=>onChange(e.target.value),
                className: `enquiry-textarea ${error ? "enquiry-input-invalid" : ""}`,
                "aria-invalid": Boolean(error),
                "aria-describedby": error ? "enquiry-message-error" : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 595,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: "enquiry-message-error",
                className: "enquiry-error",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 609,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 591,
        columnNumber: 5
    }, this);
}
function EnquirySubmitButton({ isSubmitting }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "enquiry-field enquiry-field-full enquiry-field-submit",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "submit",
            disabled: isSubmitting,
            className: "enquiry-submit-btn",
            "aria-disabled": isSubmitting,
            children: isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "size-4 enquiry-spinner",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 628,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Sending enquiry..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 629,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 627,
                columnNumber: 11
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Send enquiry"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 633,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                        className: "size-4 enquiry-btn-icon",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/enquiry-section.tsx",
                        lineNumber: 634,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/enquiry-section.tsx",
                lineNumber: 632,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/enquiry-section.tsx",
            lineNumber: 620,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 619,
        columnNumber: 5
    }, this);
}
function EnquirySection() {
    const sectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isSubmittingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const theme = useEnquiryTheme(sectionRef);
    const countryOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>getCountryOptions(), []);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [submitError, setSubmitError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSuccess, setIsSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    // Field states
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [organisation, setOrganisation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [company, setCompany] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [enquiryType, setEnquiryType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [countryKey, setCountryKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [website, setWebsite] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(""); // honeypot
    const clearFieldError = (fieldName)=>{
        if (errors[fieldName]) {
            setErrors((prev)=>{
                const next = {
                    ...prev
                };
                delete next[fieldName];
                return next;
            });
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (isSubmittingRef.current) return;
        setSubmitError(null);
        const payload = {
            name,
            email,
            organisation,
            company: company || "",
            enquiryType: enquiryType || "",
            message,
            country: countryKey || "",
            phone,
            website
        };
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$enquiry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateEnquiry"])(payload);
        if (Object.keys(validation.errors).length > 0) {
            setErrors(validation.errors);
            focusFirstInvalid(validation.errors);
            return;
        }
        setErrors({});
        isSubmittingRef.current = true;
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/enquiries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(payload)
            });
            let resJson = null;
            try {
                resJson = await res.json();
            } catch  {
            // Fallback if response is not valid JSON
            }
            if (!res.ok || !resJson?.ok) {
                if (resJson?.errors && Object.keys(resJson.errors).length > 0) {
                    setErrors(resJson.errors);
                    focusFirstInvalid(resJson.errors);
                }
                setSubmitError(resJson?.message || "Unable to deliver your enquiry at this time. Please try again or email us directly at goodman@goodmangoc.com.");
            } else {
                setIsSuccess(true);
            }
        } catch  {
            setSubmitError("A network error occurred while sending your enquiry. Please check your connection and try again.");
        }
        isSubmittingRef.current = false;
        setIsSubmitting(false);
    };
    const handleReset = ()=>{
        setName("");
        setEmail("");
        setOrganisation("");
        setCompany(null);
        setEnquiryType(null);
        setCountryKey(null);
        setPhone("");
        setMessage("");
        setWebsite("");
        setErrors({});
        setSubmitError(null);
        setIsSuccess(false);
        isSubmittingRef.current = false;
        setIsSubmitting(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "contact",
        ref: sectionRef,
        className: "chapter section-shell enquiry-chapter",
        "aria-labelledby": "enquiry-heading",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "enquiry-layout",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnquiryHeader, {}, void 0, false, {
                    fileName: "[project]/src/components/enquiry-section.tsx",
                    lineNumber: 773,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "enquiry-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnquiryNoscript, {}, void 0, false, {
                            fileName: "[project]/src/components/enquiry-section.tsx",
                            lineNumber: 776,
                            columnNumber: 11
                        }, this),
                        isSuccess ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnquirySuccessView, {
                            name: name,
                            onReset: handleReset
                        }, void 0, false, {
                            fileName: "[project]/src/components/enquiry-section.tsx",
                            lineNumber: 779,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            noValidate: true,
                            action: "/api/enquiries",
                            method: "post",
                            onSubmit: handleSubmit,
                            className: "enquiry-form",
                            "aria-label": "Goodman Group enquiry form",
                            children: [
                                submitError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnquiryErrorAlert, {
                                    message: submitError
                                }, void 0, false, {
                                    fileName: "[project]/src/components/enquiry-section.tsx",
                                    lineNumber: 793,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "enquiry-honeypot",
                                    "aria-hidden": "true",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "enquiry-website",
                                            children: "Website"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 798,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "enquiry-website",
                                            type: "text",
                                            name: "website",
                                            tabIndex: -1,
                                            autoComplete: "off",
                                            value: website,
                                            onChange: (e)=>setWebsite(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 799,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/enquiry-section.tsx",
                                    lineNumber: 797,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "enquiry-grid",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnquiryNameField, {
                                            value: name,
                                            error: errors.name,
                                            onChange: (val)=>{
                                                setName(val);
                                                clearFieldError("name");
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 811,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnquiryEmailField, {
                                            value: email,
                                            error: errors.email,
                                            onChange: (val)=>{
                                                setEmail(val);
                                                clearFieldError("email");
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 820,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnquiryOrgField, {
                                            value: organisation,
                                            error: errors.organisation,
                                            onChange: (val)=>{
                                                setOrganisation(val);
                                                clearFieldError("organisation");
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 829,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnquiryCompanySelect, {
                                            theme: theme,
                                            company: company,
                                            error: errors.company,
                                            onSelect: (val)=>{
                                                setCompany(val);
                                                clearFieldError("company");
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 838,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnquiryTypeSelect, {
                                            theme: theme,
                                            enquiryType: enquiryType,
                                            error: errors.enquiryType,
                                            onSelect: (val)=>{
                                                setEnquiryType(val);
                                                clearFieldError("enquiryType");
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 848,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnquiryPhoneField, {
                                            theme: theme,
                                            countryKey: countryKey,
                                            phone: phone,
                                            countryError: errors.country,
                                            phoneError: errors.phone,
                                            countryOptions: countryOptions,
                                            onCountryChange: (val)=>{
                                                setCountryKey(val);
                                                clearFieldError("country");
                                            },
                                            onPhoneChange: (val)=>{
                                                setPhone(val);
                                                clearFieldError("phone");
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 858,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnquiryMessageField, {
                                            value: message,
                                            error: errors.message,
                                            onChange: (val)=>{
                                                setMessage(val);
                                                clearFieldError("message");
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 875,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnquirySubmitButton, {
                                            isSubmitting: isSubmitting
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/enquiry-section.tsx",
                                            lineNumber: 884,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/enquiry-section.tsx",
                                    lineNumber: 810,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/enquiry-section.tsx",
                            lineNumber: 784,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/enquiry-section.tsx",
                    lineNumber: 775,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/enquiry-section.tsx",
            lineNumber: 772,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/enquiry-section.tsx",
        lineNumber: 766,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/mouse-glow-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MouseGlowCard",
    ()=>MouseGlowCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function MouseGlowCard({ accent, as: Tag = "article", children, className }) {
    const boundsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    function handlePointerEnter(event) {
        if (event.pointerType === "touch") {
            return;
        }
        boundsRef.current = event.currentTarget.getBoundingClientRect();
    }
    function handlePointerMove(event) {
        if (event.pointerType === "touch") {
            return;
        }
        const card = event.currentTarget;
        let bounds = boundsRef.current;
        if (!bounds) {
            bounds = card.getBoundingClientRect();
            boundsRef.current = bounds;
        }
        card.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
    }
    function handlePointerLeave() {
        boundsRef.current = null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
        className: className,
        onPointerEnter: handlePointerEnter,
        onPointerLeave: handlePointerLeave,
        onPointerMove: handlePointerMove,
        style: {
            "--company-accent": accent
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/mouse-glow-card.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/scroll-experience.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollExperience",
    ()=>ScrollExperience
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function loadScrollLibraries() {
    return Promise.all([
        __turbopack_context__.A("[project]/node_modules/lenis/dist/lenis.mjs [app-ssr] (ecmascript, async loader)"),
        __turbopack_context__.A("[project]/node_modules/gsap/index.js [app-ssr] (ecmascript, async loader)"),
        __turbopack_context__.A("[project]/node_modules/gsap/ScrollTrigger.js [app-ssr] (ecmascript, async loader)")
    ]);
}
function ScrollExperience({ children } = {}) {
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lenisRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollTriggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let frame = 0;
        const restoreHashTarget = ()=>{
            window.cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(()=>{
                const currentHash = window.location.hash.slice(1);
                const target = currentHash ? document.getElementById(currentHash) : null;
                if (target) {
                    const lenis = lenisRef.current;
                    if (lenis) {
                        lenis.resize();
                        target.scrollIntoView({
                            block: "start"
                        });
                        lenis.scrollTo(window.scrollY, {
                            immediate: true,
                            force: true
                        });
                        scrollTriggerRef.current?.update();
                    } else {
                        target.scrollIntoView({
                            block: "start"
                        });
                    }
                }
            });
        };
        window.addEventListener("hashchange", restoreHashTarget);
        restoreHashTarget();
        return ()=>{
            window.cancelAnimationFrame(frame);
            window.removeEventListener("hashchange", restoreHashTarget);
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
        const root = undefined;
        const reducedMotion = undefined;
        let cleanupExperience;
        let generation;
        async function createExperience() {
            const currentGeneration = generation;
            const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await loadScrollLibraries();
            if (currentGeneration !== generation || reducedMotion.matches || !root) {
                return;
            }
            gsap.registerPlugin(ScrollTrigger);
            const lenis = new Lenis({
                duration: 1.05,
                smoothWheel: true,
                anchors: true
            });
            const updateScroll = ()=>ScrollTrigger.update();
            const updateLenis = (time)=>lenis.raf(time * 1000);
            lenis.on("scroll", updateScroll);
            gsap.ticker.add(updateLenis);
            gsap.ticker.lagSmoothing(0);
            const context = gsap.context(()=>{
                gsap.timeline({
                    defaults: {
                        ease: "power3.out"
                    }
                }).from("[data-hero-kicker]", {
                    opacity: 0,
                    y: 18,
                    duration: 0.6
                }).from("[data-hero-line]", {
                    yPercent: 112,
                    duration: 1.05,
                    stagger: 0.1
                }, "-=0.35").from("[data-hero-support]", {
                    opacity: 0,
                    y: 24,
                    duration: 0.75,
                    stagger: 0.08
                }, "-=0.5").from("[data-orbit-node]", {
                    opacity: 0,
                    scale: 0.65,
                    duration: 0.55,
                    stagger: 0.07
                }, "-=0.55");
                gsap.to("[data-scroll-progress]", {
                    scaleX: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: root,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.2
                    }
                });
                const desktopEffects = gsap.matchMedia();
                desktopEffects.add("(min-width: 1081px)", ()=>{
                    gsap.to("[data-orbit-ring='outer']", {
                        rotate: 28,
                        ease: "none",
                        scrollTrigger: {
                            trigger: "[data-hero]",
                            start: "top top",
                            end: "bottom top",
                            scrub: 1
                        }
                    });
                    gsap.to("[data-orbit-ring='inner']", {
                        rotate: -42,
                        ease: "none",
                        scrollTrigger: {
                            trigger: "[data-hero]",
                            start: "top top",
                            end: "bottom top",
                            scrub: 1
                        }
                    });
                });
                const previousCleanup = cleanupExperience;
                cleanupExperience = ()=>{
                    desktopEffects.revert();
                    previousCleanup();
                };
            }, root);
            let revealObserver = null;
            if (typeof window.IntersectionObserver === "function") {
                revealObserver = new IntersectionObserver((entries)=>{
                    entries.forEach((entry)=>{
                        if (entry.isIntersecting) {
                            const element = entry.target;
                            gsap.to(element, {
                                opacity: 1,
                                y: 0,
                                duration: 0.85,
                                ease: "power3.out",
                                overwrite: "auto"
                            });
                            revealObserver?.unobserve(element);
                        }
                    });
                }, {
                    rootMargin: "0px 0px -12% 0px"
                });
                root.querySelectorAll("[data-reveal]").forEach((element)=>{
                    gsap.set(element, {
                        opacity: 0,
                        y: 44
                    });
                    revealObserver?.observe(element);
                });
            }
            lenisRef.current = lenis;
            scrollTriggerRef.current = ScrollTrigger;
            ScrollTrigger.refresh();
            if (window.location.hash) {
                const target = document.getElementById(window.location.hash.slice(1));
                if (target) {
                    lenis.resize();
                    target.scrollIntoView({
                        block: "start"
                    });
                    lenis.scrollTo(window.scrollY, {
                        immediate: true,
                        force: true
                    });
                    ScrollTrigger.update();
                }
            }
            const cleanupHashAndLenis = ()=>{
                revealObserver?.disconnect();
                lenisRef.current = null;
                scrollTriggerRef.current = null;
                lenis.off("scroll", updateScroll);
                gsap.ticker.remove(updateLenis);
                ScrollTrigger.getAll().forEach((t)=>t.kill());
                lenis.destroy();
            };
            const previousCleanup = cleanupExperience;
            cleanupExperience = ()=>{
                previousCleanup();
                context.revert();
                cleanupHashAndLenis();
            };
        }
        let frameId;
        const stopExperience = undefined;
        const syncMotionPreference = undefined;
    }, []);
    return children ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/scroll-experience.tsx",
        lineNumber: 258,
        columnNumber: 21
    }, this) : null;
}
}),
"[project]/src/components/site-header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteHeader",
    ()=>SiteHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$image$2d$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Image__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/image-component.js [app-ssr] (ecmascript) <export Image as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$goodman$2d$group$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/goodman-group.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/theme-toggle.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
const navigation = [
    {
        label: "About the Group",
        href: "/#about"
    },
    {
        label: "Our Companies",
        href: "/companies"
    },
    {
        label: "Our Presence",
        href: "/#presence"
    },
    {
        label: "Blog",
        href: "/blog"
    }
];
function SiteHeader() {
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])() ?? "/";
    const headerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const menuButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const menuDialogRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const closeButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const focusRestoreRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const closeMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((restoreFocus = true)=>{
        focusRestoreRef.current = restoreFocus ? menuButtonRef.current : null;
        setIsOpen(false);
    }, []);
    const isCurrentDestination = (href)=>{
        if (href === "/companies") {
            return pathname.startsWith("/companies");
        }
        if (href === "/blog") {
            return pathname === "/blog" || pathname.startsWith("/blog/");
        }
        return pathname === "/" && href === "/#about";
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen) {
            return;
        }
        const previousOverflow = document.body.style.overflow;
        const backgroundElements = [
            document.querySelector(".skip-link"),
            headerRef.current,
            document.querySelector("main"),
            document.querySelector("footer")
        ].filter((element)=>element instanceof HTMLElement);
        const previousInert = new Map();
        const closeOnKeyboard = (event)=>{
            if (event.key === "Escape") {
                closeMenu(true);
                return;
            }
            if (event.key !== "Tab" || !menuDialogRef.current) {
                return;
            }
            const focusableElements = Array.from(menuDialogRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
            const firstElement = focusableElements.at(0);
            const lastElement = focusableElements.at(-1);
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement?.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement?.focus();
            }
        };
        const closeWhenMenuToggleIsHidden = ()=>{
            const menuButton = menuButtonRef.current;
            if (menuButton && window.getComputedStyle(menuButton).display === "none") {
                menuButton.blur();
                closeMenu(false);
            }
        };
        if (menuDialogRef.current) {
            menuDialogRef.current.dataset.theme = headerRef.current?.closest(".site-shell")?.dataset.theme === "light" ? "light" : "dark";
        }
        document.body.style.overflow = "hidden";
        backgroundElements.forEach((element)=>{
            previousInert.set(element, element.inert);
            element.inert = true;
        });
        window.addEventListener("keydown", closeOnKeyboard);
        window.addEventListener("resize", closeWhenMenuToggleIsHidden);
        window.requestAnimationFrame(()=>{
            closeButtonRef.current?.focus();
        });
        return ()=>{
            document.body.style.overflow = previousOverflow;
            backgroundElements.forEach((element)=>{
                element.inert = previousInert.get(element) ?? false;
            });
            window.removeEventListener("keydown", closeOnKeyboard);
            window.removeEventListener("resize", closeWhenMenuToggleIsHidden);
            const focusTarget = focusRestoreRef.current;
            focusRestoreRef.current = null;
            if (focusTarget?.isConnected) {
                focusTarget.focus();
                window.requestAnimationFrame(()=>{
                    if (focusTarget.isConnected) {
                        focusTarget.focus();
                    }
                });
                window.setTimeout(()=>{
                    if (focusTarget.isConnected) {
                        focusTarget.focus();
                    }
                }, 0);
            }
        };
    }, [
        closeMenu,
        isOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        ref: headerRef,
        className: "site-header glass-nav",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                className: "brand-link",
                href: "/",
                "aria-label": "Goodman Group home",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$image$2d$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Image__as__default$3e$__["default"], {
                    src: "/assets/logos/GG-white.png",
                    alt: "Goodman Group",
                    width: 280,
                    height: 119,
                    sizes: "(max-width: 1080px) 96px, 112px",
                    priority: true
                }, void 0, false, {
                    fileName: "[project]/src/components/site-header.tsx",
                    lineNumber: 136,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/site-header.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "desktop-nav",
                "aria-label": "Primary navigation",
                children: navigation.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: item.href,
                        "aria-current": isCurrentDestination(item.href) ? "page" : undefined,
                        children: item.label
                    }, item.label, false, {
                        fileName: "[project]/src/components/site-header.tsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/site-header.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "header-status",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$goodman$2d$group$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["goodmanGroup"].message
            }, void 0, false, {
                fileName: "[project]/src/components/site-header.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                fileName: "[project]/src/components/site-header.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ref: menuButtonRef,
                className: "menu-toggle",
                type: "button",
                "aria-label": isOpen ? "Navigation menu (open)" : "Open navigation",
                "aria-expanded": isOpen,
                "aria-controls": "mobile-navigation",
                onClick: ()=>{
                    if (isOpen) {
                        closeMenu(true);
                        return;
                    }
                    focusRestoreRef.current = menuButtonRef.current;
                    setIsOpen(true);
                },
                children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/src/components/site-header.tsx",
                    lineNumber: 178,
                    columnNumber: 19
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/src/components/site-header.tsx",
                    lineNumber: 178,
                    columnNumber: 46
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/site-header.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            typeof document !== "undefined" && isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dialog", {
                ref: menuDialogRef,
                className: "mobile-nav-backdrop",
                "aria-label": "Site navigation",
                open: true,
                onCancel: (event)=>{
                    event.preventDefault();
                    closeMenu(true);
                },
                onPointerDown: (event)=>{
                    if (event.target === event.currentTarget) {
                        closeMenu(true);
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    id: "mobile-navigation",
                    className: "mobile-nav glass-overlay",
                    "aria-label": "Mobile navigation",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mobile-nav-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Navigate"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/site-header.tsx",
                                    lineNumber: 204,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    ref: closeButtonRef,
                                    className: "mobile-nav-close",
                                    type: "button",
                                    "aria-label": "Close navigation",
                                    onClick: ()=>closeMenu(true),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        "aria-hidden": "true"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/site-header.tsx",
                                        lineNumber: 212,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/site-header.tsx",
                                    lineNumber: 205,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/site-header.tsx",
                            lineNumber: 203,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mobile-nav-links",
                            children: navigation.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        "aria-current": isCurrentDestination(item.href) ? "page" : undefined,
                                        onClick: ()=>closeMenu(false),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "0",
                                                    index + 1
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/site-header.tsx",
                                                lineNumber: 227,
                                                columnNumber: 25
                                            }, this),
                                            item.label
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/site-header.tsx",
                                        lineNumber: 218,
                                        columnNumber: 23
                                    }, this)
                                }, item.label, false, {
                                    fileName: "[project]/src/components/site-header.tsx",
                                    lineNumber: 217,
                                    columnNumber: 21
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/site-header.tsx",
                            lineNumber: 215,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mobile-contact-status",
                            children: "Inquiries, partnerships and careers"
                        }, void 0, false, {
                            fileName: "[project]/src/components/site-header.tsx",
                            lineNumber: 233,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/site-header.tsx",
                    lineNumber: 198,
                    columnNumber: 15
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/site-header.tsx",
                lineNumber: 183,
                columnNumber: 13
            }, this), document.body) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("noscript", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                        children: `.menu-toggle { display: none !important; }`
                    }, void 0, false, {
                        fileName: "[project]/src/components/site-header.tsx",
                        lineNumber: 243,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "noscript-nav",
                        "aria-label": "Navigation without JavaScript",
                        children: navigation.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                children: item.label
                            }, item.label, false, {
                                fileName: "[project]/src/components/site-header.tsx",
                                lineNumber: 246,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/site-header.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/site-header.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/site-header.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/theme-toggle.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.mjs [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.mjs [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$theme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/site-theme.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function setChromeTheme(theme) {
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta)=>{
        meta.content = theme === "light" ? "#ffffff" : "#06111f";
    });
}
function ThemeToggle() {
    const buttonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("dark");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const shell = buttonRef.current?.closest(".site-shell");
        if (!shell) return;
        const applyThemeToShell = (currentTheme)=>{
            setTheme(currentTheme);
            if (shell.isConnected) {
                shell.dataset.theme = currentTheme;
                setChromeTheme(currentTheme);
                const backdrop = document.querySelector(".mobile-nav-backdrop");
                if (backdrop) backdrop.dataset.theme = currentTheme;
            }
        };
        const preference = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$theme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readSiteTheme"])();
        applyThemeToShell(preference);
        const rootObserver = new MutationObserver(()=>{
            const current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$theme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readSiteTheme"])();
            applyThemeToShell(current);
        });
        rootObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [
                "data-theme"
            ]
        });
        const headObserver = new MutationObserver(()=>{
            if (shell.isConnected) {
                setChromeTheme(shell.dataset.theme === "light" ? "light" : "dark");
            }
        });
        headObserver.observe(document.head, {
            childList: true
        });
        return ()=>{
            rootObserver.disconnect();
            headObserver.disconnect();
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: buttonRef,
        className: "theme-toggle",
        type: "button",
        "aria-label": `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
        "aria-pressed": theme === "light",
        onClick: ()=>{
            const next = theme === "dark" ? "light" : "dark";
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$theme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSiteTheme"])(next);
            const shell = buttonRef.current?.closest(".site-shell");
            if (shell) shell.dataset.theme = next;
            setChromeTheme(next);
            const backdrop = document.querySelector(".mobile-nav-backdrop");
            if (backdrop) backdrop.dataset.theme = next;
            setTheme(next);
        },
        children: theme === "dark" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/src/components/theme-toggle.tsx",
            lineNumber: 75,
            columnNumber: 27
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/src/components/theme-toggle.tsx",
            lineNumber: 75,
            columnNumber: 56
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/theme-toggle.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/data/companies.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "companies",
    ()=>companies,
    "getCompanyBySlug",
    ()=>getCompanyBySlug
]);
const companies = [
    {
        slug: "goodman-laboratories",
        displayName: "Goodman Laboratories",
        legalName: "Goodman Laboratories (Pvt.) Ltd.",
        relationship: null,
        business: "Pharmaceutical manufacturing",
        summary: "A Pakistan-based pharmaceutical manufacturer and national distributor serving government hospitals, private hospitals, retailers, and national distributors.",
        logo: {
            src: "/assets/logos/GoodmanLabLogo.png",
            width: 575,
            height: 279
        },
        accent: "#b4232c",
        founded: "2008",
        locations: [
            "Head office: Flat No. 4, Block No. 26, Street No. 100, FGEHF Apartments, Sector G-11, Islamabad, Pakistan",
            "Factory: Plot No. 5, Street S-5, National Industrial Zone, Rawat, Islamabad, Pakistan"
        ],
        leadership: [
            {
                name: "Syed Talib Hussain Hashmi",
                role: "Chief Executive Officer",
                detail: "Founder of Goodman Laboratories."
            }
        ],
        capabilities: [
            "Pharmaceutical production",
            "Bulk production",
            "Pharmaceutical marketing",
            "Sales",
            "Urgent-order fulfilment",
            "Bulk-order fulfilment"
        ],
        contacts: [
            "director.goodman786@gmail.com",
            "www.goodmangoc.com",
            "+92 51 4455193–195",
            "+92 51 4499156"
        ]
    },
    {
        slug: "geron-pharma",
        displayName: "Geron Pharma",
        legalName: "Geron Pharma (Pvt.) Ltd.",
        relationship: null,
        business: "Pharmaceutical business",
        summary: "Geron Pharma (Pvt.) Ltd. is a pharmaceutical business led by Chief Executive Officer Syed Talib Hussain Hashmi, who has served as CEO since 2019.",
        logo: {
            src: "/assets/logos/geronlogo.png",
            width: 684,
            height: 357
        },
        accent: "#8b5cf6",
        founded: null,
        locations: [],
        leadership: [
            {
                name: "Syed Talib Hussain Hashmi",
                role: "Chief Executive Officer",
                detail: "Chief Executive Officer since 2019."
            }
        ],
        capabilities: [
            "Pharmaceutical business"
        ],
        contacts: []
    },
    {
        slug: "goodman-medical-equipment",
        displayName: "Goodman Medical Equipment Trading",
        legalName: "Goodman Medical Equipment Trading LLC",
        relationship: null,
        business: "Medical equipment trading",
        summary: "A Dubai-based healthcare supplier with a Pakistan supply presence, specializing in surgical products, medical equipment, and medical devices.",
        logo: {
            src: "/assets/logos/GG3.png",
            width: 2450,
            height: 1961
        },
        accent: "#174a87",
        founded: "July 2024",
        locations: [
            "Dubai, United Arab Emirates",
            "Islamabad, Pakistan"
        ],
        leadership: [
            {
                name: "Malik Munir Awan",
                role: "Founder and Director",
                detail: "Founder and board director effective July 2024."
            },
            {
                name: "Syed Talib Hussain Hashmi",
                role: "Founder and Director",
                detail: "Founder and board director effective July 2024."
            },
            {
                name: "Taj Muhammad",
                role: "Founder and Director",
                detail: "Founder and board director effective July 2024."
            },
            {
                name: "Syed Ahmed Ali",
                role: "Founder and Director",
                detail: "Founder and board director effective July 2024."
            }
        ],
        capabilities: [
            "Surgical products",
            "Medical equipment",
            "Medical devices"
        ],
        contacts: [
            "+92 336 777 0770",
            "afgoodmangoc@gmail.com",
            "goodmangoc.com/goodman-medical-equipment"
        ]
    },
    {
        slug: "wal-green-chemicals",
        displayName: "Wal Green Chemicals",
        legalName: "Wal Green Chemicals (Pvt.) Ltd.",
        relationship: null,
        business: "Indenting and trading of pharmaceutical raw materials and chemicals",
        summary: "A Pakistan-based bridge between international manufacturers and local industry, supplying globally sourced pharmaceutical raw materials, intermediates, and chemicals nationwide.",
        logo: {
            src: "/assets/logos/walgreenLogo.png",
            width: 528,
            height: 259
        },
        accent: "#236c4b",
        founded: null,
        locations: [
            "Pakistan"
        ],
        leadership: [
            {
                name: "Syed Talib Hussain Hashmi",
                role: "Chief Executive Officer",
                detail: "Chief Executive Officer since 2021."
            }
        ],
        capabilities: [
            "Indenting and trading",
            "Pharmaceutical raw materials and chemicals",
            "International import channels",
            "Nationwide customer and delivery coverage",
            "Dual-channel procurement"
        ],
        contacts: []
    },
    {
        slug: "goodman-billing",
        displayName: "Goodman Billing",
        legalName: "Goodman Billing (Pvt.) Ltd.",
        relationship: null,
        business: "Medical billing and revenue-cycle management",
        summary: "A medical billing and revenue-cycle management company serving healthcare providers, physicians, clinics, and multi-provider practices across the United States.",
        logo: null,
        accent: "#174a87",
        founded: null,
        locations: [
            "91 Ferry Street, Apt 3, Jersey City, New Jersey 07307-0730, United States"
        ],
        leadership: [
            {
                name: "Syed Talib Hussain Hashmi",
                role: "Chief Executive Officer",
                detail: "Chief Executive Officer."
            }
        ],
        capabilities: [
            "Front-desk support",
            "Claim submission and medical billing",
            "Denial and accounts-receivable management",
            "Credentialing and enrolments",
            "Patient billing",
            "Audit and underpayment support"
        ],
        contacts: [
            "goodman@goodmangoc.com"
        ]
    }
];
function getCompanyBySlug(slug) {
    return companies.find((company)=>company.slug === slug);
}
}),
"[project]/src/data/enquiry.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "companyOptions",
    ()=>companyOptions,
    "enquiryTypeOptions",
    ()=>enquiryTypeOptions,
    "validateEnquiry",
    ()=>validateEnquiry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$companies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/companies.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$libphonenumber$2d$js$2f$min$2f$exports$2f$isSupportedCountry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/libphonenumber-js/min/exports/isSupportedCountry.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$libphonenumber$2d$js$2f$min$2f$exports$2f$parsePhoneNumber$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__parsePhoneNumber__as__parsePhoneNumberFromString$3e$__ = __turbopack_context__.i("[project]/node_modules/libphonenumber-js/min/exports/parsePhoneNumber.js [app-ssr] (ecmascript) <export parsePhoneNumber as parsePhoneNumberFromString>");
;
;
const companyOptions = [
    {
        id: "group",
        label: "Goodman Group / Not sure"
    },
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$companies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["companies"].map((company)=>({
            id: company.slug,
            label: company.displayName
        }))
];
const enquiryTypeOptions = [
    {
        id: "business",
        label: "Business Enquiry"
    },
    {
        id: "partnership",
        label: "Partnership"
    },
    {
        id: "supplier",
        label: "Supplier / Vendor"
    },
    {
        id: "general",
        label: "General Enquiry"
    }
];
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
function validateEnquiry(input) {
    const errors = {};
    if (typeof input !== "object" || input === null) {
        return {
            errors: {
                form: "Invalid request payload."
            }
        };
    }
    const raw = input;
    for (const field of [
        "organisation",
        "country",
        "phone",
        "website"
    ]){
        if (raw[field] !== undefined && typeof raw[field] !== "string") {
            errors[field] = "Please enter a valid value.";
        }
    }
    // Honeypot check: website field must be empty or absent
    if (typeof raw.website === "string" && raw.website.trim().length > 0) {
        errors.website = "Spam submission detected.";
    }
    // Name validation: required, 1-120 chars
    let validName;
    if (typeof raw.name !== "string" || raw.name.trim().length === 0) {
        errors.name = "Please enter your name.";
    } else {
        const trimmed = raw.name.trim();
        if (trimmed.length > 120) {
            errors.name = "Name must not exceed 120 characters.";
        } else {
            validName = trimmed;
        }
    }
    // Email validation: required, 1-254 chars, newline safe, regex
    let validEmail;
    if (typeof raw.email !== "string" || raw.email.trim().length === 0) {
        errors.email = "Please enter your email address.";
    } else {
        const trimmed = raw.email.trim();
        if (trimmed.length > 254) {
            errors.email = "Email must not exceed 254 characters.";
        } else if (trimmed.includes("\r") || trimmed.includes("\n") || !EMAIL_REGEX.test(trimmed)) {
            errors.email = "Please enter a valid email address.";
        } else {
            validEmail = trimmed;
        }
    }
    // Organisation validation: optional, max 160 chars
    let validOrganisation;
    if (typeof raw.organisation === "string") {
        const trimmed = raw.organisation.trim();
        if (trimmed.length > 160) {
            errors.organisation = "Organisation must not exceed 160 characters.";
        } else if (trimmed.length > 0) {
            validOrganisation = trimmed;
        }
    }
    // Company validation: required, must be valid option
    let validCompany;
    let validCompanyLabel;
    if (typeof raw.company !== "string" || raw.company.trim().length === 0) {
        errors.company = "Please select a company.";
    } else {
        const companyId = raw.company.trim();
        const selected = companyOptions.find((opt)=>opt.id === companyId);
        if (!selected) {
            errors.company = "Please select a valid company option.";
        } else {
            validCompany = selected.id;
            validCompanyLabel = selected.label;
        }
    }
    // Enquiry type validation: required, must be valid option
    let validEnquiryType;
    let validEnquiryTypeLabel;
    if (typeof raw.enquiryType !== "string" || raw.enquiryType.trim().length === 0) {
        errors.enquiryType = "Please select an enquiry type.";
    } else {
        const enquiryTypeId = raw.enquiryType.trim();
        const selected = enquiryTypeOptions.find((opt)=>opt.id === enquiryTypeId);
        if (!selected) {
            errors.enquiryType = "Please select a valid enquiry type.";
        } else {
            validEnquiryType = selected.id;
            validEnquiryTypeLabel = selected.label;
        }
    }
    // Message validation: required, 1-5000 chars
    let validMessage;
    if (typeof raw.message !== "string" || raw.message.trim().length === 0) {
        errors.message = "Please enter your message.";
    } else {
        const trimmed = raw.message.trim();
        if (trimmed.length > 5000) {
            errors.message = "Message must not exceed 5000 characters.";
        } else {
            validMessage = trimmed;
        }
    }
    // Phone and country validation
    let validCountry;
    let validPhone;
    const rawPhone = typeof raw.phone === "string" ? raw.phone.trim() : "";
    const rawCountry = typeof raw.country === "string" ? raw.country.trim().toUpperCase() : "";
    if (rawPhone.length > 0) {
        if (rawPhone.length > 40) {
            errors.phone = "Phone number must not exceed 40 characters.";
        }
        if (!rawCountry) {
            errors.country = "Please select a country code for your phone number.";
        } else if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$libphonenumber$2d$js$2f$min$2f$exports$2f$isSupportedCountry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSupportedCountry"])(rawCountry)) {
            errors.country = "Please select a valid country code.";
        } else {
            validCountry = rawCountry;
            const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$libphonenumber$2d$js$2f$min$2f$exports$2f$parsePhoneNumber$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__parsePhoneNumber__as__parsePhoneNumberFromString$3e$__["parsePhoneNumberFromString"])(rawPhone, rawCountry);
            if (!parsed || !parsed.isPossible()) {
                errors.phone = "Please enter a valid phone number.";
            } else {
                validPhone = parsed.number; // E.164 normalized
            }
        }
    } else if (rawCountry.length > 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$libphonenumber$2d$js$2f$min$2f$exports$2f$isSupportedCountry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSupportedCountry"])(rawCountry)) {
        // Country was provided without phone; allowed, preserve country
        validCountry = rawCountry;
    }
    if (Object.keys(errors).length > 0) {
        return {
            errors
        };
    }
    if (!validName || !validEmail || !validCompany || !validCompanyLabel || !validEnquiryType || !validEnquiryTypeLabel || !validMessage) {
        return {
            errors: {
                form: "Submission failed required field checks."
            }
        };
    }
    const data = {
        name: validName,
        email: validEmail,
        ...validOrganisation ? {
            organisation: validOrganisation
        } : {},
        company: validCompany,
        companyLabel: validCompanyLabel,
        enquiryType: validEnquiryType,
        enquiryTypeLabel: validEnquiryTypeLabel,
        message: validMessage,
        ...validCountry ? {
            country: validCountry
        } : {},
        ...validPhone ? {
            phone: validPhone
        } : {}
    };
    return {
        data,
        errors: {}
    };
}
}),
"[project]/src/data/goodman-group.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SITE_ORIGIN",
    ()=>SITE_ORIGIN,
    "goodmanGroup",
    ()=>goodmanGroup
]);
const SITE_ORIGIN = "https://goodmangoc.com";
const goodmanGroup = {
    websiteTitle: "Goodman Group — Seeking for Best",
    message: "Empowering Health, Wellness, Progress",
    description: "A diversified conglomerate operating across healthcare and non-healthcare sectors.",
    operatingPrinciples: [
        "Innovation",
        "Excellence",
        "Growth",
        "Social responsibility"
    ],
    mission: "To improve lives through innovative products, services, and solutions while fostering growth, excellence, and social responsibility.",
    sectors: [
        "Medical billing",
        "Pharmaceuticals",
        "Medical equipment",
        "Chemicals",
        "Laboratory operations",
        "Automotive",
        "Real estate"
    ],
    businessInterests: [
        "Pharmaceutical products",
        "Medical devices",
        "Nutraceutical products",
        "Surgical equipment",
        "Medical equipment",
        "Real estate",
        "Restaurants",
        "Automobiles"
    ],
    customerTypes: [
        "Government hospitals",
        "Private hospitals",
        "Retailers",
        "National distributors"
    ],
    contacts: {
        website: "https://goodmangoc.com/",
        email: "goodman@goodmangoc.com",
        usContactAddress: "91 Ferry Street, Apt 3, Jersey City, New Jersey 07307-0730, United States"
    },
    leadership: {
        name: "Syed Talib Hussain Hashmi",
        role: "Chief Executive Officer",
        familyBusinessEntry: "Took responsibility for the family business at age 16",
        moreThan30Years: "More than 30 years of administrative, marketing, and pharmaceutical-sector experience",
        manufacturingExperience: "34 years of pharmaceutical-manufacturing experience"
    },
    executiveContacts: {
        leaderName: "Syed Talib Hussain Hashmi",
        phones: [
            "+92 336 777 0770",
            "+92 311 154 8859"
        ],
        email: "director.goodman786@gmail.com"
    }
};
}),
"[project]/src/lib/site-theme.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
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
}),
]})(),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__06vamajojzqcg._.js.map