import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { BalanceBadge } from "@/components/BalanceBadge";
import { RewardPopup, type RewardOutcome } from "@/components/RewardPopup";
import { TASKS, TILE_SIZES, photoSrcSet, photoUrl } from "@/lib/tasks";
import { formatZAR } from "@/lib/currency";
import { quizStore, useQuizStore } from "@/lib/quiz-store";
import { track } from "@/lib/tracking";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Task Cash — Verification Tasks" },
      {
        name: "description",
        content:
          "Complete quick image tasks about cars, countries and everyday objects and earn rewards for every correct analysis.",
      },
      { property: "og:title", content: "Task Cash — Verification Tasks" },
      {
        property: "og:description",
        content:
          "Complete quick image tasks about cars, countries and everyday objects and earn rewards for every correct analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QuizPage,
});

/** Warm the browser cache for upcoming grids so tiles appear instantly. */
const prefetched = new Set<number>();

function prefetchTask(index: number) {
  if (typeof window === "undefined") return;
  if (prefetched.has(index)) return;
  const next = TASKS[index];
  if (!next) return;
  prefetched.add(index);
  next.images.forEach((image) => {
    const img = new Image();
    img.decoding = "async";
    img.sizes = TILE_SIZES;
    img.srcset = photoSrcSet(image.photo);
    img.src = photoUrl(image.photo);
  });
}

function QuizPage() {
  const { balance, currentTask, completed } = useQuizStore();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [popup, setPopup] = useState<{
    outcome: RewardOutcome;
    reward: number;
    balance: number;
    taskNumber: number;
    isLast: boolean;
  } | null>(null);

  useEffect(() => {
    if (completed && !popup) navigate({ to: "/congratulations" });
  }, [completed, popup, navigate]);

  const index = Math.min(currentTask, TASKS.length - 1);
  const task = TASKS[index];

  useEffect(() => {
    setSelected(new Set());
    window.scrollTo({ top: 0 });
    prefetchTask(index + 1);
    prefetchTask(index + 2);
  }, [index]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const finish = useCallback(
    (outcome: RewardOutcome) => {
      if (popup) return;
      const reward = outcome === "correct" ? task.reward : 0;
      const newBalance = balance + reward;
      const isLast = index + 1 >= TASKS.length;

      track("QuizTaskComplete", { id: `task-${task.id}`, outcome, reward });
      setPopup({
        outcome,
        reward,
        balance: newBalance,
        taskNumber: index + 1,
        isLast,
      });
      quizStore.set({ balance: newBalance });
    },
    [balance, index, popup, task.id, task.reward],
  );

  const submit = () => {
    const targets = task.images.filter((i) => i.isTarget).map((i) => i.id);
    const list = Array.from(selected);
    const hasTarget = list.some((id) => targets.includes(id));
    const noWrong = list.every((id) => targets.includes(id));
    finish(hasTarget && noWrong ? "correct" : "wrong");
  };


  const continueNext = useCallback(() => {
    const isLast = popup?.isLast;
    setPopup(null);
    if (isLast) {
      quizStore.set({ completed: true });
      track("QuizComplete", { balance: quizStore.get().balance });
      navigate({ to: "/congratulations" });
    } else {
      quizStore.set({ currentTask: index + 1 });
    }
  }, [index, navigate, popup]);

  const progress = useMemo(
    () => Math.round((index / TASKS.length) * 100),
    [index],
  );

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-6">
        <header className="flex flex-col items-center gap-4 border-b border-border pb-5">
          <Logo variant="mono" />
          <div className="w-full">
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label="Task progress"
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${Math.max(progress, 4)}%` }}
              />
            </div>
            <p className="mt-1.5 text-center text-xs font-medium text-muted-foreground">
              Task {index + 1} of {TASKS.length}
            </p>
          </div>
        </header>

        <section
          key={task.id}
          className="mt-5 flex flex-1 flex-col gap-4 animate-swipe-in"
        >
          <BalanceBadge amount={balance} />

          <div className="text-center">
            <h1 className="text-balance text-base font-semibold text-foreground sm:text-lg">
              {task.prompt}
            </h1>
          </div>

          <p className="rounded-lg bg-accent px-3 py-2 text-center text-xs font-bold text-accent-foreground sm:text-sm">
            Complete this analysis to earn {formatZAR(task.reward)}
          </p>


          <div
            role="group"
            aria-label={task.prompt}
            className="grid grid-cols-3 gap-2 sm:gap-3"
          >
            {task.images.map((image, i) => {
              const isSelected = selected.has(image.id);
              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => toggle(image.id)}
                  aria-pressed={isSelected}
                  aria-label={image.alt}
                  className={`relative aspect-square overflow-hidden rounded-lg border border-border bg-muted transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isSelected ? "tile-selected" : "active:scale-95"
                  }`}
                >
                  <img
                    src={photoUrl(image.photo)}
                    srcSet={photoSrcSet(image.photo)}
                    sizes={TILE_SIZES}
                    alt=""
                    loading={index === 0 && i < 3 ? "eager" : "lazy"}
                    fetchPriority={index === 0 && i < 3 ? "high" : "auto"}
                    decoding="async"
                    width={220}
                    height={220}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                  {isSelected && (
                    <>
                      <span className="pointer-events-none absolute inset-0 bg-primary/35" />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                          <Check className="h-6 w-6" strokeWidth={3} />
                        </span>
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={selected.size === 0 || !!popup}
            className="btn-primary mt-1"
          >
            Confirm selection
          </button>

          <button
            type="button"
            onClick={() => finish("skipped")}
            disabled={!!popup}
            className="text-center text-sm font-medium text-brand-blue underline underline-offset-4 hover:opacity-80 disabled:opacity-50"
          >
            Skip to next task
          </button>
        </section>

      </div>

      <RewardPopup
        open={!!popup}
        outcome={popup?.outcome ?? "skipped"}
        reward={popup?.reward ?? 0}
        balance={popup?.balance ?? balance}
        taskNumber={popup?.taskNumber ?? 1}
        totalTasks={TASKS.length}
        isLast={!!popup?.isLast}
        onContinue={continueNext}
      />
    </main>
  );
}
