"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function TechnologiesDirectorOrbit({ children }: { readonly children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orbit = root.current;
    if (!orbit || typeof window.matchMedia !== "function") return;

    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let x = 0;
    let y = 0;

    const resetPointer = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      orbit.style.removeProperty("--director-x");
      orbit.style.removeProperty("--director-y");
    };
    const updatePreference = () => {
      orbit.dataset.motionReady = String(motion.matches);
      resetPointer();
    };
    const movePointer = (event: PointerEvent) => {
      if (!motion.matches || !pointer.matches || event.pointerType === "touch") return;
      const bounds = orbit.getBoundingClientRect();
      x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        orbit.style.setProperty("--director-x", String(x));
        orbit.style.setProperty("--director-y", String(y));
        frame = 0;
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        orbit.dataset.orbitEntered = "true";
        observer.disconnect();
      }
    }, { threshold: 0 });

    updatePreference();
    observer.observe(orbit);
    motion.addEventListener("change", updatePreference);
    pointer.addEventListener("change", resetPointer);
    orbit.addEventListener("pointermove", movePointer);
    orbit.addEventListener("pointerleave", resetPointer);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", updatePreference);
      pointer.removeEventListener("change", resetPointer);
      orbit.removeEventListener("pointermove", movePointer);
      orbit.removeEventListener("pointerleave", resetPointer);
      resetPointer();
      delete orbit.dataset.motionReady;
      delete orbit.dataset.orbitEntered;
    };
  }, []);

  return <div className="technologies-director-orbit" ref={root}>{children}</div>;
}
