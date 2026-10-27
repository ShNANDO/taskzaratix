import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { ShieldCheck, Timer, Wallet } from "lucide-react";
import { Logo } from "@/components/Logo";
import { BalanceBadge } from "@/components/BalanceBadge";
import { quizStore, useQuizStore } from "@/lib/quiz-store";
import { TASKS, TILE_SIZES, photoSrcSet, photoUrl } from "@/lib/tasks";
import { TOTAL_USD, formatUSD, formatZAR } from "@/lib/currency";
import { track } from "@/lib/tracking";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Task Cash — Earn by completing simple tasks" },
      {
        name: "description",
        content:
          "Task Cash South Africa: complete 8 quick image checks and earn rewards for every analysis you finish.",
      },
      { property: "og:title", content: "Task Cash — Earn by completing simple tasks" },
      {
        property: "og:description",
        content:
          "Task Cash South Africa: complete 8 quick image checks and earn rewards for every analysis you finish.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndexPage,
});

/** Warm the first task grid while the user reads the intro. */
function prefetchFirstTask() {
  if (typeof window === "undefined") return;
  TASKS[0]?.images.forEach((image) => {
    const img = new Image();
    img.decoding = "async";
    img.sizes = TILE_SIZES;
    img.srcset = photoSrcSet(image.photo);
    img.src = photoUrl(image.photo);
  });
}

const HIGHLIGHTS = [
  { icon: Timer, label: "8 quick tasks", detail: "About 3 minutes" },
  { icon: Wallet, label: "Paid per task", detail: "Bank or eWallet" },
  { icon: ShieldCheck, label: "Verified access", detail: "No experience needed" },
];

function IndexPage() {
  const { balance } = useQuizStore();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    track("PageView", { page: "intro" });
    prefetchFirstTask();
    // Warm the verification route so the transition is instant on tap.
    void router.preloadRoute({ to: "/verify" });
  }, [router]);

  const start = () => {
    track("QuizStart");
    quizStore.set({ currentTask: 0, balance: 0, completed: false });
    navigate({ to: "/verify" });
  };


  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-8">
        <header className="flex flex-col items-center gap-6 text-center">
          <Logo />
          <BalanceBadge amount={balance} />
        </header>

        <section className="mt-10 flex flex-1 flex-col items-center gap-6 text-center animate-fade-in">
          <h1 className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
            <span className="text-primary">Task checks</span> that pay
          </h1>

          <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
            Review a few photos, pick the right ones and collect a reward after
            every task. No calls, no selling, no experience.
          </p>

          <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-card">
            <p className="text-4xl font-extrabold text-primary">
              {formatZAR(TOTAL_USD)}
            </p>
            <p className="text-sm font-semibold text-muted-foreground">
              ≈ {formatUSD(TOTAL_USD)} across {TASKS.length} tasks
            </p>
          </div>


          <ul className="grid w-full grid-cols-3 gap-2">
            {HIGHLIGHTS.map(({ icon: Icon, label, detail }) => (
              <li
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-2 py-3 text-center"
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden />
                <span className="text-xs font-bold leading-tight text-foreground">
                  {label}
                </span>
                <span className="text-[11px] leading-tight text-muted-foreground">
                  {detail}
                </span>
              </li>
            ))}
          </ul>

          <button type="button" onClick={start} className="btn-primary mt-2">
            Start earning now
          </button>
        </section>

        <footer className="mt-10 space-y-2 text-center text-xs text-muted-foreground">
          <p>Copyright ©{new Date().getFullYear()} Task Cash</p>
          <p className="space-x-2">
            <a href="#" className="underline-offset-2 hover:underline">Privacy</a>
            <span>|</span>
            <a href="#" className="underline-offset-2 hover:underline">Terms</a>
          </p>
        </footer>
      </div>
    </main>
  );
}

