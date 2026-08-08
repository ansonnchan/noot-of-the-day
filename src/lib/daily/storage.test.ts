import { describe, expect, it } from "vitest";
import type { DailyNoot } from "../penguins/types";
import {
  readStoredNoot,
  STORAGE_KEY,
  type StorageLike,
  writeStoredNoot,
} from "./storage";

class MemoryStorage implements StorageLike {
  values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

const noot: DailyNoot = {
  id: "gentoo-1",
  fact: "Gentoo penguins can swim very quickly.",
  species: "Gentoo penguin",
};

describe("daily noot storage", () => {
  it("persists and restores the current noot", () => {
    const storage = new MemoryStorage();
    expect(writeStoredNoot(storage, "2026-08-08", noot)).toBe(true);
    expect(readStoredNoot(storage, "2026-08-08")).toEqual(noot);
  });

  it("expires a noot from another local date", () => {
    const storage = new MemoryStorage();
    writeStoredNoot(storage, "2026-08-07", noot);

    expect(readStoredNoot(storage, "2026-08-08")).toBeNull();
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("discards malformed storage without throwing", () => {
    const storage = new MemoryStorage();
    storage.setItem(STORAGE_KEY, "{not-json");

    expect(readStoredNoot(storage, "2026-08-08")).toBeNull();
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("rejects incomplete noot data", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: "2026-08-08", noot: { id: "empty" } }),
    );

    expect(readStoredNoot(storage, "2026-08-08")).toBeNull();
  });
});

