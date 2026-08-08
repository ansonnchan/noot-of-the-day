export type PenguinMascotState =
  | "default"
  | "sleeping"
  | "searching"
  | "confused"
  | "camera"
  | "pebble";

const MASCOTS: Record<PenguinMascotState, string> = {
  default: "/images/mascots/penguin-default.png",
  sleeping: "/images/mascots/penguin-sleeping.png",
  searching: "/images/mascots/penguin-searching.png",
  confused: "/images/mascots/penguin-confused.png",
  camera: "/images/mascots/penguin-searching.png",
  pebble: "/images/mascots/penguin-default.png",
};

type PenguinMascotProps = {
  state?: PenguinMascotState;
  className?: string;
};

export function PenguinMascot({
  state = "default",
  className = "",
}: PenguinMascotProps) {
  return (
    <img
      className={`mascot mascot--${state} ${className}`.trim()}
      src={MASCOTS[state]}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}

