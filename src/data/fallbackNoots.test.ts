import { describe, expect, it } from "vitest";
import { FALLBACK_NOOTS, getFallbackNoot } from "./fallbackNoots";

function addDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

describe("fallback Noot cycle", () => {
  it("shows every fallback once before repeating", () => {
    const cycleStart = "2026-08-09";
    const facts = Array.from({ length: FALLBACK_NOOTS.length }, (_, index) =>
      getFallbackNoot(addDays(cycleStart, index)).id,
    );

    expect(new Set(facts)).toHaveLength(FALLBACK_NOOTS.length);
  });

  it("wraps back to the same fallback after 30 days", () => {
    const cycleStart = "2026-08-09";

    expect(getFallbackNoot(addDays(cycleStart, FALLBACK_NOOTS.length))).toEqual(
      getFallbackNoot(cycleStart),
    );
  });
});
