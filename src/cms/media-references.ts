import { APIError, type BasePayload, type PayloadRequest, type Where } from 'payload';

const PAGE_SIZE = 100;
const BULK_DELETE_PREFLIGHT = Symbol('media-delete-preflight');

type RecordValue = Record<string, unknown>;
type RelationshipID = number | string;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeID(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isSafeInteger(value)) return String(value);
  if (typeof value === 'string' && value.trim()) return value.trim();
  return undefined;
}

function unwrapRelationshipID(value: unknown): RelationshipID | undefined {
  let current = value;
  const seen = new Set<object>();

  while (isRecord(current)) {
    if (seen.has(current)) return undefined;
    seen.add(current);
    if (typeof current.relationTo === 'string' && current.relationTo !== 'media') return undefined;
    if (current.id !== undefined && current.id !== null) current = current.id;
    else if (current.value !== undefined && current.value !== null) current = current.value;
    else return undefined;
  }

  return typeof current === 'number' && Number.isSafeInteger(current)
    ? current
    : typeof current === 'string' && current.trim()
      ? current.trim()
      : undefined;
}

function unwrapAnyID(value: unknown): RelationshipID | undefined {
  let current = value;
  const seen = new Set<object>();
  while (isRecord(current)) {
    if (seen.has(current)) return undefined;
    seen.add(current);
    if (current.id !== undefined && current.id !== null) current = current.id;
    else if (current.value !== undefined && current.value !== null) current = current.value;
    else return undefined;
  }
  return typeof current === 'number' && Number.isSafeInteger(current)
    ? current
    : typeof current === 'string' && current.trim()
      ? current.trim()
      : undefined;
}

function collectMediaIDs(value: unknown, result: Map<string, RelationshipID>): void {
  const visited = new Set<object>();
  const visit = (node: unknown): void => {
    if (!isRecord(node) && !Array.isArray(node)) return;
    if (visited.has(node)) return;
    visited.add(node);

    if (isRecord(node) && node.type === 'upload' && (node.relationTo === undefined || node.relationTo === 'media')) {
      const id = unwrapRelationshipID(node.value);
      const normalized = normalizeID(id);
      if (id === undefined || normalized === undefined) {
        throw new APIError('Announcement contains an invalid media upload reference.', 400);
      }
      result.set(normalized, id);
    }

    if (Array.isArray(node)) {
      for (const child of node) visit(child);
    } else {
      for (const child of Object.values(node)) visit(child);
    }
  };

  visit(value);
}

function collectDocumentMediaIDs(document: unknown): Map<string, RelationshipID> {
  if (!isRecord(document)) return new Map();
  const content = isRecord(document.version) ? document.version : document;
  const result = new Map<string, RelationshipID>();

  if (content.coverImage !== undefined && content.coverImage !== null) {
    const id = unwrapRelationshipID(content.coverImage);
    const normalized = normalizeID(id);
    if (id === undefined || normalized === undefined) {
      throw new APIError('Announcement contains an invalid cover image reference.', 400);
    }
    result.set(normalized, id);
  }

  collectMediaIDs(content.body, result);
  return result;
}

function assertAnnouncementDocument(document: unknown): asserts document is RecordValue {
  if (!isRecord(document)) throw new APIError('Announcement media validation requires a document.', 400);
}

/** Ensures every cover and Lexical upload still points at an existing media document. */
export async function validateAnnouncementMedia(
  payload: BasePayload,
  document: unknown,
  req?: Partial<PayloadRequest>,
): Promise<void> {
  assertAnnouncementDocument(document);
  const entries = [...collectDocumentMediaIDs(document).entries()];

  for (let offset = 0; offset < entries.length; offset += PAGE_SIZE) {
    const batch = entries.slice(offset, offset + PAGE_SIZE);
    const found = await payload.find({
      collection: 'media',
      depth: 0,
      limit: batch.length,
      overrideAccess: true,
      pagination: false,
      req,
      where: { id: { in: batch.map(([, id]) => id) } },
    });
    const foundIDs = new Set(found.docs.map((media) => normalizeID(media.id)).filter((id): id is string => id !== undefined));
    const missing = batch.filter(([normalized]) => !foundIDs.has(normalized));
    if (missing.length) {
      throw new APIError(`Announcement references missing media: ${missing.map(([, id]) => id).join(', ')}.`, 400);
    }
  }
}

function referenceLabel(document: unknown, version = false): string {
  if (!isRecord(document)) return version ? 'retained announcement version' : 'announcement';
  const versionDocument = isRecord(document.version) ? document.version : document;
  const title = typeof versionDocument.title === 'string' && versionDocument.title.trim()
    ? ` “${versionDocument.title.trim().slice(0, 100)}”`
    : '';
  const parentID = unwrapAnyID(document.parent) ?? (version ? undefined : unwrapAnyID(document.id));
  const versionID = normalizeID(document.id);
  if (version) {
    return `retained version${title} (announcement ID: ${parentID ?? 'unknown'}${versionID ? `, version ID: ${versionID}` : ''})`;
  }
  return `announcement${title} (ID: ${parentID ?? versionID ?? 'unknown'})`;
}

async function assertMediaUnreferenced(
  payload: BasePayload,
  targetIDs: Iterable<RelationshipID>,
  req?: Partial<PayloadRequest>,
): Promise<void> {
  const targetKeys = new Set([...targetIDs].map((id) => normalizeID(id)).filter((id): id is string => id !== undefined));
  if (!targetKeys.size) return;

  const references = new Map<string, Set<string>>();
  const inspectDocument = (document: unknown, version = false): void => {
    const label = referenceLabel(document, version);
    for (const normalized of collectDocumentMediaIDs(document).keys()) {
      if (!targetKeys.has(normalized)) continue;
      let labels = references.get(normalized);
      if (!labels) references.set(normalized, labels = new Set());
      labels.add(label);
    }
  };

  for (let page = 1; ; page += 1) {
    const result = await payload.find({
      collection: 'announcements',
      depth: 0,
      limit: PAGE_SIZE,
      overrideAccess: true,
      page,
      pagination: true,
      req,
    });
    for (const document of result.docs) inspectDocument(document);
    if (!result.hasNextPage || result.docs.length === 0) break;
  }

  for (let page = 1; ; page += 1) {
    const result = await payload.findVersions({
      collection: 'announcements',
      depth: 0,
      limit: PAGE_SIZE,
      overrideAccess: true,
      page,
      pagination: true,
      req,
    });
    for (const version of result.docs) inspectDocument(version, true);
    if (!result.hasNextPage || result.docs.length === 0) break;
  }

  const blocked = [...references.entries()];
  if (!blocked.length) return;
  const details = blocked.flatMap(([id, labels]) => [...labels].map((label) => `media ${id} is used by ${label}`));
  const shown = details.slice(0, 5).join('; ');
  const remainder = details.length > 5 ? `; and ${details.length - 5} more reference(s)` : '';
  throw new APIError(`Cannot delete media while it is referenced: ${shown}${remainder}. Remove it from the listed announcement content and retained versions first.`, 409);
}

/** Run once before a bulk delete so a referenced item cannot cause partial batch deletion. */
export async function validateMediaBulkDelete(
  payload: BasePayload,
  where: Where,
  req: PayloadRequest,
): Promise<void> {
  const targetIDs: RelationshipID[] = [];
  for (let page = 1; ; page += 1) {
    const result = await payload.find({
      collection: 'media',
      depth: 0,
      limit: PAGE_SIZE,
      overrideAccess: true,
      page,
      pagination: true,
      req,
      where,
    });
    targetIDs.push(...result.docs.map((document) => document.id));
    if (!result.hasNextPage || result.docs.length === 0) break;
  }

  await assertMediaUnreferenced(payload, targetIDs, req);
  const context = (req.context ??= {}) as Record<PropertyKey, unknown>;
  const checked = new Set(targetIDs.map(normalizeID).filter((id): id is string => id !== undefined));
  context[BULK_DELETE_PREFLIGHT] = checked;
}

/** Validates a single delete unless the same request already passed the bulk preflight. */
export async function validateMediaDelete(
  payload: BasePayload,
  id: RelationshipID,
  req: PayloadRequest,
): Promise<void> {
  const context = req.context as Record<PropertyKey, unknown> | undefined;
  const checked = context?.[BULK_DELETE_PREFLIGHT];
  const normalized = normalizeID(id);
  if (normalized && checked instanceof Set && checked.has(normalized)) return;
  await assertMediaUnreferenced(payload, [id], req);
}
