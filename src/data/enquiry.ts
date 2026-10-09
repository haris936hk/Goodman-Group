import { companies } from "@/data/companies";
import {
  isSupportedCountry,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";

export const companyOptions = [
  { id: "group", label: "Goodman Group / Not sure" },
  ...companies.map((company) => ({ id: company.slug, label: company.displayName })),
] as const;

export const enquiryTypeOptions = [
  { id: "business", label: "Business Enquiry" },
  { id: "partnership", label: "Partnership" },
  { id: "supplier", label: "Supplier / Vendor" },
  { id: "general", label: "General Enquiry" },
] as const;

export type CompanyOptionId = (typeof companyOptions)[number]["id"];
export type EnquiryTypeId = (typeof enquiryTypeOptions)[number]["id"];

export interface EnquiryInput {
  name?: unknown;
  email?: unknown;
  organisation?: unknown;
  company?: unknown;
  enquiryType?: unknown;
  message?: unknown;
  country?: unknown;
  phone?: unknown;
  website?: unknown;
}

export interface Enquiry {
  name: string;
  email: string;
  organisation?: string;
  company: CompanyOptionId;
  companyLabel: string;
  enquiryType: EnquiryTypeId;
  enquiryTypeLabel: string;
  message: string;
  country?: string;
  phone?: string;
}

export type EnquiryErrors = Record<string, string>;

export interface EnquiryValidationResult {
  data?: Enquiry;
  errors: EnquiryErrors;
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validateEnquiry(input: unknown): EnquiryValidationResult {
  const errors: EnquiryErrors = {};

  if (typeof input !== "object" || input === null) {
    return {
      errors: {
        form: "Invalid request payload.",
      },
    };
  }

  const raw = input as Record<string, unknown>;

  for (const field of ["organisation", "country", "phone", "website"] as const) {
    if (raw[field] !== undefined && typeof raw[field] !== "string") {
      errors[field] = "Please enter a valid value.";
    }
  }

  // Honeypot check: website field must be empty or absent
  if (
    typeof raw.website === "string" &&
    raw.website.trim().length > 0
  ) {
    errors.website = "Spam submission detected.";
  }

  // Name validation: required, 1-120 chars
  let validName: string | undefined;
  if (typeof raw.name !== "string" || raw.name.trim().length === 0) {
    errors.name = "Please enter your name.";
  } else {
    const trimmed = raw.name.trim();
    if (trimmed.length > 120) {
      errors.name = "Name must not exceed 120 characters.";
    } else {
      validName = trimmed;
    }
  }

  // Email validation: required, 1-254 chars, newline safe, regex
  let validEmail: string | undefined;
  if (typeof raw.email !== "string" || raw.email.trim().length === 0) {
    errors.email = "Please enter your email address.";
  } else {
    const trimmed = raw.email.trim();
    if (trimmed.length > 254) {
      errors.email = "Email must not exceed 254 characters.";
    } else if (
      trimmed.includes("\r") ||
      trimmed.includes("\n") ||
      !EMAIL_REGEX.test(trimmed)
    ) {
      errors.email = "Please enter a valid email address.";
    } else {
      validEmail = trimmed;
    }
  }

  // Organisation validation: optional, max 160 chars
  let validOrganisation: string | undefined;
  if (typeof raw.organisation === "string") {
    const trimmed = raw.organisation.trim();
    if (trimmed.length > 160) {
      errors.organisation = "Organisation must not exceed 160 characters.";
    } else if (trimmed.length > 0) {
      validOrganisation = trimmed;
    }
  }

  // Company validation: required, must be valid option
  let validCompany: CompanyOptionId | undefined;
  let validCompanyLabel: string | undefined;
  if (typeof raw.company !== "string" || raw.company.trim().length === 0) {
    errors.company = "Please select a company.";
  } else {
    const companyId = raw.company.trim();
    const selected = companyOptions.find((opt) => opt.id === companyId);
    if (!selected) {
      errors.company = "Please select a valid company option.";
    } else {
      validCompany = selected.id;
      validCompanyLabel = selected.label;
    }
  }

  // Enquiry type validation: required, must be valid option
  let validEnquiryType: EnquiryTypeId | undefined;
  let validEnquiryTypeLabel: string | undefined;
  if (
    typeof raw.enquiryType !== "string" ||
    raw.enquiryType.trim().length === 0
  ) {
    errors.enquiryType = "Please select an enquiry type.";
  } else {
    const enquiryTypeId = raw.enquiryType.trim();
    const selected = enquiryTypeOptions.find((opt) => opt.id === enquiryTypeId);
    if (!selected) {
      errors.enquiryType = "Please select a valid enquiry type.";
    } else {
      validEnquiryType = selected.id;
      validEnquiryTypeLabel = selected.label;
    }
  }

  // Message validation: required, 1-5000 chars
  let validMessage: string | undefined;
  if (typeof raw.message !== "string" || raw.message.trim().length === 0) {
    errors.message = "Please enter your message.";
  } else {
    const trimmed = raw.message.trim();
    if (trimmed.length > 5000) {
      errors.message = "Message must not exceed 5000 characters.";
    } else {
      validMessage = trimmed;
    }
  }

  // Phone and country validation
  let validCountry: string | undefined;
  let validPhone: string | undefined;

  const rawPhone =
    typeof raw.phone === "string" ? raw.phone.trim() : "";
  const rawCountry =
    typeof raw.country === "string" ? raw.country.trim().toUpperCase() : "";

  if (rawPhone.length > 0) {
    if (rawPhone.length > 40) {
      errors.phone = "Phone number must not exceed 40 characters.";
    }

    if (!rawCountry) {
      errors.country = "Please select a country code for your phone number.";
    } else if (!isSupportedCountry(rawCountry as CountryCode)) {
      errors.country = "Please select a valid country code.";
    } else {
      validCountry = rawCountry;
      const parsed = parsePhoneNumberFromString(
        rawPhone,
        rawCountry as CountryCode,
      );
      if (!parsed || !parsed.isPossible()) {
        errors.phone = "Please enter a valid phone number.";
      } else {
        validPhone = parsed.number; // E.164 normalized
      }
    }
  } else if (rawCountry.length > 0 && isSupportedCountry(rawCountry as CountryCode)) {
    // Country was provided without phone; allowed, preserve country
    validCountry = rawCountry;
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  if (
    !validName ||
    !validEmail ||
    !validCompany ||
    !validCompanyLabel ||
    !validEnquiryType ||
    !validEnquiryTypeLabel ||
    !validMessage
  ) {
    return {
      errors: {
        form: "Submission failed required field checks.",
      },
    };
  }

  const data: Enquiry = {
    name: validName,
    email: validEmail,
    ...(validOrganisation ? { organisation: validOrganisation } : {}),
    company: validCompany,
    companyLabel: validCompanyLabel,
    enquiryType: validEnquiryType,
    enquiryTypeLabel: validEnquiryTypeLabel,
    message: validMessage,
    ...(validCountry ? { country: validCountry } : {}),
    ...(validPhone ? { phone: validPhone } : {}),
  };

  return { data, errors: {} };
}
