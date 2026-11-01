import { rm, stat } from 'node:fs/promises';
import sharp from 'sharp';
import {
  APIError,
  type CollectionBeforeChangeHook,
  type CollectionBeforeOperationHook,
  type CollectionConfig,
  type PayloadRequest,
} from 'payload';
import { readCmsEnvironment } from '../environment';
import { assertCmsMutationScope } from '../mutation-gate';
import { validateMediaBulkDelete, validateMediaDelete } from '../media-references';

const MAX_UPLOAD_BYTES = 5_000_000;
const MAX_DECODED_PIXELS = 25_000_000;
const ALLOWED_FORMATS: Record<string, true> = {
  jpeg: true,
  png: true,
  webp: true,
};
const PROTECTED_UPLOAD_FIELDS = {
  _objectKey: true,
  filename: true,
  filesize: true,
  focalX: true,
  focalY: true,
  height: true,
  mimeType: true,
  prefix: true,
  sizes: true,
  thumbnailURL: true,
  url: true,
  width: true,
};
const PROTECTED_UPLOAD_FIELD_NAMES = Object.keys(PROTECTED_UPLOAD_FIELDS);

type IncomingUploadFile = {
  data?: Buffer;
  mimetype: string;
  name: string;
  size: number;
  tempFilePath?: string;
  truncated?: boolean;
};

function isAdministrator(req: PayloadRequest): boolean {
  const user = req.user;
  return Boolean(user && 'collection' in user && user.collection === 'administrators');
}

function requestFiles(req: PayloadRequest): IncomingUploadFile[] {
  const files: IncomingUploadFile[] = [];
  const visited = new Set<object>();
  const visit = (value: unknown): void => {
    if (typeof value !== 'object' || value === null) return;
    if (visited.has(value)) return;
    visited.add(value);

    if (
      'name' in value && typeof value.name === 'string' &&
      'mimetype' in value && typeof value.mimetype === 'string' &&
      'size' in value && typeof value.size === 'number'
    ) {
      files.push(value as IncomingUploadFile);
      return;
    }
    if (Array.isArray(value)) {
      for (const child of value) visit(child);
      return;
    }
    for (const child of Object.values(value)) visit(child);
  };

  if (req.files) visit(req.files);
  if (req.file) visit(req.file);
  return files;
}

function hasRemoteURL(value: unknown): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  if ('url' in value && typeof value.url === 'string' && value.url.trim()) return true;
  return '_payload' in value && hasRemoteURL(value._payload);
}

function withoutProtectedUploadFields<T>(value: T): T {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return value;
  return Object.fromEntries(Object.entries(value).filter(([field]) => !Object.hasOwn(PROTECTED_UPLOAD_FIELDS, field))) as T;
}

async function decodeAndStripMetadata(req: PayloadRequest): Promise<void> {
  const files = requestFiles(req);
  if (files.length > 1) throw new APIError('Upload one image file per request.', 413);
  if (!files.length) return;
  if (!req.file) throw new APIError('Upload the image using the standard file field.', 400);

  const file = req.file as unknown as IncomingUploadFile;
  if (file.truncated) throw new APIError('The uploaded image was truncated.', 413);
  if (!Number.isSafeInteger(file.size) || file.size < 0) {
    throw new APIError('The uploaded image has an invalid file size.', 400);
  }
  // Payload's in-memory multipart handler uses an empty temporary-file path.
  const source = file.tempFilePath || (Buffer.isBuffer(file.data) ? file.data : undefined);
  if (!source || (Buffer.isBuffer(source) && source.length === 0)) {
    throw new APIError('The uploaded image is empty or malformed.', 415);
  }

  let actualSize: number;
  try {
    actualSize = file.tempFilePath ? (await stat(file.tempFilePath)).size : file.data?.byteLength ?? 0;
  } catch {
    throw new APIError('The uploaded image could not be read.', 415);
  }
  if (actualSize > MAX_UPLOAD_BYTES || file.size > MAX_UPLOAD_BYTES) {
    throw new APIError('Images must be no larger than 5,000,000 bytes.', 413);
  }
  if (actualSize !== file.size) {
    throw new APIError('The uploaded image size does not match its contents.', 400);
  }

  let sanitizedData: Buffer;
  let sanitizedFormat: string;
  try {
    const options = { animated: true, failOn: 'truncated' as const, limitInputPixels: MAX_DECODED_PIXELS };
    const metadata = await sharp(source, options).metadata();
    const width = metadata.width;
    const height = metadata.pageHeight ?? metadata.height;
    const pages = metadata.pages ?? 1;
    if (
      !metadata.format || !ALLOWED_FORMATS[metadata.format] ||
      !Number.isSafeInteger(width) || !Number.isSafeInteger(height) ||
      !Number.isSafeInteger(pages) || !width || !height || pages < 1
    ) {
      throw new APIError('Upload a complete JPEG, PNG, or WebP image.', 415);
    }
    if (BigInt(width) * BigInt(height) * BigInt(pages) > BigInt(MAX_DECODED_PIXELS)) {
      throw new APIError('Images may not exceed 25 megapixels when decoded.', 413);
    }

    const sanitized = await sharp(source, options).rotate().toBuffer({ resolveWithObject: true });
    sanitizedData = sanitized.data;
    sanitizedFormat = sanitized.info.format;
    if (!ALLOWED_FORMATS[sanitizedFormat]) {
      throw new APIError('Upload a complete JPEG, PNG, or WebP image.', 415);
    }
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Upload a complete, decodable JPEG, PNG, or WebP image.', 415);
  }

  if (file.tempFilePath) await rm(file.tempFilePath, { force: true });
  const mimeType = sanitizedFormat === 'jpeg' ? 'image/jpeg' : `image/${sanitizedFormat}`;
  req.file = {
    ...req.file,
    data: sanitizedData,
    mimetype: mimeType,
    size: sanitizedData.length,
    tempFilePath: undefined,
  } as NonNullable<PayloadRequest['file']>;
}

const enforceMutationSafety: CollectionBeforeOperationHook<"media"> = async ({ args, operation, overrideAccess, req }) => {
  if (operation !== 'create' && operation !== 'update' && operation !== 'updateByID' && operation !== 'delete' && operation !== 'deleteByID') {
    return;
  }
  assertCmsMutationScope();

  if (operation === 'delete') {
    if (!overrideAccess && !isAdministrator(req)) throw new APIError('Forbidden', 403);
    if ('where' in args && args.where) {
      await validateMediaBulkDelete(req.payload, args.where, req);
    }
    return;
  }
  if (operation === 'deleteByID') return;

  if (operation === 'create' && (hasRemoteURL(req.data) || hasRemoteURL(args.data))) {
    throw new APIError('Remote image uploads are disabled.', 400);
  }

  if (operation === 'create') {
    // Payload stores files before field validation; reject invalid metadata before that point.
    if (!args.data || typeof args.data.alt !== "string" || !args.data.alt.trim()) {
      throw new APIError("Provide meaningful alternative text for this image.", 400);
    }
    if (args.data.caption != null && typeof args.data.caption !== "string") {
      throw new APIError("Image captions must be plain text.", 400);
    }
    await decodeAndStripMetadata(req);
  } else {
    const files = requestFiles(req);
    if (files.length) throw new APIError('Image contents are immutable; upload a new media item instead.', 409);
    if ('query' in req && req.query && typeof req.query === 'object' && 'uploadEdits' in req.query && req.query.uploadEdits) {
      throw new APIError('Image contents are immutable; upload a new media item instead.', 409);
    }
  }

  if (operation === 'create' && typeof args.data === 'object' && args.data !== null && !Array.isArray(args.data)) {
    args.data = withoutProtectedUploadFields(args.data);
  }
};

const normalizeMetadata: CollectionBeforeChangeHook = ({ data, operation, originalDoc }) => {
  const normalized = { ...data };
  if (operation === 'update' && originalDoc) {
    for (const field of PROTECTED_UPLOAD_FIELD_NAMES) {
      if (field in originalDoc) normalized[field] = originalDoc[field];
      else delete normalized[field];
    }
  }
  if (typeof normalized.alt === 'string') normalized.alt = normalized.alt.trim();
  if (typeof normalized.caption === 'string') normalized.caption = normalized.caption.trim();
  return normalized;
};


export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['filename', 'alt', 'caption', 'updatedAt'],
    useAsTitle: 'filename',
  },
  access: {
    admin: ({ req }) => isAdministrator(req),
    create: ({ req }) => isAdministrator(req),
    delete: ({ req }) => isAdministrator(req),
    read: () => true,
    update: ({ req }) => isAdministrator(req),
  },
  disableDuplicate: true,
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { components: { Label: "/src/cms/admin/media-field-label#MediaFieldLabel" } },
      validate: (value: unknown) => typeof value === 'string' && value.trim().length > 0
        ? true
        : 'Provide meaningful alternative text for this image.',
    },
    {
      name: 'caption',
      type: 'text',
      admin: { components: { Label: "/src/cms/admin/media-field-label#MediaFieldLabel" } },
    },
  ],
  hooks: {
    beforeChange: [normalizeMetadata],
    beforeDelete: [async ({ id, req }) => {
      assertCmsMutationScope();
      await validateMediaDelete(req.payload, id, req);
    }],
    beforeOperation: [enforceMutationSafety],
  },
  upload: {
    staticDir: readCmsEnvironment().uploadDir,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowRestrictedFileTypes: false,
    bulkUpload: false,
    crop: false,
    disableLocalStorage: false,
    focalPoint: false,
    hideRemoveFile: true,
    imageSizes: [
      { name: 'small', width: 480, withoutEnlargement: true },
      { name: 'medium', width: 960, withoutEnlargement: true },
      { name: 'large', width: 1600, withoutEnlargement: true },
    ],
    pasteURL: false,
    withMetadata: false,
  },
};
