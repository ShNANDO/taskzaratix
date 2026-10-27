import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { HumanVerification } from "@/components/verification/HumanVerification";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Human Verification — Task Cash" },
      {
        name: "description",
        content:
          "Complete a quick, private human check to continue to your Task Cash tasks. No third-party CAPTCHA required.",
      },
      { property: "og:title", content: "Human Verification — Task Cash" },
      {
        property: "og:description",
        content:
          "A fast, accessible human check that takes seconds — built in, no third-party CAPTCHA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    void router.preloadRoute({ to: "/quiz" });
  }, [router]);

  // Move on automatically once the check passes — no dead wait.
  useEffect(() => {
    if (!verified) return;
    const t = window.setTimeout(() => navigate({ to: "/quiz" }), 900);
    return () => window.clearTimeout(t);
  }, [verified, navigate]);

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-7 px-4 py-10 sm:px-5">
        <header className="flex flex-col items-center gap-3 text-center">
          <Logo variant="mono" />
          <h1 className="text-balance text-2xl font-extrabold text-foreground sm:text-3xl">
            Let&apos;s make sure you&apos;re human
          </h1>
          <p className="max-w-xs text-sm text-muted-foreground">
            One quick challenge — it takes a few seconds.
          </p>
        </header>

        <HumanVerification onVerified={() => setVerified(true)} />

        <button
          type="button"
          disabled={!verified}
          onClick={() => navigate({ to: "/quiz" })}
          className="btn-primary"
        >
          {verified ? "Continue" : "Complete the check to continue"}
        </button>
      </div>
    </main>
  );
}
