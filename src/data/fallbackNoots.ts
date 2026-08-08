import { captionFor } from "./captions";
import { getImageForSpecies } from "./images";
import { stableHash } from "../lib/penguins/normalize";
import type { DailyNoot } from "../lib/penguins/types";

const FALLBACK_NOOTS = [
  {
    fact: "Emperor penguins are the largest living species of penguin, reaching around 120cm (4ft).",
    species: "Emperor penguin",
    sourceUrl:
      "https://www.discover-the-world.com/blog/29-things-you-might-not-have-known-about-penguins/",
  },
  {
    fact: "Gentoo penguins are the fastest species – they can reach swimming speeds up to 22 mph.",
    species: "Gentoo penguin",
    sourceUrl:
      "https://www.discover-the-world.com/blog/29-things-you-might-not-have-known-about-penguins/",
  },
  {
    fact: "King penguins can form nesting colonies of up to 10,000 penguins.",
    species: "King penguin",
    sourceUrl: "https://www.factretriever.com/penguin-facts",
  },
  {
    fact: "Macaroni penguins get their name from the long, orange, yellow, and black feathery crests above their eyes.",
    species: "Macaroni penguin",
    sourceUrl: "https://www.factretriever.com/penguin-facts",
  },
  {
    fact: "Only two species, the Adélie (Pygoscelis adeliae) and the Emperor Penguins, live on the frozen land of Antarctica.",
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
