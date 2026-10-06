"use client";

import {
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  Send,
} from "lucide-react";
import React, {
  useEffect,
  useRef,
  useState,
} from "react";
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

const displayNames =
  typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

const countryOptions: readonly CountryOption[] = getCountries().map((code) => {
  const name = displayNames?.of(code) || code;
  const callingCode = `+${getCountryCallingCode(code)}`;
  return { id: code, name, callingCode, label: `${name} (${callingCode})` };
}).sort((a, b) => a.name.localeCompare(b.name, "en"));

const countryByLabel: Record<string, CountryOption> = Object.fromEntries(
  countryOptions.map((item) => [item.label, item]),
);

const countryFilter = (textValue: string, inputValue: string): boolean => {
  const query = inputValue.trim().toLowerCase();
  if (!query) return true;
  if (textValue.toLowerCase().includes(query)) return true;

  const item = countryByLabel[textValue];
  if (item) {
    if (item.callingCode.toLowerCase().includes(query)) return true;
    if (item.callingCode.replace("+", "").includes(query)) return true;
    if (item.id.toLowerCase() === query) return true;
  }
  return false;
};

export function EnquirySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isSubmittingRef = useRef(false);

  const [theme, setTheme] = useState<"light" | "dark">("dark");
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

  // Form field refs for focusing first invalid control
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const orgInputRef = useRef<HTMLInputElement>(null);
  const companyButtonRef = useRef<HTMLButtonElement>(null);
  const enquiryTypeButtonRef = useRef<HTMLButtonElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const messageTextareaRef = useRef<HTMLTextAreaElement>(null);

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
  }, []);

  const focusFirstInvalid = (errorObj: Record<string, string>) => {
    const fieldOrder = [
      { key: "name", id: "enquiry-name", ref: nameInputRef },
      { key: "email", id: "enquiry-email", ref: emailInputRef },
      { key: "organisation", id: "enquiry-organisation", ref: orgInputRef },
      { key: "company", id: "enquiry-company-button", ref: companyButtonRef },
      { key: "enquiryType", id: "enquiry-type-button", ref: enquiryTypeButtonRef },
      { key: "country", id: "enquiry-country-input", ref: countryInputRef },
      { key: "phone", id: "enquiry-phone", ref: phoneInputRef },
      { key: "message", id: "enquiry-message", ref: messageTextareaRef },
    ];

    for (const field of fieldOrder) {
      if (errorObj[field.key]) {
        const el = field.ref.current || document.getElementById(field.id);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "instant", block: "nearest" });
          return;
        }
      }
    }
  };

  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent duplicate submit including immediate ref check
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

    // Client-side validation using shared validateEnquiry before sending
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

      // No success state except when response is ok and resJson.ok is true
      if (!res.ok || !resJson?.ok) {
        if (resJson?.errors && Object.keys(resJson.errors).length > 0) {
          setErrors(resJson.errors);
          focusFirstInvalid(resJson.errors);
        }
        setSubmitError(
          resJson?.message ||
            "Unable to deliver your enquiry at this time. Please try again or email us directly at goodman@goodmangoc.com."
        );
        return;
      }

      setIsSuccess(true);
    } catch {
      setSubmitError(
        "A network error occurred while sending your enquiry. Please check your connection and try again."
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
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
            <Clock className="w-4 h-4 enquiry-badge-icon" aria-hidden="true" />
            <span>We’ll respond within 24 hours</span>
          </div>
        </header>

        <div className="enquiry-card">
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

          {isSuccess ? (
            <div className="enquiry-success-view" role="status" aria-live="polite">
              <div className="enquiry-success-icon-wrap" aria-hidden="true">
                <CheckCircle2 className="w-12 h-12 enquiry-success-icon" />
              </div>
              <h3 className="enquiry-success-heading">Enquiry Received</h3>
              <p className="enquiry-success-message">
                Thank you{name ? `, ${name}` : ""}. Your enquiry has been received.
              </p>
              <div className="enquiry-clock-badge enquiry-success-badge">
                <Clock className="w-4 h-4 enquiry-badge-icon" aria-hidden="true" />
                <span>We’ll respond within 24 hours</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="enquiry-reset-btn"
              >
                Send another enquiry
              </button>
            </div>
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
                <div className="enquiry-alert enquiry-alert-error" role="alert">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <p>{submitError}</p>
                </div>
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
                {/* 1. Name */}
                <div className="enquiry-field enquiry-field-name">
                  <label htmlFor="enquiry-name" className="enquiry-label">
                    Full name <span className="enquiry-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    id="enquiry-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearFieldError("name");
                    }}
                    className={`enquiry-input ${errors.name ? "enquiry-input-invalid" : ""}`}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "enquiry-name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="enquiry-name-error" className="enquiry-error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* 2. Email */}
                <div className="enquiry-field enquiry-field-email">
                  <label htmlFor="enquiry-email" className="enquiry-label">
                    Email address <span className="enquiry-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={emailInputRef}
                    id="enquiry-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearFieldError("email");
                    }}
                    className={`enquiry-input ${errors.email ? "enquiry-input-invalid" : ""}`}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "enquiry-email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="enquiry-email-error" className="enquiry-error" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* 3. Organisation (optional) */}
                <div className="enquiry-field enquiry-field-full enquiry-field-org">
                  <label htmlFor="enquiry-organisation" className="enquiry-label">
                    Organisation <span className="enquiry-optional">(optional)</span>
                  </label>
                  <input
                    ref={orgInputRef}
                    id="enquiry-organisation"
                    name="organisation"
                    type="text"
                    autoComplete="organization"
                    placeholder="Company or institution name"
                    value={organisation}
                    onChange={(e) => {
                      setOrganisation(e.target.value);
                      clearFieldError("organisation");
                    }}
                    className={`enquiry-input ${errors.organisation ? "enquiry-input-invalid" : ""}`}
                    aria-invalid={Boolean(errors.organisation)}
                    aria-describedby={errors.organisation ? "enquiry-organisation-error" : undefined}
                  />
                  {errors.organisation && (
                    <p id="enquiry-organisation-error" className="enquiry-error" role="alert">
                      {errors.organisation}
                    </p>
                  )}
                </div>

                {/* 4. Company (Select) */}
                <div className="enquiry-field enquiry-field-company">
                  <Select
                    name="company"
                    isRequired
                    selectedKey={company}
                    onSelectionChange={(key) => {
                      setCompany(key ? (String(key) as CompanyOptionId) : null);
                      clearFieldError("company");
                    }}
                    className="enquiry-select-group"
                    isInvalid={Boolean(errors.company)}
                    aria-describedby={errors.company ? "enquiry-company-error" : undefined}
                  >
                    <Label className="enquiry-label">
                      Company of interest <span className="enquiry-required" aria-hidden="true">*</span>
                    </Label>
                    <Button
                      ref={companyButtonRef}
                      id="enquiry-company-button"
                      className={`enquiry-select-trigger ${errors.company ? "enquiry-input-invalid" : ""}`}
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
                  {errors.company && (
                    <p id="enquiry-company-error" className="enquiry-error" role="alert">
                      {errors.company}
                    </p>
                  )}
                </div>

                {/* 5. Enquiry Type (Select) */}
                <div className="enquiry-field enquiry-field-type">
                  <Select
                    name="enquiryType"
                    isRequired
                    selectedKey={enquiryType}
                    onSelectionChange={(key) => {
                      setEnquiryType(key ? (String(key) as EnquiryTypeId) : null);
                      clearFieldError("enquiryType");
                    }}
                    className="enquiry-select-group"
                    isInvalid={Boolean(errors.enquiryType)}
                    aria-describedby={errors.enquiryType ? "enquiry-type-error" : undefined}
                  >
                    <Label className="enquiry-label">
                      Enquiry type <span className="enquiry-required" aria-hidden="true">*</span>
                    </Label>
                    <Button
                      ref={enquiryTypeButtonRef}
                      id="enquiry-type-button"
                      className={`enquiry-select-trigger ${errors.enquiryType ? "enquiry-input-invalid" : ""}`}
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
                  {errors.enquiryType && (
                    <p id="enquiry-type-error" className="enquiry-error" role="alert">
                      {errors.enquiryType}
                    </p>
                  )}
                </div>

                {/* 6. Phone Compound (ComboBox Country + Tel Input) */}
                <div className="enquiry-field enquiry-field-full enquiry-field-phone">
                  <span id="enquiry-phone-label" className="enquiry-label">
                    Phone Number <span className="enquiry-optional">(optional)</span>
                  </span>
                  <div className="enquiry-phone-compound">
                    <ComboBox<CountryOption>
                      aria-label="Country calling code"
                      selectedKey={countryKey}
                      onSelectionChange={(key) => {
                        setCountryKey(key ? String(key) : null);
                        clearFieldError("country");
                      }}
                      defaultItems={countryOptions}
                      defaultFilter={countryFilter}
                      className="enquiry-country-combobox"
                      isInvalid={Boolean(errors.country)}
                    >
                      <div className="enquiry-combobox-wrap">
                        <Input
                          ref={countryInputRef}
                          id="enquiry-country-input"
                          aria-label="Country calling code"
                          placeholder="Country code"
                          className={`enquiry-combobox-input ${errors.country ? "enquiry-input-invalid" : ""}`}
                          aria-describedby={errors.country ? "enquiry-country-error" : undefined}
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
                      ref={phoneInputRef}
                      id="enquiry-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel-national"
                      placeholder="e.g. 51 4455193"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        clearFieldError("phone");
                      }}
                      className={`enquiry-input enquiry-phone-input ${errors.phone ? "enquiry-input-invalid" : ""}`}
                      aria-label="Phone number without country code"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "enquiry-phone-error" : undefined}
                    />
                  </div>
                  {errors.country && (
                    <p id="enquiry-country-error" className="enquiry-error" role="alert">
                      {errors.country}
                    </p>
                  )}
                  {errors.phone && (
                    <p id="enquiry-phone-error" className="enquiry-error" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* 7. Message */}
                <div className="enquiry-field enquiry-field-full enquiry-field-message">
                  <label htmlFor="enquiry-message" className="enquiry-label">
                    Message <span className="enquiry-required" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    ref={messageTextareaRef}
                    id="enquiry-message"
                    name="message"
                    required
                    rows={5}
                    maxLength={5000}
                    placeholder="Tell us about your requirement, proposal, or question."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      clearFieldError("message");
                    }}
                    className={`enquiry-textarea ${errors.message ? "enquiry-input-invalid" : ""}`}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "enquiry-message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="enquiry-message-error" className="enquiry-error" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <div className="enquiry-field enquiry-field-full enquiry-field-submit">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="enquiry-submit-btn"
                    aria-disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 enquiry-spinner" aria-hidden="true" />
                        <span>Sending enquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Send enquiry</span>
                        <Send className="w-4 h-4 enquiry-btn-icon" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
