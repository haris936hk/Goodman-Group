"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RestoreAsDraftButtonProps = {
  documentId: string;
  versionId: string;
};

export function RestoreAsDraftButton({ documentId, versionId }: RestoreAsDraftButtonProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function restoreAsDraft() {
    if (!window.confirm("Restore this version as a draft? The current saved draft will be replaced. The published announcement will remain unchanged.")) return;

    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/cms/announcements/${encodeURIComponent(documentId)}/restore-as-draft`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });

      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        let errorMessage = `Unable to restore this version (${response.status}).`;
        if (body && typeof body === "object" && "errors" in body && Array.isArray(body.errors)) {
          const firstError: unknown = body.errors[0];
          if (firstError && typeof firstError === "object" && "message" in firstError && typeof firstError.message === "string") {
            errorMessage = firstError.message;
          }
        }
        setMessage(errorMessage);
        return;
      }

      router.push(`/admin/collections/announcements/${encodeURIComponent(documentId)}`);

    } catch {
      setMessage("The version could not be restored. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <button className="btn btn--style-primary" type="button" disabled={saving} onClick={restoreAsDraft}>
        {saving ? "Saving draft…" : "Restore as draft"}
      </button>
      <p role="status" aria-live="polite">{message}</p>
    </div>
  );
}
