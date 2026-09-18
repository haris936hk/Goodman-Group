import { describe, expect, it, vi } from "vitest";
import { notFound } from "next/navigation";

import UnknownCompanyPage from "./page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

describe("UnknownCompanyPage catch-all", () => {
  it("calls notFound for unmapped company routes", () => {
    UnknownCompanyPage();
    expect(notFound).toHaveBeenCalled();
  });
});
