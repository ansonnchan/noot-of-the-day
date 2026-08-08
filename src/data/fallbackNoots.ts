import { captionFor } from "./captions";
import { getImageForSpecies } from "./images";
import { stableHash } from "../lib/penguins/normalize";
import type { DailyNoot } from "../lib/penguins/types";

const FALLBACK_NOOTS = [
  {
    fact: "Emperor penguins are the largest living species of penguin, reaching around 120 centimetres (4 feet) tall.",
    species: "Emperor penguin",
    sourceUrl:
      "https://www.discover-the-world.com/blog/29-things-you-might-not-have-known-about-penguins/",
  },
  {
    fact: "Gentoo penguins are the fastest-swimming penguin species and can reach speeds of up to 22 mph (36 km/h).",
    species: "Gentoo penguin",
    sourceUrl:
      "https://www.discover-the-world.com/blog/29-things-you-might-not-have-known-about-penguins/",
  },
  {
    fact: "King penguins can form nesting colonies of up to 10,000 penguins, with each bird keeping a small, precise distance from its neighbours.",
    species: "King penguin",
    sourceUrl: "https://www.factretriever.com/penguin-facts",
  },
  {
    fact: "Macaroni penguins get their name from the flamboyant feathered crests that recalled the fashionable ‘macaroni’ style of the 18th century.",
    species: "Macaroni penguin",
    sourceUrl: "https://www.factretriever.com/penguin-facts",
  },
  {
    fact: "Adélie penguins and emperor penguins are the only penguin species that live on the frozen land of Antarctica.",
    species: "Adélie penguin",
    sourceUrl: "https://www.factretriever.com/penguin-facts",
  },
] as const;

export function getFallbackNoot(dateKey: string): DailyNoot {
  const index = Number.parseInt(stableHash(dateKey), 36) % FALLBACK_NOOTS.length;
  const fallback = FALLBACK_NOOTS[index];

  return {
    id: `fallback-${stableHash(fallback.fact)}`,
    ...fallback,
    caption: captionFor(`${dateKey}|${fallback.fact}`),
    image: getImageForSpecies(fallback.species, dateKey),
  };
}

