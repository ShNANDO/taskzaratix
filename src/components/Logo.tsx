import { Link } from "@tanstack/react-router";

interface Props {
  variant?: "colorful" | "mono";
}

export function Logo({ variant = "colorful" }: Props) {
  if (variant === "mono") {
    return (
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground"
        aria-label="Task Cash home"
      >
        TASK CASH <span aria-hidden>🇿🇦</span>
      </Link>
    );
  }
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-3xl font-extrabold tracking-tight"
      aria-label="Task Cash home"
    >
      <span className="text-brand-blue">T</span>
      <span className="text-brand-red -ml-1.5">a</span>
      <span className="text-brand-yellow -ml-1.5">s</span>
      <span className="text-brand-blue -ml-1.5">k</span>
      <span className="ml-1 text-primary">C</span>
      <span className="text-brand-yellow -ml-1.5">a</span>
      <span className="text-brand-blue -ml-1.5">s</span>
      <span className="text-brand-red -ml-1.5">h</span>
      <span aria-hidden className="ml-1">🇿🇦</span>
    </Link>
  );
}
