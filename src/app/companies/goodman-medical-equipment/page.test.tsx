import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockMatchMedia } from "../../../../tests/test-utils";
import GoodmanMedicalEquipmentPage from "./page";

beforeEach(() => {
  localStorage.clear();
  mockMatchMedia(false);
});
describe("GoodmanMedicalEquipmentPage", () => {
  it("reveals the offsite instrument workflow independently of governance disclosures", () => {
    render(<GoodmanMedicalEquipmentPage />);

    const summary = screen.getByText("Offsite instrument-reprocessing workflow");
    const workflow = summary.closest("details");
    const offsiteStep = screen.getByText(/Instruments are transported to a STERIS Offsite Reprocessing Center/);
    expect(workflow).not.toHaveAttribute("open");
    expect(offsiteStep).not.toBeVisible();

    fireEvent.click(summary);
    expect(workflow).toHaveAttribute("open");
    expect(offsiteStep).toBeVisible();
    expect(screen.getByText("Governance and control functions").closest("details")).not.toHaveAttribute("open");

    fireEvent.click(summary);
    expect(offsiteStep).not.toBeVisible();
  });

  it("provides direct supplier contact and group routing links", () => {
    render(<GoodmanMedicalEquipmentPage />);

    expect(screen.getByRole("link", { name: "+92 336 777 0770" })).toHaveAttribute("href", "tel:+923367770770");
    expect(screen.getByRole("link", { name: "afgoodmangoc@gmail.com" })).toHaveAttribute("href", "mailto:afgoodmangoc@gmail.com");
    expect(screen.getByRole("link", { name: "Email our team" })).toHaveAttribute("href", "mailto:afgoodmangoc@gmail.com");
    expect(screen.getByRole("link", { name: /Group routing for procurement/ })).toHaveAttribute("href", "/#contact");
  });

  it("renders fallbacks when logo is missing and handles products beyond the icon list", async () => {
    vi.resetModules();
    vi.doMock("@/data/companies", () => ({
      getCompanyBySlug: (slug: string) => ({
        slug,
        displayName: "Goodman Medical Equipment Trading",
        legalName: "Goodman Medical Equipment Trading L.L.C",
        relationship: null,
        business: "Medical equipment",
        summary: "Summary.",
        logo: null,
        accent: "#101c26",
        founded: "2015",
        locations: [],
        leadership: [],
        capabilities: [],
        contacts: [],
      }),
    }));
    vi.doMock("@/data/goodman-medical-equipment", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/data/goodman-medical-equipment")>();
      return {
        ...actual,
        goodmanMedicalEquipmentProfile: {
          ...actual.goodmanMedicalEquipmentProfile,
          products: [
            ...actual.goodmanMedicalEquipmentProfile.products,
            { name: "Extra Equipment", description: "Beyond icon palette" },
          ],
        },
      };
    });
    // Exception: dynamic import is required to evaluate the page module under vi.doMock isolation.
    const { default: MockMedicalPage } = await import("./page");
    render(<MockMedicalPage />);
    expect(screen.queryByAltText("Goodman Medical Equipment Trading logo")).not.toBeInTheDocument();
    expect(screen.getAllByText("Extra Equipment").length).toBeGreaterThanOrEqual(1);
    vi.doUnmock("@/data/companies");
    vi.doUnmock("@/data/goodman-medical-equipment");
    vi.resetModules();
  });
});
