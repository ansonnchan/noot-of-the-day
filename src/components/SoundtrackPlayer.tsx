import { useRef, useState } from "react";

const TRACK_SRC =
  "/soundtrack/fish%20in%20the%20pool%E3%83%BB%E8%8A%B1%E5%B1%8B%E6%95%B7.mp3";
const APPLE_MUSIC_URL =
  "https://music.apple.com/sg/album/fish-in-the-pool/962575643";
const SPOTIFY_URL =
  "https://open.spotify.com/intl-ja/track/4Cx1roYpSYOuaQhLV0FyDO";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function SoundtrackPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    <div className="soundtrack-player">
      <img
        className="soundtrack-player__cover"
        src="/soundtrack/fish_in_the_pool_album_cover.jpeg"
        alt=""
      />

      <div className="soundtrack-player__details">
        <a
          className="soundtrack-player__title"
          href={APPLE_MUSIC_URL}
          target="_blank"
          rel="noreferrer"
        >
          Fish in the Pool
        </a>
        <a
          className="soundtrack-player__artist"
          href={SPOTIFY_URL}
          target="_blank"
          rel="noreferrer"
        >
          花屋敷 · ヘクとパスカル
        </a>

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
