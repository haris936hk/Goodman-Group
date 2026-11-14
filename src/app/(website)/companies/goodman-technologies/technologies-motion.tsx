"use client";

import { useEffect } from "react";

export function TechnologiesMotion(): null {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".technologies-page");
    if (!page || typeof window.matchMedia !== "function") return;

    let disposed = false;
    let disposeMotion: (() => void) | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      const completed = new WeakSet<Element>();
      let entered = false;

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const context = gsap.context(() => {
          const reveal = (elements: Element[], trigger: Element, stagger = 0) => {
            if (completed.has(trigger)) return;
            ScrollTrigger.create({
              trigger,
              start: "top 90%",
              once: true,
              onEnter: () => {
                completed.add(trigger);
                gsap.fromTo(elements, { y: 30, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.85, stagger, ease: "power3.out", clearProps: "transform,opacity" });
              },
            });
          };

          page.querySelectorAll("[data-technologies-reveal]").forEach((target) => {
            const children = target.matches(".technologies-heading, .technologies-contact-inner") ? [target] : Array.from(target.children);
            reveal(children, target, 0.09);
          });

          const handover = page.querySelector(".technologies-handover-art");
          if (handover && !completed.has(handover)) {
            ScrollTrigger.create({
              trigger: handover,
              start: "top 85%",
              once: true,
              onEnter: () => {
                completed.add(handover);
                gsap.fromTo(handover.querySelectorAll("[data-handover-layer]"), { y: 14, opacity: 0.5 }, {
                  y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out", clearProps: "transform,opacity",
                });
              },
            });
          }

          if (!entered) {
            entered = true;
            gsap.fromTo(".technologies-showcase", { y: 36, opacity: 0.4, rotationY: -8 }, { y: 0, opacity: 1, rotationY: 0, duration: 1.2, ease: "power3.out", clearProps: "transform,opacity" });
            gsap.fromTo(".technologies-hero-copy > :not(h1)", { y: 14, opacity: 0.5 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, clearProps: "transform,opacity" });
          }

          gsap.to(".technologies-scene-motion", {
            y: 65, rotation: 6, ease: "none",
            scrollTrigger: { trigger: ".technologies-hero", start: "top top", end: "bottom top", scrub: 0.7 },
          });
        }, page);

        return () => context.revert();
      });

      media.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
        const showcase = page.querySelector<HTMLElement>(".technologies-showcase");
        const cards = Array.from(page.querySelectorAll<HTMLElement>(".technologies-service-featured"));
        const moveScene = (event: PointerEvent) => {
          if (!showcase || event.pointerType === "touch") return;
          const rect = showcase.getBoundingClientRect();
          showcase.style.setProperty("--scene-rx", `${-(event.clientY - rect.top - rect.height / 2) / rect.height * 12}deg`);
          showcase.style.setProperty("--scene-ry", `${(event.clientX - rect.left - rect.width / 2) / rect.width * 16}deg`);
        };
        const resetScene = () => {
          showcase?.style.removeProperty("--scene-rx");
          showcase?.style.removeProperty("--scene-ry");
        };
        const moveCard = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const card = event.currentTarget as HTMLElement;
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
          card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
        };
        showcase?.addEventListener("pointermove", moveScene);
        showcase?.addEventListener("pointerleave", resetScene);
        cards.forEach((card) => card.addEventListener("pointermove", moveCard));
        return () => {
          showcase?.removeEventListener("pointermove", moveScene);
          showcase?.removeEventListener("pointerleave", resetScene);
          resetScene();
          cards.forEach((card) => {
            card.removeEventListener("pointermove", moveCard);
            card.style.removeProperty("--pointer-x");
            card.style.removeProperty("--pointer-y");
          });
        };
      });
      disposeMotion = () => media.revert();
    }).catch((error: unknown) => {
      // Animation enhancement must never prevent the static page from rendering.
      console.error("Technologies motion could not load", error);
    });

    return () => {
      disposed = true;
      disposeMotion?.();
    };
  }, []);

  return null;
}
