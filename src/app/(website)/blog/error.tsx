"use client";

export default function BlogError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content" className="blog-main" tabIndex={-1}>
      <section className="blog-state" aria-labelledby="blog-error-heading">
        <p className="blog-eyebrow">Temporarily unavailable</p>
        <h1 id="blog-error-heading">We couldn’t load the Group blog.</h1>
        <p>The announcements service is temporarily unavailable. Please try again shortly.</p>
        <button className="blog-back-link" type="button" onClick={reset}>Try again</button>
      </section>
    </main>
  );
}
