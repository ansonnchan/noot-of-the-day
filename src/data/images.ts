import { stableHash } from "../lib/penguins/normalize";
import type { PenguinImage } from "../lib/penguins/types";

const IMAGE_LIBRARY: Record<string, PenguinImage> = {
  "Adélie penguin": {
    url: "/images/noots/adelie-penguins.jpg",
    alt: "Adélie penguins standing together on an iceberg",
    credit: "Jason Auch / Wikimedia Commons",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Adelie_Penguins_on_iceberg.jpg",
    license: "CC BY 2.0",
  },
  "Emperor penguin": {
    url: "/images/noots/emperor-penguin.jpg",
    alt: "An emperor penguin standing on Antarctic ice",
    credit: "Michael Van Woert / NOAA",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Emperor_penguin.jpg",
    license: "Public domain",
  },
  "Gentoo penguin": {
    url: "/images/noots/gentoo-penguin.jpg",
    alt: "A gentoo penguin standing on a rocky Antarctic shore",
    credit: "Godot13 / Wikimedia Commons",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Brown_Bluff-2016-Tabarin_Peninsula%E2%80%93Gentoo_penguin_(Pygoscelis_papua)_02.jpg",
    license: "CC BY-SA 4.0",
  },
  "King penguin": {
    url: "/images/noots/king-penguin.jpg",
    alt: "A king penguin with orange markings along its neck",
    credit: "Isiwal / Wikimedia Commons",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:King_penguin_Aptenodytes_patagonicus-4932.jpg",
    license: "CC BY-SA 4.0",
  },
  "Macaroni penguin": {
    url: "/images/noots/macaroni-penguin.jpg",
    alt: "A macaroni penguin with a bright yellow crest",
    credit: "Mmreow / Wikimedia Commons",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Macaroni_Penguin_(Eudyptes_chrysolophus)6.jpg",
    license: "Public domain",
  },
};

const GENERIC_IMAGES = Object.values(IMAGE_LIBRARY);

export function getImageForSpecies(
  species: string | undefined,
  seed: string,
): PenguinImage {
  if (species && IMAGE_LIBRARY[species]) return IMAGE_LIBRARY[species];

  const index = Number.parseInt(stableHash(seed), 36) % GENERIC_IMAGES.length;
  return GENERIC_IMAGES[index];
}

