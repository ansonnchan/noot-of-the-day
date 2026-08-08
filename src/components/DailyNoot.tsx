import type { DailyNoot as DailyNootType } from "../lib/penguins/types";
import { Countdown } from "./Countdown";
import { PenguinPhoto } from "./PenguinPhoto";

type DailyNootProps = {
  dateKey: string;
  noot: DailyNootType;
  onNewNootAvailable: () => void;
};

function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(year, month - 1, day, 12));
}

export function DailyNoot({
  dateKey,
  noot,
  onNewNootAvailable,
}: DailyNootProps) {
  return (
    <article className="daily-noot">
      <p className="daily-noot__date">
        <time dateTime={dateKey}>{formatDateKey(dateKey)}</time>
      </p>

      <PenguinPhoto image={noot.image} species={noot.species} />

      <div className="daily-noot__words">
        {noot.species ? <p className="daily-noot__species">{noot.species}</p> : null}
        <h1 className="daily-noot__fact">{noot.fact}</h1>
        {noot.caption ? <p className="daily-noot__caption">{noot.caption}</p> : null}
        {noot.sourceUrl ? (
          <a
            className="source-link"
            href={noot.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            fact source <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>

      <Countdown
        dateKey={dateKey}
        onNewNootAvailable={onNewNootAvailable}
      />
    </article>
  );
}

