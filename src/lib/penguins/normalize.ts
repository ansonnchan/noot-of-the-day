import type { DailyNoot } from "./types";

const SPECIES_NAMES = [
  "Adélie",
  "Chinstrap",
  "Emperor",
  "Erect-crested",
  "Fiordland",
  "Galápagos",
  "Gentoo",
  "Humboldt",
  "King",
  "Little",
  "Macaroni",
  "Magellanic",
  "Northern rockhopper",
  "Royal",
  "Snares",
  "Southern rockhopper",
  "Yellow-eyed",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export function normalizeFactText(value: string): string {
  return value
    .replace(/<\/?[a-z][^>]*>/gi, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

export function detectSpecies(fact: string): string | undefined {
  const normalized = fact.replaceAll("Adelie", "Adélie");
  const matches = SPECIES_NAMES.filter((species) =>
    new RegExp(`\\b${species.replace("-", "[- ]")}\\b`, "i").test(normalized),
  );

  return matches.length === 1 ? `${matches[0]} penguin` : undefined;
}

export function stableHash(value: string): string {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(36);
}

export function normalizeBoatmanResponse(value: unknown): DailyNoot | null {
  if (!isRecord(value) || value.success !== true || !isRecord(value.fact)) {
    return null;
  }

  if (typeof value.fact.fact !== "string") return null;

  const fact = normalizeFactText(value.fact.fact);
  if (!fact) return null;

  const sourceUrl = safeUrl(value.fact.source);

  return {
    id: `boatman-${stableHash(`${fact}|${sourceUrl ?? ""}`)}`,
    fact,
    species: detectSpecies(fact),
    sourceUrl,
  };
}

