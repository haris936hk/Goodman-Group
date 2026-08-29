"use client";

import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";

type MouseGlowCardProps = {
  accent: string;
  children: ReactNode;
  className: string;
};

type GlowCardStyle = CSSProperties & {
  "--company-accent": string;
};

export function MouseGlowCard({
  accent,
  children,
  className,
}: MouseGlowCardProps) {
  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();

    card.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLElement>) {
    event.currentTarget.style.removeProperty("--glow-x");
    event.currentTarget.style.removeProperty("--glow-y");
  }

  return (
    <article
      className={className}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{ "--company-accent": accent } as GlowCardStyle}
    >
      {children}
    </article>
  );
}
