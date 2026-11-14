"use client";

import { useEffect } from "react";

export function TechnologiesApproachMotion(): null {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".technologies-approach");
    if (!root) return;
    const nav = root.querySelector<HTMLElement>(".technologies-approach-nav")!;
    const tabs = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a"));
    const panels = Array.from(root.querySelectorAll<HTMLElement>(".technologies-approach-panel"));
    const media = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    let activeIndex = -1;
    let animation: Animation | undefined;

    const activate = (index: number, animate: boolean) => {
      if (index === activeIndex) return;
      animation?.cancel();
      activeIndex = index;
      tabs.forEach((tab, tabIndex) => {
        tab.setAttribute("aria-selected", String(tabIndex === index));
        tab.tabIndex = tabIndex === index ? 0 : -1;
      });
      panels.forEach((panel, panelIndex) => { panel.hidden = panelIndex !== index; });
      if (animate && media && !media.matches && typeof panels[index].animate === "function") {
        const entrance = panels[index].animate(
          [{ transform: "translateY(8px)" }, { transform: "translateY(0)" }],
          { duration: 220, easing: "cubic-bezier(.22,1,.36,1)" },
        );
        animation = entrance;
        const finish = () => { if (animation === entrance) animation = undefined; };
        entrance.onfinish = finish;
        entrance.oncancel = finish;
      }
    };
    const selectTab = (event: MouseEvent) => {
      event.preventDefault();
      activate(tabs.indexOf(event.currentTarget as HTMLAnchorElement), true);
    };
    const navigateTabs = (event: KeyboardEvent) => {
      const index = tabs.indexOf(event.currentTarget as HTMLAnchorElement);
      let next: number;
      switch (event.key) {
        case "ArrowRight": next = (index + 1) % tabs.length; break;
        case "ArrowLeft": next = (index - 1 + tabs.length) % tabs.length; break;
        case "Home": next = 0; break;
        case "End": next = tabs.length - 1; break;
        case " ": next = index; break;
        default: return;
      }
      event.preventDefault();
      activate(next, true);
      tabs[next].focus();
    };
    const syncMotion = () => { if (media?.matches) animation?.cancel(); };

    nav.setAttribute("role", "tablist");
    nav.setAttribute("aria-orientation", "horizontal");
    tabs.forEach((tab, index) => {
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panels[index].id);
      tab.addEventListener("click", selectTab);
      tab.addEventListener("keydown", navigateTabs);
      panels[index].setAttribute("role", "tabpanel");
      panels[index].setAttribute("aria-labelledby", tab.id);
      panels[index].tabIndex = 0;
    });
    const linkedPanel = panels.findIndex((panel) => `#${panel.id}` === window.location.hash);
    activate(Math.max(0, linkedPanel), false);
    let anchorFrame = 0;
    if (linkedPanel >= 0) anchorFrame = requestAnimationFrame(() => panels[linkedPanel].scrollIntoView({ block: "start" }));
    media?.addEventListener("change", syncMotion);

    return () => {
      animation?.cancel();
      cancelAnimationFrame(anchorFrame);
      media?.removeEventListener("change", syncMotion);
      nav.removeAttribute("role");
      nav.removeAttribute("aria-orientation");
      tabs.forEach((tab) => {
        tab.removeEventListener("click", selectTab);
        tab.removeEventListener("keydown", navigateTabs);
        tab.removeAttribute("role");
        tab.removeAttribute("aria-controls");
        tab.removeAttribute("aria-selected");
        tab.removeAttribute("tabindex");
      });
      panels.forEach((panel, index) => {
        panel.hidden = false;
        panel.removeAttribute("role");
        panel.removeAttribute("tabindex");
        panel.setAttribute("aria-labelledby", `technologies-approach-title-${index}`);
      });
    };
  }, []);

  return null;
}
