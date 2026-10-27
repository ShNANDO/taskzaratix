import { useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "taskcash:v1";

export interface QuizState {
  balance: number;
  currentTask: number; // 0..3
  completed: boolean;
}

const initial: QuizState = { balance: 0, currentTask: 0, completed: false };

let state: QuizState = initial;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function hydrate() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export const quizStore = {
  get: () => state,
  set: (partial: Partial<QuizState>) => {
    state = { ...state, ...partial };
    persist();
    emit();
  },
  reset: () => {
    state = initial;
    persist();
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useQuizStore(): QuizState {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    hydrate();
    setHydrated(true);
    emit();
  }, []);
  const snap = useSyncExternalStore(
    quizStore.subscribe,
    () => state,
    () => initial,
  );
  return hydrated ? snap : initial;
}
