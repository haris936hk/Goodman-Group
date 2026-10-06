import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GoodmanMedicalEquipmentPage from "./page";

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
});
