import { config } from "@/config/index";
import type {
  Analytics,
  AuthResponse,
  CreateTipRequest,
  CreateTipResponse,
  LoginRequest,
  PaginatedResponse,
  SignupRequest,
  Tip,
  TippingInfo,
  User,
} from "@/types/index";

export class ApiClientError extends Error {
  statusCode: number;
  requestId: string;
  errors?: Record<string, string[]>;

  constructor(params: {
    statusCode: number;
    message: string;
    requestId: string;
    errors?: Record<string, string[]>;
  }) {
    super(params.message);
    this.name = "ApiClientError";
    this.statusCode = params.statusCode;
    this.requestId = params.requestId;
    this.errors = params.errors;
  }
}

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

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const errorBody = body as {
        statusCode?: number;
        message?: string;
        errors?: Record<string, string[]>;
        requestId?: string;
        path?: string;
      } | null;

      throw new ApiClientError({
        statusCode: response.status,
        message: errorBody?.message ?? "An unexpected error occurred",
        requestId: errorBody?.requestId ?? "unknown",
        errors: errorBody?.errors,
      });
    }

    const envelope = body as {
      success: boolean;
      statusCode: number;
      data: T;
      requestId: string;
      timestamp: string;
    };
    return envelope.data;
  }

  // ── Auth ──────────────────────────────────────────────────

  async register(data: SignupRequest) {
    return this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest) {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ── Profiles ─────────────────────────────────────────────

  async getProfile(username: string) {
    return this.request<User>(`/profiles/${username}`);
  }

  async getTippingInfo(username: string) {
    return this.request<TippingInfo>(`/profiles/${username}/tipping-info`);
  }

  async getMyAnalytics() {
    return this.request<Analytics>("/profiles/me/analytics");
  }

  // ── Tips ──────────────────────────────────────────────────

  async createTip(data: CreateTipRequest) {
    return this.request<CreateTipResponse>("/tips", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyReceivedTips(page = 1, limit = 20) {
    return this.request<PaginatedResponse<Tip>>(`/tips/my/received?page=${page}&limit=${limit}`);
  }
}

export const api = new ApiClient();
