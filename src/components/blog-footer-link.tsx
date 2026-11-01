"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BlogFooterLink() {
  const pathname = usePathname() ?? "/";
  const isCurrent = pathname === "/blog" || pathname.startsWith("/blog/");

  return (
    <Link href="/blog" aria-current={isCurrent ? "page" : undefined}>
      Blog
    </Link>
  );
}
