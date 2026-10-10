import { describe, expect, it } from "vitest";

import {
  companyOptions,
  enquiryTypeOptions,
  validateEnquiry,
  type EnquiryInput,
} from "./enquiry";

const baseValid: EnquiryInput = {
  name: "Jane Partner",
  email: "jane@example.com",
  company: "group",
  enquiryType: "general",
  message: "Discussing distribution opportunities.",
};

describe("validateEnquiry", () => {
  it("accepts a valid minimal payload", () => {
    const result = validateEnquiry(baseValid);
    expect(result.errors).toEqual({});
    expect(result.data).toBeDefined();
    expect(result.data?.name).toBe("Jane Partner");
    expect(result.data?.email).toBe("jane@example.com");
    expect(result.data?.company).toBe("group");
    expect(result.data?.companyLabel).toBe("Goodman Group / Not sure");
    expect(result.data?.enquiryType).toBe("general");
    expect(result.data?.enquiryTypeLabel).toBe("General Enquiry");
    expect(result.data?.message).toBe("Discussing distribution opportunities.");
    expect(result.data?.organisation).toBeUndefined();
    expect(result.data?.phone).toBeUndefined();
    expect(result.data?.country).toBeUndefined();
  });

  it("accepts all optional fields when valid", () => {
    const result = validateEnquiry({
      ...baseValid,
      organisation: "  Global Health Partners  ",
      country: "PK",
      phone: "0336 7770770",
    });

    expect(result.errors).toEqual({});
    expect(result.data?.organisation).toBe("Global Health Partners");
    expect(result.data?.country).toBe("PK");
    expect(result.data?.phone).toBe("+923367770770");
  });

  it("handles valid country supplied without a phone number", () => {
    const result = validateEnquiry({
      ...baseValid,
      country: "GB",
      phone: "",
    });

    expect(result.errors).toEqual({});
    expect(result.data?.country).toBe("GB");
    expect(result.data?.phone).toBeUndefined();
  });

  it("ignores an unsupported country when phone is absent", () => {
    const result = validateEnquiry({
      ...baseValid,
      country: "ZZ",
      phone: "",
    });

    expect(result.errors).toEqual({});
    expect(result.data?.country).toBeUndefined();
  });

  it("rejects non-object or null input", () => {
    expect(validateEnquiry(null).errors.form).toBe("Invalid request payload.");
    expect(validateEnquiry(undefined).errors.form).toBe("Invalid request payload.");
    expect(validateEnquiry("string").errors.form).toBe("Invalid request payload.");
    expect(validateEnquiry(123).errors.form).toBe("Invalid request payload.");
  });

  it("rejects non-string types for optional fields", () => {
    const result = validateEnquiry({
      ...baseValid,
      organisation: 123,
      country: true,
      phone: {},
      website: [],
    });

    expect(result.errors.organisation).toBe("Please enter a valid value.");
    expect(result.errors.country).toBe("Please enter a valid value.");
    expect(result.errors.phone).toBe("Please enter a valid value.");
    expect(result.errors.website).toBe("Please enter a valid value.");
  });

  it("detects spam when honeypot website field is non-empty", () => {
    const result = validateEnquiry({
      ...baseValid,
      website: "https://spam.example.com",
    });

    expect(result.errors.website).toBe("Spam submission detected.");
    expect(result.data).toBeUndefined();
  });

  describe("name validation", () => {
    it("requires name to be a non-empty string", () => {
      expect(validateEnquiry({ ...baseValid, name: "" }).errors.name).toBe("Please enter your name.");
      expect(validateEnquiry({ ...baseValid, name: "   " }).errors.name).toBe("Please enter your name.");
      expect(validateEnquiry({ ...baseValid, name: 123 }).errors.name).toBe("Please enter your name.");
    });

    it("enforces maximum name length of 120 characters", () => {
      expect(validateEnquiry({ ...baseValid, name: "A".repeat(120) }).errors.name).toBeUndefined();
      expect(validateEnquiry({ ...baseValid, name: "A".repeat(121) }).errors.name).toBe(
        "Name must not exceed 120 characters.",
      );
    });
  });

  describe("email validation", () => {
    it("requires email to be a non-empty string", () => {
      expect(validateEnquiry({ ...baseValid, email: "" }).errors.email).toBe("Please enter your email address.");
      expect(validateEnquiry({ ...baseValid, email: "   " }).errors.email).toBe("Please enter your email address.");
      expect(validateEnquiry({ ...baseValid, email: 123 }).errors.email).toBe("Please enter your email address.");
    });

    it("enforces maximum email length of 254 characters", () => {
      const validLong = `${"a".repeat(230)}@example.com`;
      expect(validateEnquiry({ ...baseValid, email: validLong }).errors.email).toBeUndefined();

      const tooLong = `${"a".repeat(245)}@example.com`;
      expect(validateEnquiry({ ...baseValid, email: tooLong }).errors.email).toBe(
        "Email must not exceed 254 characters.",
      );
    });

    it("rejects emails with newlines, carriage returns, or invalid structure", () => {
      expect(validateEnquiry({ ...baseValid, email: "jane@example.com\nBcc: evil" }).errors.email).toBe(
        "Please enter a valid email address.",
      );
      expect(validateEnquiry({ ...baseValid, email: "jane@example.com\rBcc: evil" }).errors.email).toBe(
        "Please enter a valid email address.",
      );
      expect(validateEnquiry({ ...baseValid, email: "not-an-email" }).errors.email).toBe(
        "Please enter a valid email address.",
      );
    });
  });

  describe("organisation validation", () => {
    it("enforces maximum organisation length of 160 characters", () => {
      expect(validateEnquiry({ ...baseValid, organisation: "B".repeat(160) }).errors.organisation).toBeUndefined();
      expect(validateEnquiry({ ...baseValid, organisation: "B".repeat(161) }).errors.organisation).toBe(
        "Organisation must not exceed 160 characters.",
      );
    });

    it("omits empty or whitespace organisation", () => {
      const result = validateEnquiry({ ...baseValid, organisation: "   " });
      expect(result.errors.organisation).toBeUndefined();
      expect(result.data?.organisation).toBeUndefined();
    });
  });

  describe("company validation", () => {
    it("requires company selection", () => {
      expect(validateEnquiry({ ...baseValid, company: "" }).errors.company).toBe("Please select a company.");
      expect(validateEnquiry({ ...baseValid, company: "   " }).errors.company).toBe("Please select a company.");
      expect(validateEnquiry({ ...baseValid, company: 123 }).errors.company).toBe("Please select a company.");
    });

    it("rejects unmapped company options", () => {
      expect(validateEnquiry({ ...baseValid, company: "unknown-corp" }).errors.company).toBe(
        "Please select a valid company option.",
      );
    });

    it.each(companyOptions)("accepts canonical company option $id", ({ id, label }) => {
      const result = validateEnquiry({ ...baseValid, company: id });
      expect(result.errors.company).toBeUndefined();
      expect(result.data?.company).toBe(id);
      expect(result.data?.companyLabel).toBe(label);
    });
  });

  describe("enquiryType validation", () => {
    it("requires enquiry type selection", () => {
      expect(validateEnquiry({ ...baseValid, enquiryType: "" }).errors.enquiryType).toBe(
        "Please select an enquiry type.",
      );
      expect(validateEnquiry({ ...baseValid, enquiryType: "   " }).errors.enquiryType).toBe(
        "Please select an enquiry type.",
      );
      expect(validateEnquiry({ ...baseValid, enquiryType: 123 }).errors.enquiryType).toBe(
        "Please select an enquiry type.",
      );
    });

    it("rejects unmapped enquiry types", () => {
      expect(validateEnquiry({ ...baseValid, enquiryType: "invalid-type" }).errors.enquiryType).toBe(
        "Please select a valid enquiry type.",
      );
    });

    it.each(enquiryTypeOptions)("accepts canonical enquiry type $id", ({ id, label }) => {
      const result = validateEnquiry({ ...baseValid, enquiryType: id });
      expect(result.errors.enquiryType).toBeUndefined();
      expect(result.data?.enquiryType).toBe(id);
      expect(result.data?.enquiryTypeLabel).toBe(label);
    });
  });

  describe("message validation", () => {
    it("requires message to be a non-empty string", () => {
      expect(validateEnquiry({ ...baseValid, message: "" }).errors.message).toBe("Please enter your message.");
      expect(validateEnquiry({ ...baseValid, message: "   " }).errors.message).toBe("Please enter your message.");
      expect(validateEnquiry({ ...baseValid, message: 123 }).errors.message).toBe("Please enter your message.");
    });

    it("enforces maximum message length of 5000 characters", () => {
      expect(validateEnquiry({ ...baseValid, message: "M".repeat(5000) }).errors.message).toBeUndefined();
      expect(validateEnquiry({ ...baseValid, message: "M".repeat(5001) }).errors.message).toBe(
        "Message must not exceed 5000 characters.",
      );
    });
  });

  describe("phone & country validation", () => {
    it("enforces maximum phone length of 40 characters", () => {
      expect(
        validateEnquiry({ ...baseValid, country: "", phone: "1".repeat(41) }).errors.phone,
      ).toBe("Phone number must not exceed 40 characters.");
    });
    it("requires country when phone is non-empty", () => {
      expect(validateEnquiry({ ...baseValid, phone: "03367770770", country: "" }).errors.country).toBe(
        "Please select a country code for your phone number.",
      );
    });

    it("requires valid supported country when phone is non-empty", () => {
      expect(validateEnquiry({ ...baseValid, phone: "03367770770", country: "ZZ" }).errors.country).toBe(
        "Please select a valid country code.",
      );
    });

    it("rejects structurally impossible phone numbers", () => {
      expect(validateEnquiry({ ...baseValid, phone: "123", country: "PK" }).errors.phone).toBe(
        "Please enter a valid phone number.",
      );
    });
  });
});
