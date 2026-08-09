import { stableHash } from "../lib/penguins/normalize";
import type { DailyNoot } from "../lib/penguins/types";

const ANTARCTIC_PROGRAM_SOURCE =
  "https://www.antarctica.gov.au/about-antarctica/animals/penguins/";
const SMITHSONIAN_SOURCE =
  "https://ocean.si.edu/ocean-life/seabirds/penguins";
const SAN_DIEGO_ZOO_SOURCE =
  "https://animals.sandiegozoo.org/animals/penguin";
const NEW_ZEALAND_DOC_SOURCE =
  "https://www.doc.govt.nz/nature/native-animals/birds/birds-a-z/";

export const FALLBACK_NOOTS: readonly Omit<DailyNoot, "id">[] = [
  {
    fact: "Emperor penguins are the largest living penguins, reaching around 120 cm (4 ft) tall.",
    sourceUrl: ANTARCTIC_PROGRAM_SOURCE,
  },
  {
    fact: "Gentoo penguins can swim at speeds of about 36 km/h (22 mph).",
    sourceUrl: ANTARCTIC_PROGRAM_SOURCE,
  },
  {
    fact: "Penguins are flightless seabirds whose bodies are specially adapted for life in the water.",
    sourceUrl: SMITHSONIAN_SOURCE,
  },
  {
    fact: "A penguin's wings have evolved into stiff flippers that propel it through the ocean.",
    sourceUrl: SMITHSONIAN_SOURCE,
  },
  {
    fact: "A penguin's dark back and pale belly provide countershading that helps conceal it in the sea.",
    sourceUrl: SAN_DIEGO_ZOO_SOURCE,
  },
  {
    fact: "Penguins eat marine prey such as fish, krill, and squid.",
    sourceUrl: SMITHSONIAN_SOURCE,
  },
  {
    fact: "Penguins have glands above their eyes that help remove excess salt from their bodies.",
    sourceUrl: SAN_DIEGO_ZOO_SOURCE,
  },
  {
    fact: "Penguin bones are denser than those of many flying birds, which helps reduce buoyancy while diving.",
    sourceUrl: SMITHSONIAN_SOURCE,
  },
  {
    fact: "Overlapping feathers trap insulating air and help keep a penguin warm in cold water.",
    sourceUrl: ANTARCTIC_PROGRAM_SOURCE,
  },
  {
    fact: "Penguins replace all their feathers during an annual molt and must remain ashore until the new coat is ready.",
    sourceUrl: SMITHSONIAN_SOURCE,
  },
  {
    fact: "Male emperor penguins balance a single egg on their feet beneath a warm fold of skin.",
    sourceUrl: ANTARCTIC_PROGRAM_SOURCE,
  },
  {
    fact: "Emperor penguins can dive deeper than 500 m (1,640 ft) while searching for food.",
    sourceUrl: ANTARCTIC_PROGRAM_SOURCE,
  },
  {
    fact: "King penguins do not build nests; they incubate their egg on top of their feet.",
    sourceUrl: ANTARCTIC_PROGRAM_SOURCE,
  },
  {
    fact: "Adélie penguins build simple nests from small stones.",
    sourceUrl: ANTARCTIC_PROGRAM_SOURCE,
  },
  {
    fact: "Chinstrap penguins are named for the narrow black band beneath their heads.",
    sourceUrl: ANTARCTIC_PROGRAM_SOURCE,
  },
  {
    fact: "Gentoo penguins are easy to recognize by the white stripe that runs across the top of the head.",
    sourceUrl: ANTARCTIC_PROGRAM_SOURCE,
  },
  {
    fact: "Macaroni penguins have long golden-orange crest feathers above their eyes.",
    sourceUrl: SAN_DIEGO_ZOO_SOURCE,
  },
  {
    fact: "Rockhopper penguins move across steep, rocky ground by hopping with both feet together.",
    sourceUrl: SAN_DIEGO_ZOO_SOURCE,
  },
  {
    fact: "African penguins live along the coasts of South Africa and Namibia.",
    sourceUrl: SAN_DIEGO_ZOO_SOURCE,
  },
  {
    fact: "Galápagos penguins are the only penguin species regularly found north of the equator.",
    sourceUrl: SAN_DIEGO_ZOO_SOURCE,
  },
  {
    fact: "Humboldt penguins live along the Pacific coasts of Peru and Chile.",
    sourceUrl: SAN_DIEGO_ZOO_SOURCE,
  },
  {
    fact: "Magellanic penguins often nest in burrows along the coasts of southern South America.",
    sourceUrl: SAN_DIEGO_ZOO_SOURCE,
  },
  {
    fact: "Little penguins are the smallest penguin species and stand only about 30 cm (12 in) tall.",
    sourceUrl: NEW_ZEALAND_DOC_SOURCE,
  },
  {
    fact: "Yellow-eyed penguins have a pale yellow band of feathers that runs behind their eyes.",
    sourceUrl: NEW_ZEALAND_DOC_SOURCE,
  },
  {
    fact: "Fiordland penguins breed along New Zealand's southwest coast and on nearby islands.",
    sourceUrl: NEW_ZEALAND_DOC_SOURCE,
  },
  {
    fact: "Snares penguins breed only on New Zealand's remote Snares Islands.",
    sourceUrl: NEW_ZEALAND_DOC_SOURCE,
  },
  {
    fact: "In crowded colonies, penguins use distinctive calls to recognize their partners and chicks.",
    sourceUrl: SMITHSONIAN_SOURCE,
  },
  {
    fact: "Penguins cannot breathe underwater, so even the deepest-diving species must return to the surface for air.",
    sourceUrl: SMITHSONIAN_SOURCE,
  },
  {
    fact: "A penguin's streamlined body reduces drag as it moves through the water.",
    sourceUrl: SMITHSONIAN_SOURCE,
  },
  {
    fact: "Penguins use oil from a gland near the tail while preening their feathers.",
    sourceUrl: SAN_DIEGO_ZOO_SOURCE,
  },
];

export function getFallbackNoot(dateKey: string): DailyNoot {
  const index = Number.parseInt(stableHash(dateKey), 36) % FALLBACK_NOOTS.length;
  const fallback = FALLBACK_NOOTS[index];

  return {
    id: `fallback-${stableHash(fallback.fact)}`,
    ...fallback,
  };
}
