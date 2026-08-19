import type { TipCurrency } from "@/types";

/**
 * Format a date for display.
 *
 * Returns `""` for an unparseable date rather than the literal string
 * "Invalid Date", so a malformed API value renders as empty instead of as
 * visible breakage. Callers that need a placeholder should supply their own.
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

/**
 * Format a tip amount for display, as `1,234.5678901 XLM`.
 *
 * Returns `""` for any non-finite amount. `parseFloat("")` and
 * `parseFloat("abc")` are both NaN, and `Intl.NumberFormat` renders NaN as the
 * literal string "NaN" -- so a validation failure or a malformed API value
 * used to reach the UI as "$NaN".
 *
 * The amount is formatted as a decimal with the code appended, rather than
 * with `style: "currency"`. `Intl.NumberFormat` only accepts three-letter
 * currency codes, so `style: "currency"` throws a RangeError on `USDC` -- one
 * of the two currencies this app actually supports. Up to 7 fraction digits
 * are kept, matching Stellar's precision.
 */
export function formatCurrency(
  amount: string | number,
  currency: TipCurrency | string = "XLM"
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!Number.isFinite(num)) return "";
  const formatted = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  }).format(num);
  return `${formatted} ${currency}`;
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
}
