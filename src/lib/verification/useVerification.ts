import { useCallback, useEffect, useRef, useState } from "react";
import { createChallenge } from "./challenges";
import type { Challenge } from "./types";

export type VerifyStatus = "idle" | "checking" | "success" | "error" | "expired";

/** A challenge stays valid for this long before it must be regenerated. */
export const CHALLENGE_TTL_MS = 60_000;
/** Minimum gap between two submissions (rapid-click guard). */
const SUBMIT_COOLDOWN_MS = 600;
const MAX_ATTEMPTS = 5;

export interface UseVerificationResult {
  challenge: Challenge;
  status: VerifyStatus;
  message: string;
  attempts: number;
  locked: boolean;
  remainingMs: number;
  progress: number;
  /** bumps whenever the board must clear its local selection */
  resetSignal: number;
  registerInteraction: () => void;
  submit: (answer: string[] | number) => void;
  retry: () => void;
}

export function useVerification(
  onVerified?: () => void,
): UseVerificationResult {
  const [challenge, setChallenge] = useState<Challenge>(() => createChallenge());
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [remainingMs, setRemainingMs] = useState(CHALLENGE_TTL_MS);
  const [resetSignal, setResetSignal] = useState(0);

  const issuedAt = useRef(Date.now());
  const firstInteractionAt = useRef<number | null>(null);
  const lastSubmitAt = useRef(0);
  const solvedIds = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback((excludeSameKind: boolean) => {
    setChallenge((prev) => createChallenge(excludeSameKind ? prev.kind : undefined));
    issuedAt.current = Date.now();
    firstInteractionAt.current = null;
    setRemainingMs(CHALLENGE_TTL_MS);
    setStatus("idle");
    setMessage("");
    setResetSignal((n) => n + 1);
  }, []);

  // expiry ticker
  useEffect(() => {
    if (status === "success") return;
    const i = setInterval(() => {
      const left = CHALLENGE_TTL_MS - (Date.now() - issuedAt.current);
      setRemainingMs(Math.max(0, left));
      if (left <= 0) {
        setStatus("expired");
        setMessage("This challenge expired. Here's a fresh one.");
      }
    }, 500);
    return () => clearInterval(i);
  }, [status, challenge.id]);

  useEffect(() => {
    if (status !== "expired") return;
    const t = setTimeout(() => reset(false), 1200);
    return () => clearTimeout(t);
  }, [status, reset]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const registerInteraction = useCallback(() => {
    if (firstInteractionAt.current === null)
      firstInteractionAt.current = Date.now();
  }, []);

  const fail = useCallback((text: string) => {
    setStatus("error");
    setMessage(text);
    setAttempts((a) => a + 1);
    setResetSignal((n) => n + 1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setStatus((s) => (s === "error" ? "idle" : s));
    }, 900);
  }, []);

  const submit = useCallback(
    (answer: string[] | number) => {
      const now = Date.now();
      if (status === "checking" || status === "success") return;
      if (attempts >= MAX_ATTEMPTS) return;
      if (now - lastSubmitAt.current < SUBMIT_COOLDOWN_MS) return; // rapid clicking
      lastSubmitAt.current = now;

      if (now - issuedAt.current > CHALLENGE_TTL_MS) {
        setStatus("expired");
        setMessage("This challenge expired. Here's a fresh one.");
        return;
      }
      if (solvedIds.current.has(challenge.id)) return; // duplicate submission

      // fall back to the issue time so a valid answer is never rejected
      // just because the widget did not report an interaction (e.g. slider).
      const started = firstInteractionAt.current ?? issuedAt.current;
      const elapsed = now - started;
      // impossible interaction speed → treat as a failure, no hints given
      if (elapsed < challenge.minSolveMs) {
        fail("That doesn't look quite right. Please try again.");
        reset(false);
        return;
      }

      setStatus("checking");

      const ok =
        typeof answer === "number"
          ? Math.abs(answer - (challenge.target ?? 0)) <= (challenge.tolerance ?? 3)
          : challenge.ordered
            ? answer.length === challenge.answer.length &&
              answer.every((id, i) => id === challenge.answer[i])
            : answer.length === challenge.answer.length &&
              answer.every((id) => challenge.answer.includes(id));

      window.setTimeout(() => {
        if (ok) {
          solvedIds.current.add(challenge.id);
          setStatus("success");
          setMessage("Verification complete. You may continue.");
          onVerified?.();
        } else {
          fail("That doesn't look quite right. Please try again.");
        }
      }, 420);
    },
    [attempts, challenge, fail, onVerified, reset, status],
  );

  const retry = useCallback(() => reset(true), [reset]);

  return {
    challenge,
    status,
    message,
    attempts,
    locked: attempts >= MAX_ATTEMPTS,
    remainingMs,
    resetSignal,
    progress: Math.max(0, Math.min(1, remainingMs / CHALLENGE_TTL_MS)),
    registerInteraction,
    submit,
    retry,
  };
}
