// Centralized tracking layer — swap implementations without touching call sites.
// Meta Pixel, GTM, GA4, and custom scripts plug in here.

type EventName =
  | "PageView"
  | "QuizStart"
  | "QuizTaskComplete"
  | "QuizComplete"
  | "InitiateCheckout"
  | "Purchase"
  | "CTAClick";

interface TrackPayload {
  [key: string]: string | number | boolean | undefined;
}

const fired = new Set<string>();

function dedupeKey(event: EventName, payload?: TrackPayload) {
  if (!payload?.id) return null;
  return `${event}:${payload.id}`;
}

export function track(event: EventName, payload: TrackPayload = {}) {
  if (typeof window === "undefined") return;
  const key = dedupeKey(event, payload);
  if (key) {
    if (fired.has(key)) return;
    fired.add(key);
  }

  // Meta Pixel
  const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
  if (typeof fbq === "function") {
    const standard = ["PageView", "InitiateCheckout", "Purchase"];
    if (standard.includes(event)) fbq("track", event, payload);
    else fbq("trackCustom", event, payload);
  }

  // GTM / dataLayer
  const w = window as unknown as { dataLayer?: unknown[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...payload });
  }
}

export function getUTMParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
    const v = params.get(k);
    if (v) utm[k] = v;
  });
  return utm;
}
