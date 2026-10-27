export type ChallengeKind =
  | "tap-color"
  | "ascending"
  | "largest"
  | "odd-one-out"
  | "count-stars"
  | "slider-fit";

export interface ChallengeOption {
  id: string;
  label: string;
  /** hue token used for randomized (accessible) coloring */
  hue?: number;
  icon?: string;
  value?: number;
}

export interface Challenge {
  id: string;
  kind: ChallengeKind;
  prompt: string;
  /** options rendered as tappable targets (unused for slider) */
  options: ChallengeOption[];
  /** correct answer ids, in order when the challenge is order-sensitive */
  answer: string[];
  ordered: boolean;
  /** slider challenges only */
  target?: number;
  tolerance?: number;
  /** minimum plausible human solve time in ms */
  minSolveMs: number;
}
