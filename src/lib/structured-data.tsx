import type { CompanyProfile } from "@/data/companies";
import { goodmanGroup, SITE_ORIGIN } from "@/data/goodman-group";

export function OrganizationJsonLd({ company }: { company?: CompanyProfile }) {
  if (!company) {
    const groupPayload = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Goodman Group",
      url: `${SITE_ORIGIN}/`,
      description: goodmanGroup.description,
      email: goodmanGroup.contacts.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: "15650 Grosvenor Lane",
        addressLocality: "Macomb",
        addressRegion: "MI",
        postalCode: "48044",
        addressCountry: "US",
      },
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(groupPayload).replace(/</g, "\\u003c"),
        }}
      />
    );
  }

  const companyPayload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.displayName,
    ...(company.legalName ? { legalName: company.legalName } : {}),
    description: company.summary,
    url: `${SITE_ORIGIN}/companies/${company.slug}`,
    ...(company.logo ? { logo: `${SITE_ORIGIN}${company.logo.src}` } : {}),
    brand: {
      "@type": "Brand",
      name: "Goodman Group",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(companyPayload).replace(/</g, "\\u003c"),
      }}
    />
  );
}
