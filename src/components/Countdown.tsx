import { useEffect, useRef, useState } from "react";
import {
  formatCountdown,
  getLocalDateKey,
  getMillisecondsUntilNextNoot,
} from "../lib/daily/date";
import { PenguinMascot } from "./PenguinMascot";

type CountdownProps = {
  dateKey: string;
  onNewNootAvailable: () => void;
};

export function Countdown({ dateKey, onNewNootAvailable }: CountdownProps) {
  const [remaining, setRemaining] = useState(() =>
    getMillisecondsUntilNextNoot(),
  );
  const hasAnnounced = useRef(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const nextRemaining = getMillisecondsUntilNextNoot(now);
      setRemaining(nextRemaining);

      if (getLocalDateKey(now) !== dateKey && !hasAnnounced.current) {
        hasAnnounced.current = true;
        onNewNootAvailable();
      }
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [dateKey, onNewNootAvailable]);

  return (
    <section className="waiting" aria-labelledby="waiting-title">
      <span className="waiting__sleep" aria-hidden="true">
        zzz
      </span>
      <PenguinMascot state="sleeping" />
      <h1 id="waiting-title">uh oh... that’s it.</h1>
      <p className="waiting__message">today’s noot is all nooted out.</p>
      <div className="waiting__countdown" aria-label="Time until the next Noot">
        <p>next noot in</p>
        <time role="timer">{formatCountdown(remaining)}</time>
      </div>
      <p className="waiting__tomorrow">see you tomorrow.</p>
    </section>
  );
}
