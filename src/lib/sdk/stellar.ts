import { STELLAR_NETWORKS } from "@/config/index";
import type { WalletState } from "@/types/index";

/**
 * The subset of the Freighter API this app uses.
 *
 * Declared once so detection and connection cannot disagree about its shape.
 */
export interface FreighterApi {
  isConnected: () => Promise<{ isConnected: boolean }>;
  getPublicKey: () => Promise<string>;
}

/**
 * Globals Freighter is known to inject, in preference order.
 *
 * Detection used to accept either while connection read only `stellar`, so a
 * browser exposing `freighter` alone reported the wallet as installed and then
 * threw "Freighter API not available" on the first click.
 */
const FREIGHTER_GLOBALS = ["stellar", "freighter"] as const;

function isFreighterApi(value: unknown): value is FreighterApi {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Partial<FreighterApi>;
  return (
    typeof candidate.isConnected === "function" && typeof candidate.getPublicKey === "function"
  );
}

/**
 * The injected Freighter API, or `null` when it is absent or unusable.
 *
 * This is the single source of truth: `isFreighterInstalled` is defined as
 * "this returned something", so the two can no longer drift. A global that
 * exists but does not expose the methods we call counts as absent, because a
 * caller cannot do anything with it.
 */
export function getFreighterApi(): FreighterApi | null {
  if (typeof window === "undefined") return null;

  const injected = window as unknown as Record<string, unknown>;
  for (const key of FREIGHTER_GLOBALS) {
    const candidate = injected[key];
    if (isFreighterApi(candidate)) return candidate;
  }
  return null;
}

/**
 * Check if a usable Freighter wallet extension is installed.
 */
export function isFreighterInstalled(): boolean {
  return getFreighterApi() !== null;
}

/**
 * Request wallet connection via Freighter.
 */
export async function connectWallet(): Promise<{
  address: string;
  publicKey: string;
}> {
  const freighter = getFreighterApi();

  if (!freighter) {
    throw new Error(
      "Freighter wallet is not installed. Please install the Freighter browser extension."
    );
  }

  try {
    const { isConnected } = await freighter.isConnected();
    if (!isConnected) {
      throw new Error("Freighter is locked. Please unlock your wallet.");
    }

    const publicKey = await freighter.getPublicKey();
    return {
      address: publicKey,
      publicKey,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to connect wallet";
    throw new Error(message);
  }
}

/**
 * Get the current wallet state.
 */
export async function getWalletState(): Promise<WalletState> {
  const installed = isFreighterInstalled();

  if (!installed) {
    return {
      address: null,
      publicKey: null,
      network: "testnet",
      status: "disconnected",
      isFreighterInstalled: false,
    };
  }

  try {
    const { publicKey } = await connectWallet();
    return {
      address: publicKey,
      publicKey,
      network: "testnet", // TODO: detect network from Freighter
      status: "connected",
      isFreighterInstalled: true,
    };
  } catch {
    return {
      address: null,
      publicKey: null,
      network: "testnet",
      status: "disconnected",
      isFreighterInstalled: true,
    };
  }
}

/**
 * Get the network passphrase for the configured Stellar network.
 */
export function getNetworkPassphrase(network: "testnet" | "mainnet"): string {
  return STELLAR_NETWORKS[network].passphrase;
}
