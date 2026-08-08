import { useCallback, useRef, useState, type MouseEvent } from "react";
import { DailyNoot } from "./components/DailyNoot";
import { NootReveal } from "./components/NootReveal";
import { getLocalDateKey } from "./lib/daily/date";
import {
  readStoredNoot,
  writeStoredNoot,
  type StorageLike,
} from "./lib/daily/storage";
import { getDailyNoot } from "./lib/penguins/boatman";
import type { DailyNoot as DailyNootType } from "./lib/penguins/types";

type RevealState = "landing" | "arrived" | "loading" | "revealed" | "error";

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
  const [revealState, setRevealState] = useState<RevealState>(
    initialNoot ? "revealed" : "landing",
  );
  const [aboutOpen, setAboutOpen] = useState(false);

  const revealNoot = useCallback(async () => {
    if (noot && dateKey === getLocalDateKey()) {
      setRevealState("revealed");
      return;
    }

    const activeRequest = ++requestId.current;
    setRevealState("loading");

    try {
      const dailyNoot = await getDailyNoot(dateKey);
      const storage = getLocalStorage();
      if (storage) writeStoredNoot(storage, dateKey, dailyNoot);
      if (activeRequest !== requestId.current) return;
      setNoot(dailyNoot);
      setRevealState("revealed");
    } catch {
      if (activeRequest !== requestId.current) return;
      setRevealState("error");
    }
  }, [dateKey, noot]);

  const handleHome = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    requestId.current += 1;
    setAboutOpen(false);
    setRevealState("landing");
  }, []);

  const handleNewNootAvailable = useCallback(() => {
    requestId.current += 1;
    const nextDateKey = getLocalDateKey();
    const storage = getLocalStorage();
    if (storage) readStoredNoot(storage, nextDateKey);
    setDateKey(nextDateKey);
    setNoot(null);
    setRevealState("arrived");
  }, []);

  return (
    <div className={`site-shell site-shell--${revealState}`}>
      <header className="site-header">
        <a
          className="wordmark"
          href="/"
          aria-label="Noot of the Day home"
          onClick={handleHome}
        >
          noot<span>.</span>
        </a>
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
            A tiny daily ritual: one real penguin, one sourced fact, then a quiet
            wait until tomorrow.
          </p>
        </aside>
      ) : null}

      <main className="site-main">
        {revealState === "revealed" && noot ? (
          <DailyNoot
            dateKey={dateKey}
            noot={noot}
            onNewNootAvailable={handleNewNootAvailable}
          />
        ) : (
          <NootReveal
            state={revealState === "revealed" ? "landing" : revealState}
            onReveal={revealNoot}
          />
        )}
      </main>

      <footer className="site-footer">
        <span>made for one small pause</span>
        <a
          href="https://github.com/boatman-27/SaaS_Penguin_API"
          target="_blank"
          rel="noreferrer"
        >
          facts via Boatman <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </div>
  );
}
