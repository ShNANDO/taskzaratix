import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PlayCircle, RotateCcw } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useQuizStore } from "@/lib/quiz-store";
import { track } from "@/lib/tracking";

export const Route = createFileRoute("/video")({
  head: () => ({
    meta: [
      { title: "Task Cash — Withdraw your balance" },
      {
        name: "description",
        content:
          "Watch the video to understand how to withdraw your Task Cash balance to Mastercard or Visa.",
      },
      { property: "og:title", content: "Task Cash — Withdraw your balance" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VideoPage,
});

interface Comment {
  name: string;
  avatarSeed: string;
  text: string;
  time: string;
}

const COMMENTS: Comment[] = [
  {
    name: "Eduardo Manjater",
    avatarSeed: "eduardo",
    time: "3 min",
    text: "I saw the video and I couldn't believe it… I took 18,500 rand just with basic questions! This system is really real! Thanks maning 🙌 🔥",
  },
  {
    name: "Carlos Nhantumbo",
    avatarSeed: "carlos",
    time: "4 min",
    text: "This system is really amazing, brothers. A few days ago already dropped 7 thousand on my visa account. Just analyzing and responding… it's a kind of magic. No one holds me now, I'm going to the bazaar for jamaica 😂 🤣",
  },
  {
    name: "Fernando Mabunda",
    avatarSeed: "fernando",
    time: "5 min",
    text: "Everyone in South africa should know that. What the man shared in the video is gold. I already have a balance to withdraw, it was worth it bro 💯 💯",
  },
  {
    name: "Sheila Ussene",
    avatarSeed: "sheila",
    time: "10 min",
    text: "Kkkk I swear I thought it was another scam, but I tested it and it's not! I have already received 11,200 in my visa card account. Just follow as it says in the video. Extraterritorial armored system ❤️",
  },
  {
    name: "Elias Zandamela",
    avatarSeed: "elias",
    time: "1 h",
    text: "Those who still doubt it are because they like to suffer. This is one of the coolest tricks I've seen online. The government would never show us this kkk",
  },
];

function VideoPage() {
  const { balance } = useQuizStore();
  const [playing, setPlaying] = useState(false);
  const [watchers] = useState(() => 480 + Math.floor(Math.random() * 60));

  useEffect(() => {
    track("PageView", { page: "video" });
  }, []);

  const play = () => {
    if (playing) return;
    setPlaying(true);
    track("CTAClick", { id: "video-play" });
  };

  const restart = () => {
    track("CTAClick", { id: "video-restart" });
    setPlaying(true);
  };

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-6">
        <header className="flex items-center justify-between gap-3 border-b border-border pb-4">
          <Logo />
          <span className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">
            Your balance: ${balance.toFixed(2)}
          </span>
        </header>

        <section className="mt-6 space-y-5 animate-fade-in">
          <h1 className="text-center text-lg font-semibold text-foreground">
            Watch the video below to understand how to withdraw your balance!{" "}
            <span aria-hidden>⬇️</span>
          </h1>

          <div className="overflow-hidden rounded-xl bg-destructive text-destructive-foreground shadow-card">
            <div className="relative aspect-video w-full bg-foreground/90">
              {!playing ? (
                <button
                  type="button"
                  onClick={play}
                  className="absolute inset-0 flex items-center justify-center transition-transform active:scale-95"
                  aria-label="Play video"
                >
                  <PlayCircle
                    className="h-20 w-20 text-primary-foreground drop-shadow-lg"
                    strokeWidth={1.5}
                  />
                </button>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-primary-foreground/80">
                  Video player placeholder
                </div>
              )}
            </div>
            <div className="p-5 text-center">
              <p className="text-lg font-bold">
                You have already started watching this video
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm font-semibold">
                <button
                  type="button"
                  onClick={play}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-destructive-hover px-4 py-2 transition-opacity hover:opacity-90"
                >
                  <PlayCircle className="h-5 w-5" /> Continue watching?
                </button>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-destructive-hover px-4 py-2 transition-opacity hover:opacity-90"
                >
                  <RotateCcw className="h-5 w-5" /> Start from beginning?
                </button>
              </div>
            </div>
          </div>

          <p className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded-full bg-destructive animate-pulse-dot"
            />
            <strong className="text-destructive">{watchers}</strong>
            people are watching now.
          </p>
        </section>

        <section aria-label="Comments" className="mt-8 border-t border-border pt-5">
          <p className="text-center text-sm text-muted-foreground">
            Facebook comments on Task Cash
          </p>
          <ul className="mt-5 space-y-6">
            {COMMENTS.map((c) => (
              <li key={c.name} className="flex gap-3">
                <img
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${c.avatarSeed}`}
                  alt=""
                  loading="lazy"
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-full bg-muted"
                />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-semibold text-brand-blue">{c.name}:</p>
                  <p className="mt-0.5 text-foreground/90">{c.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Reply · Like · Follow · {c.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Facebook social plugin
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
