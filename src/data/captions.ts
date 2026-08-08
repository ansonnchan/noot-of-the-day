import { stableHash } from "../lib/penguins/normalize";

const CAPTIONS = [
  "certified noot.",
  "just penguin things.",
  "very serious business.",
  "absolutely chilling.",
  "dressed for the occasion.",
  "professional penguin.",
  "noot noot.",
] as const;

export function captionFor(seed: string): string | undefined {
  const hash = Number.parseInt(stableHash(seed), 36);
  if (hash % 4 === 0) return undefined;
  return CAPTIONS[hash % CAPTIONS.length];
}

