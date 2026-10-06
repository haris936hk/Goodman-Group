import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { NextResponse } from "next/server";
import { goodmanGroup } from "@/data/goodman-group";
import { validateEnquiry } from "@/data/enquiry";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16 * 1024;
const WINDOW_SECONDS = 600;
const RATE_SCRIPT = `local count = redis.call('INCR', KEYS[1])
if count == 1 or redis.call('TTL', KEYS[1]) < 0 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return count`;
const unavailable = `Unable to send your enquiry right now. Please try again later or email ${goodmanGroup.contacts.email}.`;

function failure(message: string, status: number, errors?: Record<string, string>) {
  return NextResponse.json({ ok: false, message, ...(errors ? { errors } : {}) }, { status });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return failure("Please send your enquiry from our website.", 403);
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return failure("Please send a valid enquiry.", 415);
  }
  if (!request.body) return failure("Please complete the enquiry form.", 400);

  const reader = request.body.getReader();
  // A fixed buffer bounds memory even when Content-Length is missing or false.
  const bytes = new Uint8Array(MAX_BODY_BYTES);
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (size + value.byteLength > MAX_BODY_BYTES) {
        await reader.cancel();
        return failure("Your enquiry is too long. Please shorten your message.", 413);
      }
      bytes.set(value, size);
      size += value.byteLength;
    }
  } catch {
    return failure("Your enquiry could not be read. Please try again.", 400);
  } finally {
    reader.releaseLock();
  }

  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, size)));
  } catch {
    return failure("Please send a valid enquiry.", 400);
  }
  const { data, errors } = validateEnquiry(payload);
  if (!data) return failure("Please check the highlighted fields.", 400, errors);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const onVercel = process.env.VERCEL === "1";
  const trustsProxy = onVercel || process.env.ENQUIRY_TRUST_PROXY === "true";
  const clientIp = (onVercel
    ? request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")
    : request.headers.get("x-forwarded-for"))?.split(",")[0].trim();
  if (!apiKey || !from || !to || !redisUrl || !redisToken || !trustsProxy || !clientIp || !isIP(clientIp)) {
    return failure(unavailable, 503);
  }

  try {
    const limiter = await fetch(redisUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", RATE_SCRIPT, "1", `enquiry:rl:${createHash("sha256").update(clientIp).digest("hex")}`, String(WINDOW_SECONDS)]),
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    if (!limiter.ok) return failure(unavailable, 502);
    const limit: unknown = await limiter.json();
    if (!limit || typeof limit !== "object" || !("result" in limit) ||
      !Number.isSafeInteger(limit.result) || typeof limit.result !== "number" || limit.result < 1) {
      return failure(unavailable, 502);
    }
    if (limit.result > 5) {
      return NextResponse.json({ ok: false, message: "You’ve sent several enquiries. Please wait 10 minutes before trying again." }, {
        status: 429, headers: { "Retry-After": String(WINDOW_SECONDS) },
      });
    }

    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: data.email,
        subject: `[Goodman Group Enquiry] ${data.enquiryTypeLabel}`,
        text: [
          `Name: ${data.name}`, `Email: ${data.email}`,
          `Organisation: ${data.organisation || "Not provided"}`,
          `Company: ${data.companyLabel}`, `Enquiry type: ${data.enquiryTypeLabel}`,
          `Phone: ${data.phone || "Not provided"}`, `Country: ${data.country || "Not provided"}`,
          "", "Message:", data.message,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!delivery.ok) return failure(unavailable, 502);
    const receipt: unknown = await delivery.json();
    if (!receipt || typeof receipt !== "object" || !("id" in receipt) ||
      typeof receipt.id !== "string" || !receipt.id.trim()) {
      return failure(unavailable, 502);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return failure(unavailable, 502);
  }
}
