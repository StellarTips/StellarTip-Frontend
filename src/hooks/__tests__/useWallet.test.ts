import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useWallet } from "@/hooks/useWallet";
import { connectWallet, isFreighterInstalled } from "@/lib/sdk/stellar";

// Mock the SDK boundary so the hook is tested without a real Freighter
// extension. These two functions are the hook's only outside dependency.
vi.mock("@/lib/sdk/stellar", () => ({
  connectWallet: vi.fn(),
  isFreighterInstalled: vi.fn(),
}));

const mockConnectWallet = vi.mocked(connectWallet);
const mockIsFreighterInstalled = vi.mocked(isFreighterInstalled);

const ADDRESS = "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRS";

describe("useWallet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // console.error is called on the failure path; keep test output clean.
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initial state", () => {
    it("starts disconnected with no address", () => {
      mockIsFreighterInstalled.mockReturnValue(false);
      const { result } = renderHook(() => useWallet());

      expect(result.current.wallet.status).toBe("disconnected");
      expect(result.current.wallet.address).toBeNull();
      expect(result.current.wallet.publicKey).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it("reports isFreighterInstalled false when the extension is absent", async () => {
      mockIsFreighterInstalled.mockReturnValue(false);
      const { result } = renderHook(() => useWallet());

      await waitFor(() => {
        expect(result.current.wallet.isFreighterInstalled).toBe(false);
      });
    });

    it("reports isFreighterInstalled true when the extension is present", async () => {
      mockIsFreighterInstalled.mockReturnValue(true);
      const { result } = renderHook(() => useWallet());

      await waitFor(() => {
        expect(result.current.wallet.isFreighterInstalled).toBe(true);
      });
    });
  });

  describe("connect", () => {
    it("reaches connected with the returned address and publicKey", async () => {
      mockIsFreighterInstalled.mockReturnValue(true);
      mockConnectWallet.mockResolvedValue({ address: ADDRESS, publicKey: ADDRESS });

      const { result } = renderHook(() => useWallet());
      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.wallet.status).toBe("connected");
      expect(result.current.wallet.address).toBe(ADDRESS);
      expect(result.current.wallet.publicKey).toBe(ADDRESS);
      expect(result.current.wallet.isFreighterInstalled).toBe(true);
    });

    it("is 'connecting' with isLoading true while the promise is pending", async () => {
      mockIsFreighterInstalled.mockReturnValue(true);
      let resolveConnect: (v: { address: string; publicKey: string }) => void = () => {};
      mockConnectWallet.mockReturnValue(
        new Promise((resolve) => {
          resolveConnect = resolve;
        })
      );

      const { result } = renderHook(() => useWallet());

      let pending: Promise<void>;
      act(() => {
        pending = result.current.connect();
      });

      await waitFor(() => {
        expect(result.current.wallet.status).toBe("connecting");
      });
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveConnect({ address: ADDRESS, publicKey: ADDRESS });
        await pending;
      });

      expect(result.current.wallet.status).toBe("connected");
      expect(result.current.isLoading).toBe(false);
    });

    it("goes to error when connectWallet rejects", async () => {
      mockIsFreighterInstalled.mockReturnValue(true);
      mockConnectWallet.mockRejectedValue(new Error("user declined"));

      const { result } = renderHook(() => useWallet());
      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.wallet.status).toBe("error");
      expect(result.current.wallet.address).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it("goes to error without calling connectWallet when Freighter is absent", async () => {
      mockIsFreighterInstalled.mockReturnValue(false);

      const { result } = renderHook(() => useWallet());
      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.wallet.status).toBe("error");
      expect(mockConnectWallet).not.toHaveBeenCalled();
      // The guard returns before setIsLoading(true), so loading never starts.
      expect(result.current.isLoading).toBe(false);
    });

    it("clears isLoading after a failure, not just a success", async () => {
      mockIsFreighterInstalled.mockReturnValue(true);
      mockConnectWallet.mockRejectedValue(new Error("boom"));

      const { result } = renderHook(() => useWallet());
      await act(async () => {
        await result.current.connect();
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("disconnect", () => {
    it("resets to the initial state after a successful connect", async () => {
      mockIsFreighterInstalled.mockReturnValue(true);
      mockConnectWallet.mockResolvedValue({ address: ADDRESS, publicKey: ADDRESS });

      const { result } = renderHook(() => useWallet());
      await act(async () => {
        await result.current.connect();
      });
      expect(result.current.wallet.status).toBe("connected");

      act(() => {
        result.current.disconnect();
      });

      expect(result.current.wallet.status).toBe("disconnected");
      expect(result.current.wallet.address).toBeNull();
      expect(result.current.wallet.publicKey).toBeNull();
    });

    it("clears an error state too", async () => {
      mockIsFreighterInstalled.mockReturnValue(true);
      mockConnectWallet.mockRejectedValue(new Error("nope"));

      const { result } = renderHook(() => useWallet());
      await act(async () => {
        await result.current.connect();
      });
      expect(result.current.wallet.status).toBe("error");

      act(() => {
        result.current.disconnect();
      });

      expect(result.current.wallet.status).toBe("disconnected");
    });
  });
});
