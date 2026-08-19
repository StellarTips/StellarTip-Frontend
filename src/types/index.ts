// ── User & Creator ────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
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

// ── Auth ──────────────────────────────────────────────────────

export interface SignupRequest {
  email: string;
  password: string;
  username: string;
  displayName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

// ── Tips ──────────────────────────────────────────────────────

export type TipAsset = "XLM" | "USDC";

export type TipStatus = "pending" | "confirmed" | "failed";

export interface Tip {
  id: string;
  senderId?: string;
  senderWallet?: string;
  receiverId: string;
  receiverWallet: string;
  amount: number;
  asset: TipAsset;
  message?: string;
  status: TipStatus;
  transactionHash?: string;
  createdAt: string;
}

export interface CreateTipRequest {
  receiverWallet: string;
  senderWallet?: string;
  amount: number;
  asset?: TipAsset;
  message?: string;
}

export interface CreateTipResponse {
  id: string;
  transactionHash: string;
  status: TipStatus;
}

// ── Tipping Info ──────────────────────────────────────────────

export interface TippingInfo {
  walletAddress: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
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
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ── API ───────────────────────────────────────────────────────

export interface ApiSuccessEnvelope<T> {
  success: boolean;
  statusCode: number;
  data: T;
  requestId: string;
  timestamp: string;
}

export interface ApiErrorBody {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  requestId: string;
  timestamp: string;
  path: string;
}
