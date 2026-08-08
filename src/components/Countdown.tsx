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
    <section className="countdown" aria-label="Time until the next Noot">
      <PenguinMascot state="sleeping" className="countdown__mascot" />
      <div className="countdown__copy">
        <p>next noot in</p>
        <time className="countdown__time" role="timer">
          {formatCountdown(remaining)}
        </time>
        <span>see you tomorrow.</span>
      </div>
    </section>
  );
}

