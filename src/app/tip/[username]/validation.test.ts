import { describe, it, expect } from "vitest";
import { validateAmount, validateMessage } from "@/lib/validation";

describe("tip form validation", () => {
  describe("validateAmount", () => {
    it("rejects empty input", () => {
      expect(validateAmount("")).toBe("Amount is required");
    });

    it("rejects non-numeric input", () => {
      expect(validateAmount("abc")).toBe("Amount is required");
    });

    it("rejects amount below minimum (0.0000001)", () => {
      expect(validateAmount("0.00000001")).toBe("Minimum amount is 0.0000001");
    });

    it("rejects zero", () => {
      expect(validateAmount("0")).toBe("Minimum amount is 0.0000001");
    });

    it("rejects negative amounts", () => {
      expect(validateAmount("-10")).toBe("Minimum amount is 0.0000001");
    });

    it("accepts the minimum amount", () => {
      expect(validateAmount("0.0000001")).toBeNull();
    });

    it("accepts a valid amount", () => {
      expect(validateAmount("10")).toBeNull();
    });

    it("accepts decimal amounts", () => {
      expect(validateAmount("0.5")).toBeNull();
    });
  });

  describe("validateMessage", () => {
    it("accepts empty message", () => {
      expect(validateMessage("")).toBeNull();
    });

    it("accepts a message within the limit", () => {
      expect(validateMessage("a".repeat(280))).toBeNull();
    });

    it("rejects a message exceeding 280 characters", () => {
      expect(validateMessage("a".repeat(281))).toBe("Message must be 280 characters or less");
    });
  });
});
