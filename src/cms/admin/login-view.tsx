import Image from "next/image";
import Link from "next/link";
import { Geist } from "next/font/google";
import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";
import { getSafeRedirect } from "payload/shared";
import { AdministratorLoginForm } from "./login-form";

const loginFont = Geist({ subsets: ["latin"] });

export function AdministratorLoginView({ initPageResult, searchParams }: AdminViewServerProps) {
  const { req } = initPageResult;
  const { admin, routes } = req.payload.config;
  const redirectTo = typeof searchParams?.redirect === "string" ? searchParams.redirect : undefined;

  if (req.user) {
    redirect(getSafeRedirect({ fallbackTo: routes.admin, redirectTo: redirectTo ?? routes.admin }));
  }

  const userSlug = admin.user;
  const collection = userSlug === "administrators" ? req.payload.collections.administrators.config : undefined;
  const canSignIn = collection?.auth && !collection.auth.disableLocalStrategy;

  return (
    <section className={`goodman-login ${loginFont.className}`} aria-labelledby="goodman-login-heading">
      <Link className="goodman-login__brand" href="/" aria-label="Goodman Group home">
        <Image src="/assets/logos/GG-white.png" alt="Goodman Group" width={160} height={68} priority />
      </Link>
      <div className="goodman-login__card">
        <header className="goodman-login__intro">
          <p className="goodman-login__eyebrow">Announcements</p>
          <h1 id="goodman-login-heading">Welcome back</h1>
          <p>Sign in to create and publish announcements.</p>
        </header>
        {canSignIn ? <AdministratorLoginForm searchParams={searchParams} /> : (
          <p role="alert">Administrator sign-in is unavailable.</p>
        )}
        <details className="goodman-login__help">
          <summary>Need help signing in?</summary>
          <p>Password recovery uses the offline maintenance command. Email resets are not available.</p>
        </details>
      </div>
      <Link className="goodman-login__back" href="/">← Back to Goodman Group</Link>
    </section>
  );
}
