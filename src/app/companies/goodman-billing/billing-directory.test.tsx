import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { BillingDirectory, type BillingDirectoryItem } from "./billing-directory";

const sampleEntries: readonly BillingDirectoryItem[] = [
  {
    name: "Medical Coding",
    icon: "/assets/billing/coding.svg",
    description: "Accurate ICD-10 and CPT coding.",
    items: ["Chart audits", "Fee schedule review"],
  },
  {
    name: "Credentialing",
    icon: "/assets/billing/cred.svg",
    description: "Provider enrollment with major payers.",
  },
  {
    name: "Payment Posting",
    icon: "/assets/billing/payment.svg",
  },
];

describe("BillingDirectory", () => {
  it("renders entries, status text, and search controls", () => {
    render(<BillingDirectory kind="services" entries={sampleEntries} />);

    expect(screen.getByRole("searchbox", { name: "Search services" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("3 of 3 services");

    expect(screen.getByRole("heading", { level: 3, name: "Medical Coding" })).toBeInTheDocument();
    expect(screen.getByText("Accurate ICD-10 and CPT coding.")).toBeInTheDocument();
    expect(screen.getByText("Chart audits")).toBeInTheDocument();
    expect(screen.getByText("Fee schedule review")).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 3, name: "Credentialing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Payment Posting" })).toBeInTheDocument();

    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });

  it("filters entries by term in name, description, or sub-items", async () => {
    const user = userEvent.setup();
    render(<BillingDirectory kind="services" entries={sampleEntries} />);

    const search = screen.getByRole("searchbox", { name: "Search services" });

    // 1. Search by sub-item
    await user.type(search, "Chart audits");
    expect(screen.getByRole("status")).toHaveTextContent("1 of 3 services");
    expect(screen.getByRole("heading", { level: 3, name: "Medical Coding" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Credentialing" })).not.toBeInTheDocument();

    // 2. Clear via "Clear search" button
    const clearBtn = screen.getByRole("button", { name: "Clear search" });
    await user.click(clearBtn);
    expect(search).toHaveValue("");
    expect(screen.getByRole("status")).toHaveTextContent("3 of 3 services");

    // 3. Search by description term
    await user.type(search, "enrollment");
    expect(screen.getByRole("heading", { level: 3, name: "Credentialing" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Medical Coding" })).not.toBeInTheDocument();
  });

  it("displays empty state when no items match and restores through action button", async () => {
    const user = userEvent.setup();
    render(<BillingDirectory kind="specialties" entries={sampleEntries} />);

    const search = screen.getByRole("searchbox", { name: "Search specialties" });
    await user.type(search, "NonExistentSpecialty");

    expect(screen.getByRole("status")).toHaveTextContent("0 of 3 specialties");
    expect(screen.getByRole("heading", { level: 3, name: "No matching specialties" })).toBeInTheDocument();
    expect(screen.getByText("Try another specialty, service, or keyword.")).toBeInTheDocument();

    const showAllBtn = screen.getByRole("button", { name: "Show all specialties" });
    await user.click(showAllBtn);

    expect(search).toHaveValue("");
    expect(screen.getByRole("status")).toHaveTextContent("3 of 3 specialties");
    expect(screen.getByRole("heading", { level: 3, name: "Medical Coding" })).toBeInTheDocument();
  });
});
