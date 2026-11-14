"use client";

import { useEffect } from "react";

const HEADER_CLEARANCE = 120;
const BOTTOM_CLEARANCE = 40;
const STACK_PEEK = 32;
const MAX_PINNED_ROOT_FONT_SIZE = 20;

export function TechnologiesCardMotion(): null {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".technologies-workbench");
    if (!root || typeof window.matchMedia !== "function" || typeof ResizeObserver === "undefined") return;

    let disposed = false;
    let disposeMotion: (() => void) | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference) and (forced-colors: none)", () => {
        const intro = root.querySelector<HTMLElement>(".technologies-workbench-intro")!;
        const cards = Array.from(root.querySelectorAll<HTMLElement>(".technologies-stack-card"));
        const surfaces = Array.from(root.querySelectorAll<HTMLElement>(".technologies-stack-card-surface"));
        const markers = Array.from(root.querySelectorAll<HTMLElement>(".technologies-stack-rail li"));
        let context: gsap.Context | undefined;
        let frame = 0;
        let signature = "";
        let stopped = false;

        const restoreFlow = () => {
          context?.revert();
          context = undefined;
          delete root.dataset.pinned;
          root.style.removeProperty("--technology-stage-height");
          cards.forEach((card) => { delete card.dataset.active; });
          markers.forEach((marker) => {
            delete marker.dataset.active;
            marker.removeAttribute("aria-current");
          });
        };

        const updateLayout = () => {
          if (stopped) return;
          // Observe content, not the pin spacer: pinning must not trigger a resize loop.
          const cardHeight = Math.max(...surfaces.map((surface) => surface.offsetHeight));
          const introHeight = intro.offsetHeight;
          const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
          const nextSignature = `${root.clientWidth}:${window.innerHeight}:${cardHeight}:${introHeight}:${rootFontSize}`;
          if (nextSignature === signature) return;
          signature = nextSignature;
          restoreFlow();

          const stageHeight = cardHeight + STACK_PEEK;
          if (rootFontSize > MAX_PINNED_ROOT_FONT_SIZE || Math.max(stageHeight, introHeight) + HEADER_CLEARANCE + BOTTOM_CLEARANCE > window.innerHeight) {
            ScrollTrigger.refresh();
            return;
          }
          const pinTop = Math.round(HEADER_CLEARANCE + (window.innerHeight - HEADER_CLEARANCE - BOTTOM_CLEARANCE - Math.max(stageHeight, introHeight)) / 2);

          root.style.setProperty("--technology-stage-height", `${stageHeight}px`);
          root.dataset.pinned = "true";
          context = gsap.context(() => {
            let active = -1;
            const syncProgress = (index: number) => {
              if (active === index) return;
              active = index;
              cards.forEach((card, cardIndex) => {
                if (cardIndex === index) card.dataset.active = "true";
                else delete card.dataset.active;
              });
              markers.forEach((marker, markerIndex) => {
                if (markerIndex === index) {
                  marker.dataset.active = "true";
                  marker.setAttribute("aria-current", "step");
                } else {
                  delete marker.dataset.active;
                  marker.removeAttribute("aria-current");
                }
              });
            };

            gsap.set(root, { "--technology-progress": 0 });
            gsap.set(cards, {
              y: (index) => -16 * index,
              scale: (index) => 1 - 0.04 * index,
              opacity: 1,
              zIndex: (index) => cards.length - index,
              transformOrigin: "50% 0%",
            });
            syncProgress(0);
            const timeline: gsap.core.Timeline = gsap.timeline({
              scrollTrigger: {
                trigger: root,
                start: `top top+=${pinTop}`,
                end: `+=${Math.round(stageHeight * (cards.length - 1))}`,
                pin: true,
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
              onUpdate: () => {
                let index = 0;
                for (let next = 1; next < cards.length; next++) {
                  if (timeline.time() >= 1.25 + (next - 1) * 1.7) index = next;
                }
                syncProgress(index);
              },
            });
            timeline.to(root, { "--technology-progress": 1, duration: cards.length * 1.7 - 0.6, ease: "none" }, 0);
            for (let index = 0; index < cards.length - 1; index++) {
              const at = 0.9 + index * 1.7;
              timeline.to(cards[index], { y: -56, scale: 0.94, opacity: 0, duration: 0.55, ease: "power2.inOut" }, at);
              timeline.to(cards[index + 1], { y: 0, scale: 1, duration: 0.8, ease: "power2.inOut" }, at + 0.12);
              for (let behind = index + 2; behind < cards.length; behind++) {
                timeline.to(cards[behind], { y: -16 * (behind - index - 1), scale: 1 - 0.04 * (behind - index - 1), duration: 0.8, ease: "power2.inOut" }, at + 0.12);
              }
            }
          }, root);
          ScrollTrigger.refresh();
        };

        const scheduleLayout = () => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(updateLayout);
        };
        const observer = new ResizeObserver(scheduleLayout);
        observer.observe(intro);
        surfaces.forEach((surface) => observer.observe(surface));
        window.addEventListener("resize", scheduleLayout);
        updateLayout();

        return () => {
          stopped = true;
          observer.disconnect();
          window.removeEventListener("resize", scheduleLayout);
          cancelAnimationFrame(frame);
          restoreFlow();
          ScrollTrigger.refresh();
        };
      });
      disposeMotion = () => media.revert();
    }).catch((error: unknown) => {
      console.error("Technologies card motion could not load", error);
    });

    return () => {
      disposed = true;
      disposeMotion?.();
    };
  }, []);

  return null;
}
