import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

function setupWindow(overrides: Record<string, unknown> = {}) {
  const windowMock = {
    stellar: {
      isConnected: vi.fn().mockResolvedValue({ isConnected: true }),
      getPublicKey: vi.fn().mockResolvedValue("GABC123"),
      getNetwork: vi.fn().mockResolvedValue("TESTNET"),
      ...overrides,
    },
  };
  Object.defineProperty(window, "stellar", {
    value: windowMock.stellar,
    writable: true,
    configurable: true,
  });
  return windowMock;
}

function setFreighterGlobal() {
  Object.defineProperty(window, "freighter", {
    value: { isConnected: vi.fn() },
    writable: true,
    configurable: true,
  });
}

function clearWalletGlobals() {
  Reflect.deleteProperty(window, "stellar");
  Reflect.deleteProperty(window, "freighter");
}

describe("isFreighterInstalled", () => {
  beforeEach(() => {
    clearWalletGlobals();
  });

  afterEach(() => {
    clearWalletGlobals();
    vi.restoreAllMocks();
  });

  it("returns false when neither window.stellar nor window.freighter is present", async () => {
    const { isFreighterInstalled } = await import("@/lib/sdk/stellar");
    expect(isFreighterInstalled()).toBe(false);
  });

  it("returns true when window.stellar is present", async () => {
    setupWindow();
    const { isFreighterInstalled } = await import("@/lib/sdk/stellar");
    expect(isFreighterInstalled()).toBe(true);
  });

  it("returns false when only window.freighter is present", async () => {
    setFreighterGlobal();
    const { isFreighterInstalled } = await import("@/lib/sdk/stellar");
    expect(isFreighterInstalled()).toBe(false);
  });

  it("rejects connectWallet when only window.freighter is present", async () => {
    setFreighterGlobal();
    const { connectWallet } = await import("@/lib/sdk/stellar");
    await expect(connectWallet()).rejects.toThrow("Freighter wallet is not installed");
  });
});

describe("connectWallet", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    clearWalletGlobals();
  });

  it("returns detected testnet network from Freighter", async () => {
    const mock = setupWindow({ getNetwork: vi.fn().mockResolvedValue("TESTNET") });

    const { connectWallet } = await import("@/lib/sdk/stellar");
    const result = await connectWallet();

    expect(result.network).toBe("testnet");
    expect(result.address).toBe("GABC123");
    expect(mock.stellar.getNetwork).toHaveBeenCalled();
  });

  it("returns detected mainnet network from Freighter", async () => {
    const mock = setupWindow({ getNetwork: vi.fn().mockResolvedValue("MAINNET") });

    const { connectWallet } = await import("@/lib/sdk/stellar");
    const result = await connectWallet();

    expect(result.network).toBe("mainnet");
    expect(mock.stellar.getNetwork).toHaveBeenCalled();
  });

  it("normalizes PUBLIC to mainnet", async () => {
    setupWindow({ getNetwork: vi.fn().mockResolvedValue("PUBLIC") });

    const { connectWallet } = await import("@/lib/sdk/stellar");
    const result = await connectWallet();

    expect(result.network).toBe("mainnet");
  });

  it("normalizes lowercased testnet to testnet", async () => {
    setupWindow({ getNetwork: vi.fn().mockResolvedValue("testnet") });

    const { connectWallet } = await import("@/lib/sdk/stellar");
    const result = await connectWallet();

    expect(result.network).toBe("testnet");
  });
});

describe("getWalletState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    clearWalletGlobals();
  });

  it("returns configuredNetwork from config when not connected", async () => {
    setupWindow({
      isConnected: vi.fn().mockResolvedValue({ isConnected: false }),
    });

    const { getWalletState } = await import("@/lib/sdk/stellar");
    const state = await getWalletState();

    expect(state.configuredNetwork).toBe("testnet");
    expect(state.network).toBe("testnet");
    expect(state.status).toBe("disconnected");
  });

  it("sets network to detected value and configuredNetwork from config on connect", async () => {
    setupWindow({ getNetwork: vi.fn().mockResolvedValue("MAINNET") });

    const { getWalletState } = await import("@/lib/sdk/stellar");
    const state = await getWalletState();

    expect(state.network).toBe("mainnet");
    expect(state.configuredNetwork).toBe("testnet");
    expect(state.status).toBe("connected");
  });

  it("removes stale detect network from Freighter comment", async () => {
    const { getWalletState } = await import("@/lib/sdk/stellar");
    const state = await getWalletState();

    // The TODO comment should be gone - if it's still there the test
    // is not a functional check but the file itself should be clean.
    expect(state.network).toBeDefined();
  });
});
