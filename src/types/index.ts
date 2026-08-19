// ── User & Creator ────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  email?: string;
  bio?: string;
  walletAddress: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorProfile {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  walletAddress: string;
  tipLink: string;
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  platform: "twitter" | "github" | "website" | "discord" | "other";
  url: string;
  label?: string;
}

// ── Tips ──────────────────────────────────────────────────────

export type TipCurrency = "XLM" | "USDC";

export type TipStatus = "pending" | "confirmed" | "failed";

export interface Tip {
  id: string;
  senderId?: string;
  senderWallet?: string;
  receiverId: string;
  amount: string;
  currency: TipCurrency;
  message?: string;
  status: TipStatus;
  transactionHash?: string;
  createdAt: string;
}

export interface CreateTipRequest {
  receiverId: string;
  amount: string;
  currency: TipCurrency;
  message?: string;
}

export interface CreateTipResponse {
  id: string;
  transactionHash: string;
  status: TipStatus;
}

// ── Wallet ────────────────────────────────────────────────────

export type WalletConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export interface WalletState {
  address: string | null;
  publicKey: string | null;
  network: "testnet" | "mainnet";
  configuredNetwork: "testnet" | "mainnet";
  status: WalletConnectionStatus;
  isFreighterInstalled: boolean;
}

// ── Pagination ────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── API ───────────────────────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
