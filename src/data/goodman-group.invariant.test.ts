import { describe, expect, it } from "vitest";

import { goodmanGroup, SITE_ORIGIN } from "./goodman-group";

describe("goodmanGroup domain invariants", () => {
  it("enforces canonical SITE_ORIGIN format", () => {
    expect(SITE_ORIGIN).toMatch(/^https:\/\/[a-zA-Z0-9.-]+$/);
    expect(SITE_ORIGIN.endsWith("/")).toBe(false);
  });

  it("enforces core group branding and mission fields", () => {
    expect(goodmanGroup.websiteTitle.trim().length).toBeGreaterThan(0);
    expect(goodmanGroup.message.trim().length).toBeGreaterThan(0);
    expect(goodmanGroup.description.trim().length).toBeGreaterThan(0);
    expect(goodmanGroup.mission.trim().length).toBeGreaterThan(0);
  });

  it("enforces non-empty categories, sectors, and principles", () => {
    expect(goodmanGroup.operatingPrinciples.length).toBeGreaterThan(0);
    expect(goodmanGroup.sectors.length).toBeGreaterThan(0);
    expect(goodmanGroup.businessInterests.length).toBeGreaterThan(0);
    expect(goodmanGroup.customerTypes.length).toBeGreaterThan(0);

    for (const principle of goodmanGroup.operatingPrinciples) {
      expect(principle.trim().length).toBeGreaterThan(0);
    }
    for (const sector of goodmanGroup.sectors) {
      expect(sector.trim().length).toBeGreaterThan(0);
    }
    for (const interest of goodmanGroup.businessInterests) {
      expect(interest.trim().length).toBeGreaterThan(0);
    }
    for (const customer of goodmanGroup.customerTypes) {
      expect(customer.trim().length).toBeGreaterThan(0);
    }
  });

  it("validates official contact details", () => {
    expect(goodmanGroup.contacts.website).toBe(`${SITE_ORIGIN}/`);
    expect(goodmanGroup.contacts.email).toMatch(/^.+@.+\..+$/);
    expect(goodmanGroup.contacts.usContactAddress.trim().length).toBeGreaterThan(0);
  });

  it("validates executive leadership and contact credentials", () => {
    expect(goodmanGroup.leadership.name.trim().length).toBeGreaterThan(0);
    expect(goodmanGroup.leadership.role.trim().length).toBeGreaterThan(0);
    expect(goodmanGroup.leadership.familyBusinessEntry.trim().length).toBeGreaterThan(0);
    expect(goodmanGroup.leadership.moreThan30Years.trim().length).toBeGreaterThan(0);
    expect(goodmanGroup.leadership.manufacturingExperience.trim().length).toBeGreaterThan(0);

    expect(goodmanGroup.executiveContacts.leaderName).toBe(goodmanGroup.leadership.name);
    expect(goodmanGroup.executiveContacts.phones.length).toBeGreaterThan(0);
    for (const phone of goodmanGroup.executiveContacts.phones) {
      expect(phone).toMatch(/^\+\d+/);
    }
    expect(goodmanGroup.executiveContacts.email).toMatch(/^.+@.+\..+$/);
  });
});
