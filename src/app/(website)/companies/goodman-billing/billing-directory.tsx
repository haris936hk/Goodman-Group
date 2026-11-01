"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

export type BillingDirectoryItem = {
  readonly name: string;
  readonly icon: string;
  readonly description?: string;
  readonly items?: readonly string[];
};

type BillingDirectoryProps = {
  readonly kind: "services" | "specialties";
  readonly entries: readonly BillingDirectoryItem[];
};

export function BillingDirectory({ kind, entries }: BillingDirectoryProps) {
  const id = useId();
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const visible = entries.filter((entry) =>
    [entry.name, entry.description, ...(entry.items ?? [])].join(" ").toLowerCase().includes(term),
  );

  return (
    <div className={`billing-directory billing-directory-${kind}`}>
      <div className="billing-directory-tools">
        <div className="billing-search">
          <label htmlFor={id}>Search {kind}</label>
          <div><Search aria-hidden="true" size={20} /><input id={id} type="search" placeholder={`Search ${kind}...`} value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        </div>
        <p role="status">{visible.length} of {entries.length} {kind}</p>
        {query ? <button type="button" className="billing-clear" onClick={() => setQuery("")}>Clear search</button> : null}
      </div>
      <div className="billing-card-grid">
        {visible.map((entry) => (
          <article className="billing-directory-card" key={entry.name}>
            <div className="billing-card-icon" aria-hidden="true">
              <Image src={entry.icon} alt="" width={64} height={64} sizes="64px" />
            </div>
            <h3>{entry.name}</h3>
            {entry.description ? <p>{entry.description}</p> : null}
            {entry.items ? <ul>{entry.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}
          </article>
        ))}
      </div>
      {visible.length === 0 ? <div className="billing-empty"><h3>No matching {kind}</h3><p>Try another specialty, service, or keyword.</p><button className="billing-action" type="button" onClick={() => setQuery("")}>Show all {kind}</button></div> : null}
    </div>
  );
}
