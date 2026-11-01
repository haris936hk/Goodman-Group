import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Announcement not found",
  robots: { index: false, follow: false },
};

export default function BlogNotFound() {
  return (
    <main id="main-content" className="blog-main" tabIndex={-1}>
      <section className="blog-state" aria-labelledby="blog-not-found-heading">
        <p className="blog-eyebrow">404 / Announcement not found</p>
        <h1 id="blog-not-found-heading">This announcement is not available.</h1>
        <p>The address may be incorrect, or the announcement may no longer be published.</p>
        <Link href="/blog">Back to the blog</Link>
      </section>
    </main>
  );
}
