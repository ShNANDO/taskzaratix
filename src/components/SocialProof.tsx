import { useEffect, useState } from "react";
import { BadgeCheck, TrendingUp, Wallet, X } from "lucide-react";

type Kind = "joined" | "earnings" | "withdraw";

interface Notice {
  name: string;
  city: string;
  kind: Kind;
  amount?: string;
  payout?: string;
  time: string;
}

const NAMES = [
  "Thandiwe M.",
  "Sipho N.",
  "Lerato K.",
  "Johan V.",
  "Nomsa D.",
  "Ayanda P.",
  "Pieter S.",
  "Zanele B.",
  "Kagiso R.",
  "Ntombi X.",
  "Riaan L.",
  "Bongani T.",
];

/** South African locations only. */
const CITIES = [
  "Johannesburg",
  "Cape Town",
  "Durban",
  "Pretoria",
  "Soweto",
  "Gqeberha",
  "Bloemfontein",
  "Polokwane",
  "East London",
  "Mbombela",
  "Kimberley",
  "Pietermaritzburg",
  "Rustenburg",
  "Vereeniging",
  "George",
  "Welkom",
  "Umlazi",
  "Tembisa",
  "Mthatha",
  "Upington",
];

const AMOUNTS = [
  "R1,480.00",
  "R2,350.00",
  "R4,610.00",
  "R6,200.00",
  "R8,740.00",
  "R12,408.00",
];

const PAYOUTS = ["a bank account", "an eWallet"];

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/** Varied, believable relative timestamps. */
function randomTime(): string {
  const roll = Math.random();
  if (roll < 0.18) return "Just now";
  if (roll < 0.65) {
    const m = 1 + Math.floor(Math.random() * 58);
    return `${m} minute${m === 1 ? "" : "s"} ago`;
  }
  if (roll < 0.92) {
    const h = 1 + Math.floor(Math.random() * 23);
    return `${h} hour${h === 1 ? "" : "s"} ago`;
  }
  const d = 1 + Math.floor(Math.random() * 3);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

function buildNotice(): Notice {
  const kind = pick<Kind>(["joined", "earnings", "withdraw"]);
  return {
    name: pick(NAMES),
    city: pick(CITIES),
    kind,
    amount: kind === "joined" ? undefined : pick(AMOUNTS),
    payout: kind === "withdraw" ? pick(PAYOUTS) : undefined,
    time: randomTime(),
  };
}

function noticeText(n: Notice) {
  switch (n.kind) {
    case "joined":
      return (
        <>
          <strong>{n.name}</strong> from {n.city} just got access to Task Cash.
        </>
      );
    case "earnings":
      return (
        <>
          <strong>{n.name}</strong> from {n.city} had the highest earnings this
          week: <strong>{n.amount}</strong>.
        </>
      );
    default:
      return (
        <>
          <strong>{n.name}</strong> from {n.city} withdrew{" "}
          <strong>{n.amount}</strong> to {n.payout}.
        </>
      );
  }
}

const ICONS: Record<Kind, typeof BadgeCheck> = {
  joined: BadgeCheck,
  earnings: TrendingUp,
  withdraw: Wallet,
};

export function SocialProof() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    let hideTimer: number;
    let showTimer: number;

    const cycle = () => {
      setNotice(buildNotice());
      hideTimer = window.setTimeout(() => {
        setNotice(null);
        showTimer = window.setTimeout(cycle, 7000 + Math.random() * 5000);
      }, 5500);
    };

    showTimer = window.setTimeout(cycle, 4000);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(showTimer);
    };
  }, [dismissed]);

  if (!notice || dismissed) return null;

  const Icon = ICONS[notice.kind];

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 bottom-3 z-40 flex justify-center sm:inset-x-auto sm:left-4 sm:justify-start"
    >
      <div className="pointer-events-auto flex w-full max-w-xs items-start gap-3 rounded-xl border border-border bg-card/95 px-3.5 py-3 shadow-card backdrop-blur animate-fade-in">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
          <Icon className="h-4 w-4 text-primary" aria-hidden />
        </span>
        <p className="min-w-0 flex-1 text-left text-xs leading-snug text-foreground">
          {noticeText(notice)}
          <span className="mt-1 block text-[11px] text-muted-foreground">
            {notice.time}
          </span>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notifications"
          className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
