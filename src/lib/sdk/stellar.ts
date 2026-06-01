import { STELLAR_NETWORKS } from "@/config/index";
import type { WalletState } from "@/types/index";

/**
 * Check if the Freighter wallet extension is installed.
 */
export function isFreighterInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return "stellar" in window || "freighter" in window;
}

/**
 * Request wallet connection via Freighter.
 */
export async function connectWallet(): Promise<{
  address: string;
  publicKey: string;
}> {
  if (!isFreighterInstalled()) {
    throw new Error(
      "Freighter wallet is not installed. Please install the Freighter browser extension."
    );
  }

  try {
    const stellar = (window as unknown as { stellar?: { isConnected: () => Promise<{ isConnected: boolean }>; getPublicKey: () => Promise<string> } }).stellar;
    
    if (!stellar) {
      throw new Error("Freighter API not available");
    }

    const { isConnected } = await stellar.isConnected();
    if (!isConnected) {
      throw new Error("Freighter is locked. Please unlock your wallet.");
    }

    const publicKey = await stellar.getPublicKey();
    return {
      address: publicKey,
      publicKey,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to connect wallet";
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
