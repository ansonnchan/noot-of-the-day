import { useEffect, useRef, useState } from "react";

const TRACK_SRC = "/soundtrack/fish%20in%20the%20pool.mp3";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function SoundtrackPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [expanded, setExpanded] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.65);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

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
      className={`soundtrack-player${expanded ? "" : " soundtrack-player--collapsed"}${playing ? " soundtrack-player--playing" : ""}`}
    >
      <button
        className="soundtrack-player__cover-button"
        type="button"
        aria-label={expanded ? "Minimize soundtrack player" : "Expand soundtrack player"}
        aria-expanded={expanded}
        onClick={() => setExpanded((open) => !open)}
      >
        <img
          className="soundtrack-player__cover"
          src="/soundtrack/fish_in_the_pool_album_cover.jpeg"
          alt=""
        />
      </button>

      {expanded ? (
        <div className="soundtrack-player__details">
          <span className="soundtrack-player__title">
            fish in the pool · 花屋敷
          </span>
          <span className="soundtrack-player__artist">
            Hekuto Pascal · ヘクとパスカル
          </span>

          <div className="soundtrack-player__controls">
            <button
              className="soundtrack-player__play"
              type="button"
              aria-label={playing ? "Pause Fish in the Pool" : "Play Fish in the Pool"}
              onClick={togglePlayback}
            >
              <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
            </button>
            <span className="soundtrack-player__time soundtrack-player__time--current">
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
            <label className="soundtrack-player__volume">
              <span aria-hidden="true">vol</span>
              <span className="visually-hidden">Music volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
              />
            </label>
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
