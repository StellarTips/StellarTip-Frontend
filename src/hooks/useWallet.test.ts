import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("@/lib/sdk/stellar", () => ({
  isFreighterInstalled: vi.fn(),
  connectWallet: vi.fn(),
}));

import { isFreighterInstalled, connectWallet } from "@/lib/sdk/stellar";
import { useWallet } from "@/hooks/useWallet";

const mockIsFreighterInstalled = vi.mocked(isFreighterInstalled);
const mockConnectWallet = vi.mocked(connectWallet);

describe("useWallet", () => {
  beforeEach(() => {
    vi.stubGlobal("console", { ...console, error: vi.fn() });
    mockIsFreighterInstalled.mockReturnValue(false);
    mockConnectWallet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts in disconnected state with isFreighterInstalled false", () => {
    mockIsFreighterInstalled.mockReturnValue(false);
    const { result } = renderHook(() => useWallet());

    expect(result.current.wallet.status).toBe("disconnected");
    expect(result.current.wallet.isFreighterInstalled).toBe(false);
    expect(result.current.wallet.address).toBeNull();
    expect(result.current.wallet.publicKey).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("detects Freighter as installed on mount", () => {
    mockIsFreighterInstalled.mockReturnValue(true);
    const { result } = renderHook(() => useWallet());

    expect(result.current.wallet.isFreighterInstalled).toBe(true);
  });

  it("sets error when Freighter is not installed", async () => {
    mockIsFreighterInstalled.mockReturnValue(false);
    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.wallet.status).toBe("error");
    expect(mockConnectWallet).not.toHaveBeenCalled();
  });

  it("transitions through connecting -> connected on success", async () => {
    mockIsFreighterInstalled.mockReturnValue(true);
    mockConnectWallet.mockResolvedValue({
      address: "GABC123",
      publicKey: "GABC123",
    });

    const { result } = renderHook(() => useWallet());

    let connectPromise: Promise<void>;
    act(() => {
      connectPromise = result.current.connect();
    });

    expect(result.current.wallet.status).toBe("connecting");
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await connectPromise;
    });

    expect(result.current.wallet.status).toBe("connected");
    expect(result.current.wallet.address).toBe("GABC123");
    expect(result.current.wallet.publicKey).toBe("GABC123");
    expect(result.current.wallet.network).toBe("testnet");
    expect(result.current.isLoading).toBe(false);
  });

  it("transitions through connecting -> error on rejection", async () => {
    mockIsFreighterInstalled.mockReturnValue(true);
    mockConnectWallet.mockRejectedValue(new Error("Freighter is locked"));

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.wallet.status).toBe("error");
    expect(result.current.isLoading).toBe(false);
  });

  it("shows error and does not call connectWallet when Freighter is absent", async () => {
    mockIsFreighterInstalled.mockReturnValue(false);

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.wallet.status).toBe("error");
    expect(mockConnectWallet).not.toHaveBeenCalled();
  });

  it("disconnect resets to initial state from connected", async () => {
    mockIsFreighterInstalled.mockReturnValue(true);
    mockConnectWallet.mockResolvedValue({
      address: "GABC123",
      publicKey: "GABC123",
    });

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

  it("disconnect resets to initial state from error", async () => {
    mockIsFreighterInstalled.mockReturnValue(true);
    mockConnectWallet.mockRejectedValue(new Error("fail"));

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

  it("isLoading is true during connection and false after success", async () => {
    mockIsFreighterInstalled.mockReturnValue(true);

    let resolveConnect!: (value: { address: string; publicKey: string }) => void;
    mockConnectWallet.mockReturnValue(
      new Promise((r) => {
        resolveConnect = r;
      })
    );

    const { result } = renderHook(() => useWallet());

    act(() => {
      result.current.connect();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.wallet.status).toBe("connecting");

    await act(async () => {
      resolveConnect({ address: "GDEF456", publicKey: "GDEF456" });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.wallet.status).toBe("connected");
  });

  it("isLoading is true during connection and false after failure", async () => {
    mockIsFreighterInstalled.mockReturnValue(true);

    let rejectConnect!: (reason: Error) => void;
    mockConnectWallet.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectConnect = reject;
      })
    );

    const { result } = renderHook(() => useWallet());

    act(() => {
      result.current.connect();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      rejectConnect(new Error("rejected"));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.wallet.status).toBe("error");
  });

  it("does not assert hardcoded network value", async () => {
    mockIsFreighterInstalled.mockReturnValue(true);
    mockConnectWallet.mockResolvedValue({
      address: "GABC123",
      publicKey: "GABC123",
    });

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.wallet.network).toBeDefined();
  });
});
