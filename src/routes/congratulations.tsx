import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BalanceBadge } from "@/components/BalanceBadge";
import { useQuizStore } from "@/lib/quiz-store";
import { track } from "@/lib/tracking";

export const Route = createFileRoute("/congratulations")({
  head: () => ({
    meta: [
      { title: "Task Cash — Ready to withdraw" },
      {
        name: "description",
        content: "You completed 4 analyses. Learn how to turn your balance into real earnings.",
      },
      { property: "og:title", content: "Task Cash — Ready to withdraw" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CongratsPage,
});

function CongratsPage() {
  const { balance } = useQuizStore();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    track("PageView", { page: "congratulations" });
    track("InitiateCheckout", { id: "video-redirect", value: balance });
  }, [balance]);

  useEffect(() => {
    if (countdown <= 0) {
      navigate({ to: "/video" });
      return;
    }
    const t = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [countdown, navigate]);

  const go = () => {
    track("CTAClick", { id: "watch-video" });
    navigate({ to: "/video" });
  };

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-10">
        <section className="flex flex-1 flex-col items-center gap-6 text-center animate-fade-in">
          <p className="text-lg leading-relaxed text-foreground">
            You completed all <strong>8 analyses!</strong>
            <br />
            And now you are ready to make your first withdrawal.
          </p>

          <BalanceBadge amount={balance} label="Total earned" size="lg" />

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary">
            CONGRATULATIONS!
          </h1>

          <p className="text-base leading-relaxed text-foreground/90">
            To learn how to turn that balance into real earnings with{" "}
            <strong>Mastercard</strong> or <strong>Visa</strong>, watch an
            explanatory video of only 4 minutes.
          </p>


          <button type="button" onClick={go} className="btn-primary">
            Watch the video
          </button>

          <p
            aria-live="polite"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Redirect in {countdown} second{countdown === 1 ? "" : "s"}
          </p>
        </section>

        <footer className="mt-10 space-y-2 text-center text-xs text-muted-foreground">
          <p>Copyright ©{new Date().getFullYear()}</p>
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
