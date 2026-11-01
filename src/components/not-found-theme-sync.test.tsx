import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { NotFoundThemeSync } from "./not-found-theme-sync";

describe("NotFoundThemeSync", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.themeExplicit;
  });

  it("synchronizes stored light theme to document and shell on mount", () => {
    localStorage.setItem("goodman-group-theme", "light");
    const shell = document.createElement("div");
    shell.className = "site-shell";
    document.body.appendChild(shell);

    render(<NotFoundThemeSync />);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.dataset.themeExplicit).toBe("true");
    expect(shell.dataset.theme).toBe("light");

    shell.remove();
  });
});
