import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { StringDecoder } from "node:string_decoder";

export async function promptLine(message: string): Promise<string> {
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error("Administrator commands require an interactive terminal.");
  }
  const readline = createInterface({ input: stdin, output: stdout });
  try {
    return await readline.question(message);
  } finally {
    readline.close();
  }
}

export async function promptHidden(message: string): Promise<string> {
  if (!stdin.isTTY || !stdout.isTTY || typeof stdin.setRawMode !== "function") {
    throw new Error("Administrator passwords must be entered in a hidden interactive terminal.");
  }

  const previousRawMode = stdin.isRaw;
  const decoder = new StringDecoder("utf8");
  let value = "";
  let escapeSequence: "escape" | "control" | null = null;
  stdin.setRawMode(true);
  stdout.write(message);

  const { promise, resolve, reject } = Promise.withResolvers<string>();
  const finish = (error?: Error) => {
    stdin.off("data", onData);
    stdin.off("end", onEnd);
    stdin.off("error", onError);
    stdin.setRawMode(previousRawMode);
    stdout.write("\n");
    if (error) reject(error);
    else resolve(value);
  };
  const onEnd = () => finish(new Error("Password input ended unexpectedly."));
  const onError = (error: Error) => finish(error);
  const onData = (chunk: Buffer) => {
    for (const character of decoder.write(chunk)) {
      if (escapeSequence) {
        if (escapeSequence === "escape") {
          escapeSequence = character === "[" || character === "O" ? "control" : null;
        } else if (character >= "@" && character <= "~") {
          escapeSequence = null;
        }
        continue;
      }
      if (character === "\u001b") {
        escapeSequence = "escape";
        continue;
      }
      if (character === "\u0003") {
        finish(new Error("Password entry cancelled."));
        return;
      }
      if (character === "\u0004" && value.length === 0) {
        finish(new Error("Password entry cancelled."));
        return;
      }
      if (character === "\r" || character === "\n") {
        finish();
        return;
      }
      if (character === "\u007f" || character === "\b") {
        value = Array.from(value).slice(0, -1).join("");
        continue;
      }
      if (character === "\u0015") {
        value = "";
        continue;
      }
      if (character >= " ") value += character;
    }
  };

  stdin.on("data", onData);
  stdin.once("end", onEnd);
  stdin.once("error", onError);
  stdin.resume();
  return promise;
}
