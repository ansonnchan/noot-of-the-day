import type { DailyNoot } from "../penguins/types";

export const STORAGE_KEY = "noot.daily";

export type StoredNoot = {
  date: string;
  noot: DailyNoot;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeWebUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value, windowOrigin());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function windowOrigin(): string {
  return typeof window === "undefined" ? "https://noot.local" : window.location.origin;
}

function isDailyNoot(value: unknown): value is DailyNoot {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.fact === "string" &&
    value.fact.length > 0 &&
    (value.species === undefined || typeof value.species === "string") &&
    (value.sourceUrl === undefined || isSafeWebUrl(value.sourceUrl))
  );
}

export function readStoredNoot(
  storage: StorageLike,
  currentDateKey: string,
): DailyNoot | null {
  try {
    const serialized = storage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    const value: unknown = JSON.parse(serialized);
    if (
      !isRecord(value) ||
      value.date !== currentDateKey ||
      !isDailyNoot(value.noot)
    ) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }

    return value.noot;
  } catch {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // A privacy-restricted store is treated like an empty store.
    }
    return null;
  }
}

export function writeStoredNoot(
  storage: StorageLike,
  date: string,
  noot: DailyNoot,
): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ date, noot } satisfies StoredNoot));
    return true;
  } catch {
    return false;
  }
}
