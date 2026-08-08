import { describe, expect, it } from "vitest";
import {
  formatCountdown,
  getLocalDateKey,
  getMillisecondsUntilNextNoot,
  getNextLocalMidnight,
} from "./date";

describe("local daily date helpers", () => {
  it("builds a stable key from local calendar fields", () => {
    expect(getLocalDateKey(new Date(2026, 0, 7, 23, 58))).toBe("2026-01-07");
  });

  it("calculates the next local midnight", () => {
    const now = new Date(2026, 7, 8, 23, 59, 59, 500);
    const midnight = getNextLocalMidnight(now);

    expect(midnight.getFullYear()).toBe(2026);
    expect(midnight.getMonth()).toBe(7);
    expect(midnight.getDate()).toBe(9);
    expect(midnight.getHours()).toBe(0);
    expect(getMillisecondsUntilNextNoot(now)).toBe(500);
  });

  it("formats a compact clock", () => {
    expect(formatCountdown(31_337_000)).toBe("08:42:17");
    expect(formatCountdown(-1)).toBe("00:00:00");
  });
});

