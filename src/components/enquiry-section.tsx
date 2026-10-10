"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  Send,
} from "lucide-react";
import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

import {
  companyOptions,
  enquiryTypeOptions,
  validateEnquiry,
  type CompanyOptionId,
  type EnquiryTypeId,
} from "@/data/enquiry";

interface CountryOption {
  readonly id: string;
  readonly name: string;
  readonly callingCode: string;
  readonly label: string;
}

let cachedCountryOptions: readonly CountryOption[] | null = null;
let cachedCountryByLabel: Record<string, CountryOption> | null = null;

const regionDisplayNames =
  typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function getCountryOptions(): readonly CountryOption[] {
  if (!cachedCountryOptions) {
    cachedCountryOptions = getCountries().map((code) => {
      const name = regionDisplayNames?.of(code) || code;
      const callingCode = `+${getCountryCallingCode(code)}`;
      return { id: code, name, callingCode, label: `${name} (${callingCode})` };
    }).sort((a, b) => a.name.localeCompare(b.name, "en"));

    cachedCountryByLabel = Object.fromEntries(
      cachedCountryOptions.map((item) => [item.label, item]),
    );
  }
  return cachedCountryOptions;
}

function getCountryByLabel(): Record<string, CountryOption> {
  if (!cachedCountryByLabel) {
    getCountryOptions();
  }
  return cachedCountryByLabel!;
}

const countryFilter = (textValue: string, inputValue: string): boolean => {
  const query = inputValue.trim().toLowerCase();
  if (!query) return true;
  if (textValue.toLowerCase().includes(query)) return true;

  const item = getCountryByLabel()[textValue];
  if (item) {
    if (item.callingCode.toLowerCase().includes(query)) return true;
    if (item.callingCode.replace("+", "").includes(query)) return true;
    if (item.id.toLowerCase() === query) return true;
  }
  return false;
};

const FIELD_ORDER = [
  { key: "name", id: "enquiry-name" },
  { key: "email", id: "enquiry-email" },
  { key: "organisation", id: "enquiry-organisation" },
  { key: "company", id: "enquiry-company-button" },
  { key: "enquiryType", id: "enquiry-type-button" },
  { key: "country", id: "enquiry-country-input" },
  { key: "phone", id: "enquiry-phone" },
  { key: "message", id: "enquiry-message" },
] as const;

function focusFirstInvalid(errorObj: Record<string, string>) {
  for (const field of FIELD_ORDER) {
    if (errorObj[field.key]) {
      const el = document.getElementById(field.id);
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: "instant", block: "nearest" });
        return;
      }
    }
  }
}

function useEnquiryTheme(sectionRef: RefObject<HTMLElement | null>) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const shell = sectionRef.current?.closest<HTMLElement>(".site-shell");
    if (!shell) return;

    const update = () => {
      const currentTheme = shell.dataset.theme === "light" ? "light" : "dark";
      setTheme(currentTheme);
    };

    update();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-theme") {
          update();
        }
      }
    });

    observer.observe(shell, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [sectionRef]);

  return theme;
}

function EnquiryHeader() {
  return (
    <header className="enquiry-intro" data-reveal>
      <p className="chapter-index">05 / Connect</p>
      <h2 id="enquiry-heading" className="enquiry-heading">
        Let’s start a conversation.
      </h2>
      <p className="enquiry-lead">
        Tell us what you’re looking for, and we’ll connect you with the right
        team within Goodman Group.
      </p>
      <div className="enquiry-clock-badge">
        <Clock className="size-4 enquiry-badge-icon" aria-hidden="true" />
        <span>We’ll respond within 24 hours</span>
      </div>
    </header>
  );
}

function EnquiryNoscript() {
  return (
    <noscript>
      <div className="enquiry-noscript">
        <p>
          Online enquiries require JavaScript to be enabled. You can contact Goodman Group
          directly at{" "}
          <a href="mailto:goodman@goodmangoc.com" className="enquiry-mailto-link">
            goodman@goodmangoc.com
          </a>
          .
        </p>
      </div>
    </noscript>
  );
}

function EnquirySuccessView({
  name,
  onReset,
}: {
  readonly name: string;
  readonly onReset: () => void;
}) {
  return (
    <div className="enquiry-success-view" role="status" aria-live="polite">
      <div className="enquiry-success-icon-wrap" aria-hidden="true">
        <CheckCircle2 className="size-12 enquiry-success-icon" />
      </div>
      <h3 className="enquiry-success-heading">Enquiry Received</h3>
      <p className="enquiry-success-message">
        Thank you{name ? `, ${name}` : ""}. Your enquiry has been received.
      </p>
      <div className="enquiry-clock-badge enquiry-success-badge">
        <Clock className="size-4 enquiry-badge-icon" aria-hidden="true" />
        <span>We’ll respond within 24 hours</span>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="enquiry-reset-btn"
      >
        Send another enquiry
      </button>
    </div>
  );
}

function EnquiryErrorAlert({ message }: { readonly message: string }) {
  return (
    <div className="enquiry-alert enquiry-alert-error" role="alert">
      <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

function EnquiryNameField({
  value,
  error,
  onChange,
}: {
  readonly value: string;
  readonly error?: string;
  readonly onChange: (val: string) => void;
}) {
  return (
    <div className="enquiry-field enquiry-field-name">
      <label htmlFor="enquiry-name" className="enquiry-label">
        Full name <span className="enquiry-required" aria-hidden="true">*</span>
      </label>
      <input
        id="enquiry-name"
        name="name"
        type="text"
        required
        autoComplete="name"
        placeholder="Your full name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`enquiry-input ${error ? "enquiry-input-invalid" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "enquiry-name-error" : undefined}
      />
      {error && (
        <p id="enquiry-name-error" className="enquiry-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function EnquiryEmailField({
  value,
  error,
  onChange,
}: {
  readonly value: string;
  readonly error?: string;
  readonly onChange: (val: string) => void;
}) {
  return (
    <div className="enquiry-field enquiry-field-email">
      <label htmlFor="enquiry-email" className="enquiry-label">
        Email address <span className="enquiry-required" aria-hidden="true">*</span>
      </label>
      <input
        id="enquiry-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        spellCheck={false}
        placeholder="you@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`enquiry-input ${error ? "enquiry-input-invalid" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "enquiry-email-error" : undefined}
      />
      {error && (
        <p id="enquiry-email-error" className="enquiry-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function EnquiryOrgField({
  value,
  error,
  onChange,
}: {
  readonly value: string;
  readonly error?: string;
  readonly onChange: (val: string) => void;
}) {
  return (
    <div className="enquiry-field enquiry-field-full enquiry-field-org">
      <label htmlFor="enquiry-organisation" className="enquiry-label">
        Organisation <span className="enquiry-optional">(optional)</span>
      </label>
      <input
        id="enquiry-organisation"
        name="organisation"
        type="text"
        autoComplete="organization"
        placeholder="Company or institution name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`enquiry-input ${error ? "enquiry-input-invalid" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "enquiry-organisation-error" : undefined}
      />
      {error && (
        <p id="enquiry-organisation-error" className="enquiry-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function EnquiryCompanySelect({
  theme,
  company,
  error,
  onSelect,
}: {
  readonly theme: "light" | "dark";
  readonly company: CompanyOptionId | null;
  readonly error?: string;
  readonly onSelect: (val: CompanyOptionId | null) => void;
}) {
  return (
    <div className="enquiry-field enquiry-field-company">
      <Select
        name="company"
        isRequired
        selectedKey={company}
        onSelectionChange={(key) => {
          onSelect(key ? (String(key) as CompanyOptionId) : null);
        }}
        className="enquiry-select-group"
        isInvalid={Boolean(error)}
        aria-describedby={error ? "enquiry-company-error" : undefined}
      >
        <Label className="enquiry-label">
          Company of interest <span className="enquiry-required" aria-hidden="true">*</span>
        </Label>
        <Button
          id="enquiry-company-button"
          className={`enquiry-select-trigger ${error ? "enquiry-input-invalid" : ""}`}
        >
          <SelectValue className="enquiry-select-value">
            {({ isPlaceholder, defaultChildren }) =>
              isPlaceholder ? (
                <span className="enquiry-placeholder">Choose a company</span>
              ) : (
                defaultChildren
              )
            }
          </SelectValue>
          <ChevronDown className="enquiry-chevron" aria-hidden="true" />
        </Button>
        <Popover className="enquiry-popover" data-theme={theme} data-lenis-prevent>
          <ListBox className="enquiry-listbox" aria-label="Company of interest">
            {companyOptions.map((opt) => (
              <ListBoxItem
                key={opt.id}
                id={opt.id}
                textValue={opt.label}
                className="enquiry-listbox-item"
              >
                {({ isSelected }) => (
                  <>
                    <span className="enquiry-item-text">{opt.label}</span>
                    {isSelected && (
                      <Check className="enquiry-check" aria-hidden="true" />
                    )}
                  </>
                )}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>
      {error && (
        <p id="enquiry-company-error" className="enquiry-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function EnquiryTypeSelect({
  theme,
  enquiryType,
  error,
  onSelect,
}: {
  readonly theme: "light" | "dark";
  readonly enquiryType: EnquiryTypeId | null;
  readonly error?: string;
  readonly onSelect: (val: EnquiryTypeId | null) => void;
}) {
  return (
    <div className="enquiry-field enquiry-field-type">
      <Select
        name="enquiryType"
        isRequired
        selectedKey={enquiryType}
        onSelectionChange={(key) => {
          onSelect(key ? (String(key) as EnquiryTypeId) : null);
        }}
        className="enquiry-select-group"
        isInvalid={Boolean(error)}
        aria-describedby={error ? "enquiry-type-error" : undefined}
      >
        <Label className="enquiry-label">
          Enquiry type <span className="enquiry-required" aria-hidden="true">*</span>
        </Label>
        <Button
          id="enquiry-type-button"
          className={`enquiry-select-trigger ${error ? "enquiry-input-invalid" : ""}`}
        >
          <SelectValue className="enquiry-select-value">
            {({ isPlaceholder, defaultChildren }) =>
              isPlaceholder ? (
                <span className="enquiry-placeholder">Select enquiry purpose</span>
              ) : (
                defaultChildren
              )
            }
          </SelectValue>
          <ChevronDown className="enquiry-chevron" aria-hidden="true" />
        </Button>
        <Popover className="enquiry-popover" data-theme={theme} data-lenis-prevent>
          <ListBox className="enquiry-listbox" aria-label="Enquiry type">
            {enquiryTypeOptions.map((opt) => (
              <ListBoxItem
                key={opt.id}
                id={opt.id}
                textValue={opt.label}
                className="enquiry-listbox-item"
              >
                {({ isSelected }) => (
                  <>
                    <span className="enquiry-item-text">{opt.label}</span>
                    {isSelected && (
                      <Check className="enquiry-check" aria-hidden="true" />
                    )}
                  </>
                )}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>
      {error && (
        <p id="enquiry-type-error" className="enquiry-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function EnquiryPhoneField({
  theme,
  countryKey,
  phone,
  countryError,
  phoneError,
  countryOptions,
  onCountryChange,
  onPhoneChange,
}: {
  readonly theme: "light" | "dark";
  readonly countryKey: string | null;
  readonly phone: string;
  readonly countryError?: string;
  readonly phoneError?: string;
  readonly countryOptions: readonly CountryOption[];
  readonly onCountryChange: (val: string | null) => void;
  readonly onPhoneChange: (val: string) => void;
}) {
  return (
    <div className="enquiry-field enquiry-field-full enquiry-field-phone">
      <span id="enquiry-phone-label" className="enquiry-label">
        Phone Number <span className="enquiry-optional">(optional)</span>
      </span>
      <div className="enquiry-phone-compound">
        <ComboBox<CountryOption>
          aria-label="Country calling code"
          selectedKey={countryKey}
          onSelectionChange={(key) => {
            onCountryChange(key ? String(key) : null);
          }}
          defaultItems={countryOptions}
          defaultFilter={countryFilter}
          className="enquiry-country-combobox"
          isInvalid={Boolean(countryError)}
        >
          <div className="enquiry-combobox-wrap">
            <Input
              id="enquiry-country-input"
              aria-label="Country calling code"
              placeholder="Country code"
              className={`enquiry-combobox-input ${countryError ? "enquiry-input-invalid" : ""}`}
              aria-describedby={countryError ? "enquiry-country-error" : undefined}
            />
            <Button
              className="enquiry-combobox-toggle"
              aria-label="Open country code selection"
            >
              <ChevronDown className="enquiry-chevron" aria-hidden="true" />
            </Button>
          </div>
          <Popover className="enquiry-popover enquiry-popover-country" data-theme={theme} data-lenis-prevent>
            <ListBox<CountryOption> className="enquiry-listbox">
              {(item) => (
                <ListBoxItem
                  id={item.id}
                  textValue={item.label}
                  className="enquiry-listbox-item"
                >
                  {({ isSelected }) => (
                    <>
                      <span className="enquiry-item-country-name">{item.name}</span>
                      <span className="enquiry-item-country-code">{item.callingCode}</span>
                      {isSelected && (
                        <Check className="enquiry-check" aria-hidden="true" />
                      )}
                    </>
                  )}
                </ListBoxItem>
              )}
            </ListBox>
          </Popover>
        </ComboBox>

        <input
          id="enquiry-phone"
          name="phone"
          type="tel"
          autoComplete="tel-national"
          placeholder="e.g. 51 4455193"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className={`enquiry-input enquiry-phone-input ${phoneError ? "enquiry-input-invalid" : ""}`}
          aria-label="Phone number without country code"
          aria-invalid={Boolean(phoneError)}
          aria-describedby={phoneError ? "enquiry-phone-error" : undefined}
        />
      </div>
      {countryError && (
        <p id="enquiry-country-error" className="enquiry-error" role="alert">
          {countryError}
        </p>
      )}
      {phoneError && (
        <p id="enquiry-phone-error" className="enquiry-error" role="alert">
          {phoneError}
        </p>
      )}
    </div>
  );
}

function EnquiryMessageField({
  value,
  error,
  onChange,
}: {
  readonly value: string;
  readonly error?: string;
  readonly onChange: (val: string) => void;
}) {
  return (
    <div className="enquiry-field enquiry-field-full enquiry-field-message">
      <label htmlFor="enquiry-message" className="enquiry-label">
        Message <span className="enquiry-required" aria-hidden="true">*</span>
      </label>
      <textarea
        id="enquiry-message"
        name="message"
        required
        rows={5}
        maxLength={5000}
        placeholder="Tell us about your requirement, proposal, or question."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`enquiry-textarea ${error ? "enquiry-input-invalid" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "enquiry-message-error" : undefined}
      />
      {error && (
        <p id="enquiry-message-error" className="enquiry-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function EnquirySubmitButton({ isSubmitting }: { readonly isSubmitting: boolean }) {
  return (
    <div className="enquiry-field enquiry-field-full enquiry-field-submit">
      <button
        type="submit"
        disabled={isSubmitting}
        className="enquiry-submit-btn"
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 enquiry-spinner" aria-hidden="true" />
            <span>Sending enquiry...</span>
          </>
        ) : (
          <>
            <span>Send enquiry</span>
            <Send className="size-4 enquiry-btn-icon" aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
}

export function EnquirySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isSubmittingRef = useRef(false);

  const theme = useEnquiryTheme(sectionRef);
  const countryOptions = useMemo(() => getCountryOptions(), []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [company, setCompany] = useState<CompanyOptionId | null>(null);
  const [enquiryType, setEnquiryType] = useState<EnquiryTypeId | null>(null);
  const [countryKey, setCountryKey] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;
    setSubmitError(null);

    const payload = {
      name,
      email,
      organisation,
      company: company || "",
      enquiryType: enquiryType || "",
      message,
      country: countryKey || "",
      phone,
      website,
    };

    const validation = validateEnquiry(payload);
    if (Object.keys(validation.errors).length > 0) {
      setErrors(validation.errors);
      focusFirstInvalid(validation.errors);
      return;
    }

    setErrors({});
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      let resJson: {
        ok?: boolean;
        message?: string;
        errors?: Record<string, string>;
      } | null = null;

      try {
        resJson = await res.json();
      } catch {
        // Fallback if response is not valid JSON
      }

      if (!res.ok || !resJson?.ok) {
        if (resJson?.errors && Object.keys(resJson.errors).length > 0) {
          setErrors(resJson.errors);
          focusFirstInvalid(resJson.errors);
        }
        setSubmitError(
          resJson?.message ||
            "Unable to deliver your enquiry at this time. Please try again or email us directly at goodman@goodmangoc.com."
        );
      } else {
        setIsSuccess(true);
      }
    } catch {
      setSubmitError(
        "A network error occurred while sending your enquiry. Please check your connection and try again."
      );
    }

    isSubmittingRef.current = false;
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setOrganisation("");
    setCompany(null);
    setEnquiryType(null);
    setCountryKey(null);
    setPhone("");
    setMessage("");
    setWebsite("");
    setErrors({});
    setSubmitError(null);
    setIsSuccess(false);
    isSubmittingRef.current = false;
    setIsSubmitting(false);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="chapter section-shell enquiry-chapter"
      aria-labelledby="enquiry-heading"
    >
      <div className="enquiry-layout">
        <EnquiryHeader />

        <div className="enquiry-card">
          <EnquiryNoscript />

          {isSuccess ? (
            <EnquirySuccessView
              name={name}
              onReset={handleReset}
            />
          ) : (
            <form
              noValidate
              action="/api/enquiries"
              method="post"
              onSubmit={handleSubmit}
              className="enquiry-form"
              aria-label="Goodman Group enquiry form"
            >
              {submitError && (
                <EnquiryErrorAlert message={submitError} />
              )}

              {/* Honeypot field - invisible and inaccessible */}
              <div className="enquiry-honeypot" aria-hidden="true">
                <label htmlFor="enquiry-website">Website</label>
                <input
                  id="enquiry-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="enquiry-grid">
                <EnquiryNameField
                  value={name}
                  error={errors.name}
                  onChange={(val) => {
                    setName(val);
                    clearFieldError("name");
                  }}
                />

                <EnquiryEmailField
                  value={email}
                  error={errors.email}
                  onChange={(val) => {
                    setEmail(val);
                    clearFieldError("email");
                  }}
                />

                <EnquiryOrgField
                  value={organisation}
                  error={errors.organisation}
                  onChange={(val) => {
                    setOrganisation(val);
                    clearFieldError("organisation");
                  }}
                />

                <EnquiryCompanySelect
                  theme={theme}
                  company={company}
                  error={errors.company}
                  onSelect={(val) => {
                    setCompany(val);
                    clearFieldError("company");
                  }}
                />

                <EnquiryTypeSelect
                  theme={theme}
                  enquiryType={enquiryType}
                  error={errors.enquiryType}
                  onSelect={(val) => {
                    setEnquiryType(val);
                    clearFieldError("enquiryType");
                  }}
                />

                <EnquiryPhoneField
                  theme={theme}
                  countryKey={countryKey}
                  phone={phone}
                  countryError={errors.country}
                  phoneError={errors.phone}
                  countryOptions={countryOptions}
                  onCountryChange={(val) => {
                    setCountryKey(val);
                    clearFieldError("country");
                  }}
                  onPhoneChange={(val) => {
                    setPhone(val);
                    clearFieldError("phone");
                  }}
                />

                <EnquiryMessageField
                  value={message}
                  error={errors.message}
                  onChange={(val) => {
                    setMessage(val);
                    clearFieldError("message");
                  }}
                />

                <EnquirySubmitButton isSubmitting={isSubmitting} />
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
