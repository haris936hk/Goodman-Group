import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { CompanyProfile } from "@/data/companies";
import { SITE_ORIGIN } from "@/data/goodman-group";

import { OrganizationJsonLd } from "./structured-data";

const mockCompanyFull: CompanyProfile = {
  slug: "test-corp",
  displayName: "Test Corp",
  legalName: "Test Corporation (Pvt.) Ltd.",
  relationship: "Subsidiary",
  business: "Healthcare",
  summary: "A healthcare provider <specialized> in diagnostics.",
  logo: {
    src: "/assets/logos/test.png",
    width: 200,
    height: 100,
  },
  accent: "#123456",
  founded: "2020",
  locations: ["Islamabad, Pakistan"],
  leadership: [{ name: "Director", role: "CEO", detail: "Founder" }],
  capabilities: ["Diagnostics"],
  contacts: ["info@test.com"],
};

describe("OrganizationJsonLd", () => {
  it("renders group Organization schema when company is omitted", () => {
    const { container } = render(<OrganizationJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const payload = JSON.parse(script?.textContent ?? "{}");
    expect(payload["@context"]).toBe("https://schema.org");
    expect(payload["@type"]).toBe("Organization");
    expect(payload.name).toBe("Goodman Group");
    expect(payload.url).toBe(`${SITE_ORIGIN}/`);
    expect(payload.address.addressLocality).toBe("Macomb");
    expect(payload.address.postalCode).toBe("48044");
  });

  it("renders company schema with legalName and logo when present", () => {
    const { container } = render(<OrganizationJsonLd company={mockCompanyFull} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const rawHtml = script?.innerHTML ?? "";
    expect(rawHtml).toContain("\\u003cspecialized>");
    expect(rawHtml).not.toContain("<specialized");

    const payload = JSON.parse(script?.textContent ?? "{}");
    expect(payload["@context"]).toBe("https://schema.org");
    expect(payload["@type"]).toBe("Organization");
    expect(payload.name).toBe("Test Corp");
    expect(payload.legalName).toBe("Test Corporation (Pvt.) Ltd.");
    expect(payload.url).toBe(`${SITE_ORIGIN}/companies/test-corp`);
    expect(payload.logo).toBe(`${SITE_ORIGIN}/assets/logos/test.png`);
    expect(payload.brand).toEqual({
      "@type": "Brand",
      name: "Goodman Group",
    });
  });

  it("omits legalName and logo when they are null", () => {
    const minimalCompany: CompanyProfile = {
      ...mockCompanyFull,
      legalName: null,
      logo: null,
    };

    const { container } = render(<OrganizationJsonLd company={minimalCompany} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const payload = JSON.parse(script?.textContent ?? "{}");

    expect(payload.name).toBe("Test Corp");
    expect(payload.legalName).toBeUndefined();
    expect(payload.logo).toBeUndefined();
    expect(payload.brand.name).toBe("Goodman Group");
  });
});
