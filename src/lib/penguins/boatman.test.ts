import { describe, expect, it } from "vitest";
import { getFallbackNoot } from "../../data/fallbackNoots";
import { getDailyNoot } from "./boatman";

describe("daily Noot resolution", () => {
  it("decorates a normalized Boatman fact", async () => {
    const fetcher = async () =>
      new Response(
        JSON.stringify({
          success: true,
          fact: {
            fact: "Gentoo penguins can reach swimming speeds up to 22 mph.",
            source: "https://example.org/gentoo",
          },
        }),
        { status: 200 },
      );

    const noot = await getDailyNoot("2026-08-08", fetcher as typeof fetch);

    expect(noot.id).toMatch(/^boatman-/);
    expect(noot.species).toBe("Gentoo penguin");
    expect(noot).not.toHaveProperty("image");
  });

  it("uses a stable local fallback when Boatman is unavailable", async () => {
    const fetcher = async () => new Response(null, { status: 502 });

    await expect(
      getDailyNoot("2026-08-08", fetcher as typeof fetch),
    ).resolves.toEqual(getFallbackNoot("2026-08-08"));
  });
});
