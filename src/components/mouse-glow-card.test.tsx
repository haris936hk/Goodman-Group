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
    // Second move reuses cached bounds without extra getBoundingClientRect calls
    fireEvent.pointerMove(card, {
      clientX: 155,
      clientY: 120,
      pointerType: "mouse",
    });

    expect(card.style.getPropertyValue("--glow-x")).toBe("130px");
    expect(card.style.getPropertyValue("--glow-y")).toBe("90px");
    expect(card.getBoundingClientRect).toHaveBeenCalledTimes(1);
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

  it("caches bounds on pointer enter and clears on pointer leave", () => {
    render(
      <MouseGlowCard accent="#50d4f2" className="company-card">
        Card content
      </MouseGlowCard>,
    );

    const card = screen.getByRole("article");
    const boundsSpy = vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
      bottom: 200,
      height: 100,
      left: 10,
      right: 210,
      top: 100,
      width: 200,
      x: 10,
      y: 100,
      toJSON: () => ({}),
    });

    fireEvent.pointerEnter(card, { pointerType: "touch" });
    expect(boundsSpy).not.toHaveBeenCalled();

    fireEvent.pointerEnter(card, { pointerType: "mouse" });
    expect(boundsSpy).toHaveBeenCalledTimes(1);

    fireEvent.pointerMove(card, { clientX: 50, clientY: 150, pointerType: "mouse" });
    expect(boundsSpy).toHaveBeenCalledTimes(1);
    expect(card.style.getPropertyValue("--glow-x")).toBe("40px");
    expect(card.style.getPropertyValue("--glow-y")).toBe("50px");

    fireEvent.pointerLeave(card);
    expect(card.style.getPropertyValue("--glow-x")).toBe("");
    expect(card.style.getPropertyValue("--glow-y")).toBe("");
  });
});
