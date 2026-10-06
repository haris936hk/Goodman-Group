import { render, screen, waitFor } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EnquirySection } from "./enquiry-section";

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  Element.prototype.scrollIntoView = vi.fn();
});

async function fillRequired(user: UserEvent) {
  await user.type(screen.getByLabelText(/Full name/), "Jane Partner");
  await user.type(screen.getByLabelText(/Email address/), "jane@example.com");
  await user.type(screen.getByLabelText(/^Message/), "Please discuss distribution opportunities.");
  await user.click(screen.getByRole("button", { name: /Choose a company/ }));
  await user.click(await screen.findByRole("option", { name: "Goodman Group / Not sure" }));
  await user.click(screen.getByRole("button", { name: /Select enquiry purpose/ }));
  await user.click(await screen.findByRole("option", { name: "Partnership" }));
}

describe("homepage enquiries", () => {
  it("focuses the first invalid field without sending an empty enquiry", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    const user = userEvent.setup();
    render(<EnquirySection />);
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    expect(screen.getByLabelText(/Full name/)).toHaveFocus();
    expect(screen.getByText("Please enter your name.")).toBeVisible();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("retains entered values and selections when delivery fails, then allows another attempt", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(Response.json({ ok: false, message: "Delivery unavailable" }, { status: 503 })).mockResolvedValueOnce(Response.json({ ok: true })));
    const user = userEvent.setup();
    render(<EnquirySection />);
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    expect(await screen.findByText("Delivery unavailable")).toBeVisible();
    expect(screen.getByLabelText(/Full name/)).toHaveValue("Jane Partner");
    expect(screen.getByRole("button", { name: /Goodman Group \/ Not sure/ })).toBeVisible();
    expect(screen.queryByText("Enquiry Received")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    expect(await screen.findByText("Enquiry Received")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Send another enquiry" }));
    expect(screen.getByLabelText(/Full name/)).toHaveValue("");
    expect(screen.getByRole("button", { name: /Choose a company/ })).toBeVisible();
  });

  it("requires a country for a supplied phone but permits removing the optional phone", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetcher);
    const user = userEvent.setup();
    render(<EnquirySection />);
    await fillRequired(user);
    const phone = screen.getByLabelText("Phone number without country code");
    await user.type(phone, "0336 7770770");
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    expect(screen.getByText("Please select a country code for your phone number.")).toBeVisible();
    expect(fetcher).not.toHaveBeenCalled();
    await user.clear(phone);
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));
    expect(await screen.findByText("Enquiry Received")).toBeVisible();
  });

  it("keeps a single request in flight and does not treat an invalid provider response as success", async () => {
    let resolve!: (response: Response) => void;
    const fetcher = vi.fn(() => new Promise<Response>((done) => { resolve = done; }));
    vi.stubGlobal("fetch", fetcher);
    const user = userEvent.setup();
    render(<EnquirySection />);
    await fillRequired(user);
    const send = screen.getByRole("button", { name: "Send enquiry" });
    await user.dblClick(send);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Sending enquiry..." })).toBeDisabled();
    resolve(new Response("not JSON", { status: 200 }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Send enquiry" })).toBeEnabled());
    expect(screen.queryByText("Enquiry Received")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to deliver");
  });
});
