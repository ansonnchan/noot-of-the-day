export type PenguinImage = {
  url: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  license?: string;
};

export type DailyNoot = {
  id: string;
  fact: string;
  species?: string;
  sourceUrl?: string;
  caption?: string;
  image?: PenguinImage;
};

