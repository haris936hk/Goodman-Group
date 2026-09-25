import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GoodmanMedicalEquipmentPage, { metadata } from "./page";

describe("GoodmanMedicalEquipmentPage", () => {
  it("exports metadata from the verified company summary", () => {
    expect(metadata.title).toBe("Goodman Medical Equipment Trading");
    expect(metadata.description).toContain(
      "Dubai-based healthcare supplier with a Pakistan supply presence",
    );
    expect(metadata.description).not.toContain(
      "brings together three separately documented records",
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

  it("renders official legal identity, founders, board, and source-attributed designations", () => {
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

    expect(
      screen.getAllByText("Goodman Medical Equipment Trading LLC").length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText("United Arab Emirates & Pakistan"),
    ).toBeInTheDocument();

    // Four founders
    for (const founder of [
      "Malik Munir Awan",
      "Syed Talib Hussain Hashmi",
      "Taj Muhammad",
      "Syed Ahmed Ali",
    ]) {
      expect(screen.getAllByText(founder).length).toBeGreaterThanOrEqual(1);
    }

    // Board member naming boundary
    expect(screen.getByText("Ahmed Ali")).toBeInTheDocument();
    expect(
      screen.getByText("Founders section names Syed Ahmed Ali"),
    ).toBeInTheDocument();

    // Alternate source labels and leadership clarification
    expect(
      screen.getByText(/Website headline: Goodman Medical Equipment LLC/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Alternate PDF label: Goodman Medical & Surgical Equipment \(Pvt\.\) Ltd\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Personal profile title: Goodman Medical Equipment Trading \(Pvt\.\) Ltd\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Profile Syed Talib Hussain Hashmi\.pdf separately describes him as Chief Executive Officer/i),
    ).toBeInTheDocument();
  });

  it("renders messaging, equipment categories, strengths, promises, and procedural workflows", () => {
    render(<GoodmanMedicalEquipmentPage />);

    expect(
      screen.getAllByText("Delivering Excellence in Healthcare Solutions").length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText("Quality Health Solutions"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Partnering for a Healthier Tomorrow"),
    ).toBeInTheDocument();
    expect(screen.getByText("Better Health, Better Life")).toBeInTheDocument();
    expect(
      screen.getByText("Trust, Quality, Commitment"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Surgical instruments" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Medical equipment and devices" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Brochure-stated five years of industry experience."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Contracted relationships with manufacturers and suppliers."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Customer satisfaction as the highest priority."),
    ).toBeInTheDocument();

    // Offsite sterilization workflow and procedural distinction
    expect(
      screen.getAllByText(/STERIS Offsite Reprocessing Center \(ORC\)/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/indicates procedures rather than owned Goodman sterilization facilities/i),
    ).toBeInTheDocument();

    // Supply-chain process and governance functions
    expect(
      screen.getByText(/Production orders are generated for manufacturers and received for processing/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Legal Department")).toBeInTheDocument();
    expect(screen.getByText("Internal Audit")).toBeInTheDocument();
  });

  it("renders qualified operating markets versus brochure targets, and direct contact", () => {
    render(<GoodmanMedicalEquipmentPage />);

    // Customers
    for (const customer of [
      "Hospitals",
      "Clinics",
      "Healthcare professionals",
    ]) {
      expect(screen.getByText(customer, { exact: true })).toBeInTheDocument();
    }

    // Current operating markets
    expect(
      screen.getByText("United Arab Emirates, with the company based in Dubai"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Pakistan, with nationwide supply from large cities to remote areas"),
    ).toBeInTheDocument();

    // Target markets
    for (const market of [
      "Africa",
      "Europe",
      "Japan",
      "United States of America",
    ]) {
      expect(screen.getByText(market, { exact: true })).toBeInTheDocument();
    }

    // Direct contact
    expect(screen.getAllByText("Islamabad, Pakistan").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("link", { name: "+92 336 777 0770" }),
    ).toHaveAttribute("href", "tel:+923367770770");
    expect(
      screen.getByRole("link", { name: "afgoodmangoc@gmail.com" }),
    ).toHaveAttribute("href", "mailto:afgoodmangoc@gmail.com");
    expect(
      screen.getByRole("link", {
        name: /goodmangoc\.com\/goodman-medical-equipment/i,
      }),
    ).toHaveAttribute(
      "href",
      "https://goodmangoc.com/goodman-medical-equipment",
    );

    for (const unsupportedPhrase of [
      "Gulf cooperation territory",
      "diagnostic machinery",
      "specialized clinical devices",
      "hospital technology systems",
    ]) {
      expect(
        screen.queryByText(new RegExp(unsupportedPhrase, "i")),
      ).not.toBeInTheDocument();
    }
  });
});
