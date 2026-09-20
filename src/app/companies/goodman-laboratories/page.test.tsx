import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GoodmanLaboratoriesPage, { metadata } from "./page";

describe("GoodmanLaboratoriesPage", () => {
  it("exports canonical metadata without promotional or obsolete tenure wording", () => {
    expect(metadata.title).toBe("Goodman Laboratories");
    expect(metadata.description).toContain("Goodman Laboratories (Pvt.) Ltd.");
    expect(metadata.description).not.toContain("Tagline:");
    expect(metadata.description).not.toContain("Seeking for the Best");
    expect(metadata.description).not.toContain("2012");
  });

  it("renders legal identity, mission, and the verified leadership tenure", () => {
    render(<GoodmanLaboratoriesPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Goodman Laboratories" })).toBeInTheDocument();
    expect(screen.getAllByText("Goodman Laboratories (Pvt.) Ltd.").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("A Goodman Group company").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("To provide affordable pharmaceutical products across the globe.")).toBeInTheDocument();
    expect(screen.getByText("Syed Talib Hussain Hashmi")).toBeInTheDocument();
    expect(screen.getByText("Chief Executive Officer")).toBeInTheDocument();
    expect(screen.getByText("CEO since 2016")).toBeInTheDocument();

    expect(screen.queryByText("2012")).not.toBeInTheDocument();
    expect(screen.queryByText("Documented Source Conflict")).not.toBeInTheDocument();
    expect(screen.queryByText(/Tagline:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Product slogan:/)).not.toBeInTheDocument();
  });

  it("renders national coverage and qualified international customer markets", () => {
    render(<GoodmanLaboratoriesPage />);

    expect(screen.getByRole("heading", { level: 3, name: "National coverage" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "International customer markets" })).toBeInTheDocument();
    expect(screen.getByText("Islamabad")).toBeInTheDocument();
    expect(screen.getByText("Punjab")).toBeInTheDocument();
    expect(screen.getByText("Afghanistan")).toBeInTheDocument();
    expect(screen.getByText("Yemen")).toBeInTheDocument();
    expect(screen.getByText(/do not represent foreign manufacturing facilities/i)).toBeInTheDocument();
  });

  it("keeps dense product content collapsed until its named summary is activated", () => {
    render(<GoodmanLaboratoriesPage />);

    expect(screen.getByRole("heading", { level: 2, name: "Registered and marketed products" })).toBeInTheDocument();
    const firstCategory = screen.getByText("Neurology, psychiatry, and central nervous system").closest("details");
    expect(firstCategory).not.toHaveAttribute("open");
    expect(screen.getByText("Gavatin")).not.toBeVisible();

    fireEvent.click(screen.getByText("Neurology, psychiatry, and central nervous system"));
    expect(firstCategory).toHaveAttribute("open");
    expect(screen.getByText("Gavatin")).toBeVisible();
    expect(screen.getByText(/levetiracetam; 250 mg and 500 mg tablets/i)).toBeVisible();

    expect(screen.getByText("Antiviral, antiparasitic, antiemetic, and other products")).toBeInTheDocument();
    expect(screen.getByText("Entec")).toBeInTheDocument();
    expect(screen.getByText(/entecavir 0.5 mg tablets; 30-tablet pack; registration 66556/i)).toBeInTheDocument();
  });

  it("retains substantive manufacturer literature in closed disclosures", () => {
    render(<GoodmanLaboratoriesPage />);

    expect(screen.getByRole("heading", { level: 2, name: "Product literature and stated clinical positioning" })).toBeInTheDocument();
    expect(screen.getByText(/manufacturer-supplied promotional statements and do not replace approved prescribing information/i)).toBeInTheDocument();

    const desgoodSummary = screen.getByText("Desgood", { selector: "summary span" });
    const desgood = desgoodSummary.closest("details");
    expect(desgood).not.toHaveAttribute("open");
    fireEvent.click(desgoodSummary);
    expect(screen.getByText(/Promoted for seasonal allergic rhinitis and associated asthma symptoms/i)).toBeVisible();
  });

  it("renders shared certification facts once and all three unique certificates", () => {
    render(<GoodmanLaboratoriesPage />);

    expect(screen.getByRole("heading", { level: 2, name: "Management-system certifications" })).toBeInTheDocument();
    expect(screen.getByText("ISO 9001:2015")).toBeInTheDocument();
    expect(screen.getByText("ISO 14001:2015")).toBeInTheDocument();
    expect(screen.getByText("ISO 45001:2018")).toBeInTheDocument();
    expect(screen.getAllByText("24PL10324")).toHaveLength(1);
    expect(screen.getAllByText("Manufacturing of Pharmaceutical Products")).toHaveLength(1);
  });

  it("renders working direct email, website, and telephone links", () => {
    render(<GoodmanLaboratoriesPage />);

    expect(screen.getByRole("link", { name: "director.goodman786@gmail.com" })).toHaveAttribute("href", "mailto:director.goodman786@gmail.com");
    expect(screen.getByRole("link", { name: /www\.goodmangoc\.com/i })).toHaveAttribute("href", "https://www.goodmangoc.com");
    expect(screen.getByRole("link", { name: "+92 51 4455193–195" })).toHaveAttribute("href", "tel:+92514455193");
    expect(screen.getByRole("link", { name: "+92 51 4499156" })).toHaveAttribute("href", "tel:+92514499156");
  });
});
