import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import GoodmanBillingPage from "./page";

describe("Goodman Billing directories", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
  });

  it("finds services by benefit text and restores the directory after an empty search", () => {
    render(<GoodmanBillingPage />);
    const services = document.getElementById("services")!;
    const search = within(services).getByRole("searchbox", { name: "Search services" });
    fireEvent.change(search, { target: { value: "  CPAPs  " } });
    expect(within(services).getByRole("heading", { name: "Durable Medical Equipment Credentialing" })).toBeVisible();
    expect(within(services).queryByRole("heading", { name: "Medical Coding" })).not.toBeInTheDocument();
    fireEvent.change(search, { target: { value: "no-such-service" } });
    expect(within(services).getByRole("heading", { name: "No matching services" })).toBeVisible();
    fireEvent.click(within(services).getByRole("button", { name: "Show all services" }));
    expect(search).toHaveValue("");
    expect(within(services).getByRole("heading", { name: "Medical Coding" })).toBeVisible();
  });

  it("filters specialty descriptions without affecting service results", () => {
    render(<GoodmanBillingPage />);
    const specialties = document.getElementById("specialties")!;
    fireEvent.change(screen.getByRole("searchbox", { name: "Search specialties" }), { target: { value: "KIDNEY" } });
    expect(within(specialties).getByRole("heading", { name: "Nephrology" })).toBeVisible();
    expect(within(specialties).queryByRole("heading", { name: "Cardiology" })).not.toBeInTheDocument();
    expect(within(document.getElementById("services")!).getByRole("heading", { name: "Medical Billing" })).toBeVisible();
    fireEvent.click(within(specialties).getByRole("button", { name: "Clear search" }));
    expect(within(specialties).getByRole("heading", { name: "Cardiology" })).toBeVisible();
  });
});
