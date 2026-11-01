import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { getCompanyBySlug } from "@/data/companies";
import type { Announcement } from "@/payload-types";
import { getAuthenticatedDraft } from "@/lib/blog/queries";
import { readMediaImage, ResponsiveBlogImage, RichText } from "@/lib/blog/rich-text";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Announcement preview",
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
};

type PreviewPageProps = {
  params: Promise<{ id: string }>;
};

function formatPublishedDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return {
    machineDate: date.toISOString(),
    label: new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date),
  };
}

function CompanyLabels({ relatedCompanies }: { relatedCompanies: Announcement["relatedCompanies"] }) {
  const linkedCompanies = (relatedCompanies ?? [])
    .map((slug) => getCompanyBySlug(slug))
    .filter((company): company is NonNullable<typeof company> => Boolean(company));

  return (
    <ul className="blog-company-list" aria-label="Related Goodman Group companies">
      {linkedCompanies.length ? linkedCompanies.map((company) => (
        <li key={company.slug}><Link href={`/companies/${company.slug}`}>{company.displayName}</Link></li>
      )) : <li><span>Goodman Group</span></li>}
    </ul>
  );
}

function LoginRequired() {
  return (
    <main id="main-content" className="blog-main" tabIndex={-1}>
      <section className="blog-state" aria-labelledby="preview-login-heading">
        <p className="blog-eyebrow">Private preview</p>
        <h1 id="preview-login-heading">Administrator sign-in required</h1>
        <p>Sign in to the Goodman Group administrator account to preview a saved announcement draft.</p>
        <Link href="/admin/login">Continue to administrator sign in</Link>
      </section>
    </main>
  );
}

export default async function AnnouncementPreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const requestHeaders = await headers();
  const result = await getAuthenticatedDraft(id, requestHeaders);
  if (!result.authenticated) return <LoginRequired />;
  if (!result.announcement) notFound();

  const announcement = result.announcement;
  const title = announcement.title?.trim() || "Untitled announcement";
  const date = formatPublishedDate(announcement.publishedAt);
  const image = readMediaImage(announcement.coverImage);

  return (
    <main id="main-content" className="blog-main" tabIndex={-1}>
      <article className="blog-article">
        <p className="blog-preview-banner">PRIVATE PREVIEW · SAVED DRAFT</p>
        <header className="blog-article-header">
          <p className="blog-eyebrow">Goodman Group / Announcement</p>
          <h1>{title}</h1>
          {announcement.summary ? <p className="blog-article-summary">{announcement.summary}</p> : null}
          {date ? <p className="blog-article-date"><time dateTime={date.machineDate}>{date.label}</time></p> : null}
          <CompanyLabels relatedCompanies={announcement.relatedCompanies} />
        </header>

        {image ? (
          <figure className="blog-cover-figure">
            <ResponsiveBlogImage image={image} sizes="(max-width: 64rem) calc(100vw - 2.5rem), 56rem" priority />
            {image.caption ? <figcaption>{image.caption}</figcaption> : null}
          </figure>
        ) : null}

        <RichText value={announcement.body} />
        <Link className="blog-back-link" href="/blog">← Back to blog</Link>
      </article>
    </main>
  );
}
