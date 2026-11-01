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
"[project]/src/components/not-found-theme-sync.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotFoundThemeSync",
    ()=>NotFoundThemeSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$theme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/site-theme.ts [app-ssr] (ecmascript)");
"use client";
;
;
const useIsomorphicLayoutEffect = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"];
function NotFoundThemeSync() {
    useIsomorphicLayoutEffect(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2d$theme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["syncDocumentTheme"])();
    }, []);
    return null;
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0mbnzt4dwshh7._.js.map