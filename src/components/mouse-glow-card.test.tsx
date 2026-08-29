import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MouseGlowCard } from "./mouse-glow-card";

describe("MouseGlowCard", () => {
  it("tracks a fine pointer relative to the card", () => {
    render(
      <MouseGlowCard accent="#50d4f2" className="company-card">
        <span>View company</span>
      </MouseGlowCard>,
    );

    const card = screen.getByRole("article");
    vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
      bottom: 230,
      height: 200,
      left: 25,
      right: 325,
      top: 30,
      width: 300,
      x: 25,
      y: 30,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(card, {
      clientX: 145,
      clientY: 110,
      pointerType: "mouse",
    });

    expect(card.style.getPropertyValue("--glow-x")).toBe("120px");
    expect(card.style.getPropertyValue("--glow-y")).toBe("80px");

    fireEvent.pointerLeave(card);

    expect(card.style.getPropertyValue("--glow-x")).toBe("");
    expect(card.style.getPropertyValue("--glow-y")).toBe("");
  });

  it("ignores touch movement", () => {
    render(
      <MouseGlowCard accent="#50d4f2" className="company-card">
        Card content
      </MouseGlowCard>,
    );

    const card = screen.getByRole("article");
    const boundsSpy = vi.spyOn(card, "getBoundingClientRect");

    fireEvent.pointerMove(card, {
      clientX: 100,
      clientY: 100,
      pointerType: "touch",
    });

    expect(boundsSpy).not.toHaveBeenCalled();
    expect(card.style.getPropertyValue("--glow-x")).toBe("");
    expect(card.style.getPropertyValue("--glow-y")).toBe("");
  });
});
