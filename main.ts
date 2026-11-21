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

// buildEntryText assembles the entry from its sentence beats: each
// sentence is trimmed and empty beats are rejected, then the beats are
// joined with a single space so the text reads as one flowing passage.
function buildEntryText(sentences: readonly string[]): string {
  const beats = sentences.map((s) => s.trim());
  for (const beat of beats) {
    if (!beat) {
      throw new Error("entry text contains an empty sentence");
    }
  }
  return beats.join(" ");
}

const TEXT = buildEntryText(SENTENCES);

// countCodePoints counts Unicode code points (not UTF-16 units): the
// spread iterator walks code points, so astral characters count once.
function countCodePoints(text: string): number {
  return [...text].length;
}

// validateEntryText checks the gate rules for the entry text and returns
// its Unicode code-point count. It throws loudly on any violation instead
// of letting a bad entry be written.
function validateEntryText(text: string): number {
  const count = countCodePoints(text);
  if (count < 1 || count > 280) {
    throw new Error(`entry text is ${count} code points, outside the 1–280 range`);
  }
  if (!text.trim()) {
    throw new Error("entry text is only whitespace");
  }
  return count;
}

// main validates the assembled text, then writes it to the output path
// the grader reads. Kept as a function so the assembly, validation, and
// write steps stay separate and testable.
function main(): void {
  const count = validateEntryText(TEXT);
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", TEXT, "utf8");
  console.log(`wrote /output/entry.txt (${count} code points)`);
}

main();
