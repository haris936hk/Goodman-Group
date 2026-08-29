"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollExperienceProps = {
  children: ReactNode;
};

export function ScrollExperience({ children }: ScrollExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const restoreHashTarget = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const currentHash = window.location.hash.slice(1);
        const target = currentHash
          ? document.getElementById(currentHash)
          : null;

        target?.scrollIntoView({ block: "start" });
      });
    };

    window.addEventListener("hashchange", restoreHashTarget);
    restoreHashTarget();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", restoreHashTarget);
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current || typeof window.matchMedia !== "function") {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let cleanupExperience = () => {};
    let generation = 0;

    async function createExperience() {
      const currentGeneration = generation;
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

      if (
        currentGeneration !== generation ||
        reducedMotion.matches ||
        !rootRef.current
      ) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        anchors: true,
      });

      const updateScroll = () => ScrollTrigger.update();
      const updateLenis = (time: number) => lenis.raf(time * 1000);

      lenis.on("scroll", updateScroll);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);

      const context = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from("[data-hero-kicker]", { opacity: 0, y: 18, duration: 0.6 })
          .from(
            "[data-hero-line]",
            { yPercent: 112, duration: 1.05, stagger: 0.1 },
            "-=0.35",
          )
          .from(
            "[data-hero-support]",
            { opacity: 0, y: 24, duration: 0.75, stagger: 0.08 },
            "-=0.5",
          )
          .from(
            "[data-orbit-node]",
            { opacity: 0, scale: 0.65, duration: 0.55, stagger: 0.07 },
            "-=0.55",
          );

        gsap.to("[data-scroll-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.2,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 44,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          });
        });

        const desktopEffects = gsap.matchMedia();

        desktopEffects.add("(min-width: 1081px)", () => {
          gsap.to("[data-orbit-ring='outer']", {
            rotate: 28,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.to("[data-orbit-ring='inner']", {
            rotate: -42,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.from("[data-map-route]", {
            strokeDashoffset: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-presence-map]",
              start: "top 80%",
              end: "bottom 65%",
              scrub: 0.8,
            },
          });
        });

        const previousCleanup = cleanupExperience;
        cleanupExperience = () => {
          desktopEffects.revert();
          previousCleanup();
        };
      }, rootRef);

      ScrollTrigger.refresh();

      let hashFrame = 0;
      const syncLenisToHash = () => {
        window.cancelAnimationFrame(hashFrame);
        hashFrame = window.requestAnimationFrame(() => {
          const currentHash = window.location.hash.slice(1);
          const target = currentHash
            ? document.getElementById(currentHash)
            : null;

          if (target) {
            lenis.resize();
            target.scrollIntoView({ block: "start" });
            lenis.scrollTo(window.scrollY, {
              immediate: true,
              force: true,
            });
            ScrollTrigger.update();
          }
        });
      };

      window.addEventListener("hashchange", syncLenisToHash);
      syncLenisToHash();

      const cleanupHashAndLenis = () => {
        window.cancelAnimationFrame(hashFrame);
        window.removeEventListener("hashchange", syncLenisToHash);
        lenis.off("scroll", updateScroll);
        gsap.ticker.remove(updateLenis);
        lenis.destroy();
      };

      const previousCleanup = cleanupExperience;
      cleanupExperience = () => {
        previousCleanup();
        context.revert();
        cleanupHashAndLenis();
      };
    }

    const stopExperience = () => {
      generation += 1;
      cleanupExperience();
      cleanupExperience = () => {};
    };

    const syncMotionPreference = () => {
      stopExperience();

      if (!reducedMotion.matches) {
        void createExperience();
      }
    };

    reducedMotion.addEventListener("change", syncMotionPreference);
    syncMotionPreference();

    return () => {
      reducedMotion.removeEventListener("change", syncMotionPreference);
      stopExperience();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
