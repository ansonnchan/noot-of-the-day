import { getArtworkForDate } from "../data/images";

type DailyArtworkProps = {
  dateKey: string;
};

export function DailyArtwork({ dateKey }: DailyArtworkProps) {
  const artwork = getArtworkForDate(dateKey);

  return (
    <figure
      className={`daily-artwork${artwork.fit ? ` daily-artwork--${artwork.fit}` : ""}`}
    >
      <img
        src={artwork.src}
        alt={artwork.alt}
        width="600"
        height="500"
        fetchPriority="high"
        draggable={false}
      />
    </figure>
  );
}
