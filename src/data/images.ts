import { stableHash } from "../lib/penguins/normalize";

export type DailyArtwork = {
  src: string;
  alt: string;
  fit?: "close";
};

const ARTWORK_LIBRARY: readonly DailyArtwork[] = [
  {
    src: "/images/noots/penguin-atria copy.png",
    alt: "A watercolor penguin family reading a community board",
  },
  {
    src: "/images/noots/penguin-borrowd copy.png",
    alt: "Two watercolor penguins carrying a box together",
  },
  {
    src: "/images/noots/penguin-scalepad copy.png",
    alt: "A watercolor penguin working on a tiny laptop",
    fit: "close",
  },
  {
    src: "/images/noots/penguin-university copy.png",
    alt: "A watercolor penguin studying beneath a desk lamp",
  },
  {
    src: "/images/noots/penguin_pic-1-removebg-preview copy.png",
    alt: "A watercolor penguin sharing watermelon with a tiny friend",
  },
  {
    src: "/images/noots/penguin_pic-2-removebg-preview copy.png",
    alt: "Two illustrated penguins relaxing in a small blue pool",
  },
  {
    src: "/images/noots/penguin_pic-3-removebg-preview copy.png",
    alt: "An illustrated penguin happily sipping a drink",
    fit: "close",
  },
  {
    src: "/images/noots/penguin_pic-5-removebg-preview copy.png",
    alt: "An illustrated penguin stretching beside a cat",
    fit: "close",
  },
  {
    src: "/images/noots/penguin_pic-6-removebg-preview copy.png",
    alt: "An illustrated penguin carefully carrying apples in an apron",
    fit: "close",
  },
];

function dateToDayNumber(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const shuffled = [...items];
  let state = Number.parseInt(stableHash(seed), 36) >>> 0;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function getArtworkForDate(dateKey: string): DailyArtwork {
  const dayNumber = dateToDayNumber(dateKey);
  const dayInCycle =
    ((dayNumber % ARTWORK_CYCLE.length) + ARTWORK_CYCLE.length) %
    ARTWORK_CYCLE.length;
  return ARTWORK_CYCLE[dayInCycle];
}

const ARTWORK_CYCLE = seededShuffle(ARTWORK_LIBRARY, "daily-noot-artwork");

export const artworkCount = ARTWORK_LIBRARY.length;
