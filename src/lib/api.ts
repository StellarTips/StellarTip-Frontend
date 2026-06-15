import { config } from "@/config/index";
import type {
  ApiError,
  ApiResponse,
  CreateTipRequest,
  CreateTipResponse,
  PaginatedResponse,
  Tip,
} from "@/types/index";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = config.api.baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
      signal: AbortSignal.timeout(config.api.timeout),
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        code: "UNKNOWN_ERROR",
        message: "An unexpected error occurred",
        statusCode: response.status,
      }));
      throw error;
    }

    return response.json();
  }

  // ── Auth ──────────────────────────────────────────────────

  async register(data: { username: string; email: string; walletAddress: string }) {
    return this.request<
      ApiResponse<{ token: string; user: { id: string; username: string; walletAddress: string } }>
    >("/auth/register", { method: "POST", body: JSON.stringify(data) });
  }

  async login(data: { email: string; password: string }) {
    return this.request<
      ApiResponse<{ token: string; user: { id: string; username: string; walletAddress: string } }>
    >("/auth/login", { method: "POST", body: JSON.stringify(data) });
  }

  // ── Users ─────────────────────────────────────────────────

  async getUser(id: string) {
    return this.request<
      ApiResponse<{ id: string; username: string; bio: string; walletAddress: string }>
    >(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<{ username: string; bio: string }>) {
    return this.request<ApiResponse<{ id: string; username: string; bio: string }>>(
      `/users/${id}`,
      { method: "PUT", body: JSON.stringify(data) }
    );
  }

  // ── Tips ──────────────────────────────────────────────────

  async createTip(data: CreateTipRequest) {
    return this.request<ApiResponse<CreateTipResponse>>("/tips", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getUserTips(userId: string, page = 1, limit = 20) {
    return this.request<PaginatedResponse<Tip>>(`/tips?user=${userId}&page=${page}&limit=${limit}`);
  }
}

export const api = new ApiClient();
