"use client";

import {
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
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
  const boundsRef = useRef<DOMRect | null>(null);

  function handlePointerEnter(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") {
      return;
    }
    boundsRef.current = event.currentTarget.getBoundingClientRect();
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
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

  function handlePointerLeave(event: ReactPointerEvent<HTMLElement>) {
    boundsRef.current = null;
    event.currentTarget.style.removeProperty("--glow-x");
    event.currentTarget.style.removeProperty("--glow-y");
  }
  return (
    <Tag
      className={className}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{ "--company-accent": accent } as GlowCardStyle}
    >
      {children}
    </Tag>
  );
}
