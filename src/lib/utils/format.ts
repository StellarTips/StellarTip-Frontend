import type { TipAsset } from "@/types";

/**
 * Fallback returned by the formatting helpers when their input cannot be
 * represented. It is an empty string so that a bad value degrades to "nothing
 * shown" in a render path rather than surfacing `"$NaN"` or `"Invalid Date"`,
 * and never throws from what is otherwise a pure formatting helper.
 */
export const INVALID_FORMAT_FALLBACK = "";

/**
 * Format a date for display.
 *
 * Contract: an unparseable date (for example `formatDate("not-a-date")`)
 * returns {@link INVALID_FORMAT_FALLBACK} rather than the literal
 * `"Invalid Date"` that `Date.prototype.toLocaleDateString` would produce.
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return INVALID_FORMAT_FALLBACK;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

/**
 * Format a tip amount with its asset code, e.g. `"10.00 XLM"`.
 *
 * The default asset is `"XLM"` — the app's native asset — because the previous
 * `"USD"` default rendered dollar symbols on Stellar amounts. The amount is
 * formatted with a decimal number formatter and the asset code is appended as a
 * suffix, which is why this accepts the app's assets (`XLM`, `USDC`) without the
 * `RangeError` that `Intl.NumberFormat`'s `style: "currency"` throws for a code
 * that is not a valid ISO 4217 currency (such as the 4-letter `"USDC"`).
 *
 * Contract: a non-finite amount — including `parseFloat("")`/`parseFloat("abc")`
 * which yield `NaN` — returns {@link INVALID_FORMAT_FALLBACK} rather than a
 * string containing `NaN`. Up to 7 fraction digits are kept to preserve the
 * precision of Stellar assets.
 */
export function formatCurrency(amount: string | number, currency: TipAsset = "XLM"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!Number.isFinite(num)) return INVALID_FORMAT_FALLBACK;
  const formatted = new Intl.NumberFormat("en-US", {
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
