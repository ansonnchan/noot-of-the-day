import { useCallback, useEffect, useRef, useState } from "react";
import { DailyNoot } from "./components/DailyNoot";
import { Countdown } from "./components/Countdown";
import { NootReveal } from "./components/NootReveal";
import { SoundtrackPlayer } from "./components/SoundtrackPlayer";
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
const REVEAL_TRANSITION_MS = 3000;

function waitForRevealTransition(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, REVEAL_TRANSITION_MS);
  });
}

export function App() {
  const requestId = useRef(0);
  const aboutRef = useRef<HTMLDivElement>(null);
  const [dateKey, setDateKey] = useState(initialDateKey);
  const [noot, setNoot] = useState<DailyNootType | null>(initialNoot);
  const [view, setView] = useState<View>("landing");
  const [aboutOpen, setAboutOpen] = useState(false);

  const revealNoot = useCallback(async () => {
    const activeRequest = ++requestId.current;
    setAboutOpen(false);
    setView("loading");

    try {
      const currentNoot = dateKey === getLocalDateKey() ? noot : null;
      const [dailyNootResult] = await Promise.allSettled([
        currentNoot ? Promise.resolve(currentNoot) : getDailyNoot(dateKey),
        waitForRevealTransition(),
      ]);
      if (dailyNootResult.status === "rejected") {
        throw dailyNootResult.reason;
      }

      const dailyNoot = dailyNootResult.value;
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

  const handleHome = useCallback(() => {
    requestId.current += 1;
    setAboutOpen(false);
    setView("landing");
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

  useEffect(() => {
    if (!aboutOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        aboutRef.current &&
        !aboutRef.current.contains(event.target as Node)
      ) {
        setAboutOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAboutOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [aboutOpen]);

  return (
    <div className={`site-shell site-shell--${view}`}>
      <header className="site-header">
        <div className="site-header__start">
          <SoundtrackPlayer />
        </div>

        <div className="site-header__end">
          <button
            className="home-button"
            type="button"
            aria-label="Return to landing page"
            onClick={handleHome}
          >
            <img src="/images/icons/home.svg" alt="" aria-hidden="true" />
          </button>

          <div className="about-control" ref={aboutRef}>
            <button
              className="about-button"
              type="button"
              aria-expanded={aboutOpen}
              aria-controls="about-note"
              onClick={() => setAboutOpen((open) => !open)}
            >
              about
            </button>

            {aboutOpen ? (
              <aside className="about-note" id="about-note">
                <p>
                  Noot of the Day serves one penguin fact each day. Facts are provided
                  by the Boatman Penguin API.
                </p>
                <div className="about-note__links">
                  <a
                    href="https://github.com/boatman-27/SaaS_Penguin_API"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Boatman Penguin API <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </header>

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
