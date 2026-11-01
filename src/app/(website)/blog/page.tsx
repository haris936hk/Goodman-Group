import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCompanyBySlug } from "@/data/companies";
import type { Announcement } from "@/payload-types";
import { getPublishedAnnouncementsPage } from "@/lib/blog/queries";
import { readMediaImage, ResponsiveBlogImage } from "@/lib/blog/rich-text";

export const dynamic = "force-dynamic";

const BLOG_DESCRIPTION = "News, milestones, and announcements from Goodman Group.";

type BlogPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

function parsePageNumber(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const page = Number(value);
  return page > 0 ? page : null;
}

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

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const raw = params.page;
  const page = Array.isArray(raw) ? null : parsePageNumber(raw);
  const canonicalPage = page && page > 1 && Number.isSafeInteger(page) ? `?page=${page}` : "";
  return {
    title: "Blog",
    description: BLOG_DESCRIPTION,
    alternates: { canonical: `/blog${canonicalPage}` },
    openGraph: {
      type: "website",
      title: "Blog | Goodman Group",
      description: BLOG_DESCRIPTION,
      url: `/blog${canonicalPage}`,
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const raw = params.page;
  if (Array.isArray(raw)) redirect("/blog");
  const page = parsePageNumber(raw);

  if (raw !== undefined) {
    if (page === null || page === 1) redirect("/blog");
    if (!Number.isSafeInteger(page)) notFound();
    if (raw !== String(page)) redirect(`/blog?page=${page}`);
  }

  const currentPage = page ?? 1;
  const result = await getPublishedAnnouncementsPage(currentPage);
  if (currentPage > 1 && currentPage > result.totalPages) notFound();

  return (
    <main id="main-content" className="blog-main" tabIndex={-1}>
      <header className="blog-hero">
        <p className="blog-eyebrow">Goodman Group / Newsroom</p>
        <h1>Blog</h1>
        <p>News, milestones, and announcements from across the Goodman Group.</p>
      </header>

      {result.docs.length ? (
        <div className="blog-list">
          {result.docs.map((announcement, index) => {
            const slug = announcement.slug ?? "";
            const title = announcement.title?.trim() || "Goodman Group announcement";
            const date = formatPublishedDate(announcement.publishedAt);
            const image = readMediaImage(announcement.coverImage);
            return (
              <article className="blog-card" key={announcement.id}>
                {image ? (
                  <figure className="blog-card-image">
                    <ResponsiveBlogImage image={image} sizes="(max-width: 48rem) 100vw, 36vw" priority={index === 0} />
                  </figure>
                ) : null}
                <div className="blog-card-copy">
                  <h2><Link href={`/blog/${encodeURIComponent(slug)}`}>{title}</Link></h2>
                  {date ? <p className="blog-card-date"><time dateTime={date.machineDate}>{date.label}</time></p> : null}
                  {announcement.summary ? <p className="blog-card-summary">{announcement.summary}</p> : null}
                  <CompanyLinks relatedCompanies={announcement.relatedCompanies} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="blog-empty-state" aria-labelledby="blog-empty-heading">
          <h2 id="blog-empty-heading">No announcements yet</h2>
          <p>Goodman Group news and announcements will appear here.</p>
        </section>
      )}

      {result.totalPages > 1 ? (
        <nav className="blog-pagination" aria-label="Blog pagination">
          {currentPage > 1 ? (
            <Link href={currentPage === 2 ? "/blog" : `/blog?page=${currentPage - 1}`} aria-label="Previous page">
              ← Previous
            </Link>
          ) : <span aria-hidden="true" />}
          <span aria-current="page" className="sr-only">Page {currentPage} of {result.totalPages}</span>
          {currentPage < result.totalPages ? (
            <Link href={`/blog?page=${currentPage + 1}`} aria-label="Next page">
              Next →
            </Link>
          ) : <span aria-hidden="true" />}
        </nav>
      ) : null}
    </main>
  );
}
