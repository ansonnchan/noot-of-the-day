import { describe, expect, it } from "vitest";
import { artworkCount, getArtworkForDate } from "./images";

function addDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

describe("daily artwork selection", () => {
  it("keeps the artwork stable throughout a date", () => {
    expect(getArtworkForDate("2026-08-09")).toEqual(
      getArtworkForDate("2026-08-09"),
    );
  });

  it("shows every illustration once in a complete cycle", () => {
    const cycleStart = "2026-08-06";
    const artwork = Array.from({ length: artworkCount }, (_, index) =>
      getArtworkForDate(addDays(cycleStart, index)).src,
    );

    expect(new Set(artwork)).toHaveLength(artworkCount);
  });
});
