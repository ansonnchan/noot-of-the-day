import { useCallback, useEffect, useRef, useState } from "react";
import { DailyNoot } from "./components/DailyNoot";
import { Countdown } from "./components/Countdown";
import { NootReveal } from "./components/NootReveal";
import { getLocalDateKey } from "./lib/daily/date";
import {
  readStoredNoot,
  writeStoredNoot,
  type StorageLike,
} from "./lib/daily/storage";
import { getDailyNoot } from "./lib/penguins/boatman";
import type { DailyNoot as DailyNootType } from "./lib/penguins/types";

type View =
  | "landing"
  | "arrived"
  | "loading"
  | "noot"
  | "waiting"
  | "error";

function getLocalStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const initialDateKey = getLocalDateKey();
const initialStorage = getLocalStorage();
const initialNoot = initialStorage
  ? readStoredNoot(initialStorage, initialDateKey)
  : null;

export function App() {
  const requestId = useRef(0);
  const [dateKey, setDateKey] = useState(initialDateKey);
  const [noot, setNoot] = useState<DailyNootType | null>(initialNoot);
  const [view, setView] = useState<View>(
    initialNoot ? "noot" : "landing",
  );
  const [aboutOpen, setAboutOpen] = useState(false);

  const revealNoot = useCallback(async () => {
    if (noot && dateKey === getLocalDateKey()) {
      setView("noot");
      return;
    }

    const activeRequest = ++requestId.current;
    setView("loading");

    try {
      const dailyNoot = await getDailyNoot(dateKey);
      const storage = getLocalStorage();
      if (storage) writeStoredNoot(storage, dateKey, dailyNoot);
      if (activeRequest !== requestId.current) return;
      setNoot(dailyNoot);
      setView("noot");
    } catch {
      if (activeRequest !== requestId.current) return;
      setView("error");
    }
  }, [dateKey, noot]);

  const handleBack = useCallback(() => {
    requestId.current += 1;
    setAboutOpen(false);
    setView((current) => (current === "waiting" ? "noot" : "landing"));
  }, []);

  const handleNewNootAvailable = useCallback(() => {
    requestId.current += 1;
    const nextDateKey = getLocalDateKey();
    const storage = getLocalStorage();
    if (storage) readStoredNoot(storage, nextDateKey);
    setDateKey(nextDateKey);
    setNoot(null);
    setView("arrived");
  }, []);

  useEffect(() => {
    const checkDate = () => {
      if (getLocalDateKey() !== dateKey) handleNewNootAvailable();
    };

    const interval = window.setInterval(checkDate, 1000);
    return () => window.clearInterval(interval);
  }, [dateKey, handleNewNootAvailable]);

  const hasBackButton = view === "noot" || view === "waiting";

  return (
    <div className={`site-shell site-shell--${view}`}>
      <header className="site-header">
        {hasBackButton ? (
          <button
            className="back-button"
            type="button"
            aria-label={view === "waiting" ? "Back to today's Noot" : "Home"}
            onClick={handleBack}
          >
            <span aria-hidden="true">←</span>
          </button>
        ) : (
          <span />
        )}
        <button
          className="about-button"
          type="button"
          aria-expanded={aboutOpen}
          aria-controls="about-note"
          onClick={() => setAboutOpen((open) => !open)}
        >
          about
        </button>
      </header>

      {aboutOpen ? (
        <aside className="about-note" id="about-note">
          <p>
            Noot of the Day serves one penguin fact each day. Facts provided by
            the Boatman Penguin API.
          </p>
          <div className="about-note__links">
            <a
              href="https://github.com/boatman-27/SaaS_Penguin_API"
              target="_blank"
              rel="noreferrer"
            >
              Boatman Penguin API <span aria-hidden="true">↗</span>
            </a>
            {noot?.sourceUrl ? (
              <a href={noot.sourceUrl} target="_blank" rel="noreferrer">
                today’s fact source <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {noot?.image?.creditUrl ? (
              <a href={noot.image.creditUrl} target="_blank" rel="noreferrer">
                photo: {noot.image.credit}
                {noot.image.license ? ` · ${noot.image.license}` : ""}{" "}
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        </aside>
      ) : null}

      <main className="site-main">
        {view === "noot" && noot ? (
          <DailyNoot
            dateKey={dateKey}
            noot={noot}
            onWantAnother={() => setView("waiting")}
          />
        ) : view === "waiting" ? (
          <Countdown
            dateKey={dateKey}
            onNewNootAvailable={handleNewNootAvailable}
          />
        ) : (
          <NootReveal
            state={view === "noot" ? "landing" : view}
            onReveal={revealNoot}
          />
        )}
      </main>
    </div>
  );
}
