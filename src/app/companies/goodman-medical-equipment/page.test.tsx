import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GoodmanMedicalEquipmentPage, { metadata } from "./page";

describe("GoodmanMedicalEquipmentPage", () => {
  it("exports metadata from the verified multi-record summary", () => {
    expect(metadata.title).toBe("Goodman Medical Equipment Trading");
    expect(metadata.description).toContain(
      "Goodman Medical & Surgical Equipment (Pvt.) Ltd.",
    );
    expect(metadata.description).toContain(
      "Goodman Medical Equipment Trading LLC",
    );
  });

  it("provides the route landmark and direct chapter navigation", () => {
    render(<GoodmanMedicalEquipmentPage />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Dual-Region Trading Presence",
      }),
    ).toHaveAttribute("id", "med-presence-heading");

    for (const [name, href] of [
      ["Presence", "#presence"],
      ["Solutions", "#solutions"],
      ["Markets", "#markets"],
      ["Contact", "#contact"],
    ] as const) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
      expect(document.querySelector(href)).toBeInTheDocument();
    }
  });

  it("renders each legal record with its qualified leadership data", () => {
    render(<GoodmanMedicalEquipmentPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Goodman Medical Equipment Trading",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("A Goodman Group company").length,
    ).toBeGreaterThanOrEqual(1);

    for (const legalName of [
      "Goodman Medical & Surgical Equipment (Pvt.) Ltd.",
      "Goodman Medical Equipment Trading LLC",
      "Goodman Medical Equipment Trading (Pvt.) Ltd.",
    ]) {
      expect(screen.getAllByText(legalName).length).toBeGreaterThanOrEqual(1);
    }

    expect(screen.getAllByText("Pakistan").length).toBeGreaterThanOrEqual(2);
    expect(
      screen.getAllByText("United Arab Emirates").length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText("Directorship effective July 2024."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Chief Executive Officer since 2024."),
    ).toBeInTheDocument();
  });

  it("keeps supplier products, service evidence, markets, and customers scoped", () => {
    render(<GoodmanMedicalEquipmentPage />);

    expect(screen.getByText("Delivering Excellence in Healthcare Solutions")).toBeInTheDocument();
    expect(screen.getByText("Partnering for a Healthier Tomorrow")).toBeInTheDocument();
    expect(screen.getByText("Better Health, Better Life")).toBeInTheDocument();
    expect(screen.getByText("Trust, Quality, Commitment")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Surgical instruments" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Medical devices" })).toBeInTheDocument();
    expect(screen.getByText("Five years of industry experience")).toBeInTheDocument();
    expect(screen.getByText("After-sales support")).toBeInTheDocument();
    expect(screen.getByText("Product compliance with international quality standards and regulatory requirements")).toBeInTheDocument();
    expect(screen.getByText("Customer satisfaction as the highest priority")).toBeInTheDocument();

    for (const customer of ["Hospitals", "Clinics", "Healthcare professionals"]) {
      expect(screen.getByText(customer, { exact: true })).toBeInTheDocument();
    }
    expect(screen.getByText("Nationwide coverage across Pakistan")).toBeInTheDocument();
    for (const market of ["Africa", "Europe", "Japan", "United States of America"]) {
      expect(screen.getByText(market, { exact: true })).toBeInTheDocument();
    }
  });

  it("renders source limitations, conflict notes, and scoped contact links", () => {
    render(<GoodmanMedicalEquipmentPage />);

    expect(
      screen.getAllByText(
        "The supplied documents do not provide a separate product catalogue, address, customer list, or operational description for this company.",
      ),
    ).toHaveLength(2);
    expect(screen.getByText(/Source note/i)).toBeInTheDocument();
    expect(screen.getByText(/concurrent roles, a role change, or a documentation error/i)).toBeInTheDocument();

    expect(screen.getByText("Islamabad, Pakistan")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+92 336 777 0770" })).toHaveAttribute(
      "href",
      "tel:+923367770770",
    );
    expect(screen.getByRole("link", { name: "afgoodmangoc@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:afgoodmangoc@gmail.com",
    );
    expect(screen.getByRole("link", { name: "www.goodmangoc.com" })).toHaveAttribute(
      "href",
      "https://www.goodmangoc.com",
    );

    for (const unsupportedPhrase of [
      "Gulf cooperation territory",
      "diagnostic machinery",
      "specialized clinical devices",
      "hospital technology systems",
    ]) {
      expect(screen.queryByText(new RegExp(unsupportedPhrase, "i"))).not.toBeInTheDocument();
    }
  });
});
