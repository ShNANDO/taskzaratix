import { formatUSD, formatZAR } from "@/lib/currency";

interface Props {
  amount: number; // USD
  label?: string;
  size?: "sm" | "lg";
}

export function BalanceBadge({ amount, label = "Your balance", size = "sm" }: Props) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        aria-live="polite"
        aria-label={`${formatZAR(amount)}, about ${formatUSD(amount)}`}
        className={`inline-flex items-baseline gap-2 rounded-xl bg-primary px-4 shadow-cta transition-all ${
          size === "lg" ? "py-2.5" : "py-1.5"
        }`}
      >
        <span
          className={`font-extrabold text-primary-foreground ${
            size === "lg" ? "text-3xl" : "text-xl"
          }`}
        >
          {formatZAR(amount)}
        </span>
        <span className="text-sm font-semibold text-primary-foreground/80">
          ≈ {formatUSD(amount)}
        </span>
      </span>
    </div>
  );
}
