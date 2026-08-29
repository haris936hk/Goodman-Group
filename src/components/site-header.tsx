"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const navigation = [
  { label: "About the Group", href: "/#about" },
  { label: "Our Companies", href: "/companies" },
  { label: "Our Presence", href: "/#presence" },
  { label: "Responsibility", href: "/#responsibility" },
  { label: "News", href: "/#news" },
  { label: "Careers", href: "/#connect" },
] as const;

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname() ?? "/";
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuDialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const focusRestoreRef = useRef<HTMLElement | null>(null);

  const closeMenu = useCallback((restoreFocus = true) => {
    focusRestoreRef.current = restoreFocus ? menuButtonRef.current : null;
    setIsOpen(false);
  }, []);

  const isCurrentDestination = (href: string) => {
    if (href === "/companies") {
      return pathname.startsWith("/companies");
    }

    return pathname === "/" && href === "/#about";
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const backgroundElements = [
      document.querySelector(".skip-link"),
      headerRef.current,
      document.querySelector("main"),
      document.querySelector("footer"),
    ].filter((element): element is HTMLElement => element instanceof HTMLElement);
    const previousInert = new Map<HTMLElement, boolean>();
    const closeOnKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu(true);
        return;
      }

      if (event.key !== "Tab" || !menuDialogRef.current) {
        return;
      }

      const focusableElements = Array.from(
        menuDialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
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
    const closeWhenMenuToggleIsHidden = () => {
      const menuButton = menuButtonRef.current;

      if (menuButton && window.getComputedStyle(menuButton).display === "none") {
        closeMenu(false);
      }
    };

    document.body.style.overflow = "hidden";
    backgroundElements.forEach((element) => {
      previousInert.set(element, element.inert);
      element.inert = true;
    });
    window.addEventListener("keydown", closeOnKeyboard);
    window.addEventListener("resize", closeWhenMenuToggleIsHidden);
    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      backgroundElements.forEach((element) => {
        element.inert = previousInert.get(element) ?? false;
      });
      window.removeEventListener("keydown", closeOnKeyboard);
      window.removeEventListener("resize", closeWhenMenuToggleIsHidden);
      const focusTarget = focusRestoreRef.current;
      focusRestoreRef.current = null;
      if (focusTarget) {
        window.requestAnimationFrame(() => {
          if (focusTarget.isConnected) {
            focusTarget.focus();
          }
        });
      }
    };
  }, [closeMenu, isOpen]);

  return (
    <header ref={headerRef} className="site-header glass-nav">
      <Link className="brand-link" href="/" aria-label="Goodman Group home">
        <Image
          src="/assets/logos/GG-white.png"
          alt="Goodman Group"
          width={5555}
          height={2368}
          sizes="(max-width: 1080px) 96px, 112px"
          priority
        />
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isCurrentDestination(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <span className="header-status">Contact routes pending</span>

      <button
        ref={menuButtonRef}
        className="menu-toggle"
        type="button"
        aria-label={isOpen ? "Navigation menu (open)" : "Open navigation"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => {
          if (isOpen) {
            closeMenu(true);
            return;
          }

          focusRestoreRef.current = menuButtonRef.current;
          setIsOpen(true);
        }}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {isOpen ? (
                <motion.div
                  ref={menuDialogRef}
                  className="mobile-nav-backdrop"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Site navigation"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.2,
                    ease: "easeOut",
                  }}
                  onPointerDown={(event) => {
                    if (event.target === event.currentTarget) {
                      closeMenu(true);
                    }
                  }}
                >
                  <nav
                    id="mobile-navigation"
                    className="mobile-nav glass-overlay"
                    aria-label="Mobile navigation"
                  >
                    <div className="mobile-nav-header">
                      <span>Navigate</span>
                      <button
                        ref={closeButtonRef}
                        className="mobile-nav-close"
                        type="button"
                        aria-label="Close navigation"
                        onClick={() => closeMenu(true)}
                      >
                        <X aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mobile-nav-links">
                      {navigation.map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={
                            shouldReduceMotion
                              ? false
                              : { opacity: 0, x: -10 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: shouldReduceMotion ? 0 : index * 0.035,
                            duration: shouldReduceMotion ? 0 : undefined,
                          }}
                        >
                          <Link
                            href={item.href}
                            aria-current={
                              isCurrentDestination(item.href)
                                ? "page"
                                : undefined
                            }
                            onClick={() => closeMenu(false)}
                          >
                            <span>0{index + 1}</span>
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    <p className="mobile-contact-status">
                      Contact routes pending approval
                    </p>
                  </nav>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}

      <noscript>
        <style>{`.menu-toggle { display: none !important; }`}</style>
        <nav className="noscript-nav" aria-label="Navigation without JavaScript">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </noscript>
    </header>
  );
}
