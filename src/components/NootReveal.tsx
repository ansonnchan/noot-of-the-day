import { PenguinMascot } from "./PenguinMascot";

type NootRevealProps = {
  state: "landing" | "arrived" | "loading" | "error";
  onReveal: () => void;
};

export function NootReveal({ state, onReveal }: NootRevealProps) {
  if (state === "loading") {
    return (
      <section className="reveal-state reveal-state--loading" aria-live="polite">
        <PenguinMascot state="searching" />
        <p>finding today’s penguin...</p>
      </section>
    );
  }

  if (state === "error") {
    return (
      <section className="reveal-state reveal-state--error" aria-live="polite">
        <PenguinMascot state="confused" />
        <h1>hmm... today’s noot wandered off.</h1>
        <button className="text-button" type="button" onClick={onReveal}>
          try again <span aria-hidden="true">→</span>
        </button>
      </section>
    );
  }

  return (
    <section className="landing" aria-labelledby="landing-title">
      <p className="landing__eyebrow">
        {state === "arrived" ? "a new noot has arrived." : "today’s noot"}
      </p>
      <h1 id="landing-title">
        one penguin. <span>one little fact.</span> once a day.
      </h1>
      <PenguinMascot state="default" />
      <button className="reveal-button" type="button" onClick={onReveal}>
        get today’s noot <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}
