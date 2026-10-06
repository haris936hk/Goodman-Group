"use client";

import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";

type MouseGlowCardProps = {
  accent: string;
  as?: "article" | "li";
  children: ReactNode;
  className: string;
};

type GlowCardStyle = CSSProperties & {
  "--company-accent": string;
};

export function MouseGlowCard({
  accent,
  as: Tag = "article",
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
    <Tag
      className={className}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{ "--company-accent": accent } as GlowCardStyle}
    >
      {children}
    </Tag>
  );
}
