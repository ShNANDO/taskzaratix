import type { Challenge, ChallengeKind, ChallengeOption } from "./types";

/* ---------- small random helpers ---------- */

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(arr: readonly T[]): T => arr[rand(0, arr.length - 1)];

export function shuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const uid = () => Math.random().toString(36).slice(2, 10);

/** Accessible hues only — saturation/lightness are fixed in CSS so contrast holds. */
const HUES: Record<string, number> = {
  green: 145,
  blue: 260,
  red: 25,
  amber: 85,
  teal: 195,
  violet: 305,
};

/* ---------- generators ---------- */

function tapColor(): Challenge {
  const names = shuffle(Object.keys(HUES)).slice(0, rand(4, 6));
  const targetName = pick(names);
  const options: ChallengeOption[] = names.map((name) => ({
    id: uid(),
    label: name,
    hue: HUES[name],
  }));
  const answer = options.find((o) => o.label === targetName)!.id;
  return {
    id: uid(),
    kind: "tap-color",
    prompt: `Tap the ${targetName} circle`,
    options: shuffle(options),
    answer: [answer],
    ordered: false,
    minSolveMs: 700,
  };
}

function ascending(): Challenge {
  const count = rand(3, 4);
  const values = shuffle(
    Array.from({ length: 40 }, (_, i) => i + 1),
  ).slice(0, count);
  const options: ChallengeOption[] = values.map((v) => ({
    id: uid(),
    label: String(v),
    value: v,
    hue: HUES.blue,
  }));
  const answer = options
    .slice()
    .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))
    .map((o) => o.id);
  return {
    id: uid(),
    kind: "ascending",
    prompt: `Tap the ${count} numbers in ascending order`,
    options: shuffle(options),
    answer,
    ordered: true,
    minSolveMs: 1200,
  };
}

function largest(): Challenge {
  const values = shuffle(Array.from({ length: 90 }, (_, i) => i + 10)).slice(
    0,
    rand(4, 6),
  );
  const options: ChallengeOption[] = values.map((v) => ({
    id: uid(),
    label: String(v),
    value: v,
    hue: HUES.teal,
  }));
  const max = Math.max(...values);
  return {
    id: uid(),
    kind: "largest",
    prompt: "Select the largest number",
    options: shuffle(options),
    answer: [options.find((o) => o.value === max)!.id],
    ordered: false,
    minSolveMs: 800,
  };
}

const ICON_SETS: string[][] = [
  ["●", "●", "●", "▲"],
  ["★", "★", "★", "☆"],
  ["■", "■", "■", "◆"],
  ["♥", "♥", "♥", "♠"],
];

function oddOneOut(): Challenge {
  const set = pick(ICON_SETS);
  const odd = set[set.length - 1];
  const base = set[0];
  const total = rand(4, 6);
  const icons = [odd, ...Array.from({ length: total - 1 }, () => base)];
  const hue = pick(Object.values(HUES));
  const options: ChallengeOption[] = icons.map((icon) => ({
    id: uid(),
    label: icon,
    icon,
    hue,
  }));
  return {
    id: uid(),
    kind: "odd-one-out",
    prompt: "Tap the shape that is different",
    options: shuffle(options),
    answer: [options[0].id],
    ordered: false,
    minSolveMs: 900,
  };
}

function countStars(): Challenge {
  const count = rand(3, 7);
  const choices = shuffle(
    Array.from(new Set([count, count + 1, count - 1, count + 2])).filter(
      (n) => n > 0,
    ),
  );
  const options: ChallengeOption[] = choices.map((n) => ({
    id: uid(),
    label: String(n),
    value: n,
    hue: HUES.amber,
  }));
  return {
    id: uid(),
    kind: "count-stars",
    prompt: `Count the stars, then choose the right answer`,
    options,
    answer: [options.find((o) => o.value === count)!.id],
    ordered: false,
    target: count,
    minSolveMs: 1500,
  };
}

function sliderFit(): Challenge {
  const target = rand(20, 85);
  return {
    id: uid(),
    kind: "slider-fit",
    prompt: "Slide the shape until it fits the outline",
    options: [],
    answer: [],
    ordered: false,
    target,
    tolerance: 4,
    minSolveMs: 1200,
  };
}

const GENERATORS: Record<ChallengeKind, () => Challenge> = {
  "tap-color": tapColor,
  ascending,
  largest,
  "odd-one-out": oddOneOut,
  "count-stars": countStars,
  "slider-fit": sliderFit,
};

export function createChallenge(exclude?: ChallengeKind): Challenge {
  const kinds = (Object.keys(GENERATORS) as ChallengeKind[]).filter(
    (k) => k !== exclude,
  );
  return GENERATORS[pick(kinds)]();
}

export const hueStyle = (hue = 260) => ({
  backgroundColor: `oklch(0.66 0.17 ${hue})`,
  color: "oklch(0.99 0 0)",
});
