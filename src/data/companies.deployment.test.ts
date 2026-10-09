import { describe, expect, it } from "vitest";

import deploymentRoutes from "../../scripts/deployment-routes.json";
import { companies } from "./companies";
import { goodmanGroup } from "./goodman-group";

describe("deployment smoke route contract", () => {
  it("covers every company profile in the canonical registry", () => {
    const deploymentSlugs = deploymentRoutes
      .filter((route) => "slug" in route)
      .map((route) => route.slug);

    expect(deploymentSlugs).toEqual(companies.map((company) => company.slug));
  });

  it("uses the canonical group title for the homepage smoke expectation", () => {
    const homepage = deploymentRoutes.find((route) => route.path === "/");

    expect(homepage?.title).toBe(goodmanGroup.websiteTitle);
  });
});
