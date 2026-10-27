import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { hueStyle, shuffle } from "@/lib/verification/challenges";
import type { Challenge } from "@/lib/verification/types";
import { cn } from "@/lib/utils";

interface Props {
  challenge: Challenge;
  disabled: boolean;
  /** increments whenever the local selection must be cleared */
  resetSignal: number;
  onInteract: () => void;
  onSubmit: (answer: string[] | number) => void;
}

export function ChallengeBoard({
  challenge,
  disabled,
  resetSignal,
  onInteract,
  onSubmit,
}: Props) {
  const [order, setOrder] = useState<string[]>([]);
  const [slider, setSlider] = useState(() => 5 + Math.round(Math.random() * 10));

  useEffect(() => {
    setOrder([]);
    setSlider(5 + Math.round(Math.random() * 10));
  }, [challenge.id]);

  // clear the local selection after a failed / expired attempt
  useEffect(() => {
    setOrder([]);
  }, [resetSignal]);

  // randomized star layout for the counting challenge
  const stars = useMemo(
    () =>
      challenge.kind === "count-stars"
        ? shuffle(
            Array.from({ length: 12 }, (_, i) => i < (challenge.target ?? 0)),
          )
        : [],
    [challenge.id, challenge.kind, challenge.target],
  );

  const tap = (id: string) => {
    if (disabled) return;
    onInteract();
    if (!challenge.ordered) {
      setOrder([id]);
      onSubmit([id]);
      return;
    }
    if (order.includes(id)) return;
    const next = [...order, id];
    setOrder(next);
    if (next.length === challenge.answer.length) onSubmit(next);
  };

  if (challenge.kind === "slider-fit") {
    const target = challenge.target ?? 50;
    const fits = Math.abs(slider - target) <= (challenge.tolerance ?? 4);
    return (
      <div className="space-y-5">
        <div className="relative h-20 overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-muted to-secondary">
          <div
            className={cn(
              "absolute top-1/2 h-12 w-12 -translate-y-1/2 rounded-xl border-2 border-dashed transition-colors duration-200",
              fits ? "border-primary bg-primary/10" : "border-primary/50",
            )}
            style={{ left: `calc(${target}% - 24px)` }}
            aria-hidden
          />
          <div
            className={cn(
              "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl transition-[left,transform,box-shadow] duration-150",
              fits && "scale-110 shadow-cta",
            )}
            style={{ left: `calc(${slider}% - 22px)`, ...hueStyle(145) }}
            aria-hidden
          >
            {fits && <Check className="h-5 w-5" strokeWidth={3} />}
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={slider}
          disabled={disabled}
          aria-label={challenge.prompt}
          onChange={(e) => {
            onInteract();
            setSlider(Number(e.target.value));
          }}
          className="h-2 w-full cursor-pointer accent-[oklch(0.68_0.19_145)]"
        />
        <button
          type="button"
          className="btn-primary"
          disabled={disabled}
          onClick={() => onSubmit(slider)}
        >
          Verify
        </button>
      </div>
    );
  }

  const isRound = challenge.kind === "tap-color";
  const cols =
    challenge.options.length <= 3
      ? "grid-cols-3"
      : challenge.options.length === 4
        ? "grid-cols-4"
        : "grid-cols-3";

  return (
    <div className="space-y-5">
      {challenge.kind === "count-stars" && (
        <div
          className="grid grid-cols-4 gap-1.5 rounded-2xl border border-border bg-gradient-to-b from-muted to-secondary p-4 sm:gap-2"
          aria-hidden
        >
          {stars.map((isStar, i) => (
            <span
              key={i}
              style={{ animationDelay: `${i * 35}ms` }}
              className={cn(
                "flex h-8 items-center justify-center text-2xl sm:h-9",
                isStar
                  ? "text-brand-yellow animate-scale-in"
                  : "text-transparent",
              )}
            >
              ★
            </span>
          ))}
        </div>
      )}

      <div
        role="group"
        aria-label={challenge.prompt}
        className={cn("grid gap-2.5 sm:gap-3", cols)}
      >
        {challenge.options.map((opt, i) => {
          const idx = order.indexOf(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => tap(opt.id)}
              style={{ ...hueStyle(opt.hue), animationDelay: `${i * 45}ms` }}
              aria-label={isRound ? `${opt.label} circle` : `Option ${opt.label}`}
              className={cn(
                "relative flex aspect-square min-h-11 w-full items-center justify-center text-lg font-bold shadow-card animate-scale-in sm:text-xl",
                "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "hover:-translate-y-0.5 hover:shadow-cta active:scale-95 disabled:opacity-60",
                isRound ? "rounded-full" : "rounded-2xl",
                idx > -1 && "-translate-y-0.5 ring-4 ring-primary ring-offset-2",
              )}
            >
              {isRound ? "" : opt.label}
              {idx > -1 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background animate-pop-in">
                  {idx + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {challenge.ordered && (
        <p className="text-center text-xs text-muted-foreground">
          {order.length} of {challenge.answer.length} selected
        </p>
      )}
    </div>
  );
}
