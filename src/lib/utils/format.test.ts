import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  truncateAddress,
  INVALID_FORMAT_FALLBACK,
} from "@/lib/utils/format";

describe("formatCurrency", () => {
  describe("invalid input", () => {
    it("returns the fallback for a non-numeric string instead of a NaN string", () => {
      const result = formatCurrency("abc");
      expect(result).toBe(INVALID_FORMAT_FALLBACK);
      expect(result).not.toContain("NaN");
    });

    it("returns the fallback for an empty string", () => {
      const result = formatCurrency("");
      expect(result).toBe(INVALID_FORMAT_FALLBACK);
      expect(result).not.toContain("NaN");
    });

    it("returns the fallback for NaN and non-finite numbers", () => {
      expect(formatCurrency(NaN)).toBe(INVALID_FORMAT_FALLBACK);
      expect(formatCurrency(Infinity)).toBe(INVALID_FORMAT_FALLBACK);
      expect(formatCurrency(-Infinity)).toBe(INVALID_FORMAT_FALLBACK);
    });
  });

  describe("valid input", () => {
    it("formats an integer string", () => {
      expect(formatCurrency("10")).toBe("10.00 XLM");
    });

    it("formats an integer number", () => {
      expect(formatCurrency(10)).toBe("10.00 XLM");
    });

    it("preserves Stellar 7-decimal precision", () => {
      expect(formatCurrency("0.0000001")).toBe("0.0000001 XLM");
    });

    it("defaults to XLM rather than a dollar symbol", () => {
      const result = formatCurrency(5);
      expect(result).toContain("XLM");
      expect(result).not.toContain("$");
    });

    it("supports USDC, which Intl currency style would reject as a 4-letter code", () => {
      expect(() => formatCurrency("10", "USDC")).not.toThrow();
      expect(formatCurrency("10", "USDC")).toBe("10.00 USDC");
    });

    it("formats zero", () => {
      expect(formatCurrency(0)).toBe("0.00 XLM");
    });
  });
});

describe("formatDate", () => {
  it("returns the fallback for an unparseable date instead of 'Invalid Date'", () => {
    const result = formatDate("not-a-date");
    expect(result).toBe(INVALID_FORMAT_FALLBACK);
    expect(result).not.toContain("Invalid Date");
  });

  it("returns the fallback for an invalid Date object", () => {
    expect(formatDate(new Date("nope"))).toBe(INVALID_FORMAT_FALLBACK);
  });

  it("formats a valid ISO date string", () => {
    expect(formatDate("2024-01-15T00:00:00.000Z")).toBe("Jan 15, 2024");
  });

  it("formats a valid Date object", () => {
    expect(formatDate(new Date("2024-01-15T00:00:00.000Z"))).toBe("Jan 15, 2024");
  });

  it("respects override options", () => {
    expect(formatDate("2024-01-15T00:00:00.000Z", { month: "long" })).toBe("January 15, 2024");
  });
});

describe("truncateAddress", () => {
  it("truncates a long address to head...tail", () => {
    expect(truncateAddress("GABCDEF1234567890XYZ", 4)).toBe("GABC...0XYZ");
  });

  it("returns short addresses unchanged", () => {
    expect(truncateAddress("GABC", 4)).toBe("GABC");
  });
});

describe("formatNumber", () => {
  it("formats large numbers in compact notation", () => {
    expect(formatNumber(1500)).toBe("1.5K");
  });
});
