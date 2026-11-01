import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCompanyBySlug } from "@/data/companies";
import { SITE_ORIGIN } from "@/data/goodman-group";
import type { Announcement } from "@/payload-types";
import { getBlogArticleMetadata, createBlogPostingJsonLd } from "@/lib/blog/metadata";
import { getPublishedAnnouncement } from "@/lib/blog/queries";
import { readMediaImage, ResponsiveBlogImage, RichText } from "@/lib/blog/rich-text";

export const dynamic = "force-dynamic";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
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

function CompanyLinks({ relatedCompanies }: { relatedCompanies: Announcement["relatedCompanies"] }) {
  const linkedCompanies = (relatedCompanies ?? [])
    .map((slug) => getCompanyBySlug(slug))
    .filter((company): company is NonNullable<typeof company> => Boolean(company));

  return (
    <ul className="blog-company-list" aria-label="Related Goodman Group companies">
      {linkedCompanies.length ? linkedCompanies.map((company) => (
        <li key={company.slug}>
          <Link href={`/companies/${company.slug}`}>{company.displayName}</Link>
        </li>
      )) : <li><span>Goodman Group</span></li>}
    </ul>
  );
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await getPublishedAnnouncement(slug);
  if (!announcement || !formatPublishedDate(announcement.publishedAt)) {
    return { title: "Announcement not found", robots: { index: false, follow: false } };
  }
  return getBlogArticleMetadata(announcement, `${SITE_ORIGIN}/blog/${encodeURIComponent(slug)}`);
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const announcement = await getPublishedAnnouncement(slug);
  if (!announcement) notFound();

  const title = announcement.title?.trim() || "Goodman Group announcement";
  const date = formatPublishedDate(announcement.publishedAt);
  if (!date) notFound();
  const image = readMediaImage(announcement.coverImage);
  const canonicalURL = `${SITE_ORIGIN}/blog/${encodeURIComponent(slug)}`;

  return (
    <main id="main-content" className="blog-main" tabIndex={-1}>
      <article className="blog-article">
        <header className="blog-article-header">
          <p className="blog-eyebrow">Goodman Group / Announcement</p>
          <h1>{title}</h1>
          {announcement.summary ? <p className="blog-article-summary">{announcement.summary}</p> : null}
          <p className="blog-article-date">
            <time dateTime={date.machineDate}>{date.label}</time>
          </p>
          <CompanyLinks relatedCompanies={announcement.relatedCompanies} />
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: createBlogPostingJsonLd(announcement, canonicalURL) }}
      />
    </main>
  );
}
