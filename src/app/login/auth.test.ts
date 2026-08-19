import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((_index: number) => null),
  };
})();

describe("token persistence", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", localStorageMock);
    localStorageMock.clear();
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("persistAuth stores tokens in localStorage", async () => {
    const { persistAuth } = await import("./page");
    persistAuth({
      access_token: "at-123",
      refresh_token: "rt-456",
      expires_in: 3600,
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "stellartip-auth",
      JSON.stringify({
        access_token: "at-123",
        refresh_token: "rt-456",
        expires_in: 3600,
      })
    );
  });

  it("loadStoredAuth returns parsed tokens from localStorage", async () => {
    const auth = { access_token: "at-123", refresh_token: "rt-456", expires_in: 3600 };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(auth));

    const { loadStoredAuth } = await import("./page");
    const result = loadStoredAuth();
    expect(result).toEqual(auth);
  });

  it("loadStoredAuth returns null when nothing stored", async () => {
    localStorageMock.getItem.mockReturnValueOnce(null);

    const { loadStoredAuth } = await import("./page");
    const result = loadStoredAuth();
    expect(result).toBeNull();
  });

  it("loadStoredAuth returns null on corrupt JSON", async () => {
    localStorageMock.getItem.mockReturnValueOnce("not-json");

    const { loadStoredAuth } = await import("./page");
    const result = loadStoredAuth();
    expect(result).toBeNull();
  });

  it("clearStoredAuth removes the key from localStorage", async () => {
    const { clearStoredAuth } = await import("./page");
    clearStoredAuth();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("stellartip-auth");
  });
});
