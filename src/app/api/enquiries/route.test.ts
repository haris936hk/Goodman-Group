import { beforeEach, describe, expect, it, vi } from "vitest";
import { validateEnquiry } from "@/data/enquiry";
import { POST } from "./route";

const valid = { name: "Jane Partner", email: "jane@example.com", company: "group", enquiryType: "general", message: "Please discuss distribution opportunities.", organisation: "", phone: "", country: "", website: "" };
function request(body: unknown = valid, headers: Record<string, string> = {}) {
  return new Request("https://goodmangoc.com/api/enquiries", {
    method: "POST", headers: { "Content-Type": "application/json", Origin: "https://goodmangoc.com", "x-forwarded-for": "203.0.113.5", ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("ENQUIRY_FROM_EMAIL", "website@example.com");
  vi.stubEnv("ENQUIRY_TO_EMAIL", "team@example.com");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.com");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "redis-test-key");
  vi.stubEnv("ENQUIRY_TRUST_PROXY", "true");
  vi.stubEnv("VERCEL", "");
});

describe("enquiry input", () => {
  it("normalizes local phone numbers with a selected country", () => {
    expect(validateEnquiry({ ...valid, country: "PK", phone: "0336 7770770" }).data?.phone).toBe("+923367770770");
  });
  it("requires a country only when a phone number is present", () => {
    expect(validateEnquiry(valid).errors).toEqual({});
    expect(validateEnquiry({ ...valid, phone: "0336 7770770" }).errors.country).toBeDefined();
  });
  it.each([null, [], "text", { ...valid, organisation: 123 }, { ...valid, phone: 123 }, { ...valid, company: "unknown" }, { ...valid, enquiryType: "unknown" }, { ...valid, email: "jane@example.com\r\nBcc: evil@example.com" }, { ...valid, message: " " }, { ...valid, message: "x".repeat(5001) }, { ...valid, website: "https://spam.example.com" }])("rejects malformed or unsafe input %#", (input) => {
    expect(validateEnquiry(input).data).toBeUndefined();
  });
});

describe("POST /api/enquiries", () => {
  it("accepts only after the email provider returns a receipt", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(Response.json({ result: 1 })).mockResolvedValueOnce(Response.json({ id: "email-receipt" }));
    vi.stubGlobal("fetch", fetcher);
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });
  it.each([new Response("provider rejected", { status: 500 }), Response.json({}), Response.json({ id: " " })])("never reports success when delivery fails %#", async (delivery) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(Response.json({ result: 1 })).mockResolvedValueOnce(delivery));
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect((await response.json()).ok).toBe(false);
  });
  it("does not send email when the network rate limit is exceeded", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ result: 6 }));
    vi.stubGlobal("fetch", fetcher);
    const response = await POST(request());
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("600");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("fails closed if the rate limiter is unavailable", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("offline"));
    vi.stubGlobal("fetch", fetcher);
    expect((await POST(request())).status).toBe(502);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("rejects cross-origin requests even with a spoofed forwarded host", async () => {
    expect((await POST(request(valid, { Origin: "https://evil.example.com", "x-forwarded-host": "evil.example.com" }))).status).toBe(403);
  });
  it("rejects oversized payloads before provider calls", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    expect((await POST(request({ ...valid, message: "x".repeat(17000) }))).status).toBe(413);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("returns field errors without delivering invalid enquiries", async () => {
    const response = await POST(request({ ...valid, email: "invalid", company: "unknown" }));
    expect(response.status).toBe(400);
    expect((await response.json()).errors).toMatchObject({ email: expect.any(String), company: expect.any(String) });
  });
  it("does not claim acceptance when delivery credentials are missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await POST(request())).status).toBe(503);
  });
  it("requires explicit trust in the proxy providing client IPs", async () => {
    vi.stubEnv("ENQUIRY_TRUST_PROXY", "false");
    expect((await POST(request())).status).toBe(503);
  });
});
