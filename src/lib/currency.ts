// Single source of truth for money display.
// Internal balances are always stored in USD; ZAR is derived.

export const ZAR_PER_USD = 18.5;

/** Total the user reaches after completing every task ($212.00). */
export const TOTAL_USD = 212;
export const TOTAL_ZAR = TOTAL_USD * ZAR_PER_USD;

export function usdToZar(usd: number): number {
  return usd * ZAR_PER_USD;
}

export function formatUSD(usd: number): string {
  return `$${usd.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatZAR(usd: number): string {
  return `R${usdToZar(usd).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** "R490.00 · $26.50" */
export function formatBoth(usd: number): string {
  return `${formatZAR(usd)} · ${formatUSD(usd)}`;
}
