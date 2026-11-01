// @vitest-environment node
import { stdin, stdout } from "node:process";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { promptHidden, promptLine } from "./administrator-prompts";

vi.mock("node:process", async () => {
  // The mock factory runs before static imports; load streams within this module boundary.
  const { PassThrough } = await import("node:stream");
  class InputTerminal extends PassThrough {
    isTTY = true;
    isRaw = false;
    setRawMode(value: boolean) { this.isRaw = value; return this; }
  }
  const output = new PassThrough();
  Object.defineProperty(output, "isTTY", { value: true, configurable: true });
  return { stdin: new InputTerminal(), stdout: output };
});

let output = "";
beforeEach(() => {
  output = "";
  Object.defineProperty(stdin, "isTTY", { value: true, configurable: true });
  stdin.setRawMode(false);
  stdout.removeAllListeners("data");
  stdout.on("data", (chunk) => { output += chunk.toString(); });
});

describe("hidden password terminal input", () => {
  it("handles split UTF-8, correction and line clearing without echoing credentials", async () => {
    const pending = promptHidden("Password: ");
    const bytes = Buffer.from("discard\u0015sëcret\u007ft\r");
    for (const byte of bytes) stdin.emit("data", Buffer.from([byte]));
    expect(await pending).toBe("sëcret");
    expect(output).not.toContain("discard");
    expect(output).not.toContain("sëcret");
    expect(stdin.isRaw).toBe(false);
  });

  it("does not turn arrow keys or bracketed-paste delimiters into password characters", async () => {
    const pending = promptHidden("Password: ");
    stdin.emit("data", Buffer.from("abc\u001b[Ddef\u001b[200~ghi\u001b[201~\r"));
    expect(await pending).toBe("abcdefghi");
    expect(output).not.toContain("abcdefghi");
  });

  it("cancels without leaving credentials or raw terminal state in the next prompt", async () => {
    const cancelled = promptHidden("Password: ");
    const rejection = expect(cancelled).rejects.toThrow();
    stdin.emit("data", Buffer.from("abandoned\u0003"));
    await rejection;
    expect(stdin.isRaw).toBe(false);
    const next = promptHidden("Replacement: ");
    stdin.emit("data", Buffer.from("replacement\n"));
    expect(await next).toBe("replacement");
    expect(output).not.toContain("abandoned");
    expect(output).not.toContain("replacement");
  });

  it("rejects closed and failed input while restoring the terminal", async () => {
    const ended = promptHidden("Password: ");
    const endRejection = expect(ended).rejects.toThrow();
    stdin.emit("end");
    await endRejection;
    expect(stdin.isRaw).toBe(false);
    const failed = promptHidden("Password: ");
    const errorRejection = expect(failed).rejects.toThrow();
    stdin.emit("error", new Error("terminal disconnected"));
    await errorRejection;
    expect(stdin.isRaw).toBe(false);
  });

  it("treats empty EOF as cancellation, not as an empty password", async () => {
    const pending = promptHidden("Password: ");
    const rejection = expect(pending).rejects.toThrow();
    stdin.emit("data", Buffer.from("\u0004"));
    await rejection;
    expect(stdin.isRaw).toBe(false);
  });

  it("refuses noninteractive credential entry", async () => {
    Object.defineProperty(stdin, "isTTY", { value: false, configurable: true });
    await expect(promptHidden("Password: ")).rejects.toThrow();
    await expect(promptLine("Email: ")).rejects.toThrow();
  });
});
