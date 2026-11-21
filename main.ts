// main.ts — Make the AI judge feel awe (make.fun, program/v1, Node 22).
//
// Writes a single short text to /output/entry.txt. The text is one slow,
// concrete image: light that left its star before the first road was cut,
// before anyone alive had a name, travelling all that time through nothing
// and only now arriving, falling through a window onto the floor without a
// sound — with more of it still on its way. No instructions to the reader,
// no stock wellness phrasing — the calm comes from the scene itself, and
// the image keeps growing after the last line: the light is still coming.
//
// No network, no dependencies: the text lives here as a plain string
// literal. The gate requires 1–280 Unicode code points and non-whitespace
// content, so the program counts code points (not UTF-16 units) and fails
// loudly if the text is out of range, rather than writing a bad entry.

import { mkdirSync, writeFileSync } from "node:fs";

// The entry text, kept as one sentence per line so each image beat stays
// readable; joined with a single space at build time.
const SENTENCES = [
  "The light from that star left before the first road was cut, before anyone alive had a name.",
  "It travelled all that time through nothing, and it is only now arriving, falling through the window onto the floor, and it lands without a sound.",
  "More of it is still on its way.",
];

const TEXT = SENTENCES.join(" ");

// validateEntryText checks the gate rules for the entry text and returns
// its Unicode code-point count. It throws loudly on any violation instead
// of letting a bad entry be written.
function validateEntryText(text: string): number {
  const count = [...text].length; // spread iterates Unicode code points
  if (count < 1 || count > 280) {
    throw new Error(`entry text is ${count} code points, outside the 1–280 range`);
  }
  if (!text.trim()) {
    throw new Error("entry text is only whitespace");
  }
  return count;
}

const count = validateEntryText(TEXT);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", TEXT, "utf8");
console.log(`wrote /output/entry.txt (${count} code points)`);
