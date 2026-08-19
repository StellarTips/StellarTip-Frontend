import { describe, it, expect, afterEach, vi } from "vitest";
import {
  connectWallet,
  getFreighterApi,
  getWalletState,
  isFreighterInstalled,
} from "@/lib/sdk/stellar";

const ADDRESS = "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRS";

function api(overrides: Record<string, unknown> = {}) {
  return {
    isConnected: vi.fn().mockResolvedValue({ isConnected: true }),
    getPublicKey: vi.fn().mockResolvedValue(ADDRESS),
    ...overrides,
  };
}

/** Inject a value at window.<key>, or remove it when value is undefined. */
function setGlobal(key: string, value: unknown) {
  if (value === undefined) {
    delete (window as unknown as Record<string, unknown>)[key];
    return;
  }
  Object.defineProperty(window, key, { value, configurable: true, writable: true });
}

afterEach(() => {
  setGlobal("stellar", undefined);
  setGlobal("freighter", undefined);
  vi.restoreAllMocks();
});

describe("getFreighterApi", () => {
  it("returns null when neither global is present", () => {
    expect(getFreighterApi()).toBeNull();
  });

  it("finds the API on window.stellar", () => {
    const injected = api();
    setGlobal("stellar", injected);
    expect(getFreighterApi()).toBe(injected);
  });

  it("finds the API on window.freighter", () => {
    const injected = api();
    setGlobal("freighter", injected);
    expect(getFreighterApi()).toBe(injected);
  });

  it("prefers window.stellar when both are present", () => {
    const stellar = api();
    const freighter = api();
    setGlobal("stellar", stellar);
    setGlobal("freighter", freighter);
    expect(getFreighterApi()).toBe(stellar);
  });

  it("skips a global that does not expose the methods we call", () => {
    setGlobal("stellar", { somethingElse: true });
    expect(getFreighterApi()).toBeNull();
  });

  it("falls through to freighter when stellar is present but unusable", () => {
    const usable = api();
    setGlobal("stellar", { somethingElse: true });
    setGlobal("freighter", usable);
    expect(getFreighterApi()).toBe(usable);
  });

  it("ignores a non-object global", () => {
    setGlobal("stellar", "not-an-api");
    expect(getFreighterApi()).toBeNull();
  });

  it("ignores a null global", () => {
    setGlobal("stellar", null);
    expect(getFreighterApi()).toBeNull();
  });
});

describe("isFreighterInstalled", () => {
  it("is false with no wallet", () => {
    expect(isFreighterInstalled()).toBe(false);
  });

  it("is true for a usable window.stellar", () => {
    setGlobal("stellar", api());
    expect(isFreighterInstalled()).toBe(true);
  });

  it("is true for a usable window.freighter", () => {
    setGlobal("freighter", api());
    expect(isFreighterInstalled()).toBe(true);
  });

  it("is false when the global exists but is not a usable API", () => {
    // The regression: detection used `"stellar" in window`, so a bare marker
    // reported the wallet as installed and connectWallet then threw.
    setGlobal("stellar", {});
    expect(isFreighterInstalled()).toBe(false);
  });
});

describe("detection and connection agree", () => {
  it("connects through window.freighter when that is the only global", async () => {
    // Regression for #8: detection accepted `freighter`, connection read only
    // `stellar`, so this combination reported installed then failed on click.
    const injected = api();
    setGlobal("freighter", injected);

    expect(isFreighterInstalled()).toBe(true);
    await expect(connectWallet()).resolves.toEqual({ address: ADDRESS, publicKey: ADDRESS });
    expect(injected.getPublicKey).toHaveBeenCalled();
  });

  it("never reports installed while connectWallet would say the API is unavailable", async () => {
    for (const injected of [undefined, {}, "marker", null, { isConnected: () => {} }]) {
      setGlobal("stellar", undefined);
      setGlobal("freighter", undefined);
      setGlobal("stellar", injected);

      if (isFreighterInstalled()) {
        await expect(connectWallet()).resolves.toBeTruthy();
      } else {
        await expect(connectWallet()).rejects.toThrow(/not installed/);
      }
    }
  });
});

describe("connectWallet", () => {
  it("rejects with the install message when no wallet is present", async () => {
    await expect(connectWallet()).rejects.toThrow(/Freighter wallet is not installed/);
  });

  it("rejects when the wallet is locked", async () => {
    setGlobal("stellar", api({ isConnected: vi.fn().mockResolvedValue({ isConnected: false }) }));
    await expect(connectWallet()).rejects.toThrow(/Freighter is locked/);
  });

  it("surfaces an error thrown by getPublicKey", async () => {
    setGlobal("stellar", api({ getPublicKey: vi.fn().mockRejectedValue(new Error("declined")) }));
    await expect(connectWallet()).rejects.toThrow(/declined/);
  });

  it("returns the same value for address and publicKey", async () => {
    setGlobal("stellar", api());
    await expect(connectWallet()).resolves.toEqual({ address: ADDRESS, publicKey: ADDRESS });
  });
});

describe("getWalletState", () => {
  it("is disconnected and not installed with no wallet", async () => {
    await expect(getWalletState()).resolves.toMatchObject({
      status: "disconnected",
      isFreighterInstalled: false,
      address: null,
    });
  });

  it("is connected through window.freighter alone", async () => {
    setGlobal("freighter", api());
    await expect(getWalletState()).resolves.toMatchObject({
      status: "connected",
      isFreighterInstalled: true,
      address: ADDRESS,
    });
  });

  it("reports installed but disconnected when the wallet is locked", async () => {
    setGlobal("stellar", api({ isConnected: vi.fn().mockResolvedValue({ isConnected: false }) }));
    await expect(getWalletState()).resolves.toMatchObject({
      status: "disconnected",
      isFreighterInstalled: true,
      address: null,
    });
  });
});
