import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, truncateAddress, formatNumber } from "@/lib/utils/format";

describe("formatCurrency", () => {
  it("formats a numeric amount with the currency code appended", () => {
    expect(formatCurrency(1234.5678901, "XLM")).toBe("1,234.5678901 XLM");
  });

  it("parses a numeric string", () => {
    expect(formatCurrency("10", "XLM")).toBe("10.00 XLM");
  });

  it("defaults to XLM, the network's native asset", () => {
    expect(formatCurrency(1)).toBe("1.00 XLM");
  });

  it("keeps Stellar's 7 decimal places", () => {
    expect(formatCurrency("0.0000001", "XLM")).toBe("0.0000001 XLM");
  });

  it("does not throw on USDC, which Intl rejects as a currency code", () => {
    // style: "currency" throws RangeError here -- only 3-letter codes are valid.
    expect(() => formatCurrency(5, "USDC")).not.toThrow();
    expect(formatCurrency(5, "USDC")).toBe("5.00 USDC");
  });

  it.each(["", "abc", "not-a-number"])(
    "returns an empty string for the unparseable input %o",
    (input) => {
      expect(formatCurrency(input)).toBe("");
    }
  );

  it.each([NaN, Infinity, -Infinity])("returns an empty string for %o", (input) => {
    expect(formatCurrency(input)).toBe("");
  });

  it("never emits the literal string NaN", () => {
    expect(formatCurrency("")).not.toContain("NaN");
  });

  it("still formats a leading-numeric string the way parseFloat does", () => {
    expect(formatCurrency("12abc")).toBe("12.00 XLM");
  });
});

describe("formatDate", () => {
  it("formats a valid ISO string", () => {
    expect(formatDate("2026-03-14T00:00:00.000Z")).toMatch(/Mar 1[34], 2026/);
  });

  it("accepts a Date instance", () => {
    expect(formatDate(new Date("2026-03-14T00:00:00.000Z"))).toMatch(/Mar 1[34], 2026/);
  });

  it("returns an empty string rather than 'Invalid Date'", () => {
    expect(formatDate("not-a-date")).toBe("");
    expect(formatDate(new Date("nope"))).toBe("");
  });

  it("honours caller options", () => {
    expect(formatDate("2026-03-14T00:00:00.000Z", { month: "long" })).toContain("March");
  });
});

describe("truncateAddress", () => {
  it("truncates a long address", () => {
    expect(truncateAddress("GABCDEFGHIJKLMNOPQRSTUVWXYZ", 4)).toBe("GABC...WXYZ");
  });

  it("leaves a short address alone", () => {
    expect(truncateAddress("GABC", 4)).toBe("GABC");
  });
});

describe("formatNumber", () => {
  it("uses compact notation", () => {
    expect(formatNumber(1200)).toBe("1.2K");
  });
});
