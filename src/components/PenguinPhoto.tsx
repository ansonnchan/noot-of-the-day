import { useState } from "react";
import type { PenguinImage } from "../lib/penguins/types";
import { PenguinMascot } from "./PenguinMascot";

type PenguinPhotoProps = {
  image?: PenguinImage;
  species?: string;
};

export function PenguinPhoto({ image, species }: PenguinPhotoProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!image || failed) {
    return (
      <div className="photo-fallback" role="img" aria-label="Penguin photo unavailable">
        <PenguinMascot state="camera" />
        <p>camera shy today.</p>
      </div>
    );
  }

  return (
    <figure className={`noot-photo ${loaded ? "noot-photo--loaded" : ""}`}>
      <span className="noot-photo__label" aria-hidden="true">
        today’s noot
      </span>
      <div className="noot-photo__frame">
        <div className="noot-photo__placeholder" aria-hidden="true" />
        <img
          src={image.url}
          alt={image.alt || `A ${species ?? "penguin"}`}
          width="1280"
          height="960"
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </div>
      {image.credit && image.creditUrl ? (
        <figcaption>
          photo: {" "}
          <a href={image.creditUrl} target="_blank" rel="noreferrer">
            {image.credit}
          </a>
          {image.license ? ` · ${image.license}` : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
