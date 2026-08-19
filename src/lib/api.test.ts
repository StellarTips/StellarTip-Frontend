import { describe, it, expect, vi, beforeEach } from "vitest";
import { api, ApiClientError } from "@/lib/api";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("ApiClient", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    api.setToken(null);
  });

  describe("request success path", () => {
    it("unwraps the data field from the success envelope", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 200,
          data: { id: "1", username: "alice" },
          requestId: "req-1",
          timestamp: "2026-01-01T00:00:00Z",
        }),
      });

      const result = await api.getProfile("alice");
      expect(result).toEqual({ id: "1", username: "alice" });
    });
  });

  describe("request error path", () => {
    it("throws an ApiClientError with statusCode, message, and requestId", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          statusCode: 401,
          message: "Unauthorized",
          requestId: "req-401",
          timestamp: "2026-01-01T00:00:00Z",
          path: "/profiles/alice",
        }),
      });

      try {
        await api.getProfile("alice");
        expect.fail("should have thrown");
      } catch (e) {
        expect(e).toBeInstanceOf(ApiClientError);
        const err = e as ApiClientError;
        expect(err.statusCode).toBe(401);
        expect(err.message).toBe("Unauthorized");
        expect(err.requestId).toBe("req-401");
      }
    });

    it("throws ApiClientError when response body is not JSON", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("invalid json");
        },
      });

      try {
        await api.getProfile("alice");
      } catch (e) {
        expect(e).toBeInstanceOf(ApiClientError);
        const err = e as ApiClientError;
        expect(err.statusCode).toBe(500);
        expect(err.message).toBe("An unexpected error occurred");
        expect(err.requestId).toBe("unknown");
      }
    });
  });

  describe("Authorization header", () => {
    it("includes Bearer token when set", async () => {
      api.setToken("my-token");
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 200,
          data: [],
          requestId: "req-1",
          timestamp: "2026-01-01T00:00:00Z",
        }),
      });

      await api.getMyReceivedTips();

      const [, init] = mockFetch.mock.calls[0];
      expect(init.headers["Authorization"]).toBe("Bearer my-token");
    });

    it("does not include Authorization header when token is null", async () => {
      api.setToken(null);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 200,
          data: [],
          requestId: "req-1",
          timestamp: "2026-01-01T00:00:00Z",
        }),
      });

      await api.getMyReceivedTips();

      const [, init] = mockFetch.mock.calls[0];
      expect(init.headers["Authorization"]).toBeUndefined();
    });
  });

  describe("auth methods", () => {
    it("register sends POST to /auth/signup with correct payload", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 201,
          data: { access_token: "at", refresh_token: "rt", expires_in: 3600, user: { id: "1" } },
          requestId: "req-1",
          timestamp: "2026-01-01T00:00:00Z",
        }),
      });

      const result = await api.register({
        email: "a@b.com",
        password: "pass",
        username: "alice",
      });

      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toContain("/auth/signup");
      expect(init.method).toBe("POST");
      expect(JSON.parse(init.body)).toEqual({
        email: "a@b.com",
        password: "pass",
        username: "alice",
      });
      expect(result.access_token).toBe("at");
      expect(result.refresh_token).toBe("rt");
    });

    it("login sends POST to /auth/login with correct payload", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 200,
          data: { access_token: "at", refresh_token: "rt", expires_in: 3600, user: { id: "1" } },
          requestId: "req-2",
          timestamp: "2026-01-01T00:00:00Z",
        }),
      });

      const result = await api.login({ email: "a@b.com", password: "pass" });

      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toContain("/auth/login");
      expect(init.method).toBe("POST");
      expect(result.access_token).toBe("at");
    });
  });

  describe("profile methods", () => {
    it("getProfile sends GET to /profiles/:username", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 200,
          data: { id: "1", username: "alice", walletAddress: "GABC..." },
          requestId: "req-3",
          timestamp: "2026-01-01T00:00:00Z",
        }),
      });

      const result = await api.getProfile("alice");
      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain("/profiles/alice");
      expect(result.username).toBe("alice");
    });

    it("getTippingInfo sends GET to /profiles/:username/tipping-info", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 200,
          data: { walletAddress: "GABC...", username: "alice" },
          requestId: "req-4",
          timestamp: "2026-01-01T00:00:00Z",
        }),
      });

      const result = await api.getTippingInfo("alice");
      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain("/profiles/alice/tipping-info");
      expect(result.walletAddress).toBe("GABC...");
    });
  });

  describe("tip methods", () => {
    it("createTip sends POST to /tips with correct payload", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 201,
          data: { id: "tip-1", transactionHash: "tx-hash", status: "pending" },
          requestId: "req-5",
          timestamp: "2026-01-01T00:00:00Z",
        }),
      });

      const result = await api.createTip({
        receiverWallet: "GDEF...",
        amount: 10,
        asset: "XLM",
        message: "Thanks!",
      });

      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toContain("/tips");
      expect(init.method).toBe("POST");
      expect(JSON.parse(init.body)).toEqual({
        receiverWallet: "GDEF...",
        amount: 10,
        asset: "XLM",
        message: "Thanks!",
      });
      expect(result.status).toBe("pending");
    });

    it("getMyReceivedTips sends GET to /tips/my/received with pagination", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 200,
          data: {
            data: [],
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          requestId: "req-6",
          timestamp: "2026-01-01T00:00:00Z",
        }),
      });

      const result = await api.getMyReceivedTips(2, 10);
      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain("/tips/my/received?page=2&limit=10");
      expect(result.data).toEqual([]);
      expect(result.hasNextPage).toBe(false);
    });
  });
});
