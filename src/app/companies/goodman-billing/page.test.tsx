import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getCompanyBySlug } from "@/data/companies";
import { goodmanBillingProfile } from "@/data/goodman-billing";
import GoodmanBillingPage, { metadata } from "./page";

const company = getCompanyBySlug("goodman-billing")!;

function section(name: string) {
  return screen.getByRole("region", { name });
}

describe("GoodmanBillingPage", () => {
  it("derives metadata from canonical company facts", () => {
    expect(metadata.title).toBe(`${company.displayName} | Goodman Group`);
    expect(metadata.description).toBe(company.summary);
  });

  it("shows identity, US scope, audience, and provider contact without opening details", () => {
    render(<GoodmanBillingPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(company.displayName);
    expect(screen.getByText(company.summary!)).toHaveTextContent("United States");
    expect(within(section("Who we support")).getAllByRole("listitem")).toHaveLength(goodmanBillingProfile.customersServed.length);
    expect(screen.getByRole("link", { name: "Email Goodman Billing" })).toHaveAttribute("href", `mailto:${company.contacts[0]}`);
    expect(screen.getByText("A Goodman Group company")).toBeVisible();
  });

  it("keeps all six workflow stages visible and ordered", () => {
    render(<GoodmanBillingPage />);
    const items = within(section("Revenue-Cycle Workflow")).getAllByRole("listitem");
    expect(items).toHaveLength(6);
    goodmanBillingProfile.workflowSteps.forEach((step, index) => {
      expect(items[index]).toHaveTextContent(`Step ${step.step}`);
      expect(items[index]).toHaveTextContent(step.name);
      expect(items[index]).toHaveTextContent(step.description);
    });
  });

  it("keeps service categories visible and opens their full details independently", () => {
    render(<GoodmanBillingPage />);
    const services = section("Services");
    const categories = goodmanBillingProfile.serviceGroups;
    const summaries = within(services).getAllByText("View services");
    expect(summaries).toHaveLength(categories.length);
    categories.forEach((group) => {
      expect(within(services).getByRole("heading", { name: group.groupName })).toBeVisible();
      expect(within(services).getByText(group.description)).toBeVisible();
    });
    expect(summaries[0].closest("details")).not.toHaveAttribute("open");
    fireEvent.click(summaries[0]);
    expect(summaries[0].closest("details")).toHaveAttribute("open");
    expect(summaries[1].closest("details")).not.toHaveAttribute("open");
    expect(within(summaries[0].closest("details")!).getByRole("heading", { name: "Medical coding" })).toBeVisible();
  });

  it("reveals source qualifiers alongside distinct evidence claims", () => {
    render(<GoodmanBillingPage />);
    const evidence = section("Evidence & source notes");
    const targets = within(evidence).getByText(goodmanBillingProfile.performanceIndicators.evidenceBlock.title);
    expect(targets.closest("details")).not.toHaveAttribute("open");
    fireEvent.click(targets);
    expect(within(targets.closest("details")!).getAllByText("≥ 98%")).toHaveLength(2);
    expect(within(targets.closest("details")!).getByText(goodmanBillingProfile.performanceIndicators.evidenceBlock.disclaimer)).toBeVisible();
    const brochure = within(evidence).getByText(goodmanBillingProfile.brochureHistory.evidenceBlock.title);
    fireEvent.click(brochure);
    expect(within(brochure.closest("details")!).getByText("20+", { exact: false })).toBeVisible();
    const provenance = within(evidence).getByText(goodmanBillingProfile.specialtyProvenance.evidenceBlock.title);
    fireEvent.click(provenance);
    const record = within(provenance.closest("details")!);
    expect(record.getByText(goodmanBillingProfile.specialtyProvenance.websiteClaim)).toBeVisible();
    expect(record.getByText(goodmanBillingProfile.specialtyProvenance.explanation)).toBeVisible();
  });

  it("provides specialty and platform descriptions only after opening their lists", () => {
    render(<GoodmanBillingPage />);
    expect(screen.getByRole("heading", { name: "Medical Billing Specialties" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Software platforms" })).toBeVisible();
    const specialties = screen.getByText(`View ${goodmanBillingProfile.specialties.length} listed specialties`);
    const platforms = screen.getByText(`View ${goodmanBillingProfile.platforms.length} platforms`);
    expect(specialties.closest("details")).not.toHaveAttribute("open");
    expect(platforms.closest("details")).not.toHaveAttribute("open");
    fireEvent.click(specialties);
    expect(within(specialties.closest("details")!).getByText("Orthopedics")).toBeVisible();
    expect(within(specialties.closest("details")!).getByText(goodmanBillingProfile.specialties[0].focus)).toBeVisible();
    fireEvent.click(platforms);
    expect(within(platforms.closest("details")!).getByText("Epic")).toBeVisible();
    expect(within(platforms.closest("details")!).getByText(goodmanBillingProfile.platformDisclaimer)).toBeVisible();
  });

  it("shows email, leadership, website-listed address caveat, and self-reported compliance", () => {
    render(<GoodmanBillingPage />);
    const contact = section("Contact Goodman Billing");
    expect(within(contact).getByRole("link", { name: company.contacts[0] })).toHaveAttribute("href", `mailto:${company.contacts[0]}`);
    expect(within(contact).getByText(company.leadership[0].name, { exact: false })).toBeVisible();
    expect(within(contact).getByText(company.locations[0])).toBeVisible();
    expect(within(contact).getByText(/Not established as an inspected clinical or operational processing facility/)).toBeVisible();
    expect(within(contact).getByText(goodmanBillingProfile.identity.complianceClaim)).toBeVisible();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });
});
