import { captionFor } from "../../data/captions";
import { getFallbackNoot } from "../../data/fallbackNoots";
import { getImageForSpecies } from "../../data/images";
import { normalizeBoatmanResponse } from "./normalize";
import type { DailyNoot } from "./types";

export async function getDailyNoot(
  dateKey: string,
  fetcher: typeof fetch = fetch,
): Promise<DailyNoot> {
  try {
    const response = await fetcher("/api/noot", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Penguin provider unavailable");

    const normalized = normalizeBoatmanResponse(await response.json());
    if (!normalized) throw new Error("Unexpected penguin response");

    return {
      ...normalized,
      caption: captionFor(`${dateKey}|${normalized.id}`),
      image: getImageForSpecies(normalized.species, normalized.id),
    };
  } catch {
    return getFallbackNoot(dateKey);
  }
}

