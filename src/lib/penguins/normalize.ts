import type { DailyNoot } from "./types";

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
    sourceUrl,
  };
}
