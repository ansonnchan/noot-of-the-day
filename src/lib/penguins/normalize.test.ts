import { describe, expect, it } from "vitest";
import {
  normalizeBoatmanResponse,
  normalizeFactText,
} from "./normalize";

describe("Boatman response normalization", () => {
  it("normalizes the live controller response shape", () => {
    expect(
      normalizeBoatmanResponse({
        success: true,
        fact: {
          fact: "  Gentoo penguins  can swim quickly . ",
          source: "https://example.org/penguins",
        },
      }),
    ).toMatchObject({
      fact: "Gentoo penguins can swim quickly.",
      sourceUrl: "https://example.org/penguins",
    });
  });

  it("does not accept the stale README response shape", () => {
    expect(normalizeBoatmanResponse({ success: true, data: {} })).toBeNull();
  });

  it("removes simple surrounding markup and unsafe source URLs", () => {
    expect(normalizeFactText("<p>Penguins are birds.</p>")).toBe(
      "Penguins are birds.",
    );
    expect(
      normalizeBoatmanResponse({
        success: true,
        fact: { fact: "Penguins are birds.", source: "javascript:alert(1)" },
      })?.sourceUrl,
    ).toBeUndefined();
  });
});
