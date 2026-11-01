# Payload Blog Implementation Plan

Status: implementation and local acceptance complete; production deployment awaits account-specific prerequisites. Embedded Payload 3.92.1, isolated website/admin roots, SQLite migrations, administrator commands, announcement lifecycle, guarded media, saved-draft preview, public Blog, metadata/discovery, and independent backup/restore packaging are implemented.

Implementation verification: lint, TypeScript and production build passed; 265 tests across 41 files passed all unchanged 80% coverage thresholds (statements 88.77%, branches 80.29%, functions 93.40%, lines 90.87%). The built standalone application passed 161 desktop/mobile browser journeys, including real image upload, autosave, draft privacy, and existing portfolio/enquiry/theme behavior. Actual editor publish/private edit/republish/restore-as-draft/unpublish/logout, populated article metadata/accessibility/no-JavaScript reading, database outage isolation, independent packaged account recovery, paired backup/restore, fresh-directory redeployment and matched archived rollback were exercised locally. Public/private snapshots, immutable identity, 20 retained revisions and four original/derived image checksums survived release replacement. React Doctor changed-scope scan: 100/100. No high/critical production dependency audit findings; residual low/moderate upstream advisories are recorded in README. No deployment or production database changes were performed. Actual hosting terminal access, private paths, stop/start controls and target-compatible native builds remain deployment prerequisites; local checks do not establish comparative production performance.

## 1. Confirmed requirements and evidence boundaries

### 1.1 Agreed scope

- One Group-wide announcement blog, named **Blog**, at `/blog` and `/blog/[slug]`; Payload administration at `/admin`.
- Add Blog links to the Group header and footer, including active-route behavior. Leave bespoke company navigation unchanged. No homepage/company-page article feeds.
- Preserve all existing website content, routes, company designs, theme behavior, enquiry functionality, and performance.
- Embed Payload in the existing Next.js application, using the one included GoDaddy Web Hosting Economy Node.js app slot. One application, one host, local SQLite, persistent local media. No additional paid services/subscriptions.
- The owner has checked hosting compatibility and directs this plan to assume the required runtime, persistent SQLite, and local uploads are supported. Do not reopen hosting-provider compatibility research.
- One administrator, created by a deployment-time command. No public registration, public author profiles, approval workflow, company-specific permissions, SSO, or MFA.
- Administrator login identity is private. Public attribution is Goodman Group and optional linked company labels, never the administrator's email or account name.
- Drafts, manual publication/unpublication, authenticated saved-draft preview, approximately 30-second autosave, at most 20 retained versions per announcement.
- First-publication dates only; no backdating. Lock slugs after first publication. Updates to published articles remain private drafts until republished. Unpublished article URLs return 404.
- English-only, publicly readable announcements; occasional updates; start empty. No content import unless separately requested.
- Rich text: paragraphs, H2/H3, bold, italic, lists, quotes, links, images, optional captions. No arbitrary HTML, tables, embeds, video, page builder, or unnecessary plugins.
- Optional cover image; image library accepts JPEG, PNG, WebP, maximum 5 MB per file; responsive sizes, meaningful alt text, reuse, deletion protection.
- Uploaded images may be publicly reachable before publication; unpublished media is not confidential.
- Existing Group visual language, light/dark themes, readable single-column articles, newest-first listing, 10 articles per page. No categories, tags, filters, search, related articles, share buttons, or visible updated dates.
- Generated metadata, social previews, canonical URLs, BlogPosting JSON-LD, published-only sitemap. No per-article SEO override fields.
- Request-time blog reads, no CMS cache-invalidation infrastructure. Publication changes appear on the next fresh request. Previews are authenticated, private, and uncached.
- No comments, reader accounts, newsletter, subscriptions, or other reader interactions.
- Password recovery uses a terminal command, not email. No new CMS email service.
- Manual backups before deployments and after substantive editing sessions; owner downloads off-host copies. Retain latest 7 backups plus 3 monthly copies. Brief planned downtime and manual recovery are acceptable.
- Owner maintains the system: monthly dependency review, prompt relevant security fixes, existing logs, no paid monitoring/alerts.

### 1.2 Repository-observed facts

| Area | Observed baseline | Planning consequence |
| --- | --- | --- |
| Framework | `package.json`: Next 16.3.3; React/React DOM 19.2.8; strict TypeScript; React Compiler | Preserve these versions unless a documented security/compatibility change is required during implementation |
| Runtime | `engines.node` is `>=24 <25`; `.nvmrc` is `24`; research workstation returned Node 24.22.1 | Tighten minimum to an explicitly supported Node 24 patch; do not describe the deployed patch as observed |
| Package manager | `packageManager` is `npm@11.17.0`; workstation returned npm 12.2.1 | Use the repository-declared npm version for implementation/reproducibility |
| Lockfile | Lockfile root also lists `motion` and `@gsap/react`, absent from current manifest | Reconcile existing manifest/lock drift during dependency work; no unrelated animation migration |
| Application | App Router, server-first routes, separate client interaction boundaries | Keep blog reading server-rendered; do not add a client data-fetching framework |
| Content | `src/data/companies.ts`, `goodman-group.ts`, company-specific records and bespoke JSX | Do not move existing portfolio content into Payload |
| Layout | `src/app/layout.tsx` owns HTML, fonts, global CSS, metadata and theme initialization | Separate website and Payload root layouts to avoid admin CSS/theme leakage |
| Auth | No existing application authentication layer | Use Payload's built-in authentication for the administrator only |
| Services | Existing enquiry handler uses Resend and Upstash | Preserve existing enquiry configuration; neither becomes a blog dependency |
| Production | `output: "standalone"`; packaged static/public assets; Node standalone entry point | Keep standalone packaging and explicitly include operational tools separately |
| CI | npm install, lint, typecheck, unit coverage, production build/smoke, Playwright | Add isolated SQLite fixtures/migrations to existing verification; no remote CMS |
| Discovery | Custom sitemap/robots handlers; Organization JSON-LD; origin `https://goodmangoc.com` | Extend existing conventions rather than introducing competing discovery routes |

The repository did not establish the actual production deployment procedure. GoDaddy plan, app-slot availability, persistent storage and runtime support are **user-confirmed**, not independently verified here.

### 1.3 Assumptions and operational prerequisites

These are not unresolved product decisions:

- **Terminal/SSH or equivalent command execution is required but not confirmed.** Before implementation deployment, the owner must arrange a way to run migrations, initial administrator creation, password reset, backups, and integrity checks. Document actual access without claiming it currently exists. If unavailable, stop deployment until an equivalent execution method is arranged; do not silently add a public setup/reset endpoint or paid service.
- Account-specific absolute paths, application stop/start controls, and release-upload steps must be filled into the runbook during deployment. Path examples below are symbolic, not GoDaddy account facts.
- The app runs as one Node application process against one local database. Do not introduce clustered workers or multiple replicas.
- Data lives outside the public web root and replaceable releases. Only upload files are exposed through Payload's file handler; database, backups, manifests, and secrets are never HTTP-served.
- Free disk capacity must cover the database, uploads, derived images, backup retention, and previous release. Existing hosting quotas remain applicable; no additional paid capacity is assumed.
- No material content/design/workflow choices remain open. Implementation-specific behavior must pass the gates below; failed gates are not permission to narrow agreed behavior.

## 2. Architecture and rationale

### 2.1 Selected design

Embed Payload 3 in the existing Next.js application. Add three collections: `administrators`, `announcements`, and `media`. Use the official SQLite adapter and Lexical editor, local image processing with Sharp, and direct server-side Local API reads. No API client library, Redis cache, object storage, job runner, cron publishing, webhook service, or separate backend.

Public pages call a small server-only blog query module. Payload configuration is initialized lazily from blog/admin/operational entry points, never imported by existing portfolio data or shared website layout/navigation. This isolates database-query failures from existing pages, although process-level failure still affects the entire single application.

Website and CMS use separate root layouts in `(website)` and `(payload)` route groups. Parentheses do not change public URLs. There must be no shared document root that imports website CSS/theme initialization around Payload's own HTML layout. Moving routes preserves public URLs and content.

Crossing website/admin root layouts causes a full document navigation; acceptable for administrator access. No public Admin navigation link is needed.

### 2.2 Alternatives considered and rejected

| Alternative | Why not selected |
| --- | --- |
| Separate Payload service | Extra app/process, API/auth boundaries and operations; conflicts with one-slot preference |
| Managed database or object storage | Extra service/cost; user selected local SQLite/uploads |
| Build-triggered publication or ISR | Adds builds or invalidation concerns; next-request publication is simpler with direct reads |
| PostgreSQL | Viable generally, but unnecessary and contrary to the selected local SQLite architecture |
| Static-site export | Cannot host embedded authenticated CMS or runtime publication |
| CMS for existing company pages | Not requested; risks bespoke designs and broad registry consumers |

## 3. Compatibility and dependency plan

### 3.1 Verified published contract

The registry reported Payload packages **3.92.1** during research. Keep all directly installed Payload packages on the **same exact version**. Recheck advisories and peer requirements immediately before implementation installation; if choosing a newer security release, record its compatibility rather than blindly using `latest`.

- `payload` / `@payloadcms/next` 3.92.1 engines: `^22.23.4 || >=24.22.1`.
- `@payloadcms/next` 3.92.1 Next 16 peer range: `>=16.3.3 <17.0.0`; current 16.3.3 qualifies.
- Payload UI/Lexical React and React DOM peers include `^19.2.1`; current 19.2.8 qualifies.
- Installation documentation lists Next 16.2.6+, but published 3.92.1 peers require 16.3.3+. Use the stricter package contract.
- `payload` and `@payloadcms/next` declare `graphql ^16.8.1` as a peer. Satisfy that dependency even though no GraphQL route/playground is exposed.
- Lexical also declares `@faceless-ui/modal` 3.0.0 and `@faceless-ui/scroll-info` 2.0.0 peers. Ensure the npm lock resolves them; explicitly declare exact peers if needed for a clean install.
- Standalone output is covered by Payload deployment guidance, but the completed artifact and native image/SQLite dependencies must be exercised on the deployment-compatible runtime during implementation.
- Do not enable Next Cache Components as part of this integration; documented full Payload compatibility is not guaranteed and this feature is unnecessary here.

### 3.2 Proposed dependencies and scripts

Runtime additions: `payload`, `@payloadcms/next`, `@payloadcms/ui` (directly imported by admin where required), `@payloadcms/db-sqlite`, `@payloadcms/richtext-lexical`, `sharp`, and compatible `graphql`, plus required Lexical peers above. Pin Payload packages at 3.92.1 initially. Use npm/package-lock only. No SEO, redirects, search, cloud storage, email, or scheduling plugin.

Use Payload's supported `payload run` command for TypeScript operational scripts; its production dependencies include `tsx`. Define these exact npm-script interfaces:

- `payload`: `payload` (config selected by `PAYLOAD_CONFIG_PATH`).
- `cms:admin:create`: `payload run scripts/cms-create-admin.ts`.
- `cms:admin:reset-password`: `payload run scripts/cms-reset-password.ts`.
- `package:operations`: `node scripts/package-operations.mjs`, implementing §10.1.
- `test:cms`: isolated real SQLite integration tests in Node environment.
- Existing lint/typecheck/build/start/check commands remain; release packaging produces separate web and operations artifacts.

These are planned interfaces, not currently installed commands. Production uses the explicit Node/CLI paths in §10.1 without downloads, Next tracing, development dependencies, or a running HTTP server.

Prefer root `payload.config.ts`, a `@payload-config` TypeScript alias, and the documented ESM setup (`"type": "module"` with the existing TypeScript config, after checking configuration compatibility). Wrap existing Next configuration with `withPayload`; preserve standalone output, compression, React Compiler, image formats, and existing asset headers. Check Vitest, ESLint, and scripts for ESM impact rather than establishing parallel configuration.

## 4. Content schemas and invariants

### 4.1 `administrators`

Authentication-enabled collection with Payload-managed email/password, sessions, and lockout fields. No public profile fields or role taxonomy: the sole account is the administrator.

- Normal collection creation and deletion denied through APIs/admin; only offline bootstrap creates the account with an explicit trusted Local API operation.
- Administrator may read/update their own permitted account fields. Never expose account enumeration, hashes, reset tokens, or sessions publicly.
- Creation script refuses if any administrator already exists. Password-reset script refuses if there is not exactly one matching administrator.
- Use sessions, HTTP-only secure production cookies, SameSite Lax, host-only scope, two-hour token lifetime, five failed-login attempts and ten-minute lockout. Do not enable automatic login or API keys.
- CLI recovery updates passwords through Payload's supported operations, not by writing password hashes/SQLite rows. Clear lockout through the supported operation and revoke existing sessions. Confirm revocation with a pre-reset session.
- No email verification or email recovery dependency. Disable/reject web forgot/reset-password operations and remove misleading recovery links using supported endpoint/view configuration; login/account operations remain functional.

### 4.2 `announcements`

| Field | Type and constraints | Public behavior |
| --- | --- | --- |
| `title` | Required on publication; trimmed text; proposed maximum 160 characters | H1, listing title, generated SEO title |
| `slug` | Unique indexed text; lowercase URL-safe hyphenated segments; proposed maximum 180 characters | `/blog/[slug]`; auto-generated from title before first publication |
| `summary` | Required on publication; plain text; proposed maximum 300 characters | Listing introduction, article introduction, default description |
| `body` | Lexical rich text with explicit allowed features | Article body; server-rendered semantic markup |
| `coverImage` | Optional upload relationship to `media` | Listing/article image and social image |
| `relatedCompanies` | Optional multi-select of existing company slugs; no duplicates | Linked company labels, or Goodman Group if empty |
| `publishedAt` | Server-managed immutable date, initially absent | First-publication date; never backdated |
| `_status` | Payload drafts/published state | Anonymous access only to published main documents |
| Payload timestamps | Internal creation/update timestamps | Do not show a last-updated date |

Proposed text limits are implementation defaults to bound inputs, not extra editorial fields. Drafts may be incomplete; publication must enforce title, unique slug, meaningful summary/body, valid company choices, resolvable image references and alt text.

Use `versions.maxPerDoc: 20`, drafts enabled, autosave interval 30,000 ms, no scheduling. This is at most 20 stored versions, including Payload's autosave behavior, not a promise of 20 manually saved milestones. Native autosave can coalesce saves; document the actual behavior. Revisions are not backups.

Company options come from `src/data/companies.ts`; store slugs, derive labels/links from that registry. Do not duplicate companies as CMS records or make them editable here.

Enforce lifecycle rules server-side, not just with read-only form inputs:

1. First successful publication assigns server time and fixes the slug. Reject client-supplied first-publication timestamps.
2. Subsequent drafts, publication, unpublication, and version restoration preserve the original first-publication date and slug.
3. Derive immutability from persisted authoritative main-record state, not incoming draft/version data. Restoring an old pre-publication version must not erase the publication lock.
4. After publication, title changes do not regenerate the slug. Reject URL changes through REST, Local API access-controlled paths, bulk changes, and version restore.
5. Guard create/update/restore paths against field-level permission stripping that could accidentally discard server-generated dates. Test actual operations with the selected Payload version.
6. New draft saves on published announcements must use Payload's draft-saving behavior, not update the main document to draft. Explicit Unpublish is the action that removes public access.
7. Slug `preview` is reserved for the private preview route. Duplicate slugs are validation errors, not overwritten articles.

**Restoration always creates a draft; it never publishes or unpublishes.** Replace the native version Restore action with **Restore as draft**, calling an authenticated server endpoint. Inside the mutation gate in §4.3, read the selected version with the administrator and `overrideAccess: false`, verify its parent announcement, copy only editable content fields, preserve the authoritative main record's slug/date, and call the normal access-controlled update with `draft: true`, `_status: 'draft'`, the administrator and `overrideAccess: false`. Never pass historical status, publication date, IDs, timestamps or internal fields through unchecked. An existing published main document remains unchanged and public; an unpublished announcement stays unpublished. Preview shows the restored saved draft; only a subsequent explicit Publish changes the public snapshot.

Do not call `payload.restoreVersion` for announcements. Deny the native announcement version-restore REST endpoint and native restore server-function dispatch, replace/remove native restore controls, and reject raw announcement restore operations at the collection operation boundary. Version listing/detail/comparison remain available with administrator access. The draft update reuses media validation, immutable-identity rules and retention. Missing media rejects restoration without altering the public document. Negative tests must prove no native REST/server-function/Local API restore path publishes content.
The custom action posts `{ versionId }` to `POST /api/cms/announcements/:id/restore-as-draft`, a collection endpoint registered by the announcement configuration and handled by `src/cms/restore-draft.ts`. Require the administrator session, same-origin/CSRF validation and gate scope before reading the selected version. Verify the version belongs to `:id`; never trust a supplied document body or publication flag. Return saved draft identity/status only. This replaces the native restore operation; it is not an additional publication endpoint.

### 4.3 `media`

- Upload collection with local storage at absolute `UPLOAD_DIR`, outside releases/public root; `disableLocalStorage` remains false.
- Required meaningful `alt` text and optional plain-text `caption`; shared library metadata, not a public author record. Use captions consistently in the renderer, without duplicating them in body text.
- JPEG, PNG, WebP only. Interpret 5 MB as **5,000,000 bytes**. Reject oversize input with 413; never accept truncated uploads. Limit multipart uploads to one file per request with bounded aggregate/field sizes.
- Check actual file type and decoding, not extension/client MIME alone. Disable remote-URL upload/paste and unsupported SVG/HTML/document types. Strip unnecessary image metadata.
- Sharp generates width-based sizes, for example 480, 960, and 1600 pixels, preserving aspect ratio and not upscaling. Bound decoded pixel count (proposed 25 megapixels) to avoid oversized decoded images exhausting memory.
- Render explicit dimensions, accurate `sizes`/responsive sources, lazy loading below the fold, and only necessary above-the-fold priority. No externally hosted images or arbitrary remote image allowlist.
- Prefer generated local variants directly in server-rendered `<picture>`/`img` markup to avoid another image-resizing pass. Existing Next image behavior remains unchanged.
- Upload file contents are immutable after creation: a different image is a new media item. This prevents an in-place replacement from changing published articles or leaving stale image-cache bytes. Metadata edits are shared across uses and take effect immediately; document that drafts do not version shared alt/caption metadata.
- Before delete, scan references in all main announcement documents (published and draft) and all retained versions, covering cover images and nested Lexical upload nodes. Query in bounded pages; compare normalized relationship IDs rather than raw string matches.
- Deny deletion with an actionable message identifying references. Guard bulk deletion too. Do not delete files until reference validation succeeds.
- **Chosen coordination: one process-wide FIFO asynchronous mutation gate, not SQLite transactions for cross-operation serialization.** Store it under a stable `globalThis` symbol so development reloads/module copies share it. Hold it for the complete awaited mutation: validation, main/version writes, automatic revision pruning, and media file removal. Release in `finally`, including errors, never merely when an HTTP connection aborts. Public reads remain ungated.
- Acquire the gate around CMS REST mutation dispatch and the complete Payload admin server-function dispatch. All custom server actions/endpoints and application Local API writes use the same `withCmsMutation` entry point. This covers autosave, manual draft save, publish/unpublish, announcement create/delete, Restore as draft, and media create/update/single or bulk delete. No mutation launches fire-and-forget work.
- Server-owned `AsyncLocalStorage` identifies the active scope: nested hooks/Local API operations reuse it without recursively acquiring the gate. Invalidate the scope on outer completion so detached work cannot reuse it. Collection operation guards reject announcement/media mutations outside an active scope before writes. Client request/context flags cannot grant scope authority. Native announcement restoration remains prohibited under §4.2.
- For save/restore, load authoritative main state, validate every resulting cover/body media ID still exists, then finish the draft/version write and pruning before releasing. For deletion, scan all main documents/retained versions **inside the gate**, then await full database/file deletion. Bulk deletion holds one outer scope throughout. Save-first makes deletion fail on a reference; delete-first makes save/restore reject missing media. Partial file-removal failure may leave unused files, never a committed article referencing a deleted media record.
- This choice depends on the agreed single web process. Offline maintenance runs only while the web process and all other writers are stopped; any offline announcement/media write uses the same wrapper. No second worker, simultaneous maintenance CLI, direct SQLite writes, or alternate mutation API is allowed. Transactions are not an interchangeable alternative to this gate.
- Administrator can delete genuinely unused media manually. No automated garbage collector. A reference in an expired revision ceases to protect the image only after that revision has actually been pruned.
- Public file downloads are intentional, including draft-associated images. Keep media `read` public so native file handling and populated article relationships work without a custom download service. Filename, alt, caption and image-size metadata are therefore public too; store no confidential data in this collection. There is no reader-facing media-library page. Database/backups remain outside the public filesystem.

## 5. Access rules and exposed interfaces

| Resource/operation | Anonymous reader | Sole authenticated administrator | Offline maintenance |
| --- | --- | --- | --- |
| Website and published articles | Read | Same published view | Not applicable |
| Draft article/main collection reads | Denied unless published-only constraint is met | Read/edit | Trusted scripts only |
| Announcement create/update/delete | Denied | Allowed, subject to lifecycle/media checks | Explicit trusted operations only |
| Version list/read/restore | Denied | Allowed; lifecycle invariants remain enforced | Explicit trusted operations only |
| Media upload/change/delete | Denied | Allowed under media rules | Controlled recovery |
| Image file download | Allowed | Allowed | Backup/restore |
| Media metadata read | Allowed; no public library UI | Allowed | Backup/reference checks |
| Administrator create/delete | Denied | Denied | Bootstrap only; no routine deletion |
| Administrator self-read/update | Denied | Own account only | Password reset/unlock |
| First-user registration and email recovery | Denied | Denied | CLI replaces these flows |

Use `access.admin` and collection/version permissions explicitly. Public article reads apply `_status = published` and `draft: false`, with `overrideAccess: false` and no forwarded administrator identity. Logged-in users viewing public routes still see the published article, not their pending changes.

Payload Local API defaults to bypassing access control. Every public/private query must intentionally choose access mode; privileged bypass is restricted to offline tools and narrowly scoped internal reference checks. Never return raw administrator documents in article responses or serialized React props.

Do not assume `create: false` alone disables Payload's special first-user registration operation. Deny the actual first-register endpoint and setup UI using supported endpoint/view overrides or a route-boundary guard in the selected version. Test before and after bootstrap, including an empty database. Do not invent a nonexistent `disableCreateFirstUser` setting. Keep public traffic disabled until migrations/bootstrap complete regardless.

Preserve `/api/enquiries` separately. Mount Payload REST at `/api/cms` to isolate CMS concerns, with the generated route `/api/cms/[...slug]`. `/admin` remains the UI. No GraphQL endpoint or playground; disable GraphQL configuration where supported while satisfying package peers.

Security defaults: same-origin admin/API, explicit canonical production origin for CSRF/CORS, no wildcard credentialed origins, bounded REST depth and pagination limits, no secrets in client bundles/logs/URLs, no stored browser tokens in localStorage. Apply noindex headers to CMS API/admin/preview responses. Robots is discovery guidance, not authorization.

## 6. Routes, rendering, publishing, and caching

### 6.1 Public routes

| Route | Behavior |
| --- | --- |
| `/blog` | Published announcements, descending `publishedAt`, deterministic ID tie-breaker; 10 per page |
| `/blog?page=N` | Same server-rendered listing with ordinary accessible previous/next pagination |
| `/blog/[slug]` | Published main document only; unknown/draft/unpublished slug returns 404 |
| `/blog/preview/[id]` | Saved latest draft by stable document ID; administrator session required |
| `/admin/[[...segments]]` | Payload admin, isolated root layout |
| `/api/cms/[...slug]` | Payload REST/auth/media handlers, access rules above |
| `/sitemap.xml` | Existing URLs plus Blog and published announcement canonical URLs |
| `/robots.txt` | Existing sitemap origin; disallow admin/API/preview paths |

Page 1 canonical is `/blog`; later pages have self-canonical query URLs. Normalize `?page=1` to `/blog`. Invalid/nonpositive page values normalize to page 1; genuinely out-of-range positive pages return 404, except page 1 of an empty blog. No pagination links when there is only one page.

Reserve `/blog/preview` from article slugs. Preview route authenticates via Payload with the request's cookies/headers on every request, then reads with `draft: true`, `overrideAccess: false`, and that administrator. Missing/expired session gets a clear login-required response/link without draft text/metadata. The admin Preview action links to a saved ID; unsaved changes must be saved first. No preview secret, share token, Draft Mode cookie, client preview package, or public API enabling drafts is needed.

Use request-time rendering (`dynamic = \"force-dynamic\"` with this project's non-Cache-Components configuration) for blog listing, article, preview and sitemap. Do not generate static params for announcements. Avoid introducing a `loading.tsx` or parent Suspense boundary that commits headers before missing-article checks; acceptance includes a real 404 status, not only 404-looking UI in an HTTP 200 response.

### 6.2 Publishing flow

1. Administrator creates announcement, selects optional companies/media, and saves drafts; autosave stores unfinished edits privately.
2. Preview authenticates and renders the saved latest draft with a prominent Preview label and noindex/no-store.
3. Publish validates content and references; first publication assigns the immutable date/slug.
4. Next fresh public request queries the published main document; listing/article/sitemap reflect it without rebuild or revalidation hooks.
5. Editing a published article changes only drafts until explicit republish; metadata/JSON-LD also stay on the published snapshot.
6. Explicit Unpublish removes it from public queries and sitemap; fresh requests to the article return 404.

No schedule fields, jobs collection setup, cron runner, publish webhook, cache tags, or invalidation hooks.

### 6.3 Cache and error policy

- Public blog HTML and sitemap are request-time and must not be served stale by a host/CDN rule. Use framework dynamic-response behavior and explicit no-store where needed. Verify actual response headers in the deployment smoke.
- Preview/admin/auth-sensitive responses: `Cache-Control: private, no-store`; noindex/nofollow; no preview content in sitemap or JSON-LD.
- Scope header changes to new CMS/blog routes; preserve existing public/static asset caching and portfolio rendering.
- Image bytes may be cached independently because filenames/file content are immutable. Do not apply website `/assets` policy to databases or backup directories.
- Browser history/back-forward caches and already-open tabs are not live-update channels. Freshness means a new server request, not automatic updates to an open article.
- Missing content is 404; unavailable database/query errors are failures, not an empty list or fake 404. Show a clear blog error boundary, with no stack traces, and log server-side details safely.
- Sitemap database failure returns an explicit temporary 503 with no-store rather than silently presenting an incomplete sitemap as success. Existing portfolio HTML routes remain independent.
- Lazy-load server-only Payload configuration in blog entry points. No global layout database health query, CMS `onInit` seed, or automatic migration at web startup.

## 7. Public presentation and SEO

- Blog nested layout uses the existing Group shell, SiteHeader, SiteFooter, skip link and main-content contract. Avoid nested `main` elements; keep focus targets stable.
- Match Group tokens, fonts, spacing and light/dark contracts. Add scoped blog selectors in `blog.css`, not broad element styles that affect company pages or admin.
- Listing cards include title, summary, publication date, optional cover image, linked company labels or Goodman Group. Do not nest company links inside a full-card article link.
- Article: single H1, summary, first-publication date (`time` with machine-readable value), company labels, optional cover, rich-text body/captions, Back to blog.
- Use semantic H2/H3, lists, blockquotes, figures/figcaptions; prevent skipped heading levels where possible. Restrict link protocols to safe schemes; new-tab links include appropriate rel attributes and an accessible indication.
- No client-side CMS hydration/data fetch for reading; body conversion happens on the server. Use explicit allowed Lexical features and renderers, not arbitrary HTML injection.
- Generate title, description, canonical, Open Graph and Twitter metadata from the published snapshot. Use the cover image or one existing suitable public brand asset chosen during implementation; no fabricated social content.
- BlogPosting JSON-LD uses article URL, headline, summary, first-publication date, optional image, language and Organization publisher/author Goodman Group. Company labels do not imply individual authorship. Do not expose private login fields.
- Escape JSON-LD safely using the existing `<` escaping convention. Do not reuse Organization-only markup as article markup.
- Sitemap includes `/blog` and published article URLs, not every query-pagination combination, preview/admin/media metadata or drafts. For `lastmod`, use a public publication/update timestamp only if tracked correctly; omit rather than leak draft-only update times.
- Keep one canonical origin, `SITE_ORIGIN`; align moved root metadata with it. Preview canonical must not imply an indexable preview URL; omit public article structured data in preview.

## 8. File-level change map

Paths below are proposed unless marked existing. Moving an existing route includes colocated tests/styles and updates relative imports; URLs do not change.

| File/area | Planned work |
| --- | --- |
| `package.json`, `package-lock.json`, `.nvmrc` | Matched Payload dependencies; supported Node 24 minimum/explicit reproducible patch; declared npm; operational/test scripts; reconcile baseline lock drift |
| `next.config.ts` | `withPayload`, supported ESM handling; preserve existing runtime/compiler/images/headers; scoped security/cache headers |
| `tsconfig.json` | Add `@payload-config` alias, preserve `@/*` |
| `payload.config.ts` | SQLite, collections, minimal Lexical features, Sharp, limits, origins, admin REST route base; no mail/jobs/GraphQL route |
| `src/payload-types.ts` | Generated Payload types; generated from config, not hand-edited |
| `src/cms/collections/administrators.ts` | Authentication and single-account access configuration |
| `src/cms/collections/announcements.ts` | Fields, versions/drafts, publication validation, immutable slug/date rules |
| `src/cms/collections/media.ts` | Local uploads, metadata, dimensions/limits, immutability and reference-safe deletion |
| `src/cms/access.ts`, `src/cms/announcement-lifecycle.ts`, `src/cms/media-references.ts` | Small shared access/lifecycle/reference helpers; no generic service/repository framework |
| `src/cms/mutation-gate.ts` | Global FIFO gate, reentrant server-owned async scope, fail-closed operation guards |
| `src/cms/restore-draft.ts`, `src/cms/admin/restore-as-draft.tsx` | Allowlisted version-to-draft update and replacement action; prohibit native restore paths |
| `src/cms/environment.ts` | CMS environment validation usable outside Next; no Next-only imports in the operational configuration graph |
| `src/cms/admin/` | Necessary first-user/recovery overrides and Restore as draft; no custom dashboard project |
| `src/migrations/` | Initial SQLite schema and tracked future migrations/index; keep schema authority in Payload |
| `src/app/layout.tsx` → `src/app/(website)/layout.tsx` | Preserve existing document/fonts/theme/metadata behavior, remove shared root around admin |
| Existing home, companies, CSS, `not-found.tsx` → `(website)` | Mechanical moves preserving page composition and company CSS import relationships |
| `src/app/(website)/[...unmatched]/page.tsx` | Explicit unmatched-URL fallback calling `notFound()` under website root; avoid experimental global-not-found solely for this integration |
| `src/app/favicon.ico` | Keep existing root metadata asset and verify favicon delivery after layout split |
| `src/app/(payload)/layout.tsx` | Document layout from the pinned official Payload template; no website CSS/theme script |
| `src/app/(payload)/admin/[[...segments]]/page.tsx` | Admin view/metadata wrappers from selected version |
| `src/app/(payload)/admin/importMap.js` | Generated admin import map; regenerate when custom admin components change |
| `src/app/(payload)/api/cms/[...slug]/route.ts` | REST mutation gate; blocked bootstrap/recovery/native-restore boundaries; no GraphQL handlers |
| `src/app/(website)/blog/layout.tsx`, `page.tsx`, `[slug]/page.tsx` | Public shell, pagination, published article lookup/metadata |
| `src/app/(website)/blog/preview/[id]/page.tsx` | Authenticated saved-draft preview, no shared secrets |
| `src/app/(website)/blog/error.tsx`, `not-found.tsx`, `blog.css` | Real failure/absence UX and scoped responsive/theme styles |
| `src/lib/blog/queries.ts`, `rich-text.tsx`, `metadata.ts` | Lazy server-only access, shared public/preview renderer, generated metadata/JSON-LD |
| `src/components/site-header.tsx`, `site-footer.tsx` | Blog links and active state; keep navigation accessibility behavior |
| `src/components/company-group-frame.tsx`, `src/data/*` | Intentionally unchanged except import path corrections from mechanical moves if necessary |
| `src/lib/structured-data.tsx` | Preserve existing Organization emitter; add article emitter here or in blog metadata module, not duplicate serializers |
| Existing `/api/enquiries` | Keep exact route and handler behavior; do not mount under CMS catch-all |
| Existing sitemap/robots route handlers/tests | Extend without changing endpoint URLs or origin convention |
| `scripts/cms-create-admin.ts`, `cms-reset-password.ts` | Offline lifecycle tooling, hidden password prompts, refusal guards, no credentials in command history |
| `scripts/package-operations.mjs` | Staging, locked production dependency install, manifest and archive procedure in §10.1 |
| `scripts/cms-backup.mjs`, `cms-restore.mjs` | Small offline tools/checks for consistent snapshots, manifests, integrity and explicit restore confirmation |
| `scripts/deployment-routes.json`, `smoke-deployment.mjs` | Add blog/anonymous-admin/private-preview checks; keep existing route/asset checks |
| `vitest.config.mts`, proposed `vitest.cms.config.mts` | Preserve jsdom unit suite; Node real-SQLite integration suite with isolated temporary paths |
| `playwright.config.ts`, `tests/e2e/` | Isolated CMS test setup, public/admin journeys; add blog coverage to mobile project explicitly |
| `.github/workflows/ci.yml` | Disposable CMS env/database/uploads, migrations, trusted test bootstrap; tests/smoke never use production data |
| `.gitignore`, proposed `.env.example` | Ignore SQLite/sidecars/uploads/backups/private artifacts; document names with dummy values |
| `README.md` | Architecture/setup/editor and maintenance runbook, concrete deployed paths/control steps, backup/restore/password recovery |

Do not copy a whole Payload website template. Copy only the required admin/REST wrappers for the chosen version. Fix affected test mock imports after route moves. Preserve 404 behavior for unknown companies and unknown site paths, including paths crossing route groups.

## 9. Environment and persistent layout

| Name | Purpose | Required handling |
| --- | --- | --- |
| `DATABASE_URL` | Local libSQL file URL, e.g. `file:/ABSOLUTE_PRIVATE_PATH/data/blog.sqlite` | Absolute persistent private path; not inside `.next`, a release or `public` |
| `UPLOAD_DIR` | Absolute persistent upload directory | Outside releases; served only through upload handlers |
| `PAYLOAD_SECRET` | High-entropy authentication secret | Owner password manager/secure host config; stable across restarts; never commit |
| `PAYLOAD_CONFIG_PATH` | Operational CLI config selection if required | Resolve to release's config; not a secret |
| `NODE_ENV`, `PORT`, `HOSTNAME` | Existing production/start controls | Set using actual host app configuration |
| `PLAYWRIGHT_BASE_URL`, test paths | Existing browser target plus isolated test DB/uploads | CI/development only |

Use existing `SITE_ORIGIN` for canonical URLs and production origin allowlists; local development/test origins are explicitly scoped to non-production. Do not trust arbitrary Host headers to create canonical URLs.

No SMTP, cloud database/token, object-storage, preview-secret or cron variables. Do not add persistent administrator-password environment variables. Existing enquiry credentials remain unchanged and separate.

Suggested account-private layout (replace paths in final runbook):

- `releases/<release-id>/`: standalone web artifact, required static/public assets, operations package/config/migrations.
- `shared/data/`: SQLite database and any SQLite journal/WAL sidecars.
- `shared/uploads/`: original and generated images.
- `shared/backups/<backup-id>/`: matched database/media archive and manifest.
- Previous known-good release retained separately; secrets in protected host configuration, not inside downloadable backup archives.

Set private directories/files readable only by the hosting account/application as supported. Fail CMS initialization clearly on missing/invalid CMS configuration; do not substitute an in-memory/empty database. Existing portfolio pages must not initialize CMS just to render.

## 10. Administrator and editor runbook

### 10.1 Offline creation and password recovery

Build a **source-and-production-dependencies operations package**, independent of Next's standalone bundle. TypeScript executes through the pinned Payload CLI's production `tsx` dependency, not through Next or a second runtime. Payload 3.92.1 package metadata confirms the `bin.js` CLI entry and runtime dependency.

`npm run package:operations` invokes `scripts/package-operations.mjs` with this fixed build procedure:

1. After generating migrations/types/admin import map and passing checks, create clean `dist/operations/`. Copy the release's **unchanged** `package.json`, `package-lock.json`, `tsconfig.json`, `payload.config.ts`, the complete `src/` tree (including CMS helpers, registry data, migrations/index, admin component sources/import map), and exactly `scripts/cms-create-admin.ts`, `scripts/cms-reset-password.ts`, `scripts/cms-backup.mjs`, `scripts/cms-restore.mjs` into their original relative paths. Exclude source tests/specs, `.env*`, secrets, `.next`, databases/sidecars, uploads, backups and reports. The config's operational import graph must not depend on `next/headers`, Next server actions or the `server-only` poison module; UI component paths remain lazy admin references.
2. Run repository-pinned npm in the staging directory: `npm ci --omit=dev --include=optional`. Keep the same manifest/lock, not a separately resolved dependency tree. Install in the release-build environment matching production OS/architecture/libc and supported Node version; do not copy workstation-native `node_modules`. Fail packaging if native Sharp/libSQL dependencies cannot load.
3. Write `release-manifest.json` with source/release ID, lockfile checksum, Node/npm/Payload versions, build target and migration checksums; no secrets. Archive staging **including its own production `node_modules`** as `dist/operations-<release-id>.tar.gz` and emit a checksum. Package the web artifact separately. Production requires no install, network fetch, `npx`, web bundle or running HTTP server.
4. Extract into a clean isolated directory with **no `.next` or web artifact present**. Against disposable absolute DB/upload paths, run migration/status, bootstrap, failed duplicate bootstrap, password reset/session revocation, backup and restore. Confirm config imports and aliases resolve using shipped `tsconfig.json`. Fail acceptance if any command depends on source-checkout/dev dependencies or Next output.

Deploy to `releases/<release-id>/operations/`. Open the terminal in that directory. Use a protected environment file outside the release/web root containing production `DATABASE_URL`, `UPLOAD_DIR`, `PAYLOAD_SECRET`, `NODE_ENV=production`, and `PAYLOAD_CONFIG_PATH` pointing to this operations directory's absolute `payload.config.ts`. CLI preflight rejects relative data paths or data paths within a replaceable release. Stop the web process and verify no other writers before **all** maintenance commands.

Exact invocation interfaces after implementation (substitute the account-private environment path):

```text
node --env-file=/ABSOLUTE_PRIVATE_PATH/cms.env ./node_modules/payload/bin.js migrate:status
node --env-file=/ABSOLUTE_PRIVATE_PATH/cms.env ./node_modules/payload/bin.js migrate
node --env-file=/ABSOLUTE_PRIVATE_PATH/cms.env ./node_modules/payload/bin.js run scripts/cms-create-admin.ts
node --env-file=/ABSOLUTE_PRIVATE_PATH/cms.env ./node_modules/payload/bin.js run scripts/cms-reset-password.ts
node --env-file=/ABSOLUTE_PRIVATE_PATH/cms.env scripts/cms-backup.mjs
node --env-file=/ABSOLUTE_PRIVATE_PATH/cms.env scripts/cms-restore.mjs
```

These are planned interfaces, not executed capabilities. Node loads the protected environment file; Payload executes TypeScript through its shipped runtime. Credentials are hidden interactive prompts, never password arguments or persistent password variables. Backup/restore helpers load the shipped SQLite-compatible runtime directly; no HTTP server or external `sqlite3` binary. Retain the matching operations archive with every web artifact/rollback set; never use a newer global CLI against an older snapshot.

Creation: keep site traffic stopped/private; migrate; assert zero administrators; create one account through Payload; assert exactly one; exit and close DB connections before serving traffic. Refuse a second invocation that would add an account.

Recovery: obtain terminal/SSH access; stop app and verify no other writers; take a backup; run the matching operations archive's reset command above, clear lockout and revoke sessions; restart and verify new login plus rejection of old password/session. No HTTP reset tooling. Lost terminal access requires hosting-account recovery, not a public backdoor.

### 10.2 Everyday editing

1. Open `/admin`, sign in, create an announcement.
2. Add title/summary/body, optional cover/company labels. Upload or reuse images, supply alt text and optional captions.
3. Save draft; use Preview to see saved content in a separate authenticated tab. Wait for save confirmation; unsaved changes are not promised in preview.
4. Publish when ready. Verify `/blog` and article in a fresh signed-out request.
5. For updates, save drafts and publish deliberately. **Restore as draft** saves historical content privately; the public article stays unchanged until a separate Publish action.
6. Use Unpublish to remove public article access; image URLs remain public. Slug/date stay locked for later republishing.
7. After substantive editing, make and download a manual backup.

## 11. Deployment, schema migration, and content migration

### 11.1 Development and CI

- Use disposable local SQLite/uploads, separate from production. Commit schema migrations; prefer `push: false` and explicit migrations for a consistent small-project workflow.
- Generate initial schema using the selected adapter's supported tooling; review migration contents. Test fresh creation and an upgrade of a disposable prior-schema copy. Never run development schema push on production.
- Payload SQLite documentation notes transaction differences, and migration docs state SQLite transactions are disabled by default. Do not promise automatic transactional rollback of every migration; snapshot backups are the recovery authority.
- Run type/import-map generation, lint/typecheck, meaningful unit/SQLite integration tests, coverage, production build, standalone smoke and browser journeys.
- Builds must not read/write production data. Request-time blog routes and lazy initialization avoid content prerendering. Supply disposable build configuration/database if Payload build tooling needs initialization; test the exact artifact, not just dev mode.
- CI creates its own DB/upload paths and administrator fixture via trusted setup. Delete temporary data after runs. No production credentials in CI.

### 11.2 Initial release

1. Record actual terminal execution method, private paths, app start/stop controls, deployment artifact and runtime versions. This is deployment setup, not a new hosting-compatibility investigation.
2. Build/package/test matching web and operations artifacts. Record release ID, source revision and lockfile checksum.
3. Preserve the existing production artifact and secure configuration. Keep public access stopped/private while bootstrap is incomplete.
4. Create private persistent data/uploads/backups directories and production environment. Do not place SQLite or backups under public assets.
5. Apply initial migrations with matching operations tools. Create sole administrator offline. Confirm first-user/public account creation is denied.
6. Configure one Node app to start the standalone server with persistent absolute paths. Do not run a second server/worker.
7. Verify empty Blog, existing routes, enquiry behavior, CMS login, local upload persistence across restart and authenticated preview.
8. Use a disposable announcement to exercise draft → publish → edit draft → republish → unpublish; remove the disposable content/media afterwards.
9. Verify real status/cache/security headers, published-only API/sitemap, admin/theme isolation, private file paths not downloadable.
10. Take/download first complete backup, then record deployed paths/controls and hand over runbook.

### 11.3 Subsequent releases

- Owner manually backs up before each release, including current release identity, database and uploads.
- Build/test new artifact away from live data. Enter short maintenance window; stop app cleanly and confirm no database writers.
- Snapshot current data; run reviewed migrations once with new matching tools; check status and integrity. Do not auto-migrate every web startup.
- Start new release, verify acceptance smoke, retain previous artifact with its matching backup.
- If checks fail, follow full-set rollback below rather than running destructive migration reset/fresh commands.
- No content-import system or seed announcements. Starting empty is intentional. Existing company/group records are not migrated.

## 12. Backup, restore, disk checks, and rollback

### 12.1 Manual consistent backup

Cadence: before deployment and after substantive editing. No cron or paid storage. Data-loss exposure is everything since the last successful downloaded backup; there is no automatic recovery point guarantee.

1. Choose a timestamped backup ID. Check disk space and identify active release.
2. Stop the application cleanly and verify no CLI/web process is writing DB or uploads. Keep it stopped until the paired snapshot is complete.
3. Use SQLite's supported backup API to create a standalone snapshot into the backup directory; run `PRAGMA integrity_check` against it. The backup tool may use the installed libSQL/runtime API; an external `sqlite3` binary is not an assumed host prerequisite.
4. If using a cold file copy instead, copy the full stopped database set including any WAL/journal state; recover/checkpoint only a staging copy with a compatible SQLite engine and verify it before accepting the backup. Never copy just the main DB from a live WAL-mode database.
5. Copy all uploads (originals and variants) from the same stopped state.
6. Write a manifest: timestamp, release/source ID, Payload/Node versions, applied migration identifiers, database filename, archive/checksums, upload counts/size. Do not include passwords or environment values.
7. Restart the application, check Blog/admin/image availability, then download archive and manifest to the owner's computer. Verify download checksum before deleting any older copy.
8. Store downloaded archives securely: the DB contains unpublished content and account/session data. Use encrypted local storage; do not publish archives or email them casually.

Retain the latest **7** backup sets and **3 monthly** sets (one successful representative set per month); overlapping sets need not be duplicated. Keep a clearly labeled known-good pre-deployment set until release acceptance. If there are fewer than three months of history, retain what exists; do not invent monthly copies.

Cleanup is manual: list manifests, identify sets not protected by latest-seven/monthly/rollback retention, confirm an off-host copy and a newer valid set, then delete only those complete expired sets. Never delete individual files inside a retained set. Run disk checks such as `df -h` and `du -sh` on the actual data/uploads/backups directories. Do not auto-delete current uploads to make room.

Secure configuration recovery is separate: keep `PAYLOAD_SECRET`, hosting access, canonical configuration, persistent paths and existing enquiry credentials in the owner's password manager/secure records. Back up config templates without values. Retain the required secret/version record securely for each rollback set.

### 12.2 Restore procedure

1. Obtain terminal/hosting access and select a known-good matched backup plus its application release. Verify checksums/manifest.
2. Stop app and all maintenance writers. Preserve a separate copy of the failed current state before replacing anything.
3. Restore snapshot to a clean staging directory; run database integrity check with the compatible operations tools. Restore corresponding full uploads tree.
4. Restore matching application artifact, migration files and secure configuration. Replace active data directories only after checks pass; do not merge stale WAL sidecars from the failed database.
5. Confirm filesystem permissions and absolute paths. Check migration status with the restored release. Do not blindly apply the newest migrations to an older rollback snapshot.
6. Start app; verify administrator login, representative published/draft article separation, images, listing/pagination, sitemap and existing portfolio routes. Verify that private files remain inaccessible.
7. Record restore time and data loss since snapshot. Keep failed-state copy until satisfied. Sessions present in restored DB may predate recovery; invalidate restored sessions where needed.

Perform a restore rehearsal into isolated local temporary paths before launch. Do not test restore by overwriting live data.

### 12.3 Rollback strategy

- First rollout: previous website-only artifact plus preserved pre-CMS configuration; leave CMS data intact/offline rather than deleting it.
- Later releases: previous compatible application artifact **and its matching database/uploads backup**. Code-only rollback is safe only if schema compatibility is positively established.
- No reliance on migration `down` to recover deleted data. Never use `migrate:fresh`, reset, or destructive schema push as production recovery.
- Keep current failed state for investigation. Return to service only after smoke proof. Brief maintenance downtime and owner-available manual recovery are accepted.

## 13. Meaningful verification and acceptance criteria

No Payload tests were executed during planning. The following are implementation obligations, not claims of current behavior.

### 13.1 Unit and real-SQLite integration tests

Use existing Vitest conventions for pure helpers, and Node-environment integration tests with the actual Payload config, disposable SQLite files and temporary upload directories. Do not substitute mocked access rules for security proof.

- Anonymous direct REST and Local API reads cannot retrieve draft announcements, draft versions or administrator data; public media files/metadata remain readable as agreed. Public media metadata never includes reverse relationships or private announcement content.
- Logged-in public article queries still return the published version, while authenticated preview returns the latest saved draft.
- Publish assigns date once; edit/unpublish/republish/restore preserve date/slug. Attempted API backdating and post-publication slug changes fail.
- Saving incomplete drafts works; publishing incomplete/invalid content fails. Duplicate slugs and reserved preview slug fail.
- New drafts on published articles do not change public body, summary, title, SEO or sitemap. Explicit unpublish yields absence from all public queries.
- Version count stays at or below 20. For a **never-published** announcement, create at least **25 distinct saved draft revisions** (not autosave attempts that coalesce); prove pruning occurred and authoritative main state still has no first-publication date. Publish for the first time and verify latest title/body/media, newly assigned server date and locked slug in public HTML/API/metadata/sitemap. Subsequent edits, republish and restoration preserve that identity. Retained revision history must not determine whether publication has occurred.
- Restore both a retained **published** revision and a retained **draft** revision while another public snapshot is live: preview changes to restored content, but main public state/body/metadata/sitemap do not change. On an unpublished announcement, either restore stays unpublished. Only explicit Publish changes the public snapshot. Preserve immutable date/slug. Native REST/server-function/raw Local API restoration must fail, not publish.
- Public registration/first-register denied on empty and seeded databases; offline bootstrap refuses a second account; account deletion denied.
- Login lockout and CLI reset/unlock work; old password/session rejected after reset.
- Valid JPEG/PNG/WebP succeeds; exactly permitted file-size boundary succeeds and larger upload fails; disguised/unsupported/invalid images and excessive pixel dimensions fail without leaving orphan files.
- Deterministically interleave autosave/save, Restore as draft, version pruning and single/bulk deletion using barriers with real SQLite. Exercise save/restore-first (reference blocks deletion) and delete-first (save/restore rejects missing media). Inject errors to prove `finally` releases the gate. Verify no committed main/draft/version reference is broken and no unscoped Local API/admin-server-function mutation bypasses the gate. Truly unused media remains deletable.
- Safe renderer rejects unsafe link schemes/HTML; company choices map to real registry URLs without duplicating companies.
- Pagination yields nonoverlapping pages in deterministic order; empty first page and out-of-range cases behave correctly.

Only permanent tests that catch consumer-visible behavior/invariants are appropriate. Do not snapshot incidental config/source text or create wiring/mock-echo tests.

### 13.2 Browser and production smoke

- Run the built standalone server, not only dev mode. Exercise actual admin login, upload, editing, autosave/save, preview, publish, republish, unpublish, logout and failed unauthenticated access.
- Validate 404 HTTP status for unknown/draft/unpublished URLs and no draft leakage in HTML, metadata, JSON-LD, API responses or sitemap. Fresh requests reflect publication without rebuild.
- Verify preview/admin noindex and private/no-store, blog/sitemap freshness headers, and existing static-asset caching.
- Verify generated canonical, Open Graph/Twitter data, safe BlogPosting JSON-LD, fallback image and published-only sitemap after a draft edit.
- Verify linked company labels, Group fallback, 10-item pagination and no-JavaScript reading/navigation.
- Check Group header Blog active state, keyboard/mobile menu, focus trap/restoration, Escape, scroll locking and background inertness after link addition.
- Check both themes, mobile/desktop layouts, 200% text, keyboard/focus, contrast, meaningful alternatives, captions, heading structure, no overflow. Run Axe plus manual inspection; target WCAG 2.2 AA without claiming certification.
- Check representative image-heavy articles for explicit dimensions/no avoidable layout shift, lightweight public bundles, no admin/editor code on public pages, and no new scroll/animation work.
- Repeat existing home/company/theme/enquiry/404 routes and standalone asset checks after route-group moves. Confirm CMS CSS never leaks into the website and vice versa.
- Simulate database unavailability in an isolated environment: blog shows a real error, sitemap returns temporary failure, existing portfolio pages render without CMS queries.
- Restart app and confirm SQLite/media persist. Run backup and isolated restore; compare restored publication state, images and migration status.
- **Redeployment persistence, beyond restart:** in release A create a published announcement, newer private draft, retained revisions and referenced original/derived images in external shared paths. Record IDs, slug/date, revision content and image checksums. Build/extract fresh web and **independent operations** artifacts into a different release B directory; run normal stop/backup/migration-status-or-upgrade/switch/start without copying DB/uploads from A into B. Remove A's extracted build from the test environment, retaining an archived rollback copy. Verify B sees the same public snapshot, private draft/revisions, identity and image bytes from shared storage; its operations archive must run migration status and recover a disposable account without A or `.next`. Recheck draft privacy and backup/restore. Rehearse in isolation, not by deleting production rollback artifacts.

### 13.3 Release acceptance

Release is accepted only when all agreed behavior above is exercised; lint/typecheck, relevant unit/real-DB tests, enforced coverage, production build, standalone smoke and desktop/mobile browser journeys pass. Record commands/results and any measured performance observations. Do not claim performance preservation from compilation alone.

## 14. Phased implementation checklist

### Phase A — integration boundaries

- [x] Re-read current Next/Payload guides, lock matched dependencies and minimum Node patch; resolve manifest/lock drift.
- [x] Split website/admin roots with mechanical route moves; preserve existing URL/CSS/theme/404 behavior.
- [x] Add minimal Payload config/SQLite adapter, generated types/import map and isolated REST handlers.
- [x] Prove standalone build plus operations artifact can run with disposable private data paths.

### Phase B — secure content lifecycle

- [x] Implement three collections, restrictive account/bootstrap/recovery interfaces and offline scripts.
- [x] Implement publication/date/slug invariants, drafts, 30-second autosave and bounded versions.
- [x] Replace all native announcement restore paths with authenticated Restore as draft; prove public content changes only after explicit Publish.
- [x] Implement minimal media limits, immutable files, process-wide mutation gate and version-aware deletion; prove both race orderings.
- [x] Generate/review initial migrations and exercise real SQLite security/lifecycle tests.

### Phase C — public Blog

- [x] Implement request-time list/article/preview, pagination and error/404 behavior.
- [x] Add scoped Group design/theme styling and accessible server-rendered rich text/images.
- [x] Add header/footer links, generated metadata/JSON-LD and published-only discovery.
- [x] Confirm next-fresh-request publication and no admin/draft leakage.

### Phase D — operations and release proof

- [x] Finalize manual backup/restore/disk cleanup, password recovery, deployment and rollback runbook.
- [ ] Confirm actual command-execution access without assuming SSH is already available.
- [x] Add disposable CMS setup to CI and run meaningful tests/build/standalone/browser checks.
- [x] Rehearse backup/isolated restore, fresh-directory redeployment persistence and rollback with matched web/operations artifacts; prove first publication after more than 20 distinct drafts.
- [ ] Deploy in a short maintenance window; bootstrap offline; complete acceptance smoke and download a backup.
- [ ] Fill README/runbook with actual hosting paths during deployment; repository scripts, observed local behavior and monthly maintenance procedure are documented and handed over.

## 15. Risks and proportionate mitigations

| Risk | Mitigation / accepted residual |
| --- | --- |
| One host/application fails | Accepted shared process/host boundary; keep existing page queries CMS-independent; manual restore |
| Local storage/account loss | Owner downloads paired backups; same-host archives alone are insufficient |
| SQLite locking or interrupted migrations | One application process, short writes, bounded adapter busy timeout, manual pre-release snapshot; test actual transaction semantics |
| Uploads/backups exhaust disk | Small image limits, bounded sizes/versions, manual disk checks and explicit backup rotation |
| Draft leaks via privileged Local API or versions | Access-controlled public queries, explicit published constraint, real DB/API negative tests |
| Setup takeover with empty user table | Deny special first-register route and setup view; bootstrap offline before traffic |
| Restore changes immutable public identity | Persisted main-record authority; regression tests for restoring pre-publication versions |
| Referenced media deleted/replaced | Version-aware deletion guard, coordinated writes, immutable upload files |
| Public pre-publication images | Explicitly accepted; do not upload confidential material |
| Global CSS/theme or 404 regressions | Separate root layouts; scoped blog styles; real browser and HTTP status checks |
| Stale host cache defeats publication | No blog HTML ISR/CDN cache; inspect response headers on deployment |
| Manual backup forgotten | Document editing/deployment checklist; accepted loss since latest valid off-host snapshot |
| Password/hosting access lost | Password manager and documented CLI recovery; terminal execution is a prerequisite, not confirmed |
| Dependency/security drift | Monthly review; prompt fixes; matched Payload versions; backup/test before upgrades |
| No added paid services | No added subscriptions; existing hosting quotas and owner's maintenance time still apply |

## 16. Official research sources

Documentation is live; package metadata was queried for the exact published versions during planning. Recheck at implementation, not as permission to upgrade blindly.

1. [Payload installation, supported runtimes and existing-app integration](https://payloadcms.com/docs/getting-started/installation)
2. [Payload 3.92.1 package metadata](https://registry.npmjs.org/payload/3.92.1)
3. [Next integration 3.92.1 peers and engines](https://registry.npmjs.org/@payloadcms%2fnext/3.92.1)
4. [UI 3.92.1 React peers](https://registry.npmjs.org/@payloadcms%2fui/3.92.1)
5. [SQLite adapter 3.92.1 package metadata](https://registry.npmjs.org/@payloadcms%2fdb-sqlite/3.92.1)
6. [Lexical editor 3.92.1 peers](https://registry.npmjs.org/@payloadcms%2frichtext-lexical/3.92.1)
7. [SQLite adapter and options](https://payloadcms.com/docs/database/sqlite)
8. [Schema migrations and SQLite transaction caveat](https://payloadcms.com/docs/database/migrations)
9. [Draft semantics and published versus draft reads](https://payloadcms.com/docs/versions/drafts)
10. [Versions and `maxPerDoc`](https://payloadcms.com/docs/versions/overview)
11. [Local API and default `overrideAccess`](https://payloadcms.com/docs/local-api/overview)
12. [Authentication, secure cookies, sessions and lockout](https://payloadcms.com/docs/authentication/overview)
13. [Uploads, local paths, resizing and multipart limits](https://payloadcms.com/docs/upload/overview)
14. [Production deployment, security and permanent storage](https://payloadcms.com/docs/production/deployment)
15. [Live preview](https://payloadcms.com/docs/live-preview/overview) — researched, not selected
16. [Jobs queue](https://payloadcms.com/docs/jobs-queue/overview) — researched; unnecessary without scheduling
17. [Next root layouts](https://nextjs.org/docs/app/api-reference/file-conventions/layout) — also inspected bundled Next 16.3.3 docs, including multiple-root full-page navigation
18. [Next self-hosting and cache behavior](https://nextjs.org/docs/app/guides/self-hosting) — also inspected bundled Next 16.3.3 guidance
19. [Next not-found conventions](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) — bundled guidance notes streamed 404 status caveat and experimental global fallback
20. [Payload outside Next.js and `payload run`](https://payloadcms.com/docs/local-api/outside-nextjs) — CLI TypeScript execution without Next; pinned package metadata confirms `bin.js` and production `tsx`.

Planning research and implementation acceptance are distinct: the official sources above informed the design; observed local implementation results are recorded at the start of this plan and in README. Hosting command access, account-specific paths/controls, target-native compatibility rehearsal, production smoke and owner off-host backup download remain deployment work. No host compatibility re-investigation or production mutation was performed.