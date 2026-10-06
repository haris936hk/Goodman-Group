import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GoodmanLaboratoriesPage from "./page";

describe("GoodmanLaboratoriesPage", () => {

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

    const otherCategory = screen.getByText("Antiviral, antiparasitic, antiemetic, and other products").closest("details");
    expect(otherCategory).not.toHaveAttribute("open");
    expect(screen.getByText("Entec")).not.toBeVisible();
    expect(screen.getByText(/entecavir 0.5 mg tablets; 30-tablet pack; registration 66556/i)).not.toBeVisible();
  });


  it("renders working direct email and telephone links", () => {
    render(<GoodmanLaboratoriesPage />);

    expect(screen.getByRole("link", { name: "director.goodman786@gmail.com" })).toHaveAttribute("href", "mailto:director.goodman786@gmail.com");
    expect(screen.getByRole("link", { name: "+92 51 4455193–195" })).toHaveAttribute("href", "tel:+92514455193");
    expect(screen.getByRole("link", { name: "+92 51 4499156" })).toHaveAttribute("href", "tel:+92514499156");
  });
});
