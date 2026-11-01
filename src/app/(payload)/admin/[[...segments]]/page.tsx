import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import { withCmsMutation } from "@/cms/mutation-gate";
import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> => generatePageMetadata({ config, params, searchParams });

export default async function AdminPage(args: Args) {
  const { segments = [] } = await args.params;
  if (segments.some((segment) => ["create-first-user", "forgot", "reset", "forgot-password", "reset-password"].includes(segment))) {
    return <section><h1>Terminal access required</h1><p>Account creation and password recovery are available only through offline maintenance commands.</p><Link href="/admin/login">Administrator login</Link></section>;
  }
  if (segments.join("/") === "collections/announcements/create") {
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: await headers() });
    if (!user || user.collection !== "administrators") redirect("/admin/login");
    // Native autosave initializes a document in a deferred RSC, outside dispatch scope.
    // Own that mutation here so the entire write finishes before entering the edit view.
    const document = await withCmsMutation(() => payload.create({
      collection: "announcements", data: {}, draft: true, overrideAccess: false, user,
    }));
    redirect(`/admin/collections/announcements/${document.id}`);
  }
  return RootPage({ ...args, config, importMap });
}
