import type { DailyNoot as DailyNootType } from "../lib/penguins/types";
import { DailyArtwork } from "./DailyArtwork";

type DailyNootProps = {
  dateKey: string;
  noot: DailyNootType;
  onWantAnother: () => void;
};

function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day, 12));
}

export function DailyNoot({
  dateKey,
  noot,
  onWantAnother,
}: DailyNootProps) {
  return (
    <article className="daily-noot">
      <p className="daily-noot__date">
        <time dateTime={dateKey}>{formatDateKey(dateKey)}</time>
      </p>

      <DailyArtwork dateKey={dateKey} />

      <div className="daily-noot__words">
        <h1 className="daily-noot__fact">
          <span>Did you know…</span> {noot.fact}
        </h1>
      </div>

      <button
        className="reveal-button daily-noot__cta"
        type="button"
        onClick={onWantAnother}
      >
        one more noot? <span aria-hidden="true">→</span>
      </button>
    </article>
  );
}
