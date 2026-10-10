import { describe, expect, it } from "vitest";

import { goodmanBillingProfile } from "./goodman-billing";
import { goodmanLaboratoriesProfile } from "./goodman-laboratories";
import { goodmanMedicalEquipmentProfile } from "./goodman-medical-equipment";
import { walGreenChemicalsProfile } from "./wal-green-chemicals";

describe("company profile domain contracts", () => {
  describe("goodmanBillingProfile", () => {
    it("enforces sequential workflow steps 1 through N", () => {
      const steps = goodmanBillingProfile.workflowSteps;
      expect(steps.length).toBeGreaterThan(0);
      steps.forEach((step, index) => {
        expect(step.step).toBe(index + 1);
        expect(step.name.trim().length).toBeGreaterThan(0);
        expect(step.description.trim().length).toBeGreaterThan(0);
      });
    });

    it("enforces valid core tasks, services, and specialties", () => {
      expect(goodmanBillingProfile.coreTasks.length).toBeGreaterThan(0);
      for (const task of goodmanBillingProfile.coreTasks) {
        expect(["front-desk", "billing-rcm"]).toContain(task.category);
        expect(task.title.trim().length).toBeGreaterThan(0);
      }

      expect(goodmanBillingProfile.services.length).toBeGreaterThan(0);
      for (const cat of goodmanBillingProfile.services) {
        expect(cat.heading.trim().length).toBeGreaterThan(0);
        expect(cat.icon).toMatch(/^\/assets\//);
        expect(cat.items.length).toBeGreaterThan(0);
      }

      expect(goodmanBillingProfile.specialties.length).toBeGreaterThan(0);
      for (const spec of goodmanBillingProfile.specialties) {
        expect(spec.name.trim().length).toBeGreaterThan(0);
        expect(spec.icon).toMatch(/^\/assets\//);
        expect(spec.focus.trim().length).toBeGreaterThan(0);
      }
    });

    it("enforces platforms and differentiators", () => {
      expect(goodmanBillingProfile.platforms.length).toBeGreaterThan(0);
      expect(goodmanBillingProfile.differentiators.length).toBeGreaterThan(0);
    });
  });

  describe("goodmanLaboratoriesProfile", () => {
    it("enforces identity, facilities, and product categories", () => {
      expect(goodmanLaboratoriesProfile.identity.legalName.trim().length).toBeGreaterThan(0);
      expect(goodmanLaboratoriesProfile.identity.tagline.trim().length).toBeGreaterThan(0);
      expect(goodmanLaboratoriesProfile.facilitiesAndOperations.length).toBeGreaterThan(0);

      expect(goodmanLaboratoriesProfile.productCategories.length).toBeGreaterThan(0);
      for (const cat of goodmanLaboratoriesProfile.productCategories) {
        expect(cat.name.trim().length).toBeGreaterThan(0);
        expect(cat.products.length).toBeGreaterThan(0);
        for (const prod of cat.products) {
          expect(prod.name.trim().length).toBeGreaterThan(0);
          expect(prod.details.trim().length).toBeGreaterThan(0);
        }
      }
    });

    it("enforces national coverage and certifications", () => {
      expect(goodmanLaboratoriesProfile.geographicPresence.nationalCoverage.length).toBeGreaterThan(0);
      expect(goodmanLaboratoriesProfile.certifications.certificates.length).toBeGreaterThan(0);
      expect(goodmanLaboratoriesProfile.certifications.issuer.trim().length).toBeGreaterThan(0);
    });
  });

  describe("goodmanMedicalEquipmentProfile", () => {
    it("enforces sequential supply chain stages and ORC instrument handling", () => {
      expect(goodmanMedicalEquipmentProfile.supplyChain).toHaveLength(5);
      expect(goodmanMedicalEquipmentProfile.instrumentHandling).toHaveLength(7);

      expect(goodmanMedicalEquipmentProfile.products.length).toBeGreaterThan(0);
      for (const prod of goodmanMedicalEquipmentProfile.products) {
        expect(prod.name.trim().length).toBeGreaterThan(0);
        expect(prod.description.trim().length).toBeGreaterThan(0);
      }
    });
  });

  describe("walGreenChemicalsProfile", () => {
    it("enforces core positioning, product portfolio, and sourcing network", () => {
      expect(walGreenChemicalsProfile.identity.legalName.trim().length).toBeGreaterThan(0);
      expect(walGreenChemicalsProfile.identity.positioning.trim().length).toBeGreaterThan(0);
      expect(walGreenChemicalsProfile.identity.coreOffer.trim().length).toBeGreaterThan(0);

      expect(walGreenChemicalsProfile.productPortfolio.length).toBeGreaterThan(0);
      for (const prod of walGreenChemicalsProfile.productPortfolio) {
        expect(prod.trim().length).toBeGreaterThan(0);
      }

      expect(walGreenChemicalsProfile.strengths.length).toBeGreaterThan(0);
      expect(walGreenChemicalsProfile.sourcingNetwork.internationalImports.length).toBeGreaterThan(0);
    });
  });
});
