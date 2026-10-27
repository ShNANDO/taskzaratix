import { Check, Lock, RefreshCw, ShieldCheck, X } from "lucide-react";
import { useVerification } from "@/lib/verification/useVerification";
import { ChallengeBoard } from "./ChallengeBoard";
import { cn } from "@/lib/utils";

interface Props {
  onVerified?: () => void;
  title?: string;
}

export function HumanVerification({ onVerified, title = "Quick human check" }: Props) {
  const v = useVerification(onVerified);
  const busy = v.status === "checking" || v.status === "success" || v.locked;
  const seconds = Math.ceil(v.remainingMs / 1000);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border bg-card p-5 shadow-card transition-colors duration-300 sm:p-6",
        v.status === "error"
          ? "border-destructive/60"
          : v.status === "success"
            ? "border-primary/60"
            : "border-border",
      )}
      aria-label="Human verification"
    >
      <span
        className={cn(
          "pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-500",
          v.status === "success" ? "bg-primary/25 opacity-100" : "bg-primary/10 opacity-70",
        )}
        aria-hidden
      />

      <header className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
            v.status === "success"
              ? "bg-primary text-primary-foreground animate-glow-ring"
              : v.status === "error"
                ? "bg-destructive text-destructive-foreground"
                : "bg-accent text-accent-foreground",
          )}
        >
          {v.status === "success" ? (
            <Check className="h-5 w-5 animate-scale-in" strokeWidth={3} />
          ) : v.status === "error" ? (
            <X className="h-5 w-5 animate-scale-in" strokeWidth={3} />
          ) : v.locked ? (
            <Lock className="h-5 w-5" />
          ) : (
            <ShieldCheck className="h-5 w-5" />
          )}
        </span>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-foreground sm:text-base">
            {title}
          </h2>
          <p className="text-xs leading-snug text-muted-foreground">
            {v.status === "success"
              ? "Verified"
              : v.status === "expired"
                ? "Refreshing challenge…"
                : v.challenge.prompt}
          </p>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums transition-colors",
            v.status === "success"
              ? "bg-primary/10 text-primary"
              : seconds <= 10
                ? "bg-destructive/10 text-destructive"
                : "bg-secondary text-muted-foreground",
          )}
        >
          {v.status === "success" ? "done" : `${seconds}s`}
        </span>
      </header>

      {/* time-remaining / progress indicator */}
      <div
        className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="presentation"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-linear",
            v.status === "error" ? "bg-destructive" : "bg-primary",
          )}
          style={{ width: `${(v.status === "success" ? 1 : v.progress) * 100}%` }}
        />
      </div>

      <div
        key={v.challenge.id}
        className={cn("relative mt-5", v.status !== "success" && "animate-swipe-in")}
      >
        {v.status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center animate-pop-in">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-cta animate-glow-ring">
              <Check className="h-10 w-10" strokeWidth={3} />
            </span>
            <p className="text-base font-bold text-foreground">
              Verification complete
            </p>
            <p className="text-xs text-muted-foreground">
              You may continue to your tasks.
            </p>
          </div>
        ) : v.locked ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Too many attempts. Please reload the page to try again.
          </div>
        ) : (
          <div className={cn(v.status === "checking" && "pointer-events-none opacity-70")}>
            <ChallengeBoard
              challenge={v.challenge}
              disabled={busy || v.status === "expired"}
              resetSignal={v.resetSignal}
              onInteract={v.registerInteraction}
              onSubmit={v.submit}
            />
          </div>
        )}
      </div>

      <div
        aria-live="polite"
        className={cn(
          "relative mt-4 min-h-5 text-center text-sm font-medium",
          v.status === "error" ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {v.status === "checking" ? "Checking…" : v.message}
      </div>

      {v.status !== "success" && !v.locked && (
        <button
          type="button"
          onClick={v.retry}
          className="relative mx-auto mt-1 flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try a different challenge
        </button>
      )}
    </section>
  );
}
