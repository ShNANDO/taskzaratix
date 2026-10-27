import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Coins, XCircle } from "lucide-react";
import { formatUSD, formatZAR } from "@/lib/currency";

export type RewardOutcome = "correct" | "wrong" | "skipped";

interface Props {
  open: boolean;
  outcome: RewardOutcome;
  reward: number; // USD earned in this task
  balance: number; // USD total after the task
  taskNumber: number;
  totalTasks: number;
  isLast: boolean;
  onContinue: () => void;
}

/** Popup stays visible for exactly this long before moving on. */
const AUTO_CLOSE_MS = 5000;

export function RewardPopup({
  open,
  outcome,
  reward,
  balance,
  taskNumber,
  totalTasks,
  isLast,
  onContinue,
}: Props) {
  const cbRef = useRef(onContinue);
  cbRef.current = onContinue;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) return;
    setProgress(0);
    const raf = requestAnimationFrame(() => setProgress(1));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") cbRef.current();
    };
    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => cbRef.current(), AUTO_CLOSE_MS);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open, taskNumber]);

  if (!open) return null;

  const won = outcome === "correct" && reward > 0;

  const title = won
    ? "Task completed!"
    : outcome === "wrong"
      ? "Wrong selection"
      : "Task skipped";

  const message = won
    ? "You just earned"
    : outcome === "wrong"
      ? "You selected the wrong images, so you earn nothing for this task."
      : "You skipped this task, so no reward was added.";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reward-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 px-4 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-6 text-center shadow-xl animate-pop-in sm:p-7">
        {won && (
          <span
            className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
            aria-hidden
          />
        )}

        <div className="relative">
          <div
            className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
              won
                ? "bg-gradient-to-br from-primary to-primary/70 shadow-cta animate-glow-ring"
                : "bg-destructive/10"
            }`}
          >
            {won ? (
              <>
                <span
                  className="absolute inset-0 rounded-full ring-4 ring-primary/25"
                  aria-hidden
                />
                <Coins
                  className="h-10 w-10 text-primary-foreground animate-scale-in"
                  strokeWidth={2.2}
                  aria-hidden
                />
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-card">
                  <BadgeCheck className="h-5 w-5 text-primary" aria-hidden />
                </span>
              </>
            ) : (
              <XCircle className="h-10 w-10 text-destructive animate-scale-in" aria-hidden />
            )}
          </div>


          <h2
            id="reward-title"
            className="mt-4 text-xl font-extrabold text-foreground sm:text-2xl"
          >
            {title}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">{message}</p>

          {won && (
            <p className="mt-3">
              <span className="block break-words text-3xl font-extrabold text-primary sm:text-4xl">
                +{formatZAR(reward)}
              </span>
              <span className="text-xs font-semibold text-muted-foreground sm:text-sm">
                ≈ {formatUSD(reward)}
              </span>
            </p>
          )}

          <div className="mt-5 rounded-2xl bg-secondary px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {won ? "New balance" : "Balance unchanged"}
            </p>
            <p className="mt-0.5 break-words text-2xl font-extrabold text-foreground">
              {formatZAR(balance)}
            </p>
            <p className="text-xs font-semibold text-muted-foreground">
              ≈ {formatUSD(balance)}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5" aria-hidden>
            {Array.from({ length: totalTasks }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i < taskNumber ? "w-5 bg-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          <p className="mt-2 text-xs font-medium text-muted-foreground">
            Task {taskNumber} of {totalTasks} complete ·{" "}
            {isLast ? "finishing up…" : "loading next task…"}
          </p>

          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary ease-linear"
              style={{
                width: progress ? "100%" : "0%",
                transitionProperty: "width",
                transitionDuration: `${AUTO_CLOSE_MS}ms`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
