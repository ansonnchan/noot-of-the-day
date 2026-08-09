import { useEffect, useRef, useState } from "react";

const TRACK_SRC =
  "/soundtrack/fish%20in%20the%20pool%E3%83%BB%E8%8A%B1%E5%B1%8B%E6%95%B7.mp3";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function SoundtrackPlayer() {
  const playerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        expanded &&
        playerRef.current &&
        !playerRef.current.contains(event.target as Node)
      ) {
        setExpanded(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [expanded]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  };

  return (
    <div
      className={`soundtrack-player${expanded ? " soundtrack-player--expanded" : ""}`}
      ref={playerRef}
    >
      <button
        className="soundtrack-player__cover-button"
        type="button"
        aria-label={expanded ? "Collapse soundtrack player" : "Open soundtrack player"}
        aria-expanded={expanded}
        onClick={() => setExpanded((open) => !open)}
      >
        <img
          src="/soundtrack/fish_in_the_pool_album_cover.jpeg"
          alt=""
        />
        {!expanded ? (
          <span className="soundtrack-player__note" aria-hidden="true">
            ♪
          </span>
        ) : null}
      </button>

      {expanded ? (
        <div className="soundtrack-player__details">
          <div className="soundtrack-player__marquee">
            <span className="soundtrack-player__title">Fish in the Pool</span>
          </div>
          <div className="soundtrack-player__artist">Hekuto Pascal</div>

          <div className="soundtrack-player__controls">
            <button
              className="soundtrack-player__play"
              type="button"
              aria-label={playing ? "Pause Fish in the Pool" : "Play Fish in the Pool"}
              onClick={togglePlayback}
            >
              <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
            </button>
            <span className="soundtrack-player__time">
              {formatTime(currentTime)}
            </span>
            <input
              className="soundtrack-player__progress"
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              aria-label="Soundtrack position"
              onChange={(event) => {
                const nextTime = Number(event.target.value);
                if (audioRef.current) audioRef.current.currentTime = nextTime;
                setCurrentTime(nextTime);
              }}
            />
            <span className="soundtrack-player__time">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      ) : null}

      <audio
        ref={audioRef}
        src={TRACK_SRC}
        preload="metadata"
        loop
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </div>
  );
}
