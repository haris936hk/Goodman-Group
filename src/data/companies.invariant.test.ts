import { describe, expect, it } from "vitest";

import { companies, getCompanyBySlug } from "./companies";

describe("companies domain invariants", () => {
  it("contains exactly five canonical companies", () => {
    expect(companies).toHaveLength(5);
  });

  it("enforces unique, lowercase kebab-case slugs", () => {
    const slugs = companies.map((c) => c.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);

    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("enforces valid accent color hex codes", () => {
    for (const company of companies) {
      expect(company.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("validates logo specifications when provided", () => {
    for (const company of companies) {
      if (company.logo) {
        expect(company.logo.src).toMatch(/^\/assets\//);
        expect(company.logo.width).toBeGreaterThan(0);
        expect(company.logo.height).toBeGreaterThan(0);
      }
    }
  });

  it("enforces required text fields are non-empty strings", () => {
    for (const company of companies) {
      expect(company.displayName.trim().length).toBeGreaterThan(0);
      expect(company.business.trim().length).toBeGreaterThan(0);
      expect(company.summary.trim().length).toBeGreaterThan(0);
      expect(Array.isArray(company.locations)).toBe(true);
      expect(company.capabilities.length).toBeGreaterThan(0);
      expect(Array.isArray(company.contacts)).toBe(true);

      for (const location of company.locations) {
        expect(location.trim().length).toBeGreaterThan(0);
      }
      for (const capability of company.capabilities) {
        expect(capability.trim().length).toBeGreaterThan(0);
      }
      for (const contact of company.contacts) {
        expect(contact.trim().length).toBeGreaterThan(0);
      }
    }
  });

  describe("getCompanyBySlug", () => {
    it.each(companies)("resolves canonical company for slug $slug", (company) => {
      const resolved = getCompanyBySlug(company.slug);
      expect(resolved).toBeDefined();
      expect(resolved?.displayName).toBe(company.displayName);
    });

    it("returns undefined for unmapped slugs", () => {
      expect(getCompanyBySlug("non-existent-company")).toBeUndefined();
      expect(getCompanyBySlug("")).toBeUndefined();
    });
  });
});
